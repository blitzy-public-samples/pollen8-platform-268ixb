import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

/**
 * Migration to create the user_industries junction table in the Pollen8 platform database.
 * @description This migration establishes the many-to-many relationship between users and industries,
 * allowing users to associate multiple industries with their profiles.
 * @requirements Industry Selection - Enable users to select multiple industries for their profile (Technical Specification/1.1 System Objectives/Verified Connections)
 * @requirements Minimum Industry Selection - Support the requirement for users to select at least 3 industries (Technical Specification/1.2 Scope/Core Functionalities)
 */
export class CreateUserIndustriesTable1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_industries',
        columns: [
          {
            name: 'user_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'industry_id',
            type: 'uuid',
            isPrimary: true,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'user_industries',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'user_industries',
      new TableForeignKey({
        columnNames: ['industry_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'industries',
        onDelete: 'CASCADE',
      })
    );

    // Create an index to improve query performance
    await queryRunner.createIndex('user_industries', {
      name: 'IDX_USER_INDUSTRIES',
      columnNames: ['user_id', 'industry_id'],
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the index
    await queryRunner.dropIndex('user_industries', 'IDX_USER_INDUSTRIES');

    // Drop foreign keys
    const table = await queryRunner.getTable('user_industries');
    const foreignKeys = table.foreignKeys;
    for (const foreignKey of foreignKeys) {
      await queryRunner.dropForeignKey('user_industries', foreignKey);
    }

    // Drop the table
    await queryRunner.dropTable('user_industries');
  }
}