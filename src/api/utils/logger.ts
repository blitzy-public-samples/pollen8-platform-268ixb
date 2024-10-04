import winston from 'winston';
import { config } from '../config/environment';

/**
 * This file implements a custom logging utility for the Pollen8 API, providing consistent and configurable logging across the application.
 * It addresses the Logging requirement from the Technical Specification/System Design/Monitoring and Logging section.
 */

/**
 * Creates and configures a Winston logger instance with appropriate transports and format based on the current environment.
 * 
 * @returns {winston.Logger} Configured Winston logger instance
 */
function createLogger(): winston.Logger {
  // Step 1: Import necessary modules and configurations
  const { combine, timestamp, printf, colorize } = winston.format;

  // Step 2: Create a Winston logger instance
  const logger = winston.createLogger({
    level: config.nodeEnv === 'production' ? 'info' : 'debug',
    format: combine(
      timestamp(),
      printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level}]: ${message}`;
      })
    ),
    transports: [],
  });

  // Step 3: Configure console transport with appropriate format based on environment
  if (config.nodeEnv !== 'production') {
    logger.add(new winston.transports.Console({
      format: combine(
        colorize(),
        printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
    }));
  } else {
    logger.add(new winston.transports.Console({
      format: combine(
        printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
    }));
  }

  // Step 4: Add file transport for production environment
  if (config.nodeEnv === 'production') {
    logger.add(new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }));
    logger.add(new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }));
  }

  // Step 5: Set log level based on environment
  logger.level = config.nodeEnv === 'production' ? 'info' : 'debug';

  // Step 6: Return the configured logger instance
  return logger;
}

// Create and export the logger instance
export const log = createLogger();

// Export the logger as default for convenience
export default log;