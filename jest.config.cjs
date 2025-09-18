module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // Setup files
  setupFiles: ['<rootDir>/tests/polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/*.test.js',
    '**/*.spec.js'
  ],

  // ES modules support
  preset: null,

  // Transform configuration
  transform: {},

  // Module name mapping
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js'
  },

  // Transform ignore patterns
  transformIgnorePatterns: [],

  // Coverage configuration (disabled for now)
  collectCoverage: false,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/examples/**',
    '!src/index.js'
  ],

  // Module file extensions
  moduleFileExtensions: ['js', 'json'],

  // Test timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Error on deprecated features
  errorOnDeprecated: true,

  // Notify mode disabled
  notify: false
}