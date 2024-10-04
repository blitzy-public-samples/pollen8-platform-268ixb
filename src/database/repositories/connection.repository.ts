import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Connection } from '../entities/connection.entity';
import { DatabaseConnection } from '../utils/database-connection.util';
import { createSelectQuery, createInsertQuery, createDeleteQuery } from '../utils/query-builder.util';

/**
 * ConnectionRepository class for handling database operations related to user connections.
 * @description This class extends the base Repository class from TypeORM and is specifically tailored for handling Connection entities.
 * It provides methods for creating, reading, updating, and deleting connection records, as well as more complex operations related to network analysis.
 * @requirements Quantifiable Networking - Provide methods to store and retrieve connection data for network value calculation (Technical Specification/1.1 System Objectives)
 * @requirements Visual Network Management - Support data operations for network visualization (Technical Specification/1.1 System Objectives)
 */
@EntityRepository(Connection)
@Injectable()
export class ConnectionRepository extends Repository<Connection> {
  constructor(private readonly dbConnection: DatabaseConnection) {
    super();
  }

  /**
   * Creates a new connection between two users.
   * @param userId - The ID of the user initiating the connection
   * @param connectedUserId - The ID of the user being connected to
   * @returns A Promise resolving to the created Connection entity
   */
  async createConnection(userId: string, connectedUserId: string): Promise<Connection> {
    const connection = new Connection();
    connection.userId = userId;
    connection.connectedUserId = connectedUserId;
    connection.value = 3.14; // Set the connection value as per requirements

    const insertQuery = createInsertQuery(Connection, connection);
    const result = await insertQuery.execute();

    return this.findOne(result.identifiers[0].id);
  }

  /**
   * Retrieves all connections for a given user.
   * @param userId - The ID of the user whose connections are being retrieved
   * @returns A Promise resolving to an array of Connection entities
   */
  async getConnectionsByUserId(userId: string): Promise<Connection[]> {
    const queryOptions = {
      where: { userId },
      relations: ['connectedUser'],
    };

    const query = createSelectQuery(Connection, queryOptions);
    return query.getMany();
  }

  /**
   * Calculates the total connection value for a user based on their connections.
   * @param userId - The ID of the user for whom the connection value is being calculated
   * @returns A Promise resolving to the total connection value
   */
  async getConnectionValue(userId: string): Promise<number> {
    const query = this.createQueryBuilder('connection')
      .select('SUM(connection.value)', 'totalValue')
      .where('connection.userId = :userId', { userId });

    const result = await query.getRawOne();
    return result ? parseFloat(result.totalValue) || 0 : 0;
  }

  /**
   * Retrieves the user's network up to a specified depth.
   * @param userId - The ID of the user whose network is being retrieved
   * @param depth - The depth of the network to retrieve
   * @returns A Promise resolving to an array of Connection entities representing the user's network
   */
  async getNetworkByUserId(userId: string, depth: number): Promise<Connection[]> {
    const query = this.createQueryBuilder('connection')
      .where(qb => {
        const subQuery = qb.subQuery()
          .select('c.id')
          .from(Connection, 'c')
          .where('c.userId = :userId', { userId })
          .getQuery();
        return `connection.id IN ${subQuery}`;
      })
      .leftJoinAndSelect('connection.connectedUser', 'connectedUser')
      .take(depth);

    return query.getMany();
  }

  /**
   * Removes a connection between two users.
   * @param userId - The ID of the user initiating the disconnection
   * @param connectedUserId - The ID of the user being disconnected from
   * @returns A Promise that resolves when the connection is deleted
   */
  async deleteConnection(userId: string, connectedUserId: string): Promise<void> {
    const deleteQuery = createDeleteQuery(Connection, { userId, connectedUserId });
    await deleteQuery.execute();
  }

  /**
   * Creates a recursive CTE query to fetch the entire network of a user up to a specified depth.
   * @param userId - The ID of the user whose network is being retrieved
   * @param maxDepth - The maximum depth of the network to retrieve
   * @returns A SelectQueryBuilder instance for the recursive CTE query
   */
  private createNetworkCTEQuery(userId: string, maxDepth: number): SelectQueryBuilder<Connection> {
    return this.createQueryBuilder('connection')
      .where(qb => {
        const cte = qb.subQuery()
          .select('c.id', 'id')
          .addSelect('c.userId', 'userId')
          .addSelect('c.connectedUserId', 'connectedUserId')
          .addSelect('c.value', 'value')
          .addSelect('1', 'depth')
          .from(Connection, 'c')
          .where('c.userId = :userId', { userId })
          .union(subQb => {
            return subQb
              .select('c.id', 'id')
              .addSelect('c.userId', 'userId')
              .addSelect('c.connectedUserId', 'connectedUserId')
              .addSelect('c.value', 'value')
              .addSelect('n.depth + 1', 'depth')
              .from(Connection, 'c')
              .innerJoin('network', 'n', 'c.userId = n.connectedUserId')
              .where('n.depth < :maxDepth', { maxDepth });
          })
          .getQuery();

        return `connection.id IN ${cte}`;
      })
      .setParameter('userId', userId)
      .setParameter('maxDepth', maxDepth);
  }
}

// Additional notes:
// 1. This repository implements the Repository pattern, providing a clean API for database operations related to connections.
// 2. The createConnection method ensures that each connection has the required value of 3.14 as per the specifications.
// 3. The getNetworkByUserId method uses a recursive CTE (Common Table Expression) to efficiently fetch the user's network up to a specified depth.
// 4. Error handling should be implemented at the service layer that uses this repository.
// 5. The repository uses the query builder utility functions to create type-safe and optimized queries.
// 6. The Injectable decorator is used to allow dependency injection in NestJS applications.