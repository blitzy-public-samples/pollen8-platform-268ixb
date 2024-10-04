/**
 * This file serves as the main entry point for exporting all shared styles and theme-related modules in the Pollen8 application.
 * 
 * Requirements addressed:
 * 1. Centralized Styling
 *    Location: Technical specification/2.5 Theme Design
 *    Description: Provide a single point of access for all shared styles
 * 
 * Maintenance considerations:
 * - When adding new shared styles or theme-related modules, make sure to export them from this file.
 * - Keep this file lean and only include exports for truly shared and global styling modules.
 * - Consider adding comments for each export to briefly explain its purpose, especially if the number of exports grows.
 */

// Export the main theme object
export { default as theme } from './theme';

// Export the global styles component
export { default as GlobalStyles } from './globalStyles';

// Add any additional style exports here

/**
 * Usage example:
 * import { theme, GlobalStyles } from '@shared/styles';
 * 
 * This allows components and pages to easily import and use the shared styles and theme,
 * ensuring consistency across the application.
 */