/**
 * Test Setup and Configuration
 * Global test setup for Jest testing environment
 */

// Mock DOM environment for Node.js testing
import { JSDOM } from 'jsdom'

// Setup DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
})

global.window = dom.window
global.document = dom.window.document
global.navigator = dom.window.navigator
global.HTMLElement = dom.window.HTMLElement
global.HTMLCanvasElement = dom.window.HTMLCanvasElement
global.SVGElement = dom.window.SVGElement
global.Event = dom.window.Event
global.CustomEvent = dom.window.CustomEvent
global.getComputedStyle = dom.window.getComputedStyle
global.requestAnimationFrame = (callback) => setTimeout(callback, 16)
global.cancelAnimationFrame = clearTimeout

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
)

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = jest.fn()

// Mock File and FileReader
global.File = class File {
  constructor(content, name, options = {}) {
    this.content = content
    this.name = name
    this.type = options.type || 'text/plain'
    this.size = content.length
    this.lastModified = Date.now()
  }
}

global.FileReader = class FileReader {
  constructor() {
    this.readyState = 0
    this.result = null
    this.error = null
    this.onload = null
    this.onerror = null
  }

  readAsText(file) {
    setTimeout(() => {
      this.readyState = 2
      this.result = typeof file.content === 'string' ? file.content : file.content.toString()
      if (this.onload) this.onload({ target: this })
    }, 10)
  }

  readAsDataURL(file) {
    setTimeout(() => {
      this.readyState = 2
      this.result = `data:${file.type};base64,${btoa(file.content)}`
      if (this.onload) this.onload({ target: this })
    }, 10)
  }
}

// Mock Canvas API
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => ({ data: new Array(4) })),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
  toDataURL: jest.fn(() => 'data:image/png;base64,mock'),
  toBlob: jest.fn((callback) => callback(new Blob(['mock'], { type: 'image/png' }))),
}))

// Mock SVG methods
global.SVGElement.prototype.getBBox = jest.fn(() => ({
  x: 0,
  y: 0,
  width: 100,
  height: 100
}))

global.SVGElement.prototype.getScreenCTM = jest.fn(() => ({
  a: 1, b: 0, c: 0, d: 1, e: 0, f: 0
}))

// Mock Image constructor
global.Image = class Image {
  constructor() {
    this.onload = null
    this.onerror = null
    this.src = ''
    this.width = 0
    this.height = 0
  }

  set src(value) {
    this._src = value
    setTimeout(() => {
      this.width = 100
      this.height = 100
      if (this.onload) this.onload()
    }, 10)
  }

  get src() {
    return this._src
  }
}

// Mock console methods for cleaner test output
const originalConsole = global.console
global.console = {
  ...originalConsole,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}

// Restore console for debugging when needed
global.console.restore = () => {
  global.console = originalConsole
}

// Global test utilities
global.testUtils = {
  // Wait for async operations
  waitFor: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)),

  // Create mock event
  createMockEvent: (type, properties = {}) => {
    const event = new Event(type, { bubbles: true, cancelable: true })
    Object.assign(event, properties)
    return event
  },

  // Create mock markdown content
  createMockMarkdown: () => `# Test Title
## Section 1
- Item 1
- Item 2

## Section 2
- Item A
- Item B`,

  // Create mock DOM element
  createMockElement: (tag = 'div', attributes = {}) => {
    const element = document.createElement(tag)
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value)
    })
    return element
  },

  // Clean up DOM after tests
  cleanupDOM: () => {
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  }
}

// Setup before each test
beforeEach(() => {
  // Reset mocks
  jest.clearAllMocks()
  localStorageMock.getItem.mockReturnValue(null)
  localStorageMock.setItem.mockImplementation()
  localStorageMock.removeItem.mockImplementation()
  localStorageMock.clear.mockImplementation()

  // Clean DOM
  global.testUtils.cleanupDOM()
})

// Cleanup after each test
afterEach(() => {
  // Additional cleanup if needed
  global.testUtils.cleanupDOM()
})

export default global