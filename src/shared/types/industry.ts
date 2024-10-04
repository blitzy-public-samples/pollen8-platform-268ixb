/**
 * This file defines the TypeScript interface and types related to industries in the Pollen8 platform.
 * It addresses the requirement for industry selection during user onboarding as specified in the
 * Technical specification/1.1 System Objectives/Verified Connections section.
 */

import { User } from '../user';

/**
 * This interface defines the structure of an industry in the Pollen8 platform.
 * It is designed to be flexible, allowing for future expansion of industry-related features.
 */
export interface Industry {
  /**
   * Unique identifier for the industry.
   */
  id: string;

  /**
   * Name of the industry.
   */
  name: string;

  /**
   * Optional description of the industry.
   * This field can be used to provide more context about each industry if needed in the future.
   */
  description?: string;
}

/**
 * Type alias for the industry identifier.
 * Using a separate IndustryId type allows for easy type checking and future changes to the identifier type if necessary.
 */
export type IndustryId = string;

/**
 * Type for a user's selected industries.
 * This type is used to associate industries with user profiles.
 */
export type UserIndustries = {
  user: User;
  industries: Industry[];
};

/**
 * Function to check if a given string is a valid IndustryId.
 * This can be useful for type guards and validation.
 * 
 * @param id - The string to check
 * @returns True if the string is a valid IndustryId, false otherwise
 */
export function isIndustryId(id: string): id is IndustryId {
  // Implement validation logic here, e.g., check if it's a valid UUID
  return typeof id === 'string' && id.length > 0;
}

/**
 * Function to create an Industry object with optional description.
 * This factory function ensures that all required fields are provided.
 * 
 * @param id - The unique identifier for the industry
 * @param name - The name of the industry
 * @param description - Optional description of the industry
 * @returns An Industry object
 */
export function createIndustry(id: IndustryId, name: string, description?: string): Industry {
  return { id, name, description };
}

// Export additional types or functions as needed for industry-related operations