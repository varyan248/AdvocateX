/**
 * AI Chat Store — Vakil AI conversation state
 */
import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: Citation[];
  language?: string;
  isStreaming?: boolean;
}

export interface Citation {
  actName: string;
  sectionNumber: string;
  sectionTitle?: string;
  sectionText?: string;
}

interface AIChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  selectedLanguage: string;
  mode: 'chat' | 'draft' | 'study';
  dailyQueryCount: number;
  maxFreeQueries: number;

  addMessage: (msg: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  setMessages: (msgs: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  setLanguage: (lang: string) => void;
  setMode: (mode: 'chat' | 'draft' | 'study') => void;
  incrementQueryCount: () => void;
  clearChat: () => void;
}

export const useAIChatStore = create<AIChatState>((set) => ({
  messages: [],
  isLoading: false,
  isStreaming: false,
  selectedLanguage: 'en',
  mode: 'chat',
  dailyQueryCount: 0,
  maxFreeQueries: 3,

  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  updateMessage: (id, updates) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),
  setMessages: (msgs) => set({ messages: msgs }),
  setLoading: (loading) => set({ isLoading: loading }),
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  setLanguage: (lang) => set({ selectedLanguage: lang }),
  setMode: (mode) => set({ mode }),
  incrementQueryCount: () => set((s) => ({ dailyQueryCount: s.dailyQueryCount + 1 })),
  clearChat: () => set({ messages: [], isStreaming: false, isLoading: false }),
}));
