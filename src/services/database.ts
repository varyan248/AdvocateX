/**
 * SQLite Database Service — Offline law library with FTS5 full-text search
 * Performance target: search results in under 80ms
 */
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('advocatex_laws.db');

  // Enable WAL mode for better performance
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA synchronous = NORMAL;');

  return db;
}

/**
 * Initialize database schema — creates all tables and FTS5 virtual table
 */
export async function initializeDatabase(): Promise<void> {
  const database = await getDatabase();

  await database.execAsync(`
    -- Acts table
    CREATE TABLE IF NOT EXISTS acts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      year TEXT NOT NULL,
      category TEXT NOT NULL,
      section_count INTEGER DEFAULT 0,
      last_updated TEXT,
      description TEXT
    );

    -- Chapters table
    CREATE TABLE IF NOT EXISTS chapters (
      id TEXT PRIMARY KEY,
      act_id TEXT NOT NULL,
      chapter_number TEXT NOT NULL,
      chapter_title TEXT NOT NULL,
      FOREIGN KEY (act_id) REFERENCES acts(id)
    );

    -- Sections table
    CREATE TABLE IF NOT EXISTS sections (
      id TEXT PRIMARY KEY,
      act_id TEXT NOT NULL,
      chapter_id TEXT,
      section_number TEXT NOT NULL,
      section_title TEXT NOT NULL,
      section_text TEXT NOT NULL,
      keywords TEXT,
      FOREIGN KEY (act_id) REFERENCES acts(id),
      FOREIGN KEY (chapter_id) REFERENCES chapters(id)
    );

    -- Amendments table
    CREATE TABLE IF NOT EXISTS amendments (
      id TEXT PRIMARY KEY,
      act_id TEXT NOT NULL,
      section_id TEXT,
      amendment_act TEXT,
      amendment_date TEXT,
      change_description TEXT,
      old_text TEXT,
      new_text TEXT,
      FOREIGN KEY (act_id) REFERENCES acts(id),
      FOREIGN KEY (section_id) REFERENCES sections(id)
    );

    -- Comparisons table (old law → new law mapping)
    CREATE TABLE IF NOT EXISTS comparisons (
      id TEXT PRIMARY KEY,
      old_act_id TEXT NOT NULL,
      old_section_id TEXT,
      old_section_number TEXT,
      new_act_id TEXT NOT NULL,
      new_section_id TEXT,
      new_section_number TEXT,
      mapping_type TEXT NOT NULL CHECK (mapping_type IN ('retained', 'modified', 'repealed', 'new')),
      diff_summary TEXT,
      FOREIGN KEY (old_act_id) REFERENCES acts(id),
      FOREIGN KEY (new_act_id) REFERENCES acts(id)
    );

    -- FTS5 virtual table for blazing-fast full-text search
    CREATE VIRTUAL TABLE IF NOT EXISTS sections_fts USING fts5(
      section_number,
      section_title,
      section_text,
      keywords,
      act_short_name,
      content='sections',
      content_rowid='rowid',
      tokenize='porter unicode61'
    );

    -- Bookmarks local table
    CREATE TABLE IF NOT EXISTS local_bookmarks (
      id TEXT PRIMARY KEY,
      act_id TEXT NOT NULL,
      section_id TEXT NOT NULL,
      note TEXT,
      folder_name TEXT DEFAULT 'General',
      created_at TEXT DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0
    );

    -- Highlights local table
    CREATE TABLE IF NOT EXISTS local_highlights (
      id TEXT PRIMARY KEY,
      act_id TEXT NOT NULL,
      section_id TEXT NOT NULL,
      start_offset INTEGER NOT NULL,
      end_offset INTEGER NOT NULL,
      color TEXT NOT NULL DEFAULT 'yellow',
      note TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0
    );

    -- Reading history
    CREATE TABLE IF NOT EXISTS reading_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      act_id TEXT NOT NULL,
      section_id TEXT NOT NULL,
      read_at TEXT DEFAULT (datetime('now'))
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_sections_act ON sections(act_id);
    CREATE INDEX IF NOT EXISTS idx_sections_chapter ON sections(chapter_id);
    CREATE INDEX IF NOT EXISTS idx_sections_number ON sections(section_number);
    CREATE INDEX IF NOT EXISTS idx_chapters_act ON chapters(act_id);
    CREATE INDEX IF NOT EXISTS idx_comparisons_old ON comparisons(old_act_id, old_section_number);
    CREATE INDEX IF NOT EXISTS idx_comparisons_new ON comparisons(new_act_id, new_section_number);
    CREATE INDEX IF NOT EXISTS idx_comparisons_type ON comparisons(mapping_type);
    CREATE INDEX IF NOT EXISTS idx_bookmarks_section ON local_bookmarks(section_id);
    CREATE INDEX IF NOT EXISTS idx_highlights_section ON local_highlights(section_id);
    CREATE INDEX IF NOT EXISTS idx_history_act ON reading_history(act_id);
  `);
}

