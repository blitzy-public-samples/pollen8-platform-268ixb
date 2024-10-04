import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NetworkStats, NetworkGraph, NetworkFilter, NetworkSortOption, NetworkConnection, NetworkGrowthMetrics, NetworkQueryParams, NetworkRecommendation, NetworkQueryResponse } from '../interfaces/network.interface';
import { User } from '../interfaces/user.interface';
import { Connection } from '../../shared/types/connection';
import { environment } from '../config/environment';
import { calculateNetworkValue } from '../../shared/utils/networkCalculations';

@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(Connection)
    private connectionRepository: Repository<Connection>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  /**
   * Retrieves network statistics for a given user.
   * @param userId - The ID of the user to fetch statistics for.
   * @returns A promise that resolves to NetworkStats object.
   */
  async getNetworkStats(userId: string): Promise<NetworkStats> {
    // Retrieve user connections from the database
    const connections = await this.connectionRepository.find({ where: { userId } });

    // Calculate network statistics
    const totalConnections = connections.length;
    const totalValue = connections.reduce((sum, conn) => sum + conn.connectionValue, 0);
    const growthRate = await this.calculateGrowthRate(userId);
    const topIndustries = await this.getTopIndustries(userId);

    return {
      totalConnections,
      totalValue,
      growthRate,
      topIndustries
    };
  }

  /**
   * Generates a network graph for visualization based on user connections.
   * @param userId - The ID of the user to generate the graph for.
   * @param filter - Optional filter to apply to the network data.
   * @returns A promise that resolves to NetworkGraph object.
   */
  async getNetworkGraph(userId: string, filter?: NetworkFilter): Promise<NetworkGraph> {
    // Retrieve user connections from the database
    let connections = await this.connectionRepository.find({ where: { userId } });

    // Apply optional filter
    if (filter) {
      connections = this.applyFilter(connections, filter);
    }

    // Generate network graph data structure
    const nodes = await this.generateGraphNodes(connections);
    const edges = this.generateGraphEdges(connections);

    return { nodes, edges };
  }

  /**
   * Adds a new connection between two users.
   * @param userId - The ID of the user initiating the connection.
   * @param connectionId - The ID of the user to connect with.
   * @returns A promise that resolves to the newly created Connection object.
   */
  async addConnection(userId: string, connectionId: string): Promise<Connection> {
    // Validate user IDs
    await this.validateUsers(userId, connectionId);

    // Check for existing connection
    const existingConnection = await this.connectionRepository.findOne({ where: { userId, connectedUserId: connectionId } });
    if (existingConnection) {
      throw new Error('Connection already exists');
    }

    // Create new connection in the database
    const newConnection = this.connectionRepository.create({
      userId,
      connectedUserId: connectionId,
      connectionValue: environment.defaultConnectionValue,
      connectedAt: new Date(),
      industries: [] // To be populated based on user industries
    });

    return this.connectionRepository.save(newConnection);
  }

  /**
   * Removes a connection between two users.
   * @param userId - The ID of the user removing the connection.
   * @param connectionId - The ID of the user to disconnect from.
   */
  async removeConnection(userId: string, connectionId: string): Promise<void> {
    // Validate user IDs
    await this.validateUsers(userId, connectionId);

    // Check for existing connection
    const existingConnection = await this.connectionRepository.findOne({ where: { userId, connectedUserId: connectionId } });
    if (!existingConnection) {
      throw new Error('Connection does not exist');
    }

    // Remove connection from the database
    await this.connectionRepository.remove(existingConnection);
  }

  /**
   * Retrieves a list of connections for a user with optional sorting and filtering.
   * @param params - NetworkQueryParams object containing query parameters.
   * @returns A promise that resolves to NetworkQueryResponse object.
   */
  async getConnections(params: NetworkQueryParams): Promise<NetworkQueryResponse> {
    const { userId, skip = 0, take = 10, sortBy, sortOrder, filters } = params;

    // Validate user ID
    await this.validateUsers(userId);

    // Build query
    let query = this.connectionRepository.createQueryBuilder('connection')
      .where('connection.userId = :userId', { userId })
      .skip(skip)
      .take(take);

    // Apply optional sorting
    if (sortBy) {
      query = query.orderBy(`connection.${sortBy}`, sortOrder || 'ASC');
    }

    // Apply optional filtering
    if (filters) {
      query = this.applyQueryFilter(query, filters);
    }

    // Execute query
    const [connections, totalCount] = await query.getManyAndCount();

    // Transform connections to NetworkConnection type
    const networkConnections = await this.transformToNetworkConnections(connections);

    // Get network stats and growth metrics
    const stats = await this.getNetworkStats(userId);
    const growthMetrics = await this.getNetworkGrowthMetrics(userId);

    return {
      connections: networkConnections,
      totalCount,
      stats,
      growthMetrics
    };
  }

  /**
   * Calculates the growth rate of a user's network.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to the growth rate as a number.
   */
  private async calculateGrowthRate(userId: string): Promise<number> {
    // Implementation details would depend on how growth rate is defined
    // This is a placeholder implementation
    return 0.05; // 5% growth rate
  }

  /**
   * Retrieves the top industries in a user's network.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an array of top industries with their counts.
   */
  private async getTopIndustries(userId: string): Promise<Array<{ industry: string; count: number }>> {
    // Implementation details would depend on how industries are stored and counted
    // This is a placeholder implementation
    return [
      { industry: 'Technology', count: 10 },
      { industry: 'Finance', count: 5 },
      { industry: 'Healthcare', count: 3 }
    ];
  }

  /**
   * Applies a filter to an array of connections.
   * @param connections - The array of connections to filter.
   * @param filter - The filter to apply.
   * @returns The filtered array of connections.
   */
  private applyFilter(connections: Connection[], filter: NetworkFilter): Connection[] {
    return connections.filter(conn => {
      if (filter.industry && !conn.industries.includes(filter.industry)) {
        return false;
      }
      if (filter.connectionStrength) {
        const strength = this.calculateConnectionStrength(conn);
        if (strength !== filter.connectionStrength) {
          return false;
        }
      }
      if (filter.dateRange) {
        const connDate = new Date(conn.connectedAt);
        if (connDate < filter.dateRange.start || connDate > filter.dateRange.end) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Generates graph nodes from an array of connections.
   * @param connections - The array of connections.
   * @returns A promise that resolves to an array of graph nodes.
   */
  private async generateGraphNodes(connections: Connection[]): Promise<NetworkGraph['nodes']> {
    const userIds = new Set(connections.flatMap(conn => [conn.userId, conn.connectedUserId]));
    const users = await this.userRepository.findByIds([...userIds]);

    return users.map(user => ({
      id: user.id,
      label: user.phoneNumber, // Using phone number as label; might want to use a different identifier
      industries: user.industries.map(ind => ind.name)
    }));
  }

  /**
   * Generates graph edges from an array of connections.
   * @param connections - The array of connections.
   * @returns An array of graph edges.
   */
  private generateGraphEdges(connections: Connection[]): NetworkGraph['edges'] {
    return connections.map(conn => ({
      source: conn.userId,
      target: conn.connectedUserId,
      value: conn.connectionValue
    }));
  }

  /**
   * Validates that the provided user IDs exist in the database.
   * @param userIds - The user IDs to validate.
   * @throws Error if any user ID is invalid.
   */
  private async validateUsers(...userIds: string[]): Promise<void> {
    const users = await this.userRepository.findByIds(userIds);
    if (users.length !== userIds.length) {
      throw new Error('One or more user IDs are invalid');
    }
  }

  /**
   * Applies filters to a TypeORM query builder.
   * @param query - The TypeORM query builder.
   * @param filters - The filters to apply.
   * @returns The modified query builder.
   */
  private applyQueryFilter(query: any, filters: NetworkFilter): any {
    if (filters.industry) {
      query = query.andWhere(':industry = ANY(connection.industries)', { industry: filters.industry });
    }
    if (filters.connectionStrength) {
      // This would require a more complex query or a computed column
      // For simplicity, we're not implementing this filter in the database query
    }
    if (filters.dateRange) {
      query = query.andWhere('connection.connectedAt BETWEEN :start AND :end', {
        start: filters.dateRange.start,
        end: filters.dateRange.end
      });
    }
    return query;
  }

  /**
   * Transforms Connection objects to NetworkConnection objects.
   * @param connections - The array of Connection objects.
   * @returns A promise that resolves to an array of NetworkConnection objects.
   */
  private async transformToNetworkConnections(connections: Connection[]): Promise<NetworkConnection[]> {
    return Promise.all(connections.map(async conn => ({
      ...conn,
      strength: this.calculateConnectionStrength(conn),
      lastInteractionDate: await this.getLastInteractionDate(conn)
    })));
  }

  /**
   * Calculates the strength of a connection.
   * @param connection - The Connection object.
   * @returns The strength of the connection as 'weak', 'medium', or 'strong'.
   */
  private calculateConnectionStrength(connection: Connection): 'weak' | 'medium' | 'strong' {
    // This is a simplified calculation and should be adjusted based on actual business logic
    if (connection.connectionValue < 5) return 'weak';
    if (connection.connectionValue < 10) return 'medium';
    return 'strong';
  }

  /**
   * Gets the last interaction date for a connection.
   * @param connection - The Connection object.
   * @returns A promise that resolves to the last interaction date.
   */
  private async getLastInteractionDate(connection: Connection): Promise<Date> {
    // This would typically involve querying an interactions table
    // For simplicity, we're returning the connection date
    return connection.connectedAt;
  }

  /**
   * Gets network growth metrics for a user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to NetworkGrowthMetrics object.
   */
  private async getNetworkGrowthMetrics(userId: string): Promise<NetworkGrowthMetrics> {
    // This would typically involve complex queries to calculate growth metrics
    // For simplicity, we're returning placeholder data
    return {
      newConnections: 5,
      valueIncrease: 15.7,
      growthPercentage: 10,
      mostActiveIndustries: [
        { industry: 'Technology', newConnections: 3 },
        { industry: 'Finance', newConnections: 2 }
      ]
    };
  }
}