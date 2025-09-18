module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Enforce consistent spacing
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],

    // Code quality
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'no-console': ['warn', { 'allow': ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',

    // ES6+ features
    'arrow-spacing': 'error',
    'template-curly-spacing': 'error',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],

    // Function style
    'space-before-function-paren': ['error', {
      'anonymous': 'always',
      'named': 'never',
      'asyncArrow': 'always'
    }],

    // Import/Export
    'import/order': ['error', {
      'groups': [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index'
      ],
      'newlines-between': 'always'
    }],

    // Atomic Design specific rules
    'max-len': ['error', {
      'code': 100,
      'ignoreUrls': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true
    }],

    // Class and function naming
    'camelcase': ['error', {
      'properties': 'always'
    }],

    // Disable some rules for flexibility
    'comma-dangle': 'off'
  },

  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      rules: {
        'no-console': 'off'
      }
    },
    {
      files: ['src/atoms/**/*.js'],
      rules: {
        // Atoms should be simple and focused
        'max-lines': ['error', 200],
        'complexity': ['error', 10]
      }
    },
    {
      files: ['src/molecules/**/*.js'],
      rules: {
        // Molecules can be more complex
        'max-lines': ['error', 300],
        'complexity': ['error', 15]
      }
    },
    {
      files: ['src/organisms/**/*.js'],
      rules: {
        // Organisms can be complex
        'max-lines': ['error', 500],
        'complexity': ['error', 20]
      }
    }
  ],

  globals: {
    // Browser globals
    'document': 'readonly',
    'window': 'readonly',
    'navigator': 'readonly',
    'localStorage': 'readonly',
    'sessionStorage': 'readonly',
    'requestAnimationFrame': 'readonly',
    'cancelAnimationFrame': 'readonly',

    // SVG globals
    'SVGElement': 'readonly',

    // Test globals
    'describe': 'readonly',
    'test': 'readonly',
    'expect': 'readonly',
    'beforeEach': 'readonly',
    'afterEach': 'readonly',
    'beforeAll': 'readonly',
    'afterAll': 'readonly',
    'jest': 'readonly'
  }
}