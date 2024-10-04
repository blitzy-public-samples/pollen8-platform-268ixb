/**
 * This file defines the TypeScript interfaces and types related to connections between users in the Pollen8 platform.
 * 
 * Requirements addressed:
 * 1. Connection Data Structure (Technical Specification/2.3 Component Diagrams/2.3.2 Backend Components)
 * 2. Connection Value (Technical Specification/1.1 System Objectives/Quantifiable Networking)
 */

import { User, UserId } from './user';
import { Industry } from './industry';

/**
 * This interface defines the structure of a connection between two users in the Pollen8 platform.
 */
export interface Connection {
  /**
   * The unique identifier for the connection.
   */
  id: string;

  /**
   * The user ID of the user who initiated or owns this connection.
   */
  userId: UserId;

  /**
   * The user ID of the connected user.
   */
  connectedUserId: UserId;

  /**
   * The calculated value of the connection.
   * This addresses the "Connection Value" requirement from the technical specification.
   */
  connectionValue: number;

  /**
   * The timestamp when the connection was established.
   */
  connectedAt: Date;

  /**
   * The industries associated with this connection.
   * This could be used for industry-specific analytics or filtering.
   */
  industries: string[];
}

/**
 * This type defines the possible states of a connection request.
 */
export type ConnectionStatus = 'pending' | 'accepted' | 'rejected';

/**
 * This type extends the Connection interface to include the full User object of the connected user.
 * This can be useful for displaying detailed information about connections.
 */
export type ConnectionWithUser = Connection & { connectedUser: User };

/**
 * This interface defines the structure for creating a new connection.
 */
export interface CreateConnectionDto {
  /**
   * The user ID of the user to connect with.
   */
  connectedUserId: UserId;

  /**
   * The industries associated with this connection.
   */
  industries: string[];
}

/**
 * This interface defines the structure for updating an existing connection.
 */
export interface UpdateConnectionDto {
  /**
   * The updated connection value.
   */
  connectionValue?: number;

  /**
   * The updated industries associated with this connection.
   */
  industries?: string[];
}

/**
 * This interface defines the structure for connection analytics.
 */
export interface ConnectionAnalytics {
  /**
   * The total number of connections.
   */
  totalConnections: number;

  /**
   * The total value of all connections.
   */
  totalConnectionValue: number;

  /**
   * The average value per connection.
   */
  averageConnectionValue: number;

  /**
   * The distribution of connections by industry.
   */
  industryDistribution: Record<string, number>;
}

/**
 * This type defines the options for sorting connections.
 */
export type ConnectionSortOption = 'connectionValue' | 'connectedAt' | 'industry';

/**
 * This interface defines the parameters for querying connections.
 */
export interface ConnectionQueryParams {
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
  sortBy?: ConnectionSortOption;

  /**
   * The order to sort in ('asc' or 'desc').
   */
  sortOrder?: 'asc' | 'desc';

  /**
   * Filter connections by industry.
   */
  industry?: string;
}