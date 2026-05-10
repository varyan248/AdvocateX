/**
 * Auth Store — User authentication and profile state
 */
import { create } from 'zustand';
import { Platform } from 'react-native';

let storage: any;

if (Platform.OS === 'web') {
  storage = {
    set: (key: string, value: any) => {
      try {
        localStorage.setItem(`advocatex-auth-${key}`, value.toString());
      } catch (e) {}
    },
    getString: (key: string) => {
      try {
        return localStorage.getItem(`advocatex-auth-${key}`) || undefined;
      } catch (e) {
        return undefined;
      }
    },
    getBoolean: (key: string) => {
      try {
        return localStorage.getItem(`advocatex-auth-${key}`) === 'true';
      } catch (e) {
        return false;
      }
    },
    delete: (key: string) => {
      try {
        localStorage.removeItem(`advocatex-auth-${key}`);
      } catch (e) {}
    },
  };
} else {
  const { MMKV } = require('react-native-mmkv');
  storage = new MMKV({ id: 'advocatex-auth' });
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  designation: 'advocate' | 'junior' | 'intern' | 'student';
  primaryCourt: string;
  highCourtJurisdiction: string;
  enrollmentNumber?: string;
  isVerified: boolean;
  areasOfPractice: string[];
  preferredLanguage: string;
  subscriptionTier: 'free' | 'pro' | 'chamber';
  subscriptionExpiry?: string;
  barCouncilState?: string;
  address?: string;
  signatureUrl?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  user: UserProfile | null;
  token: string | null;

  setAuthenticated: (auth: boolean) => void;
  setOnboarded: (onboarded: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  setToken: (token: string | null) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: storage.getBoolean('isAuthenticated') || false,
  isOnboarded: storage.getBoolean('isOnboarded') || false,
  user: (() => {
    try {
      const raw = storage.getString('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })(),
  token: storage.getString('token') || null,

  setAuthenticated: (auth) => {
    storage.set('isAuthenticated', auth);
    set({ isAuthenticated: auth });
  },
  setOnboarded: (onboarded) => {
    storage.set('isOnboarded', onboarded);
    set({ isOnboarded: onboarded });
  },
  setUser: (user) => {
    if (user) {
      storage.set('user', JSON.stringify(user));
    } else {
      storage.delete('user');
    }
    set({ user });
  },
  setToken: (token) => {
    if (token) {
      storage.set('token', token);
    } else {
      storage.delete('token');
    }
    set({ token });
  },
  signOut: () => {
    storage.delete('isAuthenticated');
    storage.delete('user');
    storage.delete('token');
    set({ isAuthenticated: false, user: null, token: null });
  },
}));
