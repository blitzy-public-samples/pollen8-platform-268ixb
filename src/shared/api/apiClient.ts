/**
 * @file apiClient.ts
 * @description This file is responsible for creating and configuring the main API client used throughout the Pollen8 frontend application to communicate with the backend services.
 * @requirement Centralized API Communication
 * @location Technical specification/1.1 System Objectives
 * @requirement Secure Data Transfer
 * @location Technical specification/9. Security Considerations
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '../config/environment';
import { handleApiError } from '../utils/errorHandling';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * Configuration for the Axios instance
 */
const axiosConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Create and configure an Axios instance for making API requests to the Pollen8 backend.
 * @returns {AxiosInstance} Configured Axios instance
 */
const createApiClient = (): AxiosInstance => {
  const instance = axios.create(axiosConfig);

  // Request interceptor
  instance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      // Add any request modifications here, e.g., adding authentication token
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // You can modify the response data here if needed
      return response;
    },
    (error: AxiosError) => {
      // Handle global error responses
      return handleApiError(error);
    }
  );

  return instance;
};

/**
 * The main API client instance to be used throughout the application
 */
export const apiClient: AxiosInstance = createApiClient();

/**
 * Set the authentication token in the API client's default headers
 * @param {string} token - The JWT token to be set
 */
export const setAuthToken = (token: string): void => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/**
 * Remove the authentication token from the API client's default headers
 */
export const clearAuthToken = (): void => {
  delete apiClient.defaults.headers.common['Authorization'];
};

/**
 * Export API_ENDPOINTS for convenience
 */
export { API_ENDPOINTS };

/**
 * Helper function to make a GET request
 * @param {string} url - The endpoint URL
 * @param {AxiosRequestConfig} config - Optional Axios config
 * @returns {Promise<AxiosResponse>} The API response
 */
export const get = (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
  return apiClient.get(url, config);
};

/**
 * Helper function to make a POST request
 * @param {string} url - The endpoint URL
 * @param {any} data - The data to be sent in the request body
 * @param {AxiosRequestConfig} config - Optional Axios config
 * @returns {Promise<AxiosResponse>} The API response
 */
export const post = (url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
  return apiClient.post(url, data, config);
};

/**
 * Helper function to make a PUT request
 * @param {string} url - The endpoint URL
 * @param {any} data - The data to be sent in the request body
 * @param {AxiosRequestConfig} config - Optional Axios config
 * @returns {Promise<AxiosResponse>} The API response
 */
export const put = (url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
  return apiClient.put(url, data, config);
};

/**
 * Helper function to make a DELETE request
 * @param {string} url - The endpoint URL
 * @param {AxiosRequestConfig} config - Optional Axios config
 * @returns {Promise<AxiosResponse>} The API response
 */
export const del = (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
  return apiClient.delete(url, config);
};