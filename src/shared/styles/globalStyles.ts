import { createGlobalStyle } from 'styled-components';
import theme from './theme';

/**
 * This file defines the global styles for the Pollen8 application,
 * ensuring a consistent look and feel across all components and pages.
 * 
 * Requirements addressed:
 * 1. Black and White Theme
 *    Location: Technical specification/1.2 Scope/Product Overview
 *    Description: Implement a minimalist black and white aesthetic
 * 
 * 2. Proxima Nova Font
 *    Location: Technical specification/2.5 Theme Design/Typography
 *    Description: Use Proxima Nova as the primary font
 */

const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${theme.palette.background.default};
    color: ${theme.palette.text.primary};
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.body1.fontSize};
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }

  h1, h2, h3 {
    font-weight: ${theme.typography.h1.fontWeight};
    margin-bottom: ${theme.spacing(2)}px;
  }

  h1 {
    font-size: ${theme.typography.h1.fontSize};
  }

  h2 {
    font-size: ${theme.typography.h2.fontSize};
  }

  h3 {
    font-size: ${theme.typography.h3.fontSize};
  }

  a {
    color: ${theme.palette.text.primary};
    text-decoration: none;
    &:hover {
      opacity: 0.8;
    }
  }

  button {
    background-color: ${theme.palette.primary.main};
    color: ${theme.palette.primary.contrastText};
    padding: ${theme.spacing(1, 2)};
    border: none;
    border-radius: ${theme.shape.borderRadius}px;
    cursor: pointer;
    font-size: ${theme.typography.button.fontSize};
    font-weight: ${theme.typography.button.fontWeight};
    text-transform: ${theme.typography.button.textTransform};
    &:hover {
      opacity: 0.9;
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${theme.palette.secondary.main};
    }
  }

  input, textarea {
    background-color: ${theme.palette.background.default};
    color: ${theme.palette.text.primary};
    border: 3px solid ${theme.palette.primary.main};
    border-radius: ${theme.shape.borderRadius}px;
    padding: ${theme.spacing(1)}px;
    font-family: ${theme.typography.fontFamily};
    &:focus {
      outline: none;
      border-color: ${theme.palette.primary.main};
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: ${theme.spacing(0, 2)};
  }

  .flex {
    display: flex;
  }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: ${theme.breakpoints.values.md}px) {
    body {
      font-size: ${parseFloat(theme.typography.body1.fontSize as string) * 0.9}px;
    }
    h1 {
      font-size: ${parseFloat(theme.typography.h1.fontSize as string) * 0.9}px;
    }
    h2 {
      font-size: ${parseFloat(theme.typography.h2.fontSize as string) * 0.9}px;
    }
    h3 {
      font-size: ${parseFloat(theme.typography.h3.fontSize as string) * 0.9}px;
    }
  }
`;

export default GlobalStyles;