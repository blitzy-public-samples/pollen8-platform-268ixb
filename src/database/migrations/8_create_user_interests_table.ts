import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

/**
 * Migration to create the user_interests junction table in the Pollen8 platform database.
 * @description This migration establishes the many-to-many relationship between users and interests,
 * allowing users to associate multiple interests with their profiles.
 * @requirements Interest Selection - Enable users to select multiple interests for their profile
 * (Technical Specification/1.2 Scope/Core Functionalities/User Authentication and Profile Creation)
 * @requirements Minimum Interest Selection - Support the requirement for users to select at least 3 interests
 * (Technical Specification/1.2 Scope/Core Functionalities/User Authentication and Profile Creation)
 */
export class CreateUserInterestsTable1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_interests',
        columns: [
          {
            name: 'user_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'interest_id',
            type: 'uuid',
            isPrimary: true,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'user_interests',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'user_interests',
      new TableForeignKey({
        columnNames: ['interest_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'interests',
        onDelete: 'CASCADE',
      })
    );

    // Create an index to improve query performance
    await queryRunner.createIndex(
      'user_interests',
      {
        name: 'IDX_USER_INTERESTS',
        columnNames: ['user_id', 'interest_id'],
      }
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the index
    await queryRunner.dropIndex('user_interests', 'IDX_USER_INTERESTS');

    // Drop foreign keys
    await queryRunner.dropForeignKey('user_interests', 'FK_USER_INTERESTS_INTEREST');
    await queryRunner.dropForeignKey('user_interests', 'FK_USER_INTERESTS_USER');

    // Drop the table
    await queryRunner.dropTable('user_interests');
  }
}