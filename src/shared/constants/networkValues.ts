/**
 * This file contains constant values related to network calculations and metrics for the Pollen8 platform.
 * These constants are used throughout the application to ensure consistency in network value calculations
 * and user profile requirements.
 */

/**
 * The value assigned to each connection in a user's network.
 * This constant is used in the network value calculation as specified in the technical requirements.
 * @see Technical specification/1.1 System Objectives/Quantifiable Networking
 */
export const CONNECTION_VALUE: number = 3.14;

/**
 * The minimum number of industries a user must select during profile creation.
 * This ensures that users provide sufficient professional context for meaningful networking.
 */
export const MINIMUM_INDUSTRIES: number = 3;

/**
 * The minimum number of interests a user must select during profile creation.
 * This helps in creating a well-rounded user profile for better connection matching.
 */
export const MINIMUM_INTERESTS: number = 3;

/**
 * Calculates the network value based on the number of connections.
 * This function encapsulates the logic for network value calculation, making it easy to use across the application.
 * 
 * @param connectionCount - The number of connections in the user's network
 * @returns The calculated network value
 */
export const calculateNetworkValue = (connectionCount: number): number => {
  return connectionCount * CONNECTION_VALUE;
};

/**
 * Checks if the user has selected the minimum required number of industries.
 * 
 * @param selectedIndustries - The number of industries selected by the user
 * @returns A boolean indicating whether the minimum requirement is met
 */
export const hasMinimumIndustries = (selectedIndustries: number): boolean => {
  return selectedIndustries >= MINIMUM_INDUSTRIES;
};

/**
 * Checks if the user has selected the minimum required number of interests.
 * 
 * @param selectedInterests - The number of interests selected by the user
 * @returns A boolean indicating whether the minimum requirement is met
 */
export const hasMinimumInterests = (selectedInterests: number): boolean => {
  return selectedInterests >= MINIMUM_INTERESTS;
};