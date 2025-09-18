# mark2 Test Suite

Comprehensive testing framework for the mark2 markdown to mind map application.

## Test Structure

### 📁 Test Organization

```
tests/
├── setup.js                    # Global test configuration
├── globalSetup.js              # Pre-test setup
├── globalTeardown.js           # Post-test cleanup
├── transforms/                 # File transformers for Jest
│   ├── cssTransform.js         # CSS import handling
│   └── fileTransform.js        # Asset import handling
├── atoms/                      # Atomic component tests
│   ├── Button.test.js          # Button component tests
│   ├── TextInput.test.js       # Text input tests
│   └── Node.test.js            # Mind map node tests
├── molecules/                  # Molecular component tests
│   ├── Toolbar.test.js         # Toolbar component tests
│   └── TextEditor.test.js      # Text editor tests
├── organisms/                  # Organism component tests
│   ├── Header.test.js          # Header component tests
│   ├── EditorPanel.test.js     # Editor panel tests
│   └── MindMap.test.js         # Mind map organism tests
├── utils/                      # Utility function tests
│   ├── ExportManager.test.js   # Export functionality tests
│   ├── markdownParser.test.js  # Markdown parsing tests
│   └── mindMapGenerator.test.js # Mind map generation tests
├── i18n/                       # Internationalization tests
│   └── LanguageManager.test.js # Language management tests
├── theme/                      # Theme system tests
│   └── ThemeManager.test.js    # Theme management tests
└── integration/                # Integration tests
    └── Application.test.js     # End-to-end application tests
```

## 🧪 Test Categories

### Unit Tests
- **Atoms**: Individual component functionality
- **Molecules**: Component interaction and composition
- **Organisms**: Complex component behavior
- **Utils**: Pure function testing
- **Managers**: System service testing

### Integration Tests
- **Application**: End-to-end user workflows
- **Component Integration**: Multi-component interactions
- **Data Flow**: State management and updates
- **Event Handling**: User interaction responses

## 🚀 Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Specific Test Categories
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Component tests only
npm run test:components

# Utility tests only
npm run test:utils
```

### Specific Test Files
```bash
# Single test file
npm test -- Button.test.js

# Pattern matching
npm test -- --testNamePattern="MindMap"

# File pattern
npm test -- tests/atoms/
```

## 📊 Coverage Requirements

### Global Coverage Targets
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Component-Specific Targets
- **Atoms**: 90% (high reliability required)
- **Utils**: 95% (pure functions, easily testable)
- **Managers**: 90% (core system functionality)
- **Molecules**: 85% (moderate complexity)
- **Organisms**: 80% (complex interactions)

## 🛠 Test Utilities

### Global Test Helpers
Available in all test files via `global.testUtils`:

```javascript
// Wait for async operations
await testUtils.waitFor(100)

// Create mock events
const clickEvent = testUtils.createMockEvent('click', { clientX: 100 })

// Generate test data
const markdown = testUtils.createMockMarkdown()

// DOM utilities
const element = testUtils.createMockElement('div', { id: 'test' })
testUtils.cleanupDOM()
```

### Mock Setup
- **localStorage**: Automatically mocked
- **sessionStorage**: Automatically mocked
- **fetch**: Mocked with success responses
- **Canvas API**: Complete mock implementation
- **SVG API**: Mock for mind map rendering
- **File API**: Mock for import/export testing

## 🔧 Configuration

### Jest Configuration
Located in `jest.config.js` with:
- **Environment**: jsdom for DOM testing
- **Transforms**: Babel for ES modules, custom for assets
- **Module Mapping**: Path aliases for clean imports
- **Coverage**: Detailed reporting with thresholds
- **Reporters**: HTML and JUnit output

### Environment Variables
- `NODE_ENV=test`: Test environment
- `IS_TEST_ENV=true`: Test detection flag
- `DEBUG_TESTS=true`: Enable console output

## 📝 Writing Tests

### Test File Naming
- `*.test.js`: Unit tests
- `*.spec.js`: Integration tests
- `*.integration.js`: End-to-end tests

### Test Structure
```javascript
describe('ComponentName', () => {
  let component

  beforeEach(() => {
    testUtils.cleanupDOM()
    component = new ComponentName()
  })

  afterEach(() => {
    if (component) {
      component.destroy()
      component = null
    }
  })

  describe('Initialization', () => {
    test('should create with default options', () => {
      // Test implementation
    })
  })

  describe('Functionality', () => {
    test('should handle user interactions', () => {
      // Test implementation
    })
  })
})
```

### Best Practices

#### ✅ Good Practices
- **Descriptive test names**: Clear what is being tested
- **Isolated tests**: Each test is independent
- **Proper cleanup**: Prevent test pollution
- **Mock external dependencies**: Focus on unit under test
- **Test edge cases**: Error conditions and boundaries
- **Use test utilities**: Leverage provided helpers

#### ❌ Avoid
- **Testing implementation details**: Test behavior, not internals
- **Flaky tests**: Tests that randomly fail
- **Shared state**: Tests affecting each other
- **Overly complex tests**: Keep tests simple and focused
- **Missing cleanup**: Memory leaks and DOM pollution

## 🐛 Debugging Tests

### Debug Mode
```bash
# Enable verbose console output
DEBUG_TESTS=true npm test

# Run specific test in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand Button.test.js
```

### Console Restoration
```javascript
// In test files, restore console for debugging
beforeEach(() => {
  if (process.env.DEBUG_TESTS) {
    global.console.restore()
  }
})
```

### Common Issues
1. **DOM not cleaning**: Use `testUtils.cleanupDOM()`
2. **Async operations**: Use `await testUtils.waitFor()`
3. **Event handlers**: Ensure proper mocking
4. **Memory leaks**: Always cleanup components

## 📈 Continuous Integration

### GitHub Actions
Tests run automatically on:
- Pull requests
- Main branch pushes
- Nightly builds

### Quality Gates
- All tests must pass
- Coverage thresholds must be met
- No ESLint errors
- No TypeScript errors (if applicable)

## 🎯 Testing Philosophy

### Test Pyramid
1. **Unit Tests (70%)**: Fast, isolated, focused
2. **Integration Tests (20%)**: Component interactions
3. **E2E Tests (10%)**: User workflows

### Testing Goals
- **Reliability**: Catch regressions early
- **Documentation**: Tests as living documentation
- **Confidence**: Deploy with confidence
- **Maintainability**: Easy to update and understand

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs)
- [Testing Library](https://testing-library.com/)
- [DOM Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Atomic Design Testing](https://bradfrost.com/blog/post/atomic-web-design/)

---

*Last updated: December 2024*