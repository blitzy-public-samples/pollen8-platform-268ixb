/**
 * @file environment.ts
 * @description This file is responsible for managing environment-specific configuration for the Pollen8 application.
 * It provides a centralized location for storing and accessing environment variables and configuration settings
 * that may vary between different deployment environments (e.g., development, staging, production).
 * 
 * @requirement Environment Configuration
 * @location Technical Specification/2. SYSTEM ARCHITECTURE/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM
 */

/**
 * Type definition for environment variables
 */
type EnvironmentVariable = string | undefined;

/**
 * Object containing all environment variables used in the application
 */
const ENV: { [key: string]: EnvironmentVariable } = {
  NODE_ENV: process.env.NODE_ENV,
  API_BASE_URL: process.env.API_BASE_URL,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  JWT_SECRET: process.env.JWT_SECRET,
};

/**
 * Retrieves the value of an environment variable
 * @param key - The key of the environment variable
 * @returns The value of the environment variable
 * @throws Error if the environment variable is not set
 */
export function getEnvironmentVariable(key: string): string {
  const value = ENV[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Checks if the current environment is production
 * @returns True if the current environment is production, false otherwise
 */
export function isProduction(): boolean {
  return getEnvironmentVariable('NODE_ENV') === 'production';
}

/**
 * Checks if the current environment is development
 * @returns True if the current environment is development, false otherwise
 */
export function isDevelopment(): boolean {
  return getEnvironmentVariable('NODE_ENV') === 'development';
}

/**
 * Object containing all environment-specific configuration
 */
export const environment = {
  nodeEnv: getEnvironmentVariable('NODE_ENV'),
  apiBaseUrl: getEnvironmentVariable('API_BASE_URL'),
  twilioAccountSid: getEnvironmentVariable('TWILIO_ACCOUNT_SID'),
  twilioAuthToken: getEnvironmentVariable('TWILIO_AUTH_TOKEN'),
  jwtSecret: getEnvironmentVariable('JWT_SECRET'),
  isProduction,
  isDevelopment,
};

export default environment;