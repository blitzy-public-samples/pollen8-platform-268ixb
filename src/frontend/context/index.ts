import { AuthContext, AuthProvider, useAuthContext } from './AuthContext';
import { ThemeContext, ThemeProvider, useTheme } from './ThemeContext';

// Export authentication context and related utilities
export { AuthContext, AuthProvider, useAuthContext };

// Export theme context and related utilities
export { ThemeContext, ThemeProvider, useTheme };

// Requirement addressed: Centralized State Management
// Location: Technical specification/2. SYSTEM ARCHITECTURE/2.3.1 Frontend Components
// Description: This file provides easy access to global state by exporting context providers and hooks

// Requirement addressed: Modular Architecture
// Location: Technical specification/2. SYSTEM ARCHITECTURE/2.3 COMPONENT DIAGRAMS
// Description: This file organizes code into reusable modules by centralizing context exports

// Note: This file acts as a single point of import for all context-related
// components and hooks, simplifying imports throughout the application.