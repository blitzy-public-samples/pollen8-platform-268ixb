import { ConnectionOptions } from 'typeorm';
import { ormconfig } from '../ormconfig';

// Development configuration
const developmentConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'pollen8_dev',
  password: process.env.DB_PASSWORD || 'dev_password',
  database: process.env.DB_NAME || 'pollen8_dev',
  entities: ormconfig.entities,
  migrations: ormconfig.migrations,
  logging: true,
  synchronize: false,
};

// Staging configuration
const stagingConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ormconfig.entities,
  migrations: ormconfig.migrations,
  logging: false,
  synchronize: false,
};

// Production configuration
const productionConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ormconfig.entities,
  migrations: ormconfig.migrations,
  logging: false,
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    max: 20,
    min: 2,
    idleTimeoutMillis: 10000,
  },
};

// Export the appropriate configuration based on the environment
export const databaseConfig: ConnectionOptions = 
  process.env.NODE_ENV === 'production' ? productionConfig :
  (process.env.NODE_ENV === 'staging' ? stagingConfig : developmentConfig);

// Requirement: Database Connection
// Location: Technical specification/2. SYSTEM ARCHITECTURE/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM
// Description: This file provides configuration for connecting to the PostgreSQL database

// Requirement: Environment-specific Configuration
// Location: Technical specification/5. INFRASTRUCTURE/5.1 DEPLOYMENT ENVIRONMENT
// Description: This file supports different database configurations for development, staging, and production environments