# Testing Guide - mark2

This guide provides comprehensive testing strategies and guidelines for contributors to the mark2 project.

## Testing Philosophy

The mark2 project maintains high code quality through comprehensive testing with these priorities:
1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test component interactions and data flow
3. **Visual Tests**: Verify UI behavior and responsive design
4. **Accessibility Tests**: Ensure usability for all users

## Test Structure Overview

### Test Organization
```
tests/
├── unit/              # Unit tests for individual components
│   ├── atoms/         # Button, TextInput, Node, Connection
│   ├── molecules/     # Toolbar, TextEditor, NodeGroup
│   ├── organisms/     # EditorPanel, MindMap, Header
│   └── utils/         # Pure functions (parsers, generators)
├── integration/       # Integration tests
│   ├── markdown-to-mindmap.test.js
│   ├── theme-switching.test.js
│   └── user-workflows.test.js
├── visual/           # Visual regression tests
│   ├── snapshots/    # Reference images
│   └── responsive.test.js
├── accessibility/    # A11y tests
│   └── accessibility.test.js
└── __mocks__/       # Mock files and test utilities
    ├── svg.js       # SVG mocking
    └── localStorage.js
```

## Jest Configuration

### jest.config.js
```javascript
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/examples/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapping: {
    '\\.(css)$': 'identity-obj-proxy'
  }
}
```

### Test Setup (tests/setup.js)
```javascript
import '@testing-library/jest-dom'

// Mock SVG creation for mind map tests
global.SVGElement = class SVGElement extends HTMLElement {
  constructor() {
    super()
  }
}

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    store: {},
    getItem: jest.fn((key) => window.localStorage.store[key] || null),
    setItem: jest.fn((key, value) => { window.localStorage.store[key] = value }),
    removeItem: jest.fn((key) => { delete window.localStorage.store[key] }),
    clear: jest.fn(() => { window.localStorage.store = {} })
  }
})

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0))
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id))
```

## Unit Testing Guidelines

### Testing Atoms (Basic Components)

#### Button Component Test
```javascript
// tests/unit/atoms/Button.test.js
import Button from '../../../src/atoms/Button/index.js'

describe('Button Component', () => {
  test('should render with correct text', () => {
    const button = new Button('Click me', () => {})
    const element = button.render()

    expect(element.tagName).toBe('BUTTON')
    expect(element.textContent).toBe('Click me')
    expect(element.classList.contains('atom-button')).toBe(true)
  })

  test('should handle click events', () => {
    const mockHandler = jest.fn()
    const button = new Button('Click me', mockHandler)
    const element = button.render()

    element.click()
    expect(mockHandler).toHaveBeenCalledTimes(1)
  })

  test('should apply variant classes', () => {
    const button = new Button('Test', () => {}, 'secondary')
    const element = button.render()

    expect(element.classList.contains('atom-button--secondary')).toBe(true)
  })

  test('should handle disabled state', () => {
    const button = new Button('Test', () => {}, 'primary', true)
    const element = button.render()

    expect(element.disabled).toBe(true)
    expect(element.classList.contains('atom-button--disabled')).toBe(true)
  })
})
```

#### Node Component Test
```javascript
// tests/unit/atoms/Node.test.js
import Node from '../../../src/atoms/Node/index.js'

describe('Node Component', () => {
  test('should create node with correct properties', () => {
    const node = new Node('Test Node', 1, 100, 200)

    expect(node.text).toBe('Test Node')
    expect(node.level).toBe(1)
    expect(node.x).toBe(100)
    expect(node.y).toBe(200)
    expect(node.children).toEqual([])
    expect(node.parent).toBeNull()
  })

  test('should add children correctly', () => {
    const parent = new Node('Parent', 1)
    const child = new Node('Child', 2)

    parent.addChild(child)

    expect(parent.children).toContain(child)
    expect(child.parent).toBe(parent)
  })

  test('should render SVG element', () => {
    const node = new Node('Test', 1, 50, 50)
    const svgElement = node.renderSVG()

    expect(svgElement.tagName).toBe('g')
    expect(svgElement.getAttribute('class')).toBe('mind-map-node mind-map-node--level-1')
  })
})
```

