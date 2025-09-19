/**
 * Vitest Configuration
 * Configuration for testing with native ES modules support
 */

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Test environment
    environment: 'jsdom',

    // Global test setup
    setupFiles: ['./tests/polyfills.js', './tests/setup.js'],

    // Test file patterns
    include: [
      '**/__tests__/**/*.{js,ts}',
      '**/*.{test,spec}.{js,ts}'
    ],

    // Files to exclude
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
    ],

    // Global test configuration
    globals: true,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: [
        'src/**/*.js'
      ],
      exclude: [
        'src/**/*.test.js',
        'src/**/*.spec.js',
        'src/examples/**',
        'src/index.js'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },

    // Test timeout
    testTimeout: 10000,

    // Hook timeouts
    hookTimeout: 10000,

    // Teardown timeout
    teardownTimeout: 10000,

    // Reporter configuration
    reporter: ['verbose', 'json', 'html'],

    // Output files
    outputFile: {
      json: './coverage/test-results.json',
      html: './coverage/test-results.html'
    },

    // Pool options for parallel testing
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: 4
      }
    },

    // Watch options
    watch: false,

    // UI options
    ui: false,

    // Open UI in browser
    open: false,

    // CSS handling
    css: false,

    // Transform options for better ES modules support
    server: {
      deps: {
        inline: [
          // Add any problematic dependencies here
        ]
      }
    }
  },

  // Resolve configuration
  resolve: {
    alias: {
      // Add path aliases if needed
      '@': new URL('./src', import.meta.url).pathname,
      '@tests': new URL('./tests', import.meta.url).pathname
    }
  },

  // Define global constants
  define: {
    __TEST__: true
  }
})