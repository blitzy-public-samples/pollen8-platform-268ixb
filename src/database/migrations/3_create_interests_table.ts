import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * Migration to create the interests table in the Pollen8 platform database.
 * @description This migration defines the structure of the interests table, which is crucial for implementing the interest selection feature during user onboarding and profile management.
 * @requirements 
 * - Interest Selection (Technical Specification/1.2 Scope/Core Functionalities/User Authentication and Profile Creation)
 * - Minimum Interest Selection (Technical Specification/1.2 Scope/Core Functionalities/User Authentication and Profile Creation)
 */
export class CreateInterestsTable1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'interests',
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

    // Create a unique index on the 'name' column
    await queryRunner.createIndex(
      'interests',
      new TableIndex({
        name: 'IDX_INTEREST_NAME',
        columnNames: ['name'],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the index first
    await queryRunner.dropIndex('interests', 'IDX_INTEREST_NAME');

    // Then drop the table
    await queryRunner.dropTable('interests');
  }
}