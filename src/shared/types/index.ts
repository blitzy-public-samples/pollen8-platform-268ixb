/**
 * @file src/shared/types/index.ts
 * @description Central export point for all shared TypeScript types and interfaces used throughout the Pollen8 platform.
 * 
 * This file addresses the following requirements:
 * 1. Centralized Type Definitions (Technical Specification/2.3 Component Diagrams)
 *    - Provides a single point of import for all shared types
 * 2. Type Consistency (Technical Specification/2.5 Data-Flow Diagram)
 *    - Ensures consistent use of types across frontend and backend
 */

// User types
export * from './user';

// Connection types
export * from './connection';

// Invite types
export * from './invite';

// Industry types
export * from './industry';

// Interest types
export * from './interest';

/**
 * Common types that might be used across multiple modules
 */

// Pagination type for API responses
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Generic API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Type for network value calculation
export interface NetworkValue {
  totalValue: number;
  connectionCount: number;
}

// Type for date range queries
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Enum for user roles
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

// Type for geolocation data
export interface GeoLocation {
  latitude: number;
  longitude: number;
}

// Type for API endpoints
export enum ApiEndpoint {
  AUTH = '/api/auth',
  USERS = '/api/users',
  CONNECTIONS = '/api/connections',
  INVITES = '/api/invites',
  INDUSTRIES = '/api/industries',
  INTERESTS = '/api/interests',
}

/**
 * Ensure that all exported types are properly documented and consistent with
 * the data models used in both frontend and backend components of the Pollen8 platform.
 */