import { ConnectionOptions } from 'typeorm';
import { DatabaseConfig } from './database.config';

// Requirement: Database Configuration
// Location: Technical specification/2. SYSTEM ARCHITECTURE/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM
// Description: Establish connection settings for the application's database

const configuration: ConnectionOptions = {
  type: DatabaseConfig.type,
  host: DatabaseConfig.host,
  port: DatabaseConfig.port,
  username: DatabaseConfig.username,
  password: DatabaseConfig.password,
  database: DatabaseConfig.database,
  entities: ['src/database/entities/**/*.entity.ts'],
  migrations: ['src/database/migrations/**/*.ts'],
  cli: {
    entitiesDir: 'src/database/entities',
    migrationsDir: 'src/database/migrations',
  },
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
};

// Export the configuration for use in other parts of the application
export const ormconfig: ConnectionOptions = configuration;

// Additional notes:
// 1. This file is crucial for establishing the connection between the Pollen8 application and its database using TypeORM.
// 2. It uses environment variables for sensitive information like database credentials to enhance security.
// 3. The configuration may differ slightly between development, staging, and production environments.
// 4. It's important to ensure that the `entities` and `migrations` paths are correctly set to match the project structure.
// 5. The `synchronize` option is set to `false` to prevent automatic schema changes in all environments.
// 6. Logging is configured to be enabled in non-production environments for debugging purposes.

// Requirement: Security Considerations
// Location: Technical specification/9. SECURITY CONSIDERATIONS/9.2 DATA SECURITY
// Description: Ensure sensitive information like database credentials are not hardcoded

// Requirement: Environment-specific Configuration
// Location: Technical specification/5. INFRASTRUCTURE/5.1 DEPLOYMENT ENVIRONMENT
// Description: Support different configurations for development, staging, and production environments