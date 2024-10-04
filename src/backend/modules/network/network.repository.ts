import { Injectable } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { Connection } from '../../../database/entities/connection.entity';
import { PaginatedResultInterface } from '../../shared/interfaces/paginated-result.interface';
import { PaginationDto } from '../../shared/dto/pagination.dto';

/**
 * This file defines the NetworkRepository class, which is responsible for handling database operations
 * related to the network connections between users in the Pollen8 platform.
 * 
 * Requirements addressed:
 * - Quantifiable Networking (Technical Specification/1.1 System Objectives)
 *   Provide data access for network growth metrics
 * - Visual Network Management (Technical Specification/1.1 System Objectives)
 *   Support data retrieval for network visualization
 */

@Injectable()
@EntityRepository(Connection)
export class NetworkRepository extends Repository<Connection> {
  /**
   * Retrieves paginated connections for a specific user.
   * @param userId The ID of the user whose connections are being retrieved
   * @param paginationDto The pagination parameters
   * @returns A promise resolving to a paginated list of connections
   */
  async findConnectionsByUserId(
    userId: string,
    paginationDto: PaginationDto
  ): Promise<PaginatedResultInterface<Connection>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [connections, total] = await this.findAndCount({
      where: [
        { userId },
        { connectedUserId: userId }
      ],
      skip,
      take: limit,
      order: { connectedAt: 'DESC' }
    });

    return {
      items: connections,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Creates a new connection between two users.
   * @param userId The ID of the user initiating the connection
   * @param connectedUserId The ID of the user being connected to
   * @returns A promise resolving to the newly created connection
   */
  async createConnection(userId: string, connectedUserId: string): Promise<Connection> {
    const connection = this.create({
      userId,
      connectedUserId,
      connectedAt: new Date()
    });

    return this.save(connection);
  }

  /**
   * Removes a connection between two users.
   * @param userId The ID of one user in the connection
   * @param connectedUserId The ID of the other user in the connection
   * @returns A promise resolving to void
   */
  async removeConnection(userId: string, connectedUserId: string): Promise<void> {
    await this.delete({
      where: [
        { userId, connectedUserId },
        { userId: connectedUserId, connectedUserId: userId }
      ]
    });
  }

  /**
   * Calculates the total number of connections for a user.
   * @param userId The ID of the user
   * @returns A promise resolving to the total number of connections
   */
  async getNetworkSize(userId: string): Promise<number> {
    const [, count] = await this.findAndCount({
      where: [
        { userId },
        { connectedUserId: userId }
      ]
    });

    return count;
  }

  /**
   * Calculates the total value of a user's network based on the number of connections.
   * @param userId The ID of the user
   * @returns A promise resolving to the calculated network value
   */
  async getNetworkValue(userId: string): Promise<number> {
    const networkSize = await this.getNetworkSize(userId);
    return networkSize * 3.14; // As per the requirement in the technical specification
  }
}