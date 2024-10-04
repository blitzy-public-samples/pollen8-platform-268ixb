import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

/**
 * Migration to create the users table in the Pollen8 platform database.
 * @description This migration defines the initial structure of the users table, including all necessary fields and constraints.
 * @requirements User Profile Creation - Define database schema for user profiles (Technical Specification/1.1 System Objectives/Verified Connections)
 * @requirements Phone Verification - Include verified phone number field (Technical Specification/1.1 System Objectives/Verified Connections)
 * @requirements Location-based Profile - Add fields for city and zip code (Technical Specification/1.1 System Objectives/Verified Connections)
 */
export class CreateUsersTable1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'phone_number',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'city',
            type: 'varchar',
          },
          {
            name: 'zip_code',
            type: 'varchar',
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
          },
        ],
      }),
      true
    );

    // Create index on phone_number for faster lookups during authentication
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_PHONE_NUMBER',
        columnNames: ['phone_number'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the index first
    await queryRunner.dropIndex('users', 'IDX_USERS_PHONE_NUMBER');

    // Then drop the table
    await queryRunner.dropTable('users');
  }
}