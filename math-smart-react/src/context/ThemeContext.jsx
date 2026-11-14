import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const THEME_STORAGE_KEY = 'math_smart_theme_v1';

/**
 * @typedef {{ theme: 'dark' | 'light', toggleTheme: () => void }} ThemeContextValue
 */

/** @type {React.Context<ThemeContextValue>} */
const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {}
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem(THEME_STORAGE_KEY) : null;
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage quota / private mode errors
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/** @returns {ThemeContextValue} */
export const useTheme = () => useContext(ThemeContext);
