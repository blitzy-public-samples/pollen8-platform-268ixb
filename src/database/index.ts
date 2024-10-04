import { Connection } from 'typeorm';
import { databaseConfig } from './config/database.config';
import { createDatabaseConnection } from './utils/database-connection.util';
import { User } from './entities/user.entity';
import { Industry } from './entities/industry.entity';
import { Interest } from './entities/interest.entity';
import { Connection as ConnectionEntity } from './entities/connection.entity';
import { Invite } from './entities/invite.entity';
import { InviteAnalytics } from './entities/invite-analytics.entity';
import { UserRepository } from './repositories/user.repository';
import { IndustryRepository } from './repositories/industry.repository';
import { InterestRepository } from './repositories/interest.repository';
import { ConnectionRepository } from './repositories/connection.repository';
import { InviteRepository } from './repositories/invite.repository';
import { InviteAnalyticsRepository } from './repositories/invite-analytics.repository';

// Requirement: Database Integration
// Location: Technical Specification/2. SYSTEM ARCHITECTURE/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM
// Description: Provides a centralized access point for all database operations

/**
 * Initializes the database connection using the configuration and utility functions.
 * @returns A promise that resolves to a database connection
 */
export async function initializeDatabase(): Promise<Connection> {
  try {
    const connection = await createDatabaseConnection();
    console.log('Database initialized successfully');
    return connection;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Export entities
export { User, Industry, Interest, ConnectionEntity as Connection, Invite, InviteAnalytics };

// Export repositories
export { UserRepository, IndustryRepository, InterestRepository, ConnectionRepository, InviteRepository, InviteAnalyticsRepository };

// Export database configuration
export { databaseConfig };

// Export utility functions
export { createDatabaseConnection, getConnection, closeConnection, createConnectionPool } from './utils/database-connection.util';

// Additional exports for database-related functionality
export { QueryBuilder } from './utils/query-builder.util';

// Requirement: Centralized Database Access
// Location: Technical Specification/2. SYSTEM ARCHITECTURE/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM
// Description: This file serves as the main entry point for the database module, exporting all necessary database-related functionality

/**
 * This module provides a centralized access point for all database operations in the Pollen8 platform.
 * It exports entities, repositories, configuration, and utility functions for database management.
 * 
 * Usage:
 * 1. Import this module in other parts of the application that require database access.
 * 2. Use the exported functions and classes to interact with the database.
 * 3. Always initialize the database connection before performing any database operations.
 * 
 * Example:
 * ```
 * import { initializeDatabase, UserRepository } from './database';
 * 
 * async function setupDatabase() {
 *   await initializeDatabase();
 *   const userRepository = new UserRepository();
 *   // Perform database operations...
 * }
 * ```
 * 
 * Note: Ensure proper error handling when using database functions, especially in production environments.
 */

// Export any additional types or interfaces that might be useful for consumers of this module
export type { ConnectionOptions } from 'typeorm';

// Requirement: Database Security
// Location: Technical Specification/9. SECURITY CONSIDERATIONS/9.2 DATA SECURITY
// Description: Implement secure database access and connection management