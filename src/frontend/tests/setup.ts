// This file is responsible for setting up the testing environment for the frontend of the Pollen8 application.
// Requirements addressed:
// - Test Environment Setup (Technical Specification/3. SYSTEM DESIGN/3.2 COMPONENT DIAGRAMS/3.2.1 Frontend Components)

// Import Jest DOM matchers to extend Jest's expect function with additional DOM-specific matchers
import '@testing-library/jest-dom';

// Import necessary testing utilities
import { cleanup } from '@testing-library/react';

// Mock global fetch function
global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));

// Set up environment variables needed for testing
process.env.REACT_APP_API_URL = 'http://localhost:3000/api';

// Define custom test utilities or helpers available globally
global.renderWithProviders = (ui, options = {}) => {
  // Custom render function implementation
  // This is a placeholder and should be implemented based on the actual requirements
  // It might include wrapping the component with necessary providers (e.g., Redux, Theme, Router)
  console.warn('renderWithProviders is not fully implemented');
  return { ui, options };
};

// Set up automatic cleanup after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// Extend the global object with custom properties for TypeScript
declare global {
  namespace NodeJS {
    interface Global {
      renderWithProviders: (ui: React.ReactElement, options?: any) => any;
      fetch: jest.Mock;
    }
  }
}

// Additional setup can be added here as needed for the Pollen8 application
// For example, mocking specific modules, setting up test database connections, etc.

console.log('Test environment setup completed for Pollen8 frontend');