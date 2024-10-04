/**
 * This file serves as the main entry point for utility functions in the frontend of the Pollen8 application.
 * It re-exports utility functions from other files in the utils directory, allowing for a cleaner import syntax
 * in other parts of the application.
 *
 * Requirements addressed:
 * - Utility Functions (Technical Specification/1.1 System Objectives)
 */

// Re-export all functions from analytics.ts
export * from './analytics';

// Re-export all functions from errorHandling.ts
export * from './errorHandling';

// As the application grows, more utility functions may be added and exported from this file.
// It's important to keep this file updated whenever new utility files are added to the utils directory.

/**
 * Example of how to use these utilities in other parts of the application:
 * 
 * import { trackPageView, handleApiError } from 'src/frontend/utils';
 * 
 * // Track a page view
 * trackPageView('Home');
 * 
 * // Handle an API error
 * try {
 *   // API call
 * } catch (error) {
 *   handleApiError(error);
 * }
 */

// This file structure promotes modularity and makes it easier to manage and use utility functions
// throughout the frontend application.