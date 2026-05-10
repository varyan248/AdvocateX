/**
 * Settings Store — Theme, language, font size, and app preferences
 */
import { create } from 'zustand';
import { Platform } from 'react-native';

let storage: any;

if (Platform.OS === 'web') {
  storage = {
    set: (key: string, value: any) => {
      try {
        localStorage.setItem(`advocatex-settings-${key}`, value.toString());
      } catch (e) {}
    },
    getString: (key: string) => {
      try {
        return localStorage.getItem(`advocatex-settings-${key}`) || undefined;
      } catch (e) {
        return undefined;
      }
    },
    getBoolean: (key: string) => {
      try {
        const val = localStorage.getItem(`advocatex-settings-${key}`);
        if (val === null) return undefined;
        return val === 'true';
      } catch (e) {
        return undefined;
      }
    },
    getNumber: (key: string) => {
      try {
        const val = localStorage.getItem(`advocatex-settings-${key}`);
        if (val === null) return undefined;
        return Number(val);
      } catch (e) {
        return undefined;
      }
    },
    delete: (key: string) => {
      try {
        localStorage.removeItem(`advocatex-settings-${key}`);
      } catch (e) {}
    },
  };
} else {
  const { MMKV } = require('react-native-mmkv');
  storage = new MMKV({ id: 'advocatex-settings' });
}

type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  themeMode: ThemeMode;
  fontSize: number;
  defaultLanguage: string;
  biometricEnabled: boolean;
  autoLockTimeout: number; // minutes
  notificationsEnabled: boolean;
  hearingReminders: boolean;
  dailyBriefing: boolean;
  readingTheme: 'parchment' | 'sepia' | 'night';

  setThemeMode: (mode: ThemeMode) => void;
  setFontSize: (size: number) => void;
  setDefaultLanguage: (lang: string) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  setAutoLockTimeout: (minutes: number) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setHearingReminders: (enabled: boolean) => void;
  setDailyBriefing: (enabled: boolean) => void;
  setReadingTheme: (theme: 'parchment' | 'sepia' | 'night') => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  themeMode: (storage.getString('themeMode') as ThemeMode) || 'system',
  fontSize: storage.getNumber('fontSize') || 16,
  defaultLanguage: storage.getString('defaultLanguage') || 'gu',
  biometricEnabled: storage.getBoolean('biometricEnabled') || false,
  autoLockTimeout: storage.getNumber('autoLockTimeout') || 5,
  notificationsEnabled: storage.getBoolean('notificationsEnabled') !== false,
  hearingReminders: storage.getBoolean('hearingReminders') !== false,
  dailyBriefing: storage.getBoolean('dailyBriefing') !== false,
  readingTheme: (storage.getString('readingTheme') as 'parchment' | 'sepia' | 'night') || 'parchment',

  setThemeMode: (mode) => {
    storage.set('themeMode', mode);
    set({ themeMode: mode });
  },
  setFontSize: (size) => {
    storage.set('fontSize', size);
    set({ fontSize: size });
  },
  setDefaultLanguage: (lang) => {
    storage.set('defaultLanguage', lang);
    set({ defaultLanguage: lang });
  },
  setBiometricEnabled: (enabled) => {
    storage.set('biometricEnabled', enabled);
    set({ biometricEnabled: enabled });
  },
  setAutoLockTimeout: (minutes) => {
    storage.set('autoLockTimeout', minutes);
    set({ autoLockTimeout: minutes });
  },
  setNotificationsEnabled: (enabled) => {
    storage.set('notificationsEnabled', enabled);
    set({ notificationsEnabled: enabled });
  },
  setHearingReminders: (enabled) => {
    storage.set('hearingReminders', enabled);
    set({ hearingReminders: enabled });
  },
  setDailyBriefing: (enabled) => {
    storage.set('dailyBriefing', enabled);
    set({ dailyBriefing: enabled });
  },
  setReadingTheme: (theme) => {
    storage.set('readingTheme', theme);
    set({ readingTheme: theme });
  },
}));
