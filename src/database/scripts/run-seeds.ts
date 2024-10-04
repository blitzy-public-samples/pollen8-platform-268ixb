import { createConnection, Connection } from 'typeorm';
import { config } from 'dotenv';
import { seedIndustries } from '../seeds/1_seed_industries';
import { seedInterests } from '../seeds/2_seed_interests';
import { getDatabaseConnection } from '../utils/database-connection.util';
import { databaseConfig } from '../config/database.config';

// Load environment variables
config();

/**
 * This function is the main entry point for running all seed scripts.
 * It establishes a database connection, runs the seed functions in the correct order,
 * and handles any errors that may occur during the process.
 * 
 * @description Populate the database with initial data for industries and interests
 * @requirements Database Seeding - Technical Specification/2. SYSTEM ARCHITECTURE/2.3 COMPONENT DIAGRAMS/2.3.2 Backend Components
 * 
 * @returns {Promise<void>} A promise that resolves when all seed operations are complete
 */
async function runSeeds(): Promise<void> {
  let connection: Connection | null = null;

  try {
    // Establish a database connection
    connection = await createConnection(databaseConfig);
    console.log('Database connection established.');

    // Run seed functions in order
    console.log('Starting seed operations...');

    // Seed industries
    await seedIndustries();
    console.log('Industries seeded successfully.');

    // Seed interests
    await seedInterests();
    console.log('Interests seeded successfully.');

    console.log('All seed operations completed successfully.');
  } catch (error) {
    console.error('An error occurred during the seeding process:', error);
    throw error;
  } finally {
    // Close the database connection
    if (connection) {
      await connection.close();
      console.log('Database connection closed.');
    }
  }
}

// Run the seeds if this script is executed directly
if (require.main === module) {
  runSeeds()
    .then(() => {
      console.log('Seed script completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });
}

// Export the runSeeds function for use in other scripts or modules
export { runSeeds };