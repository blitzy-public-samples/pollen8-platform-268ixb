import dotenv from 'dotenv';

/**
 * This file is responsible for managing environment-specific configuration settings for the Pollen8 API.
 * It addresses the Environment Configuration requirement from the Technical Specification/2. SYSTEM ARCHITECTURE/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM.
 */

// Declare the NODE_ENV as a global variable
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

/**
 * Loads environment variables from a .env file if it exists.
 * This function uses the dotenv package to accomplish this task.
 */
export function loadEnv(): void {
  const result = dotenv.config();
  
  if (result.error) {
    console.warn('No .env file found. Using default environment variables.');
  }
}

/**
 * Retrieves the value of an environment variable.
 * If the variable is not set and a default value is provided, it returns the default value.
 * 
 * @param key - The name of the environment variable to retrieve
 * @param defaultValue - An optional default value to return if the environment variable is not set
 * @returns The value of the environment variable or the default value
 * @throws Error if the environment variable is not set and no default value is provided
 */
export function getEnvVariable(key: string, defaultValue?: string): string {
  const value = process.env[key];

  if (value !== undefined) {
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Environment variable ${key} is not set and no default value provided.`);
}

// Load environment variables
loadEnv();

// Configuration object with environment-specific settings
export const config = {
  nodeEnv: getEnvVariable('NODE_ENV', 'development'),
  port: parseInt(getEnvVariable('PORT', '3000'), 10),
  database: {
    host: getEnvVariable('DB_HOST', 'localhost'),
    port: parseInt(getEnvVariable('DB_PORT', '5432'), 10),
    username: getEnvVariable('DB_USERNAME', 'postgres'),
    password: getEnvVariable('DB_PASSWORD', 'password'),
    database: getEnvVariable('DB_NAME', 'pollen8'),
  },
  jwt: {
    secret: getEnvVariable('JWT_SECRET', 'your-secret-key'),
    expiresIn: getEnvVariable('JWT_EXPIRES_IN', '1d'),
  },
  twilio: {
    accountSid: getEnvVariable('TWILIO_ACCOUNT_SID'),
    authToken: getEnvVariable('TWILIO_AUTH_TOKEN'),
    verifyServiceSid: getEnvVariable('TWILIO_VERIFY_SERVICE_SID'),
  },
  cors: {
    origin: getEnvVariable('CORS_ORIGIN', 'http://localhost:3000'),
  },
};

export default config;