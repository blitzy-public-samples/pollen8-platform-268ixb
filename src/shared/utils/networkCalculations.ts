/**
 * This file contains utility functions for performing network-related calculations in the Pollen8 platform.
 * It provides essential methods for computing network values, growth metrics, and other quantifiable networking aspects.
 * 
 * Requirements addressed:
 * 1. Quantifiable Networking (Technical Specification/1.1 System Objectives)
 * 2. Network Value Calculation (Technical Specification/1.1 System Objectives)
 */

import { Connection } from '../types/connection';
import { User } from '../types/user';
import { CONNECTION_VALUE } from '../constants/networkValues';

/**
 * Calculates the total network value for a user based on their connections.
 * It uses the constant value of 3.14 per connection as specified in the technical requirements.
 * 
 * @param connections - An array of Connection objects
 * @returns The calculated network value
 */
export function calculateNetworkValue(connections: Connection[]): number {
  // Validate input connections array
  if (!Array.isArray(connections)) {
    throw new Error('Invalid input: connections must be an array');
  }

  // Multiply the number of connections by CONNECTION_VALUE (3.14)
  return connections.length * CONNECTION_VALUE;
}

/**
 * Calculates the network growth rate between two points in time.
 * 
 * @param currentConnections - The current number of connections
 * @param previousConnections - The previous number of connections
 * @returns The calculated growth rate as a percentage
 */
export function calculateNetworkGrowth(currentConnections: number, previousConnections: number): number {
  // Validate input parameters
  if (typeof currentConnections !== 'number' || typeof previousConnections !== 'number') {
    throw new Error('Invalid input: both parameters must be numbers');
  }

  if (previousConnections === 0) {
    return currentConnections > 0 ? 100 : 0; // 100% growth if starting from 0, 0% if still 0
  }

  // Calculate the difference between current and previous connections
  const difference = currentConnections - previousConnections;

  // Divide the difference by the previous connections to get the growth rate
  const growthRate = (difference / previousConnections) * 100;

  // Return the calculated growth rate rounded to two decimal places
  return Number(growthRate.toFixed(2));
}

/**
 * Calculates the distribution of connections across different industries.
 * 
 * @param connections - An array of Connection objects
 * @returns An object with industry names as keys and the percentage of connections in each industry as values
 */
export function calculateIndustryDistribution(connections: Connection[]): Record<string, number> {
  // Validate input connections array
  if (!Array.isArray(connections)) {
    throw new Error('Invalid input: connections must be an array');
  }

  // Initialize an empty object to store industry distributions
  const distribution: Record<string, number> = {};
  const totalConnections = connections.length;

  // Iterate through the connections and count occurrences of each industry
  connections.forEach(connection => {
    connection.industries.forEach(industry => {
      if (distribution[industry]) {
        distribution[industry]++;
      } else {
        distribution[industry] = 1;
      }
    });
  });

  // Calculate the percentage for each industry
  Object.keys(distribution).forEach(industry => {
    distribution[industry] = Number(((distribution[industry] / totalConnections) * 100).toFixed(2));
  });

  return distribution;
}

/**
 * Calculates a network strength score based on the user's profile completeness and the quality of their connections.
 * 
 * @param user - The User object
 * @param connections - An array of Connection objects
 * @returns The calculated network strength score
 */
export function calculateNetworkStrength(user: User, connections: Connection[]): number {
  // Validate input user object and connections array
  if (!user || !Array.isArray(connections)) {
    throw new Error('Invalid input: user must be a valid object and connections must be an array');
  }

  // Calculate profile completeness score (0-50 points)
  const profileScore = calculateProfileCompleteness(user);

  // Calculate connection quality score (0-50 points)
  const connectionScore = calculateConnectionQuality(connections);

  // Combine profile completeness and connection quality scores
  const strengthScore = profileScore + connectionScore;

  // Return the final network strength score rounded to two decimal places
  return Number(strengthScore.toFixed(2));
}

/**
 * Helper function to calculate profile completeness score.
 * 
 * @param user - The User object
 * @returns The profile completeness score (0-50 points)
 */
function calculateProfileCompleteness(user: User): number {
  let score = 0;

  // Check for minimum industry selections (15 points)
  score += user.industries.length >= 3 ? 15 : 5 * user.industries.length;

  // Check for minimum interest selections (15 points)
  score += user.interests.length >= 3 ? 15 : 5 * user.interests.length;

  // Check for location information (20 points)
  score += user.city && user.zipCode ? 20 : (user.city || user.zipCode ? 10 : 0);

  return score;
}

/**
 * Helper function to calculate connection quality score.
 * 
 * @param connections - An array of Connection objects
 * @returns The connection quality score (0-50 points)
 */
function calculateConnectionQuality(connections: Connection[]): number {
  if (connections.length === 0) return 0;

  const totalValue = connections.reduce((sum, connection) => sum + connection.connectionValue, 0);
  const averageValue = totalValue / connections.length;

  // Score based on average connection value (0-30 points)
  let score = Math.min(30, averageValue * 10);

  // Additional points for number of connections (0-20 points)
  score += Math.min(20, connections.length);

  return score;
}