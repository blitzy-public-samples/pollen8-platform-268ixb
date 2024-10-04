import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Database configuration for the Pollen8 backend application.
 * This file is responsible for configuring the database connection settings.
 * 
 * @module DatabaseConfig
 */

/**
 * Get the database configuration based on the current environment.
 * 
 * @function getDatabaseConfig
 * @returns {TypeOrmModuleOptions} Database configuration object
 */
export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'pollen8user',
    password: process.env.DB_PASSWORD || 'pollen8password',
    database: process.env.DB_NAME || 'pollen8db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    retryAttempts: 5,
    retryDelay: 3000,
    autoLoadEntities: true,
  };
};

/**
 * Database configuration object.
 * This can be imported and used directly in the app module.
 */
export const databaseConfig: TypeOrmModuleOptions = getDatabaseConfig();

/**
 * Requirements addressed:
 * - Database Configuration (Technical Specification/2. SYSTEM ARCHITECTURE/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM/Data Layer)
 *   This file defines the database connection parameters as specified in the technical requirements.
 */