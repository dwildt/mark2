/**
 * Jest Global Setup
 * Setup tasks that run once before all tests
 */

export default async function globalSetup() {
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.IS_TEST_ENV = 'true'

  // Mock console methods for cleaner test output
  if (!process.env.DEBUG_TESTS) {
    const originalMethods = {}

    ;['log', 'warn', 'info', 'debug'].forEach(method => {
      originalMethods[method] = console[method]
      console[method] = () => {} // Silent
    })

    // Preserve error and restore methods
    global.__originalConsoleMethods = originalMethods
  }

  // Initialize any global test data
  global.__testStartTime = Date.now()

  console.log('🧪 Starting mark2 test suite...')
}