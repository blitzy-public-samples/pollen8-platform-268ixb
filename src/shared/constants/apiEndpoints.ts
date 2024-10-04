/**
 * @file apiEndpoints.ts
 * @description This file contains constant definitions for API endpoints used throughout the Pollen8 application.
 * @requirement API Endpoint Centralization
 * @location Technical specification/2. SYSTEM ARCHITECTURE/2.3 COMPONENT DIAGRAMS/2.3.2 Backend Components
 */

/**
 * Base URL for all API endpoints
 */
export const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.pollen8.com/v1';

/**
 * Authentication related endpoints
 */
export const AUTH_ENDPOINTS = {
  VERIFY: `${API_BASE_URL}/auth/verify`,
  CONFIRM: `${API_BASE_URL}/auth/confirm`,
  REFRESH: `${API_BASE_URL}/auth/refresh`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
};

/**
 * User related endpoints
 */
export const USER_ENDPOINTS = {
  PROFILE: `${API_BASE_URL}/user/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/user/profile`,
  INDUSTRIES: `${API_BASE_URL}/user/industries`,
  INTERESTS: `${API_BASE_URL}/user/interests`,
};

/**
 * Network related endpoints
 */
export const NETWORK_ENDPOINTS = {
  CONNECTIONS: `${API_BASE_URL}/network/connections`,
  GRAPH: `${API_BASE_URL}/network/graph`,
  VALUE: `${API_BASE_URL}/network/value`,
};

/**
 * Invite related endpoints
 */
export const INVITE_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/invite/create`,
  LIST: `${API_BASE_URL}/invite/list`,
  ANALYTICS: `${API_BASE_URL}/invite/analytics`,
};

/**
 * Export all endpoints as a single object for convenience
 */
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  NETWORK: NETWORK_ENDPOINTS,
  INVITE: INVITE_ENDPOINTS,
};