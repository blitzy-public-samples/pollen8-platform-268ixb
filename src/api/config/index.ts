import { config as environmentConfig } from './environment';
import { databaseConfig } from './database';

/**
 * This file serves as the central configuration hub for the Pollen8 API,
 * aggregating and exporting various configuration settings from different modules.
 * 
 * Requirements addressed:
 * - Centralized Configuration (Technical Specification/2. SYSTEM ARCHITECTURE/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM)
 */

/**
 * Exportable configuration object combining all settings
 */
export const config = {
  ...environmentConfig,
  database: {
    ...environmentConfig.database,
    ...databaseConfig,
  },
};

/**
 * Security considerations:
 * 1. This file does not contain any sensitive information directly.
 *    All sensitive data is handled in the imported configuration files.
 * 2. Ensure that the exported configuration object does not accidentally
 *    expose any sensitive information that should remain private to specific modules.
 */

/**
 * Additional notes:
 * 1. This index file plays a crucial role in maintaining a clean and organized
 *    configuration structure for the Pollen8 API.
 * 2. It simplifies configuration management by providing a single point of truth for all settings.
 * 3. As the application grows, additional configuration modules can be easily integrated
 *    by importing them here and adding them to the exported config object.
 * 4. It's important to keep this file lean and focused on aggregating configurations,
 *    rather than defining them directly here.
 */

/**
 * Usage example:
 * import { config } from '../config';
 * 
 * // Access environment variables
 * const port = config.port;
 * 
 * // Access database configuration
 * const dbHost = config.database.host;
 */

export default config;