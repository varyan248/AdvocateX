/**
 * AdvocateX Theme Provider — React Context for light/dark mode
 */
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';
import { useSettingsStore } from '../stores/settingsStore';

type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  colors: typeof Colors.light;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const { themeMode, setThemeMode } = useSettingsStore();

  const resolved: ResolvedTheme = useMemo(() => {
    if (themeMode === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, systemScheme]);

  const colors = useMemo(() => {
    return resolved === 'dark' ? Colors.dark : Colors.light;
  }, [resolved]);

  const value = useMemo(
    () => ({
      mode: themeMode,
      resolved,
      colors,
      isDark: resolved === 'dark',
      setMode: setThemeMode,
    }),
    [themeMode, resolved, colors, setThemeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export const useColors = () => useTheme().colors;
