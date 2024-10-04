/**
 * This file defines the TypeScript interfaces and types related to user data in the Pollen8 platform.
 * 
 * Requirements addressed:
 * 1. User Data Structure (Technical Specification/1.1 System Objectives/Verified Connections)
 * 2. Industry Selection (Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * 3. Interest Selection (Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 * 4. Location Data (Technical Specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation)
 */

// Assuming Industry and Interest are defined in their respective files
import { Industry } from '../industry';
import { Interest } from '../interest';

/**
 * Represents a unique identifier for a user.
 */
export type UserId = string;

/**
 * Represents a phone number.
 */
export type PhoneNumber = string;

/**
 * This interface defines the structure of a user in the Pollen8 platform.
 * It includes all necessary fields as per the technical specifications.
 */
export interface User {
  /**
   * The unique identifier for the user.
   */
  id: UserId;

  /**
   * The user's verified phone number.
   */
  phoneNumber: PhoneNumber;

  /**
   * The industries selected by the user.
   * Minimum of 3 selections required as per specifications.
   */
  industries: Industry[];

  /**
   * The interests selected by the user.
   * Minimum of 3 selections required as per specifications.
   */
  interests: Interest[];

  /**
   * The city where the user is located.
   */
  city: string;

  /**
   * The zip code of the user's location.
   */
  zipCode: string;

  /**
   * The timestamp when the user account was created.
   */
  createdAt: Date;

  /**
   * The timestamp of the user's last login.
   */
  lastLogin: Date;
}

/**
 * This interface defines the structure for user profile data that can be updated.
 */
export interface UserProfile {
  /**
   * The industries selected by the user.
   * Minimum of 3 selections required as per specifications.
   */
  industries: Industry[];

  /**
   * The interests selected by the user.
   * Minimum of 3 selections required as per specifications.
   */
  interests: Interest[];

  /**
   * The city where the user is located.
   */
  city: string;

  /**
   * The zip code of the user's location.
   */
  zipCode: string;
}