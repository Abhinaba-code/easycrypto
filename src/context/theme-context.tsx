
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themes, type Theme } from '@/lib/themes';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(themes[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedThemeName = localStorage.getItem('crypto-theme');
    const storedTheme = themes.find(t => t.name === storedThemeName);
    if (storedTheme) {
      setThemeState(storedTheme);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const root = window.document.documentElement;
      const colors = theme.colors[theme.mode];
      
      root.style.setProperty('--background', colors.background);
      root.style.setProperty('--foreground', colors.foreground);
      root.style.setProperty('--card', colors.card);
      root.style.setProperty('--card-foreground', colors.cardForeground);
      root.style.setProperty('--popover', colors.popover);
      root.style.setProperty('--popover-foreground', colors.popoverForeground);
      root.style.setProperty('--primary', colors.primary);
      root.style.setProperty('--primary-foreground', colors.primaryForeground);
      root.style.setProperty('--secondary', colors.secondary);
      root.style.setProperty('--secondary-foreground', colors.secondaryForeground);
      root.style.setProperty('--muted', colors.muted);
      root.style.setProperty('--muted-foreground', colors.mutedForeground);
      root.style.setProperty('--accent', colors.accent);
      root.style.setProperty('--accent-foreground', colors.accentForeground);
      root.style.setProperty('--destructive', colors.destructive);
      root.style.setProperty('--destructive-foreground', colors.destructiveForeground);
      root.style.setProperty('--border', colors.border);
      root.style.setProperty('--input', colors.input);
      root.style.setProperty('--ring', colors.ring);

      document.body.classList.remove('light', 'dark');
      document.body.classList.add(theme.mode);
    }
  }, [theme, mounted]);

  const setTheme = (themeName: string) => {
    const newTheme = themes.find(t => t.name === themeName);
    if (newTheme) {
      setThemeState(newTheme);
      localStorage.setItem('crypto-theme', themeName);
    }
  };
  
  if (!mounted) {
    return null;
  }

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
