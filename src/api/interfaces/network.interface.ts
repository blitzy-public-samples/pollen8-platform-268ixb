/**
 * This file defines the TypeScript interfaces and types related to the network functionality in the Pollen8 platform's API.
 * 
 * Requirements addressed:
 * 1. Network Data Structure (Technical Specification/2.3 Component Diagrams/2.3.2 Backend Components)
 * 2. Quantifiable Networking (Technical Specification/1.1 System Objectives/Quantifiable Networking)
 * 3. Visual Network Management (Technical Specification/1.1 System Objectives/Visual Network Management)
 */

import { User } from '../user.interface';
import { Connection } from '../../shared/types/connection';

/**
 * This interface defines the structure for network statistics.
 * Addresses the "Quantifiable Networking" requirement.
 */
export interface NetworkStats {
  /**
   * The total number of connections in the user's network.
   */
  totalConnections: number;

  /**
   * The total value of the user's network.
   * Calculated based on the sum of all connection values.
   */
  totalValue: number;

  /**
   * The growth rate of the user's network.
   * Represents the percentage increase in network value over a specific period.
   */
  growthRate: number;

  /**
   * The top industries in the user's network, sorted by count.
   */
  topIndustries: Array<{ industry: string; count: number }>;
}

/**
 * This interface defines the structure for network graph data used in visualizations.
 * Addresses the "Visual Network Management" requirement.
 */
export interface NetworkGraph {
  /**
   * The nodes in the network graph, representing users.
   */
  nodes: Array<{
    id: string;
    label: string;
    industries: string[];
  }>;

  /**
   * The edges in the network graph, representing connections between users.
   */
  edges: Array<{
    source: string;
    target: string;
    value: number;
  }>;
}

/**
 * This type defines the structure for filtering network data.
 */
export type NetworkFilter = {
  /**
   * Filter connections by industry.
   */
  industry?: string;

  /**
   * Filter connections by connection strength.
   */
  connectionStrength?: 'weak' | 'medium' | 'strong';

  /**
   * Filter connections by date range.
   */
  dateRange?: {
    start: Date;
    end: Date;
  };
};

/**
 * This type defines the available options for sorting network connections.
 */
export type NetworkSortOption = 'value' | 'date' | 'industry';

/**
 * This interface extends the Connection interface to include additional network-specific properties.
 */
export interface NetworkConnection extends Connection {
  /**
   * The strength of the connection, calculated based on interaction frequency and connection value.
   */
  strength: 'weak' | 'medium' | 'strong';

  /**
   * The last interaction date with this connection.
   */
  lastInteractionDate: Date;
}

/**
 * This interface defines the structure for network growth metrics.
 */
export interface NetworkGrowthMetrics {
  /**
   * The number of new connections added in a specific period.
   */
  newConnections: number;

  /**
   * The increase in network value over a specific period.
   */
  valueIncrease: number;

  /**
   * The percentage growth in network size over a specific period.
   */
  growthPercentage: number;

  /**
   * The most active industries in terms of new connections.
   */
  mostActiveIndustries: Array<{ industry: string; newConnections: number }>;
}

/**
 * This interface defines the parameters for querying network data.
 */
export interface NetworkQueryParams {
  /**
   * The user ID for whom to fetch the network data.
   */
  userId: string;

  /**
   * The number of connections to skip (for pagination).
   */
  skip?: number;

  /**
   * The number of connections to return (for pagination).
   */
  take?: number;

  /**
   * The field to sort by.
   */
  sortBy?: NetworkSortOption;

  /**
   * The order to sort in ('asc' or 'desc').
   */
  sortOrder?: 'asc' | 'desc';

  /**
   * Filters to apply to the network data.
   */
  filters?: NetworkFilter;
}

/**
 * This interface defines the structure for network recommendations.
 */
export interface NetworkRecommendation {
  /**
   * The recommended user.
   */
  user: User;

  /**
   * The strength of the recommendation based on common connections, industries, etc.
   */
  recommendationStrength: number;

  /**
   * The common connections between the current user and the recommended user.
   */
  commonConnections: User[];

  /**
   * The common industries between the current user and the recommended user.
   */
  commonIndustries: string[];
}

/**
 * This interface defines the response structure for network queries.
 */
export interface NetworkQueryResponse {
  /**
   * The list of network connections.
   */
  connections: NetworkConnection[];

  /**
   * The total count of connections (before pagination).
   */
  totalCount: number;

  /**
   * The network statistics.
   */
  stats: NetworkStats;

  /**
   * The network growth metrics.
   */
  growthMetrics: NetworkGrowthMetrics;
}