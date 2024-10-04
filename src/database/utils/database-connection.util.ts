import { createConnection, Connection, ConnectionOptions } from 'typeorm';
import { Pool } from 'pg';
import { databaseConfig } from '../config/database.config';
import { ormconfig } from '../config/ormconfig';

// Requirement: Database Connection Management
// Location: Technical Specification/2. SYSTEM ARCHITECTURE/2.2 HIGH-LEVEL ARCHITECTURE DIAGRAM
// Description: Establish and manage connections to the PostgreSQL database

let dbConnection: Connection;

/**
 * Creates and establishes a connection to the database using TypeORM.
 * Uses configuration from DatabaseConfig and OrmConfig to set up the connection.
 * @returns A promise that resolves to the established database connection
 */
export async function createDatabaseConnection(): Promise<Connection> {
  try {
    const connectionOptions: ConnectionOptions = {
      ...databaseConfig,
      ...ormconfig,
    };

    const connection = await createConnection(connectionOptions);
    dbConnection = connection;
    console.log('Database connection established successfully');
    return connection;
  } catch (error) {
    console.error('Error establishing database connection:', error);
    throw error;
  }
}

/**
 * Returns the current database connection instance.
 * If no connection exists, it throws an error.
 * @returns The current database connection instance
 */
export function getConnection(): Connection {
  if (!dbConnection) {
    throw new Error('Database connection has not been established. Call createDatabaseConnection() first.');
  }
  return dbConnection;
}

/**
 * Closes the current database connection if it exists.
 * @returns A promise that resolves when the connection is closed
 */
export async function closeConnection(): Promise<void> {
  if (dbConnection) {
    await dbConnection.close();
    dbConnection = null;
    console.log('Database connection closed successfully');
  }
}

// Requirement: Connection Pooling
// Location: Technical Specification/9. SECURITY CONSIDERATIONS/9.2 DATA SECURITY/9.2.3 Database Security
// Description: Implement connection pooling for efficient database access

/**
 * Creates and returns a connection pool for PostgreSQL using the `pg` module.
 * Uses the database configuration to set up the pool with optimal settings.
 * @returns A PostgreSQL connection pool instance
 */
export function createConnectionPool(): Pool {
  const poolConfig = {
    ...databaseConfig,
    max: process.env.NODE_ENV === 'production' ? 20 : 10, // Max connections
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  };

  const pool = new Pool(poolConfig);

  // Error handling for the pool
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  console.log('PostgreSQL connection pool created successfully');
  return pool;
}

// Export the global connection variable for use in other modules
export { dbConnection };

// Additional notes:
// 1. This utility file centralizes database connection management for the Pollen8 platform.
// 2. It provides functions for creating, retrieving, and closing database connections.
// 3. The connection pooling feature enhances performance by reusing connections.
// 4. Error handling is implemented to catch and log any connection issues.
// 5. The configuration is environment-aware, allowing for different settings in development, staging, and production.
// 6. Always ensure to close the connection when it's no longer needed to prevent resource leaks.