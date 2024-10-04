import { createConnection, Connection } from 'typeorm';
import { config } from 'dotenv';
import { databaseConfig } from '../config/database.config';
import { createDatabaseConnection, closeConnection } from '../utils/database-connection.util';

// Load environment variables
config();

/**
 * Runs all pending database migrations.
 * This function is responsible for executing the database migration process.
 * 
 * Requirement: Database Schema Management
 * Location: Technical Specification/2. SYSTEM ARCHITECTURE/2.3 COMPONENT DIAGRAMS/2.3.2 Backend Components
 * Description: Automate the process of applying database schema changes
 */
async function runMigrations(): Promise<void> {
  let connection: Connection | null = null;

  try {
    // Step 1: Load environment variables
    console.log('Loading environment variables...');

    // Step 2: Retrieve database configuration
    console.log('Retrieving database configuration...');
    const connectionOptions = {
      ...databaseConfig,
      migrationsRun: true, // Ensure migrations are run
    };

    // Step 3: Establish a connection to the database
    console.log('Establishing database connection...');
    connection = await createDatabaseConnection();

    // Step 4: Run all pending migrations
    console.log('Running pending migrations...');
    const migrations = await connection.runMigrations({ transaction: 'all' });

    // Step 5: Log the results of the migration process
    if (migrations.length > 0) {
      console.log(`Successfully ran ${migrations.length} migration(s):`);
      migrations.forEach((migration) => {
        console.log(`- ${migration.name}`);
      });
    } else {
      console.log('No pending migrations to run.');
    }

    console.log('Migration process completed successfully.');
  } catch (error) {
    console.error('Error during migration process:', error);
    process.exit(1);
  } finally {
    // Step 6: Close the database connection
    if (connection) {
      console.log('Closing database connection...');
      await closeConnection();
    }
  }
}

// Execute the migration process
runMigrations().catch((error) => {
  console.error('Unhandled error during migration process:', error);
  process.exit(1);
});

// Additional notes:
// 1. This script uses TypeORM's migration system to manage database schema changes.
// 2. It ensures that all migrations are run in a single transaction for data consistency.
// 3. The script is designed to be run as part of the deployment process or manually when needed.
// 4. It provides detailed logging to track the migration process and identify any issues.
// 5. Error handling is implemented to catch and log any migration failures.
// 6. The connection is properly closed after migrations are run to prevent resource leaks.
// 7. This script addresses the requirement for automated database schema management as specified in the technical documentation.