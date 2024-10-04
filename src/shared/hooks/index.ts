// src/shared/hooks/index.ts

// Import custom hooks
import { useNetworkValue } from './useNetworkValue';
import { useInviteAnalytics } from './useInviteAnalytics';

// Export custom hooks
export {
  useNetworkValue,
  useInviteAnalytics
};

// Additional exports can be added here as more custom hooks are developed

/**
 * This file serves as the central export point for all custom React hooks
 * in the shared hooks directory of the Pollen8 platform.
 * 
 * Requirements addressed:
 * 1. Quantifiable Networking (Technical Specification/1.1 System Objectives/Quantifiable Networking)
 *    - useNetworkValue hook provides measurable network growth metrics
 * 2. Strategic Growth Tools (Technical Specification/1.1 System Objectives/Strategic Growth Tools)
 *    - useInviteAnalytics hook enables targeted network expansion through invite analytics
 * 
 * As new hooks are developed, they should be imported and exported from this file
 * to maintain a centralized access point for all shared hooks.
 */

// Example of how to add a new hook:
// import { useNewHook } from './useNewHook';
// export { useNewHook };

// TypeScript type definitions for exported hooks can be added here if needed
// export type { SomeHookReturnType } from './someHook';