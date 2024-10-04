/**
 * @file src/shared/config/index.ts
 * @description Central export point for all configuration-related modules in the shared directory.
 * This file aggregates and re-exports configuration settings from various files to provide
 * a unified interface for accessing application configuration throughout the project.
 * 
 * @requires ./environment - Environment-related configurations
 * @requires ./featureFlags - Feature flag-related configurations
 * 
 * Requirements addressed:
 * - Centralized Configuration (Technical Specification/2. SYSTEM ARCHITECTURE/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM)
 * - Feature Flag Management (Technical Specification/2. SYSTEM ARCHITECTURE/2.3 COMPONENT DIAGRAMS)
 */

// Import all environment-related configurations
import * as environment from './environment';

// Import all feature flag-related configurations
import * as featureFlags from './featureFlags';

// Re-export all configurations from the imported modules
export * from './environment';
export * from './featureFlags';

// Export a consolidated config object for convenience
export const config = {
  environment,
  featureFlags
};

/**
 * Usage example:
 * 
 * import { config } from '@shared/config';
 * 
 * console.log(config.environment.API_URL);
 * console.log(config.featureFlags.ENABLE_NEW_FEATURE);
 * 
 * // Or import specific configurations:
 * import { API_URL } from '@shared/config';
 * import { ENABLE_NEW_FEATURE } from '@shared/config';
 */