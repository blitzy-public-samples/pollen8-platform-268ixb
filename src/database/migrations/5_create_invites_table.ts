import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

/**
 * Migration class for creating the invites table in the Pollen8 platform database.
 * @description This migration defines the structure of the invites table, which is crucial for implementing the strategic growth tools and invite system features.
 * @requirements Invite System - Define database schema for trackable invite links (Technical Specification/1.1 System Objectives/Strategic Growth Tools)
 * @requirements Click Analytics - Include field for storing click count (Technical Specification/1.1 System Objectives/Strategic Growth Tools)
 * @requirements 30-day Activity Visualization - Add creation timestamp for invite analytics (Technical Specification/1.1 System Objectives/Strategic Growth Tools)
 */
export class CreateInvitesTable1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invites',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'url',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'clickCount',
            type: 'integer',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Create index on userId for faster lookups
    await queryRunner.createIndex(
      'invites',
      new TableIndex({
        name: 'IDX_INVITES_USER_ID',
        columnNames: ['userId'],
      })
    );

    // Create unique index on url to ensure uniqueness
    await queryRunner.createIndex(
      'invites',
      new TableIndex({
        name: 'IDX_INVITES_URL',
        columnNames: ['url'],
        isUnique: true,
      })
    );

    // Create foreign key constraint for userId referencing users table
    await queryRunner.createForeignKey(
      'invites',
      new TableForeignKey({
        name: 'FK_INVITES_USER',
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint
    await queryRunner.dropForeignKey('invites', 'FK_INVITES_USER');

    // Drop indexes
    await queryRunner.dropIndex('invites', 'IDX_INVITES_URL');
    await queryRunner.dropIndex('invites', 'IDX_INVITES_USER_ID');

    // Drop the invites table
    await queryRunner.dropTable('invites');
  }
}