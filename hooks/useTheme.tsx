import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type Theme = 'light' | 'dark' | 'lime' | 'rose' | 'ocean' | 'tangerine' | 'lavender';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors: { [key in Theme]: string } = {
  light: '#e0e5ec',
  dark: '#2c3038',
  lime: '#f0f2eb',
  rose: '#fbe9e7',
  ocean: '#e6f0f5',
  tangerine: '#fff0e6',
  lavender: '#f3eef7',
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>('theme', 'light');
  const [theme, setTheme] = useState<Theme>(storedTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    // Clean up all possible theme classes before adding the current one
    root.classList.remove('light', 'dark', 'lime', 'rose', 'ocean', 'tangerine', 'lavender');
    root.classList.add(theme);
    setStoredTheme(theme);

    const themeColorMeta = document.getElementById('theme-color-meta');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', themeColors[theme]);
    }
  }, [theme, setStoredTheme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};