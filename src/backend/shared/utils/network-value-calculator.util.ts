/**
 * This utility file contains functions for calculating network values in the Pollen8 platform's backend.
 * It addresses the following requirements:
 * 1. Network Value Calculation (Technical specification/1.1 System Objectives/Quantifiable Networking)
 * 2. Growth Tracking (Technical specification/1.1 System Objectives/Quantifiable Networking)
 */

// Define the CONNECTION_VALUE constant
const CONNECTION_VALUE = 3.14;

/**
 * Calculates the total network value for a user based on their number of connections.
 * @param connections The number of connections the user has
 * @returns The calculated network value
 */
export function calculateNetworkValue(connections: number): number {
  // Multiply the number of connections by the CONNECTION_VALUE constant
  const networkValue = connections * CONNECTION_VALUE;
  
  // Return the result
  return Number(networkValue.toFixed(2)); // Round to 2 decimal places for precision
}

/**
 * Calculates the growth rate of a user's network value between two points in time.
 * @param previousValue The previous network value
 * @param currentValue The current network value
 * @returns The calculated growth rate as a percentage
 */
export function calculateGrowthRate(previousValue: number, currentValue: number): number {
  // Calculate the difference between currentValue and previousValue
  const difference = currentValue - previousValue;
  
  // Divide the difference by the previousValue
  const growthRate = (difference / previousValue) * 100;
  
  // Return the result as a percentage, rounded to 2 decimal places
  return Number(growthRate.toFixed(2));
}

/**
 * Calculates the projected network value based on the current value, growth rate, and number of days.
 * @param currentValue The current network value
 * @param growthRate The daily growth rate as a percentage
 * @param days The number of days to project
 * @returns The projected network value
 */
export function calculateProjectedGrowth(currentValue: number, growthRate: number, days: number): number {
  // Calculate the daily growth factor based on the growth rate
  const dailyGrowthFactor = 1 + (growthRate / 100);
  
  // Apply the growth factor to the current value for the specified number of days
  const projectedValue = currentValue * Math.pow(dailyGrowthFactor, days);
  
  // Return the projected value, rounded to 2 decimal places
  return Number(projectedValue.toFixed(2));
}

/**
 * Calculates the number of connections needed to reach a target network value.
 * @param targetValue The target network value
 * @returns The number of connections needed
 */
export function calculateConnectionsNeeded(targetValue: number): number {
  // Divide the target value by the CONNECTION_VALUE constant
  const connectionsNeeded = Math.ceil(targetValue / CONNECTION_VALUE);
  
  // Return the result, rounded up to the nearest integer
  return connectionsNeeded;
}

/**
 * Calculates the network value difference between two users.
 * @param userConnections1 The number of connections for the first user
 * @param userConnections2 The number of connections for the second user
 * @returns The difference in network value
 */
export function calculateNetworkValueDifference(userConnections1: number, userConnections2: number): number {
  // Calculate network values for both users
  const networkValue1 = calculateNetworkValue(userConnections1);
  const networkValue2 = calculateNetworkValue(userConnections2);
  
  // Calculate the absolute difference
  const difference = Math.abs(networkValue1 - networkValue2);
  
  // Return the difference, rounded to 2 decimal places
  return Number(difference.toFixed(2));
}