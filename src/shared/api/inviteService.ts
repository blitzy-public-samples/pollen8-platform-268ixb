/**
 * @file inviteService.ts
 * @description This file contains the invite service, which is responsible for handling API requests related to invite functionality in the Pollen8 platform.
 * @requirements_addressed 
 * - Invite System (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 * - Invite Analytics (Technical specification/1.1 System Objectives/Strategic Growth Tools)
 */

import { apiClient, API_ENDPOINTS } from './apiClient';
import { Invite, CreateInviteDto, UpdateInviteDto, InviteAnalytics } from '../types/invite';

/**
 * Creates a new invite by sending a POST request to the backend API.
 * @param {CreateInviteDto} data - The data required to create a new invite
 * @returns {Promise<Invite>} The created invite object
 */
export const createInvite = async (data: CreateInviteDto): Promise<Invite> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.INVITES, data);
    return response.data;
  } catch (error) {
    console.error('Error creating invite:', error);
    throw error;
  }
};

/**
 * Retrieves all invites for the authenticated user by sending a GET request to the backend API.
 * @returns {Promise<Invite[]>} An array of Invite objects
 */
export const getInvites = async (): Promise<Invite[]> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.INVITES);
    return response.data;
  } catch (error) {
    console.error('Error fetching invites:', error);
    throw error;
  }
};

/**
 * Updates an existing invite by sending a PUT request to the backend API.
 * @param {string} id - The ID of the invite to update
 * @param {UpdateInviteDto} data - The data to update the invite with
 * @returns {Promise<Invite>} The updated Invite object
 */
export const updateInvite = async (id: string, data: UpdateInviteDto): Promise<Invite> => {
  try {
    const response = await apiClient.put(`${API_ENDPOINTS.INVITES}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating invite:', error);
    throw error;
  }
};

/**
 * Deletes an invite by sending a DELETE request to the backend API.
 * @param {string} id - The ID of the invite to delete
 * @returns {Promise<void>} No return value
 */
export const deleteInvite = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${API_ENDPOINTS.INVITES}/${id}`);
  } catch (error) {
    console.error('Error deleting invite:', error);
    throw error;
  }
};

/**
 * Retrieves analytics data for a specific invite by sending a GET request to the backend API.
 * @param {string} id - The ID of the invite to get analytics for
 * @returns {Promise<InviteAnalytics>} The invite analytics data
 */
export const getInviteAnalytics = async (id: string): Promise<InviteAnalytics> => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.INVITES}/${id}/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invite analytics:', error);
    throw error;
  }
};

/**
 * Retrieves the 30-day activity visualization data for a specific invite.
 * @param {string} id - The ID of the invite to get activity visualization for
 * @returns {Promise<InviteActivityVisualization>} The invite activity visualization data
 */
export const getInviteActivityVisualization = async (id: string): Promise<InviteActivityVisualization> => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.INVITES}/${id}/activity-visualization`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invite activity visualization:', error);
    throw error;
  }
};

/**
 * Regenerates an invite link by sending a POST request to the backend API.
 * @param {string} id - The ID of the invite to regenerate
 * @returns {Promise<Invite>} The updated Invite object with the new link
 */
export const regenerateInviteLink = async (id: string): Promise<Invite> => {
  try {
    const response = await apiClient.post(`${API_ENDPOINTS.INVITES}/${id}/regenerate`);
    return response.data;
  } catch (error) {
    console.error('Error regenerating invite link:', error);
    throw error;
  }
};

/**
 * Retrieves the current status of an invite.
 * @param {string} id - The ID of the invite to get the status for
 * @returns {Promise<InviteStatus>} The current status of the invite
 */
export const getInviteStatus = async (id: string): Promise<InviteStatus> => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.INVITES}/${id}/status`);
    return response.data.status;
  } catch (error) {
    console.error('Error fetching invite status:', error);
    throw error;
  }
};

/**
 * Revokes an active invite.
 * @param {string} id - The ID of the invite to revoke
 * @returns {Promise<void>} No return value
 */
export const revokeInvite = async (id: string): Promise<void> => {
  try {
    await apiClient.post(`${API_ENDPOINTS.INVITES}/${id}/revoke`);
  } catch (error) {
    console.error('Error revoking invite:', error);
    throw error;
  }
};