### Testing Utils (Pure Functions)

#### Markdown Parser Test
```javascript
// tests/unit/utils/markdownParser.test.js
import { parseHeaders, parseList, parseMarkdown } from '../../../src/utils/markdownParser.js'

describe('Markdown Parser', () => {
  describe('parseHeaders', () => {
    test('should parse single header', () => {
      const markdown = '# Main Title'
      const result = parseHeaders(markdown)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        level: 1,
        text: 'Main Title',
        index: 0
      })
    })

    test('should parse multiple headers with different levels', () => {
      const markdown = `# Level 1
## Level 2
### Level 3`

      const result = parseHeaders(markdown)

      expect(result).toHaveLength(3)
      expect(result[0].level).toBe(1)
      expect(result[1].level).toBe(2)
      expect(result[2].level).toBe(3)
    })

    test('should handle empty input', () => {
      expect(parseHeaders('')).toEqual([])
      expect(parseHeaders(null)).toEqual([])
      expect(parseHeaders(undefined)).toEqual([])
    })
  })

  describe('parseList', () => {
    test('should parse unordered list', () => {
      const markdown = `- Item 1
- Item 2
- Item 3`

      const result = parseList(markdown)

      expect(result).toHaveLength(3)
      expect(result[0].text).toBe('Item 1')
      expect(result[0].type).toBe('unordered')
    })

    test('should parse ordered list', () => {
      const markdown = `1. First item
2. Second item
3. Third item`

      const result = parseList(markdown)

      expect(result).toHaveLength(3)
      expect(result[0].text).toBe('First item')
      expect(result[0].type).toBe('ordered')
    })
  })

  describe('parseMarkdown (integration)', () => {
    test('should parse complete markdown structure', () => {
      const markdown = `# Project
## Phase 1
- Task 1
- Task 2
## Phase 2
- Task 3`

      const result = parseMarkdown(markdown)

      expect(result.title).toBe('Project')
      expect(result.sections).toHaveLength(2)
      expect(result.sections[0].items).toHaveLength(2)
    })

    test('should handle malformed markdown gracefully', () => {
      const malformed = '# # Invalid ## Header'
      const result = parseMarkdown(malformed)

      expect(result.error).toBeUndefined()
      expect(result.sections).toBeDefined()
    })
  })
})
```

### Testing Organisms (Complex Components)

#### MindMap Component Test
```javascript
// tests/unit/organisms/MindMap.test.js
import MindMap from '../../../src/organisms/MindMap/index.js'

describe('MindMap Component', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  test('should initialize with empty data', () => {
    const mindMap = new MindMap(container)

    expect(mindMap.nodes).toEqual([])
    expect(mindMap.connections).toEqual([])
    expect(mindMap.container).toBe(container)
  })

  test('should render nodes from parsed data', () => {
    const mockData = {
      title: 'Test',
      sections: [
        { title: 'Section 1', items: ['Item 1', 'Item 2'] }
      ]
    }

    const mindMap = new MindMap(container)
    mindMap.loadData(mockData)

    expect(mindMap.nodes.length).toBeGreaterThan(0)
    expect(container.querySelector('.mind-map-node')).toBeTruthy()
  })

  test('should handle zoom operations', () => {
    const mindMap = new MindMap(container)
    const initialZoom = mindMap.zoomLevel

    mindMap.zoomIn()
    expect(mindMap.zoomLevel).toBeGreaterThan(initialZoom)

    mindMap.zoomOut()
    expect(mindMap.zoomLevel).toBe(initialZoom)
  })

  test('should handle pan operations', () => {
    const mindMap = new MindMap(container)
    const initialX = mindMap.panX
    const initialY = mindMap.panY

    mindMap.pan(50, 30)
    expect(mindMap.panX).toBe(initialX + 50)
    expect(mindMap.panY).toBe(initialY + 30)
  })
})
```

## Integration Testing

### Markdown to Mind Map Flow
```javascript
// tests/integration/markdown-to-mindmap.test.js
import { parseMarkdown } from '../../src/utils/markdownParser.js'
import { generateLayout } from '../../src/utils/mindMapGenerator.js'
import MindMap from '../../src/organisms/MindMap/index.js'

