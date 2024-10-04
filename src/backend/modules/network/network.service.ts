import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NetworkRepository } from './network.repository';
import { UserService } from '../user/user.service';
import { NetworkEntity } from './network.entity';
import { PaginatedResult } from '../../shared/interfaces/paginated-result.interface';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { calculateNetworkValue } from '../../shared/utils/network-value-calculator.util';

/**
 * This class encapsulates all the business logic related to user networks and connections in the Pollen8 platform.
 * 
 * Requirements addressed:
 * - Quantifiable Networking (Technical Specification/1.1 System Objectives)
 *   Provide measurable network growth metrics
 * - Visual Network Management (Technical Specification/1.1 System Objectives)
 *   Offer intuitive network visualization and management
 * - Network Value Calculation (Technical Specification/1.1 System Objectives)
 *   Calculate network value (3.14 per connection)
 */
@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(NetworkRepository)
    private readonly networkRepository: NetworkRepository,
    private readonly userService: UserService
  ) {}

  /**
   * Retrieves the network connections for a given user with pagination.
   * @param userId The ID of the user whose network is being retrieved
   * @param paginationDto The pagination parameters
   * @returns A promise resolving to a paginated list of network connections
   */
  async getNetworkForUser(
    userId: string,
    paginationDto: PaginationDto
  ): Promise<PaginatedResult<NetworkEntity>> {
    return this.networkRepository.findConnectionsByUserId(userId, paginationDto);
  }

  /**
   * Creates a new connection between two users.
   * @param userId The ID of the user initiating the connection
   * @param connectedUserId The ID of the user being connected to
   * @returns A promise resolving to the newly created connection
   */
  async createConnection(userId: string, connectedUserId: string): Promise<NetworkEntity> {
    // Validate that both users exist
    await Promise.all([
      this.userService.getUserById(userId),
      this.userService.getUserById(connectedUserId)
    ]);

    // Check if connection already exists
    const existingConnection = await this.networkRepository.findOne({
      where: [
        { userId, connectedUserId },
        { userId: connectedUserId, connectedUserId: userId }
      ]
    });

    if (existingConnection) {
      throw new Error('Connection already exists');
    }

    // Create the connection
    const connection = await this.networkRepository.createConnection(userId, connectedUserId);

    // Create reverse connection for bidirectional relationship
    await this.networkRepository.createConnection(connectedUserId, userId);

    return connection;
  }

  /**
   * Removes a connection between two users.
   * @param userId The ID of one user in the connection
   * @param connectedUserId The ID of the other user in the connection
   * @returns A promise resolving to void
   */
  async removeConnection(userId: string, connectedUserId: string): Promise<void> {
    // Validate that the connection exists
    const existingConnection = await this.networkRepository.findOne({
      where: [
        { userId, connectedUserId },
        { userId: connectedUserId, connectedUserId: userId }
      ]
    });

    if (!existingConnection) {
      throw new Error('Connection does not exist');
    }

    // Remove the connection in both directions
    await this.networkRepository.removeConnection(userId, connectedUserId);
  }

  /**
   * Calculates the network value for a given user based on their connections.
   * @param userId The ID of the user
   * @returns A promise resolving to the calculated network value
   */
  async calculateNetworkValue(userId: string): Promise<number> {
    const networkSize = await this.networkRepository.getNetworkSize(userId);
    return calculateNetworkValue(networkSize);
  }

  /**
   * Retrieves analytics data for a user's network, including growth metrics and industry distribution.
   * @param userId The ID of the user
   * @returns A promise resolving to an object containing network analytics data
   */
  async getNetworkAnalytics(userId: string): Promise<NetworkAnalytics> {
    const connections = await this.networkRepository.findConnectionsByUserId(userId, { page: 1, limit: 1000 });
    const networkSize = connections.total;
    const networkValue = await this.calculateNetworkValue(userId);

    // Calculate growth rate (assuming we have historical data)
    const previousMonthSize = await this.getPreviousMonthNetworkSize(userId);
    const growthRate = (networkSize - previousMonthSize) / previousMonthSize * 100;

    // Aggregate industry distribution
    const industryDistribution = await this.getIndustryDistribution(userId);

    return {
      networkSize,
      networkValue,
      growthRate,
      industryDistribution,
      connections: connections.items
    };
  }

  /**
   * Helper method to get the network size from the previous month.
   * This is a placeholder implementation and should be replaced with actual historical data retrieval.
   */
  private async getPreviousMonthNetworkSize(userId: string): Promise<number> {
    // Placeholder implementation
    const currentSize = await this.networkRepository.getNetworkSize(userId);
    return Math.floor(currentSize * 0.9); // Assume 10% growth from last month
  }

  /**
   * Helper method to get the industry distribution of a user's network.
   * This is a placeholder implementation and should be replaced with actual data aggregation.
   */
  private async getIndustryDistribution(userId: string): Promise<Record<string, number>> {
    // Placeholder implementation
    return {
      'Technology': 40,
      'Finance': 30,
      'Healthcare': 20,
      'Other': 10
    };
  }
}

interface NetworkAnalytics {
  networkSize: number;
  networkValue: number;
  growthRate: number;
  industryDistribution: Record<string, number>;
  connections: NetworkEntity[];
}