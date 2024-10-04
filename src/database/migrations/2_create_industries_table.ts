import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * Migration to create the industries table in the database.
 * @description This migration creates the industries table and its indexes for the Pollen8 platform.
 * @requirements Industry Selection - Define database schema for industries that users can associate with their profiles (Technical Specification/1.1 System Objectives/Verified Connections)
 * @requirements Minimum Industry Selection - Support the requirement for users to select at least 3 industries (Technical Specification/1.2 Scope/Core Functionalities)
 */
export class CreateIndustriesTable1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'industries',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Create index on the 'name' column for faster lookups
    await queryRunner.createIndex(
      'industries',
      new TableIndex({
        name: 'IDX_INDUSTRY_NAME',
        columnNames: ['name'],
      })
    );

    // Note: The many-to-many relationship between users and industries
    // will be created in a separate migration for the junction table.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the index first
    await queryRunner.dropIndex('industries', 'IDX_INDUSTRY_NAME');

    // Then drop the table
    await queryRunner.dropTable('industries');
  }
}