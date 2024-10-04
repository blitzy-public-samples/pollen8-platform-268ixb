import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import { DatabaseConnection } from '../../utils/database-connection.util';

// Requirement: Click Analytics
// Location: Technical specification/1.1 System Objectives/Strategic Growth Tools
// Description: Create table structure for storing invite link analytics

// Requirement: 30-day Activity Visualization
// Location: Technical specification/1.1 System Objectives/Strategic Growth Tools
// Description: Set up database schema for daily click data storage

export class CreateInviteAnalyticsTable1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invite_analytics',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'inviteId',
            type: 'uuid',
          },
          {
            name: 'dailyClicks',
            type: 'integer',
            default: 0,
          },
          {
            name: 'date',
            type: 'date',
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

    // Create index on inviteId for faster lookups
    await queryRunner.createIndex(
      'invite_analytics',
      new TableIndex({
        name: 'IDX_INVITE_ANALYTICS_INVITE_ID',
        columnNames: ['inviteId'],
      })
    );

    // Create index on date for efficient date-based queries
    await queryRunner.createIndex(
      'invite_analytics',
      new TableIndex({
        name: 'IDX_INVITE_ANALYTICS_DATE',
        columnNames: ['date'],
      })
    );

    // Create composite index on inviteId and date for optimized queries
    await queryRunner.createIndex(
      'invite_analytics',
      new TableIndex({
        name: 'IDX_INVITE_ANALYTICS_INVITE_ID_DATE',
        columnNames: ['inviteId', 'date'],
      })
    );

    console.log('Created invite_analytics table and indexes');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('invite_analytics', 'IDX_INVITE_ANALYTICS_INVITE_ID_DATE');
    await queryRunner.dropIndex('invite_analytics', 'IDX_INVITE_ANALYTICS_DATE');
    await queryRunner.dropIndex('invite_analytics', 'IDX_INVITE_ANALYTICS_INVITE_ID');

    // Drop table
    await queryRunner.dropTable('invite_analytics');

    console.log('Dropped invite_analytics table and indexes');
  }
}

// Additional notes:
// 1. This migration creates the invite_analytics table to store daily click data for invite links.
// 2. The table structure supports the Click Analytics and 30-day Activity Visualization requirements.
// 3. Indexes are created to optimize query performance for common access patterns.
// 4. The inviteId column is used to link analytics data to specific invite links.
// 5. The dailyClicks column stores the number of clicks for a specific date.
// 6. The date column allows for easy retrieval of time-based analytics data.
// 7. The createdAt column is added for auditing and debugging purposes.
// 8. The down method ensures that the migration can be reverted if needed.
// 9. Console logs are added for better visibility during the migration process.
// 10. The migration uses the QueryRunner provided by TypeORM for database operations.