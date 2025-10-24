import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  // Effect to update the DOM when theme changes
  useEffect(() => {
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (currentTheme: Theme) => {
        if (currentTheme === 'dark' || (currentTheme === 'system' && systemPrefersDark.matches)) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };
    
    applyTheme(theme);
    
    const handleChange = (e: MediaQueryListEvent) => {
        if (theme === 'system') {
            applyTheme('system');
        }
    };

    systemPrefersDark.addEventListener('change', handleChange);
    return () => systemPrefersDark.removeEventListener('change', handleChange);
  }, [theme]);


  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
