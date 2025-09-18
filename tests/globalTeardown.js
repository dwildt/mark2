/**
 * Jest Global Teardown
 * Cleanup tasks that run once after all tests
 */

export default async function globalTeardown() {
  // Restore console methods if they were mocked
  if (global.__originalConsoleMethods) {
    Object.entries(global.__originalConsoleMethods).forEach(([method, original]) => {
      console[method] = original
    })
  }

  // Calculate total test time
  if (global.__testStartTime) {
    const totalTime = Date.now() - global.__testStartTime
    console.log(`✅ mark2 test suite completed in ${totalTime}ms`)
  }

  // Clean up any global resources
  // (In a real application, this might include closing database connections, etc.)

  console.log('🧹 Test cleanup completed')
}