/**
 * Full-text search across all sections — target: <80ms
 */
export async function searchSections(
  query: string,
  options?: {
    actId?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }
): Promise<SearchResult[]> {
  const database = await getDatabase();
  const limit = options?.limit || 30;
  const offset = options?.offset || 0;

  // Clean query for FTS5
  const ftsQuery = query
    .replace(/[^\w\s]/g, '')
    .trim()
    .split(/\s+/)
    .map((w) => `"${w}"*`)
    .join(' ');

  if (!ftsQuery) return [];

  let sql = `
    SELECT 
      s.id,
      s.act_id,
      s.section_number,
      s.section_title,
      substr(s.section_text, 1, 200) as section_preview,
      a.short_name as act_short_name,
      a.name as act_name,
      a.category,
      rank
    FROM sections_fts fts
    JOIN sections s ON s.rowid = fts.rowid
    JOIN acts a ON a.id = s.act_id
    WHERE sections_fts MATCH ?
  `;

  const params: any[] = [ftsQuery];

  if (options?.actId) {
    sql += ' AND s.act_id = ?';
    params.push(options.actId);
  }

  if (options?.category) {
    sql += ' AND a.category = ?';
    params.push(options.category);
  }

  sql += ' ORDER BY rank LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const results = await database.getAllAsync(sql, params);
  return results as SearchResult[];
}

/**
 * Exact section number lookup
 */
export async function getSectionByNumber(
  actId: string,
  sectionNumber: string
): Promise<SectionData | null> {
  const database = await getDatabase();
  const result = await database.getFirstAsync(
    `SELECT s.*, a.short_name as act_short_name, a.name as act_name,
            c.chapter_number, c.chapter_title
     FROM sections s 
     JOIN acts a ON a.id = s.act_id
     LEFT JOIN chapters c ON c.id = s.chapter_id
     WHERE s.act_id = ? AND s.section_number = ?`,
    [actId, sectionNumber]
  );
  return result as SectionData | null;
}

/**
 * Get all sections for an act
 */
export async function getActSections(actId: string): Promise<SectionData[]> {
  const database = await getDatabase();
  const results = await database.getAllAsync(
    `SELECT s.*, c.chapter_number, c.chapter_title
     FROM sections s 
     LEFT JOIN chapters c ON c.id = s.chapter_id
     WHERE s.act_id = ?
     ORDER BY CAST(s.section_number AS INTEGER)`,
    [actId]
  );
  return results as SectionData[];
}

/**
 * Get all chapters for an act
 */
export async function getActChapters(actId: string): Promise<ChapterData[]> {
  const database = await getDatabase();
  const results = await database.getAllAsync(
    `SELECT * FROM chapters WHERE act_id = ? ORDER BY CAST(chapter_number AS INTEGER)`,
    [actId]
  );
  return results as ChapterData[];
}

/**
 * Get comparison mapping between old and new acts
 */
