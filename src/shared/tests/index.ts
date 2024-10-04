/**
 * This file serves as the main entry point for exporting test utilities and mock data
 * used across the Pollen8 platform's shared components and modules.
 * 
 * Requirements addressed:
 * 1. Test Utilities Export (Technical Specification/3. SYSTEM DESIGN/3.3 API DESIGN)
 * 2. Mock Data Export (Technical Specification/3. SYSTEM DESIGN/3.3 API DESIGN)
 */

// Export all test utility functions
export {
  createMockUser,
  createMockConnection,
  createMockInvite,
  renderWithProviders,
  mockNetworkCalculations,
  userEvent
} from './testUtils';

// Export all mock data and generation functions
export {
  mockUsers,
  mockConnections,
  mockInvites,
  mockIndustries,
  mockInterests,
  generateMockUser,
  generateMockConnection,
  generateMockInvite
} from './mockData';

/**
 * This index file simplifies the import process for test-related utilities and mock data
 * across the Pollen8 platform. By centralizing these exports, it becomes easier to manage
 * and update test-related imports project-wide.
 * 
 * Usage example:
 * import { createMockUser, mockUsers, renderWithProviders } from '@shared/tests';
 * 
 * When new test utilities or mock data sets are added to either testUtils.ts or mockData.ts,
 * ensure they are also exported in this index file to maintain consistency.
 * 
 * This file follows the barrel pattern, which is a way to roll up exports from several
 * modules into a single convenient module. It promotes consistency in how test utilities
 * and mock data are imported and used across different test files in the project.
 * 
 * When importing from this file, developers can choose to import everything or select
 * specific utilities or mock data as needed:
 * 
 * import * as TestUtils from '@shared/tests';
 * or
 * import { createMockUser, mockNetworkCalculations } from '@shared/tests';
 * 
 * Regular maintenance of this file is crucial to keep it in sync with the contents
 * of testUtils.ts and mockData.ts.
 */