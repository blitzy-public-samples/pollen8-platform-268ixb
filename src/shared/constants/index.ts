/**
 * @file src/shared/constants/index.ts
 * @description This file serves as the central export point for all constant values used throughout the Pollen8 application,
 * consolidating constants from various domains such as network values and API endpoints.
 * 
 * Requirements addressed:
 * - Centralized Constants (Technical specification/2. SYSTEM ARCHITECTURE/2.3 COMPONENT DIAGRAMS)
 * - Network Value Calculation (Technical specification/1.1 System Objectives/Quantifiable Networking)
 * - API Endpoint Centralization (Technical specification/2. SYSTEM ARCHITECTURE/2.3 COMPONENT DIAGRAMS/2.3.2 Backend Components)
 */

// Import all constants from networkValues
export * from './networkValues';

// Import all constants from apiEndpoints
export * from './apiEndpoints';

// Additional constants can be added here if needed in the future

/**
 * Example of how to use these constants:
 * 
 * import { NETWORK_VALUE_PER_CONNECTION, API_BASE_URL } from 'src/shared/constants';
 * 
 * const calculateNetworkValue = (connections: number) => {
 *   return connections * NETWORK_VALUE_PER_CONNECTION;
 * };
 * 
 * const fetchUserProfile = async (userId: string) => {
 *   const response = await fetch(`${API_BASE_URL}/users/${userId}`);
 *   return response.json();
 * };
 */

// If there are any constants that don't fit into the imported modules,
// they can be defined and exported here:

/**
 * Maximum number of industries a user can select
 */
export const MAX_INDUSTRIES = 5;

/**
 * Maximum number of interests a user can select
 */
export const MAX_INTERESTS = 10;

/**
 * Default pagination limit for API requests
 */
export const DEFAULT_PAGINATION_LIMIT = 20;

/**
 * Maximum number of connections displayed in the network graph
 */
export const MAX_NETWORK_GRAPH_CONNECTIONS = 100;

// Add any other global constants here as needed