import { Connection, getConnection } from 'typeorm';
import { Industry } from '../entities/industry.entity';

/**
 * Seed function to populate the industries table with predefined industry data.
 * @description This function is responsible for seeding the industries table with a list of common industries.
 * @requirements Industry Selection - Provide a list of industries for users to select from during onboarding (Technical Specification/1.1 System Objectives/Verified Connections)
 */
export async function seedIndustries(): Promise<void> {
  let connection: Connection;

  try {
    // Establish a database connection
    connection = getConnection();

    // Define an array of industry names
    const industryNames: string[] = [
      'Technology',
      'Healthcare',
      'Finance',
      'Education',
      'Manufacturing',
      'Retail',
      'Marketing',
      'Media',
      'Entertainment',
      'Real Estate',
      'Agriculture',
      'Energy',
      'Transportation',
      'Hospitality',
      'Consulting',
      'Legal Services',
      'Non-profit',
      'Government',
      'Telecommunications',
      'Construction'
    ];

    // Create Industry entities from the array of names
    const industries: Industry[] = industryNames.map(name => new Industry({ name }));

    // Use the connection to insert the Industry entities into the database
    await connection
      .createQueryBuilder()
      .insert()
      .into(Industry)
      .values(industries)
      .orIgnore() // This will ignore duplicate entries based on the unique constraint
      .execute();

    console.log(`Successfully seeded ${industries.length} industries.`);
  } catch (error) {
    console.error('Error seeding industries:', error);
    throw error;
  }
}

// If this script is run directly, execute the seed function
if (require.main === module) {
  seedIndustries()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}