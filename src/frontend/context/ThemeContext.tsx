import React, { createContext, useState, useContext, useCallback, useMemo, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles';
import defaultTheme from '../../shared/styles/theme';

/**
 * This file defines a React context for managing the application's theme,
 * allowing for dynamic theme switching and consistent theme application
 * across the Pollen8 platform.
 * 
 * Requirements addressed:
 * 1. Black and White Theme
 *    Location: Technical specification/1.2 Scope/Product Overview
 *    Description: Implement a minimalist black and white aesthetic
 * 
 * 2. Proxima Nova Font
 *    Location: Technical specification/1.2 Scope/Product Overview
 *    Description: Use Proxima Nova as the primary font
 */

// Define the shape of the theme context
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define the props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

// Create the ThemeProvider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // State to hold the current theme
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Function to toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      palette: {
        ...prevTheme.palette,
        mode: prevTheme.palette.mode === 'light' ? 'dark' : 'light',
        background: {
          default: prevTheme.palette.mode === 'light' ? '#000000' : '#FFFFFF',
          paper: prevTheme.palette.mode === 'light' ? '#000000' : '#FFFFFF',
        },
        text: {
          primary: prevTheme.palette.mode === 'light' ? '#FFFFFF' : '#000000',
          secondary: prevTheme.palette.mode === 'light' ? '#EFEFEF' : '#333333',
        },
      },
    }));
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook for accessing the theme context within components
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;