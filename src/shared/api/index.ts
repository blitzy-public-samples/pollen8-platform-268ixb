/**
 * @file index.ts
 * @description This file serves as the main entry point for the API services in the Pollen8 frontend application, exporting all the API-related functionalities from various service modules.
 * @requirements_addressed 
 * - Centralized API Access (Technical specification/2. System Architecture)
 * - Modular API Structure (Technical specification/2.3 Component Diagrams)
 */

// Import and export the main API client and auth token functions
export { 
  apiClient, 
  setAuthToken, 
  clearAuthToken, 
  API_ENDPOINTS,
  get,
  post,
  put,
  del
} from './apiClient';

// Export all user-related API functions
export * as userService from './userService';

// Export all network-related API functions
export * as networkService from './networkService';

// Export all invite-related API functions
export * from './inviteService';

/**
 * ApiServices interface combining all API services
 */
export interface ApiServices {
  user: typeof userService;
  network: typeof networkService;
  invite: typeof import('./inviteService');
}

/**
 * Combined API services object
 */
export const apiServices: ApiServices = {
  user: userService,
  network: networkService,
  invite: require('./inviteService')
};

/**
 * Default export of the combined API services
 */
export default apiServices;