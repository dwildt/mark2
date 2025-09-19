/**
 * Test Setup and Configuration
 * Global test setup for Jest testing environment
 */

// Mock DOM environment for Node.js testing
import { JSDOM } from 'jsdom'
import { vi } from 'vitest'

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
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock fetch API
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
)

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = vi.fn()

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
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Array(4) })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => ({ data: new Array(4) })),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
  toDataURL: vi.fn(() => 'data:image/png;base64,mock'),
  toBlob: vi.fn((callback) => callback(new Blob(['mock'], { type: 'image/png' }))),
}))

// Mock SVG methods
global.SVGElement.prototype.getBBox = vi.fn(() => ({
  x: 0,
  y: 0,
  width: 100,
  height: 100
}))

global.SVGElement.prototype.getScreenCTM = vi.fn(() => ({
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
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
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
  vi.clearAllMocks()
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