describe('Markdown to Mind Map Integration', () => {
  test('should complete full transformation flow', () => {
    const markdown = `# Main Topic
## Subtopic 1
- Point A
- Point B
## Subtopic 2
- Point C
- Point D`

    // Step 1: Parse markdown
    const parsed = parseMarkdown(markdown)
    expect(parsed.title).toBe('Main Topic')
    expect(parsed.sections).toHaveLength(2)

    // Step 2: Generate layout
    const layout = generateLayout(parsed)
    expect(layout.nodes).toBeDefined()
    expect(layout.connections).toBeDefined()

    // Step 3: Render mind map
    const container = document.createElement('div')
    const mindMap = new MindMap(container)
    mindMap.loadData(parsed)

    expect(container.querySelectorAll('.mind-map-node')).toHaveLength(7) // 1 main + 2 sub + 4 points
  })

  test('should handle real-time updates', async () => {
    const container = document.createElement('div')
    const mindMap = new MindMap(container)

    const markdown1 = '# Test'
    mindMap.loadData(parseMarkdown(markdown1))
    expect(container.querySelectorAll('.mind-map-node')).toHaveLength(1)

    const markdown2 = '# Test\n## Subtopic'
    mindMap.loadData(parseMarkdown(markdown2))
    expect(container.querySelectorAll('.mind-map-node')).toHaveLength(2)
  })
})
```

### Theme Switching Integration
```javascript
// tests/integration/theme-switching.test.js
import ThemeManager from '../../src/theme/ThemeManager.js'