export async function getComparisonMapping(
  oldActId: string,
  newActId: string,
  filterType?: string
): Promise<ComparisonData[]> {
  const database = await getDatabase();
  let sql = `
    SELECT c.*,
           os.section_title as old_section_title,
           os.section_text as old_section_text,
           ns.section_title as new_section_title,
           ns.section_text as new_section_text
    FROM comparisons c
    LEFT JOIN sections os ON os.id = c.old_section_id
    LEFT JOIN sections ns ON ns.id = c.new_section_id
    WHERE c.old_act_id = ? AND c.new_act_id = ?
  `;
  const params: any[] = [oldActId, newActId];

  if (filterType && filterType !== 'all') {
    sql += ' AND c.mapping_type = ?';
    params.push(filterType);
  }

  sql += ' ORDER BY CAST(c.old_section_number AS INTEGER)';
  const results = await database.getAllAsync(sql, params);
  return results as ComparisonData[];
}

/**
 * Get all acts
 */
export async function getAllActs(category?: string): Promise<ActData[]> {
  const database = await getDatabase();
  let sql = 'SELECT * FROM acts';
  const params: any[] = [];

  if (category && category !== 'all') {
    sql += ' WHERE category = ?';
    params.push(category);
  }

  sql += ' ORDER BY year DESC, name ASC';
  const results = await database.getAllAsync(sql, params);
  return results as ActData[];
}

/**
 * Add to reading history
 */
export async function addReadingHistory(actId: string, sectionId: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT INTO reading_history (act_id, section_id) VALUES (?, ?)',
    [actId, sectionId]
  );
}

/**
 * Get recent reading history
 */
export async function getReadingHistory(limit: number = 10): Promise<any[]> {
  const database = await getDatabase();
  const results = await database.getAllAsync(
    `SELECT rh.*, s.section_number, s.section_title, a.short_name, a.name as act_name
     FROM reading_history rh
     JOIN sections s ON s.id = rh.section_id
     JOIN acts a ON a.id = rh.act_id
     GROUP BY rh.section_id
     ORDER BY rh.read_at DESC
     LIMIT ?`,
    [limit]
  );
  return results;
}

/**
 * Add bookmark
 */
export async function addBookmark(
  actId: string,
  sectionId: string,
  note?: string,
  folderName?: string
): Promise<void> {
  const database = await getDatabase();
  const id = `bm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await database.runAsync(
    'INSERT OR REPLACE INTO local_bookmarks (id, act_id, section_id, note, folder_name) VALUES (?, ?, ?, ?, ?)',
    [id, actId, sectionId, note || null, folderName || 'General']
  );
}

/**
 * Add highlight
 */
export async function addHighlight(
  actId: string,
  sectionId: string,
  startOffset: number,
  endOffset: number,
  color: string,
  note?: string
): Promise<void> {
  const database = await getDatabase();
  const id = `hl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await database.runAsync(
    'INSERT INTO local_highlights (id, act_id, section_id, start_offset, end_offset, color, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, actId, sectionId, startOffset, endOffset, color, note || null]
  );
}

/**
 * Get highlights for a section
 */
export async function getSectionHighlights(sectionId: string): Promise<any[]> {
  const database = await getDatabase();
  return await database.getAllAsync(
    'SELECT * FROM local_highlights WHERE section_id = ? ORDER BY start_offset',
    [sectionId]
  );
}

// Types
export interface ActData {
  id: string;
  name: string;
  short_name: string;
  year: string;
  category: string;
  section_count: number;
  last_updated: string;
  description: string;
}

export interface ChapterData {
  id: string;
  act_id: string;
  chapter_number: string;
  chapter_title: string;
}

export interface SectionData {
  id: string;
  act_id: string;
  chapter_id: string;
  section_number: string;
  section_title: string;
  section_text: string;
  keywords: string;
  act_short_name?: string;
  act_name?: string;
  chapter_number?: string;
  chapter_title?: string;
}

export interface ComparisonData {
  id: string;
  old_act_id: string;
  old_section_id: string;
  old_section_number: string;
  new_act_id: string;
  new_section_id: string;
  new_section_number: string;
  mapping_type: 'retained' | 'modified' | 'repealed' | 'new';
  diff_summary: string;
  old_section_title?: string;
  old_section_text?: string;
  new_section_title?: string;
  new_section_text?: string;
}

export interface SearchResult {
  id: string;
  act_id: string;
  section_number: string;
  section_title: string;
  section_preview: string;
  act_short_name: string;
  act_name: string;
  category: string;
  rank: number;
}
