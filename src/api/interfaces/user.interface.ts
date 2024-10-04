import { Industry } from '../shared/types/industry';
import { Interest } from '../shared/types/interest';

/**
 * This interface defines the structure of a User object in the Pollen8 platform.
 * It addresses the following requirements:
 * - User Profile: Define user attributes including phone number and location
 *   (Technical specification/1.1 System Objectives/Verified Connections)
 * - Industry Selection: Include user's selected industries
 *   (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * - Interest Selection: Include user's selected interests
 *   (Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 */
export interface User {
  /**
   * Unique identifier for the user
   */
  id: string;

  /**
   * User's verified phone number
   * Used for authentication and connection verification
   */
  phoneNumber: string;

  /**
   * User's city of residence
   * Part of the location-based profile enhancement
   */
  city: string;

  /**
   * User's ZIP code
   * Used for more precise location-based functionality
   */
  zipCode: string;

  /**
   * List of industries selected by the user
   * Minimum of 3 industries required during onboarding
   */
  industries: Industry[];

  /**
   * List of interests selected by the user
   * Minimum of 3 interests required during onboarding
   */
  interests: Interest[];

  /**
   * Timestamp of when the user account was created
   */
  createdAt: Date;

  /**
   * Timestamp of the user's last login
   * Used for activity tracking and analytics
   */
  lastLogin: Date;
}

/**
 * Interface for creating a new user
 * Omits the id, createdAt, and lastLogin fields which are generated server-side
 */
export interface CreateUserDto {
  phoneNumber: string;
  city: string;
  zipCode: string;
  industries: string[]; // Array of industry IDs
  interests: string[]; // Array of interest IDs
}

/**
 * Interface for updating an existing user
 * All fields are optional to allow partial updates
 */
export interface UpdateUserDto {
  city?: string;
  zipCode?: string;
  industries?: string[]; // Array of industry IDs
  interests?: string[]; // Array of interest IDs
}

/**
 * Interface for user login attempts
 * Only requires the phone number for initial authentication
 */
export interface UserLoginDto {
  phoneNumber: string;
}

/**
 * Interface for user profile data returned to the client
 * Excludes sensitive information like createdAt and lastLogin
 */
export interface UserProfileDto {
  id: string;
  phoneNumber: string;
  city: string;
  zipCode: string;
  industries: Industry[];
  interests: Interest[];
}