/**
 * @file networkService.ts
 * @description This file contains the network service responsible for handling API requests related to user connections and network operations in the Pollen8 platform.
 * @requirements_addressed 
 * - Network Management (Technical specification/1.1 System Objectives/Visual Network Management)
 * - Quantifiable Networking (Technical specification/1.1 System Objectives/Quantifiable Networking)
 * - Visual Network Management (Technical specification/1.1 System Objectives/Visual Network Management)
 */

import { apiClient, API_ENDPOINTS } from './apiClient';
import { Connection, ConnectionWithUser, CreateConnectionDto, UpdateConnectionDto, ConnectionQueryParams, ConnectionAnalytics } from '../types/connection';

/**
 * NetworkGraphData interface for the network graph visualization
 */
interface NetworkGraphData {
  nodes: Array<{ id: string; label: string; industry: string }>;
  edges: Array<{ source: string; target: string; value: number }>;
}

/**
 * NetworkService class containing methods for network-related operations
 */
export class NetworkService {
  /**
   * Retrieves the list of connections for the authenticated user.
   * @param {ConnectionQueryParams} queryParams - Optional query parameters for pagination and sorting
   * @returns {Promise<Connection[]>} A promise that resolves to an array of Connection objects
   */
  static async getConnections(queryParams?: ConnectionQueryParams): Promise<Connection[]> {
    const response = await apiClient.get(API_ENDPOINTS.NETWORK.CONNECTIONS, { params: queryParams });
    return response.data;
  }

  /**
   * Retrieves the network graph data for visualization.
   * @returns {Promise<NetworkGraphData>} A promise that resolves to the network graph data
   */
  static async getNetworkGraph(): Promise<NetworkGraphData> {
    const response = await apiClient.get(API_ENDPOINTS.NETWORK.GRAPH);
    return response.data;
  }

  /**
   * Calculates and retrieves the total network value for the authenticated user.
   * @returns {Promise<number>} A promise that resolves to the calculated network value
   */
  static async getNetworkValue(): Promise<number> {
    const response = await apiClient.get(API_ENDPOINTS.NETWORK.VALUE);
    return response.data.value;
  }

  /**
   * Creates a new connection with another user.
   * @param {CreateConnectionDto} connectionData - The data for creating a new connection
   * @returns {Promise<Connection>} A promise that resolves to the newly created Connection object
   */
  static async createConnection(connectionData: CreateConnectionDto): Promise<Connection> {
    const response = await apiClient.post(API_ENDPOINTS.NETWORK.CONNECTIONS, connectionData);
    return response.data;
  }

  /**
   * Updates an existing connection.
   * @param {string} connectionId - The ID of the connection to update
   * @param {UpdateConnectionDto} updateData - The data to update the connection with
   * @returns {Promise<Connection>} A promise that resolves to the updated Connection object
   */
  static async updateConnection(connectionId: string, updateData: UpdateConnectionDto): Promise<Connection> {
    const response = await apiClient.put(`${API_ENDPOINTS.NETWORK.CONNECTIONS}/${connectionId}`, updateData);
    return response.data;
  }

  /**
   * Removes an existing connection.
   * @param {string} connectionId - The ID of the connection to remove
   * @returns {Promise<void>} A promise that resolves when the connection is successfully removed
   */
  static async removeConnection(connectionId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.NETWORK.CONNECTIONS}/${connectionId}`);
  }

  /**
   * Retrieves detailed information about a specific connection, including the connected user's data.
   * @param {string} connectionId - The ID of the connection to retrieve
   * @returns {Promise<ConnectionWithUser>} A promise that resolves to the ConnectionWithUser object
   */
  static async getConnectionDetails(connectionId: string): Promise<ConnectionWithUser> {
    const response = await apiClient.get(`${API_ENDPOINTS.NETWORK.CONNECTIONS}/${connectionId}`);
    return response.data;
  }

  /**
   * Retrieves network analytics data.
   * @returns {Promise<ConnectionAnalytics>} A promise that resolves to the ConnectionAnalytics object
   */
  static async getNetworkAnalytics(): Promise<ConnectionAnalytics> {
    const response = await apiClient.get(`${API_ENDPOINTS.NETWORK.CONNECTIONS}/analytics`);
    return response.data;
  }

  /**
   * Searches for potential connections based on industry, interests, or name.
   * @param {string} query - The search query
   * @param {ConnectionQueryParams} queryParams - Optional query parameters for pagination and sorting
   * @returns {Promise<Connection[]>} A promise that resolves to an array of potential Connection objects
   */
  static async searchPotentialConnections(query: string, queryParams?: ConnectionQueryParams): Promise<Connection[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.NETWORK.CONNECTIONS}/search`, {
      params: { ...queryParams, query },
    });
    return response.data;
  }
}

export default NetworkService;