describe('Theme Switching Integration', () => {
  let themeManager

  beforeEach(() => {
    themeManager = new ThemeManager()
    document.body.className = ''
  })

  test('should apply theme classes correctly', () => {
    themeManager.setTheme('dark')
    expect(document.body.classList.contains('theme-dark')).toBe(true)

    themeManager.setTheme('blue')
    expect(document.body.classList.contains('theme-blue')).toBe(true)
    expect(document.body.classList.contains('theme-dark')).toBe(false)
  })

  test('should persist theme preference', () => {
    themeManager.setTheme('green')
    expect(localStorage.getItem('preferred-theme')).toBe('green')

    const newThemeManager = new ThemeManager()
    newThemeManager.loadStoredTheme()
    expect(document.body.classList.contains('theme-green')).toBe(true)
  })

  test('should update CSS custom properties', () => {
    themeManager.setTheme('dark')

    const bgColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-bg-primary')

    expect(bgColor.trim()).not.toBe('#ffffff')
  })
})
```

## Visual Testing

### Responsive Design Tests
```javascript
// tests/visual/responsive.test.js
describe('Responsive Design', () => {
  const viewports = [
    { width: 320, height: 568, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1440, height: 900, name: 'desktop' }
  ]

  viewports.forEach(viewport => {
    test(`should render correctly on ${viewport.name}`, () => {
      // Set viewport size
      Object.defineProperty(window, 'innerWidth', { value: viewport.width })
      Object.defineProperty(window, 'innerHeight', { value: viewport.height })

      // Trigger resize event
      window.dispatchEvent(new Event('resize'))

      // Test layout adjustments
      const editorPanel = document.querySelector('.organism-editor-panel')
      const mindMapPanel = document.querySelector('.organism-mind-map')

      if (viewport.width < 768) {
        // Mobile: stacked layout
        expect(editorPanel.style.display).not.toBe('none')
        expect(mindMapPanel.style.display).not.toBe('none')
      } else {
        // Tablet/Desktop: side-by-side
        const computedStyle = getComputedStyle(editorPanel)
        expect(parseFloat(computedStyle.width)).toBeLessThan(viewport.width)
      }
    })
  })
})
```

## Accessibility Testing

### A11y Tests
```javascript
// tests/accessibility/accessibility.test.js
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Accessibility', () => {
  test('should have no accessibility violations', async () => {
    const container = document.createElement('div')
    container.innerHTML = `
      <div class="app">
        <header class="organism-header">
          <h1>mark2</h1>
          <button>Theme</button>
        </header>
        <main class="template-app-layout">
          <div class="organism-editor-panel">
            <textarea aria-label="Markdown editor"></textarea>
          </div>
          <div class="organism-mind-map" aria-label="Mind map visualization">
            <svg></svg>
          </div>
        </main>
      </div>
    `

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('should support keyboard navigation', () => {
    const button = document.createElement('button')
    button.textContent = 'Test Button'
    document.body.appendChild(button)

    button.focus()
    expect(document.activeElement).toBe(button)

    // Test Enter key
    const mockHandler = jest.fn()
    button.addEventListener('click', mockHandler)
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))

    document.body.removeChild(button)
  })

  test('should have proper ARIA attributes', () => {
    const mindMap = document.createElement('div')
    mindMap.setAttribute('role', 'img')
    mindMap.setAttribute('aria-label', 'Interactive mind map')

    expect(mindMap.getAttribute('role')).toBe('img')
    expect(mindMap.getAttribute('aria-label')).toBe('Interactive mind map')
  })
})
```

## Performance Testing

### Load Time Tests
```javascript
// tests/performance/load-time.test.js
describe('Performance', () => {
  test('should render initial UI within acceptable time', async () => {
    const startTime = performance.now()

    // Simulate app initialization
    const app = new App()
    await app.initialize()

    const endTime = performance.now()
    const loadTime = endTime - startTime

    expect(loadTime).toBeLessThan(1000) // Should load within 1 second
  })

  test('should handle large markdown files efficiently', () => {
    const largeMd = '# '.repeat(1000) + 'Header\n'.repeat(1000)

    const startTime = performance.now()
    const result = parseMarkdown(largeMd)
    const endTime = performance.now()

    expect(endTime - startTime).toBeLessThan(500) // Parse within 500ms
    expect(result.sections.length).toBeGreaterThan(0)
  })
})
```

## Running Tests

### Commands
```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only
npm run test:visual         # Visual tests only
npm run test:a11y          # Accessibility tests only

# Watch mode during development
npm run test:watch

# Coverage report
npm run test:coverage

# Debug mode
npm run test:debug
```

### CI/CD Integration
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm ci
      - run: npm run lint
      - run: npm run test:coverage
      - run: npm run test:a11y

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Best Practices

### Writing Good Tests
1. **Arrange, Act, Assert**: Structure tests clearly
2. **Single Responsibility**: One assertion per test when possible
3. **Descriptive Names**: Test names should explain what they verify
4. **Mock Dependencies**: Isolate units under test
5. **Test Edge Cases**: Empty inputs, errors, boundary conditions

### Test Maintenance
1. **Keep Tests Fast**: Unit tests should run in milliseconds
2. **Avoid Test Pollution**: Clean up after each test
3. **Update Tests with Code**: Tests are documentation
4. **Review Coverage**: Aim for high coverage but focus on critical paths

### Common Pitfalls
- Testing implementation details instead of behavior
- Forgetting to test error conditions
- Not testing user interactions
- Ignoring accessibility in tests
- Flaky tests due to timing issues

## Contributing

When contributing tests:
1. Follow the established patterns
2. Ensure new features have corresponding tests
3. Run the full test suite before submitting
4. Update this guide if adding new test categories
5. Include performance considerations for large features

Happy testing! 🧪