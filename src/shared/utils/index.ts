/**
 * @file src/shared/utils/index.ts
 * @description This file serves as the main entry point for utility functions used across the Pollen8 platform.
 * It aggregates and exports various utility functions from different modules to provide a centralized access point
 * for common operations.
 * 
 * Requirements addressed:
 * - Code Organization: Centralize utility functions for easy access (Technical Specification/2. SYSTEM ARCHITECTURE)
 * - Modular Design: Promote code reusability and maintainability (Technical Specification/2. SYSTEM ARCHITECTURE)
 */

// Import all utility functions from the validation module
import * as validation from './validation';

// Import all utility functions from the formatting module
import * as formatting from './formatting';

// Import all utility functions from the networkCalculations module
import * as networkCalculations from './networkCalculations';

// Re-export all functions from the validation module
export const {
  validatePhoneNumber,
  validateEmail,
  validatePassword,
  validateIndustries,
  validateInterests,
  validateZipCode,
  validateInviteUrl
} = validation;

// Re-export all functions from the formatting module
export const {
  formatPhoneNumber,
  formatNetworkValue,
  formatDate,
  formatIndustryList,
  formatInviteUrl
} = formatting;

// Re-export all functions from the networkCalculations module
export const {
  calculateNetworkValue,
  calculateNetworkGrowth,
  calculateIndustryDistribution,
  calculateNetworkStrength
} = networkCalculations;

// Export the entire modules for cases where naming conflicts might occur
// or when users prefer to use the namespaced approach
export { validation, formatting, networkCalculations };

/**
 * Example usage:
 * 
 * import { validatePhoneNumber, formatNetworkValue, calculateNetworkGrowth } from '@shared/utils';
 * 
 * // Or using namespaced imports:
 * import { validation, formatting, networkCalculations } from '@shared/utils';
 * validation.validatePhoneNumber('1234567890');
 * formatting.formatNetworkValue(1000);
 * networkCalculations.calculateNetworkGrowth(oldValue, newValue);
 */