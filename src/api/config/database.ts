import { ConnectionOptions } from 'typeorm';
import { config } from './environment';

/**
 * This file contains the database configuration settings for the Pollen8 API.
 * It defines the connection parameters and options for interacting with the PostgreSQL database used by the application.
 * 
 * Requirements addressed:
 * - Database Configuration (Technical Specification/2. SYSTEM ARCHITECTURE/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM)
 */

/**
 * Database configuration object that can be exported and used to establish a connection
 * between the Pollen8 API and its PostgreSQL database.
 */
export const databaseConfig: ConnectionOptions = {
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: config.nodeEnv !== 'production',
  logging: config.nodeEnv === 'development',
  ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
};

/**
 * Additional TypeORM-specific options for optimizing database performance and behavior.
 */
export const typeOrmConfig: Partial<ConnectionOptions> = {
  ...databaseConfig,
  migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
  cache: {
    duration: 30000, // 30 seconds
  },
  extra: {
    max: 25, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  },
};

/**
 * Security considerations:
 * 1. Database credentials are stored as environment variables, not hardcoded in this file.
 * 2. The 'synchronize' option is set to false in production for data safety.
 * 3. SSL options are included for secure database connections in production.
 */

/**
 * Additional notes:
 * 1. This configuration file is crucial for establishing a connection between the Pollen8 API and its PostgreSQL database.
 * 2. It's likely to be imported in the main application file or a database module to initialize the database connection.
 * 3. The file includes additional TypeORM-specific options for optimizing database performance and behavior.
 */

export default databaseConfig;