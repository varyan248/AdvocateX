/**
 * Cases Store — Case management state
 */
import { create } from 'zustand';

export interface Case {
  id: string;
  userId: string;
  title: string;
  clientName: string;
  clientPhone?: string;
  oppositeParty: string;
  courtName: string;
  caseNumber: string;
  cnrNumber?: string;
  firNumber?: string;
  policeStation?: string;
  sectionsInvolved: string[];
  filingDate: string;
  stage: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isActive: boolean;
  advocateOnRecord?: string;
  nextHearingDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Hearing {
  id: string;
  caseId: string;
  userId: string;
  date: string;
  purpose: string;
  outcome?: string;
  notes?: string;
  notificationSent: boolean;
  createdAt: string;
}

export interface CaseDocument {
  id: string;
  caseId: string;
  userId: string;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface FeeRecord {
  id: string;
  caseId: string;
  userId: string;
  amount: number;
  type: 'received' | 'expected';
  description: string;
  date: string;
  receiptUrl?: string;
}

interface CasesState {
  cases: Case[];
  selectedCase: Case | null;
  hearings: Hearing[];
  documents: CaseDocument[];
  fees: FeeRecord[];
  filter: 'all' | 'active' | 'disposed' | 'upcoming';
  sortBy: 'nextHearing' | 'dateFiled' | 'court';

  setCases: (cases: Case[]) => void;
  addCase: (c: Case) => void;
  updateCase: (id: string, updates: Partial<Case>) => void;
  selectCase: (c: Case | null) => void;
  setHearings: (hearings: Hearing[]) => void;
  addHearing: (h: Hearing) => void;
  setDocuments: (docs: CaseDocument[]) => void;
  setFees: (fees: FeeRecord[]) => void;
  setFilter: (filter: 'all' | 'active' | 'disposed' | 'upcoming') => void;
  setSortBy: (sort: 'nextHearing' | 'dateFiled' | 'court') => void;
}

export const useCasesStore = create<CasesState>((set) => ({
  cases: [],
  selectedCase: null,
  hearings: [],
  documents: [],
  fees: [],
  filter: 'all',
  sortBy: 'nextHearing',

  setCases: (cases) => set({ cases }),
  addCase: (c) => set((s) => ({ cases: [...s.cases, c] })),
  updateCase: (id, updates) =>
    set((s) => ({
      cases: s.cases.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  selectCase: (c) => set({ selectedCase: c }),
  setHearings: (hearings) => set({ hearings }),
  addHearing: (h) => set((s) => ({ hearings: [...s.hearings, h] })),
  setDocuments: (docs) => set({ documents: docs }),
  setFees: (fees) => set({ fees }),
  setFilter: (filter) => set({ filter }),
  setSortBy: (sort) => set({ sortBy: sort }),
}));
