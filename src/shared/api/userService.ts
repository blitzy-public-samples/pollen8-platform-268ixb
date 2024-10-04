/**
 * @file userService.ts
 * @description This file contains the implementation of the user service, which handles all user-related API calls in the Pollen8 frontend application.
 * @requirement User Authentication
 * @location Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 * @requirement Profile Management
 * @location Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 * @requirement Industry and Interest Selection
 * @location Technical specification/1.2 Scope/Core Functionalities/1. User Authentication and Profile Creation
 */

import { apiClient, API_ENDPOINTS } from './apiClient';
import { User, UserProfile } from '../types/user';

/**
 * User Service class that handles all user-related API calls
 */
export class UserService {
  /**
   * Retrieves the current user's profile from the backend.
   * @returns {Promise<User>} A promise that resolves to the user's profile
   * @throws {Error} If there's an error fetching the profile
   */
  static async getUserProfile(): Promise<User> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USER.PROFILE);
      return response.data as User;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  /**
   * Updates the user's profile with the provided information.
   * @param {UserProfile} profile - The updated profile information
   * @returns {Promise<User>} A promise that resolves to the updated user profile
   * @throws {Error} If there's an error updating the profile
   */
  static async updateUserProfile(profile: UserProfile): Promise<User> {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USER.UPDATE_PROFILE, profile);
      return response.data as User;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  /**
   * Updates the user's selected industries.
   * @param {string[]} industries - Array of industry IDs
   * @returns {Promise<User>} A promise that resolves to the updated user profile
   * @throws {Error} If there's an error updating the industries
   */
  static async updateUserIndustries(industries: string[]): Promise<User> {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USER.INDUSTRIES, { industries });
      return response.data as User;
    } catch (error) {
      console.error('Error updating user industries:', error);
      throw new Error('Failed to update user industries');
    }
  }

  /**
   * Updates the user's selected interests.
   * @param {string[]} interests - Array of interest IDs
   * @returns {Promise<User>} A promise that resolves to the updated user profile
   * @throws {Error} If there's an error updating the interests
   */
  static async updateUserInterests(interests: string[]): Promise<User> {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USER.INTERESTS, { interests });
      return response.data as User;
    } catch (error) {
      console.error('Error updating user interests:', error);
      throw new Error('Failed to update user interests');
    }
  }
}

/**
 * Export a default instance of the UserService for convenience
 */
export default new UserService();