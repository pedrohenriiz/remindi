import React, { createContext, useContext, useState } from 'react';
import { lightTheme } from './themes';
import { Theme } from './themes';

type ThemeName = 'light';

interface ThemeContextData {
  theme: Theme;
  themeName: ThemeName;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName] = useState<ThemeName>('light');

  const theme = lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeName }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
