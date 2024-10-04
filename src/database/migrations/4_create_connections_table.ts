import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

/**
 * Migration to create the connections table in the Pollen8 platform database.
 * @description This migration defines the structure of the connections table, which is crucial for implementing the network management and quantifiable networking features.
 * @requirements Quantifiable Networking - Provide database structure for storing connection data (Technical Specification/1.1 System Objectives)
 * @requirements Network Value Calculation - Support storing connection value (3.14 per connection) (Technical Specification/1.1 System Objectives)
 * @requirements Visual Network Management - Enable data storage for network visualization (Technical Specification/1.1 System Objectives)
 */
export class CreateConnectionsTable1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'connections',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'connected_user_id',
            type: 'uuid',
          },
          {
            name: 'value',
            type: 'float',
            default: 3.14,
            comment: 'The calculated value of the connection (3.14 per connection)',
          },
          {
            name: 'connected_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Create index on user_id column
    await queryRunner.createIndex(
      'connections',
      new TableIndex({
        name: 'IDX_CONNECTIONS_USER_ID',
        columnNames: ['user_id'],
      })
    );

    // Create index on connected_user_id column
    await queryRunner.createIndex(
      'connections',
      new TableIndex({
        name: 'IDX_CONNECTIONS_CONNECTED_USER_ID',
        columnNames: ['connected_user_id'],
      })
    );

    // Create unique index on combination of user_id and connected_user_id
    await queryRunner.createIndex(
      'connections',
      new TableIndex({
        name: 'IDX_CONNECTIONS_UNIQUE_PAIR',
        columnNames: ['user_id', 'connected_user_id'],
        isUnique: true,
      })
    );

    // Create foreign key constraint for user_id referencing users table
    await queryRunner.createForeignKey(
      'connections',
      new TableForeignKey({
        name: 'FK_CONNECTIONS_USER_ID',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );

    // Create foreign key constraint for connected_user_id referencing users table
    await queryRunner.createForeignKey(
      'connections',
      new TableForeignKey({
        name: 'FK_CONNECTIONS_CONNECTED_USER_ID',
        columnNames: ['connected_user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    await queryRunner.dropForeignKey('connections', 'FK_CONNECTIONS_CONNECTED_USER_ID');
    await queryRunner.dropForeignKey('connections', 'FK_CONNECTIONS_USER_ID');

    // Drop indexes
    await queryRunner.dropIndex('connections', 'IDX_CONNECTIONS_UNIQUE_PAIR');
    await queryRunner.dropIndex('connections', 'IDX_CONNECTIONS_CONNECTED_USER_ID');
    await queryRunner.dropIndex('connections', 'IDX_CONNECTIONS_USER_ID');

    // Drop the connections table
    await queryRunner.dropTable('connections');
  }
}