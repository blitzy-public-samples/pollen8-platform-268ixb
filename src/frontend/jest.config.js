/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  // Use ts-jest as a preset to handle TypeScript files
  preset: 'ts-jest',

  // Specify the test environment (jsdom for browser-like environment)
  testEnvironment: 'jsdom',

  // Setup files to run after Jest is loaded
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],

  // Transform files before running tests
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Module name mapper for handling CSS/SCSS modules and absolute imports
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Specify where to output coverage reports
  coverageDirectory: '<rootDir>/coverage',

  // Specify which files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
  ],

  // Set minimum threshold for code coverage
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Ignore certain paths for coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/tests/',
    '/src/types/',
  ],

  // Display individual test results with test suite hierarchy
  verbose: true,

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The maximum number of workers used to run your tests
  maxWorkers: '50%',

  // An array of regexp pattern strings that are matched against all test paths before executing the test
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/src'],

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],

  // An array of regexp pattern strings that are matched against all source file paths before re-running tests in watch mode
  watchPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Indicates whether each individual test should be reported during the run
  verbose: true,
};