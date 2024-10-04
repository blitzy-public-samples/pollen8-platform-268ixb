import { createTheme, Theme } from '@mui/material';

/**
 * This file defines the global theme for the Pollen8 application,
 * ensuring consistent styling across all components.
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

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }
}

const theme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#000000',
    },
    neutral: {
      main: '#EFEFEF',
      contrastText: '#000000',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#EFEFEF',
    },
  },
  typography: {
    fontFamily: '"Proxima Nova", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '30px',
      fontWeight: 600,
    },
    h2: {
      fontSize: '25px',
      fontWeight: 600,
    },
    h3: {
      fontSize: '20px',
      fontWeight: 600,
    },
    body1: {
      fontSize: '14px',
      fontWeight: 300,
    },
    button: {
      fontSize: '16px',
      fontWeight: 600,
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          padding: '12px 24px',
        },
        containedPrimary: {
          backgroundColor: '#000000',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
        containedSecondary: {
          backgroundColor: '#FFFFFF',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#EFEFEF',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#000000',
              borderWidth: '3px',
            },
            '&:hover fieldset': {
              borderColor: '#333333',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
            },
          },
        },
      },
    },
  },
});

export default theme;