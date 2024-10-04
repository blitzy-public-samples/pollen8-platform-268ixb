import { getConnection } from 'typeorm';
import { Interest } from '../entities/interest.entity';

/**
 * Seed data for populating the interests table in the Pollen8 platform database.
 * @description This function is responsible for seeding the interests table with predefined interest data.
 * @requirements Interest Selection - Provide a list of interests for users to select from during onboarding (Technical Specification/1.1 System Objectives/Verified Connections)
 */
export async function seedInterests(): Promise<void> {
  const connection = getConnection();
  const interestRepository = connection.getRepository(Interest);

  // Define an array of interest names to be seeded
  const interestNames: string[] = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Marketing',
    'Design',
    'Engineering',
    'Sales',
    'Human Resources',
    'Entrepreneurship',
    'Data Science',
    'Artificial Intelligence',
    'Blockchain',
    'Sustainability',
    'Cybersecurity'
  ];

  try {
    console.log('Starting to seed interests...');

    // Create Interest entities from the array of names
    const interests = interestNames.map(name => new Interest({ name }));

    // Use the connection to save the Interest entities to the database
    await interestRepository.save(interests, { chunk: 50 });

    console.log(`Successfully seeded ${interests.length} interests.`);
  } catch (error) {
    console.error('Error seeding interests:', error);
    // Implement error handling for robustness
    if (error.code === '23505') { // Unique constraint violation
      console.log('Some interests already exist. Skipping duplicates.');
    } else {
      throw error; // Re-throw the error for other types of errors
    }
  } finally {
    // Note: We don't close the connection here as it might be needed for other operations
    console.log('Finished interest seeding process.');
  }
}

// Export the seedInterests function for use in scripts or other modules
export { seedInterests };