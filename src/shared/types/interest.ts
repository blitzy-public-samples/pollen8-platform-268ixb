/**
 * @file src/shared/types/interest.ts
 * @description This file defines the TypeScript interface for the Interest type used throughout the Pollen8 application.
 * @requirement User Interests - Define the structure for user interests
 * @location Technical specification/1.1 System Objectives/Verified Connections
 */

/**
 * Interface representing an Interest in the Pollen8 application.
 * @interface Interest
 * @property {string} id - Unique identifier for the interest.
 * @property {string} name - Name of the interest.
 */
export interface Interest {
  id: string;
  name: string;
}

/**
 * Export the Interest interface as the default export for easier importing in other files.
 */
export default Interest;

/**
 * Type guard to check if an object is of type Interest.
 * @param obj - The object to check.
 * @returns {boolean} True if the object is of type Interest, false otherwise.
 */
export function isInterest(obj: any): obj is Interest {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string'
  );
}

/**
 * Function to create a new Interest object.
 * @param id - The unique identifier for the interest.
 * @param name - The name of the interest.
 * @returns {Interest} A new Interest object.
 */
export function createInterest(id: string, name: string): Interest {
  return { id, name };
}

/**
 * Function to compare two Interest objects for equality.
 * @param a - The first Interest object.
 * @param b - The second Interest object.
 * @returns {boolean} True if the interests are equal, false otherwise.
 */
export function areInterestsEqual(a: Interest, b: Interest): boolean {
  return a.id === b.id && a.name === b.name;
}