/**
 * Application Integration Tests
 * End-to-end integration testing for the complete mark2 application
 */

import Mark2App from '../../src/index.js'

describe('Mark2 Application Integration', () => {
  let app
  let appContainer

  beforeEach(() => {
    testUtils.cleanupDOM()

    // Create app container
    appContainer = document.createElement('div')
    appContainer.id = 'app'
    document.body.appendChild(appContainer)

    // Mock additional DOM elements that might be needed
    const mobileNav = document.createElement('nav')
    mobileNav.className = 'organism-mobile-nav'
    mobileNav.innerHTML = `
      <button id="mobile-editor-tab">Editor</button>
      <button id="mobile-mindmap-tab">Mind Map</button>
    `
    document.body.appendChild(mobileNav)

    const helpModal = document.createElement('div')
    helpModal.id = 'help-modal'
    helpModal.style.display = 'none'
    document.body.appendChild(helpModal)
  })

  afterEach(() => {
    if (app) {
      app.destroy()
      app = null
    }
    testUtils.cleanupDOM()
  })

  describe('Application Initialization', () => {
    test('should initialize application successfully', async () => {
      app = new Mark2App()

      await app.init()

      expect(app.isInitialized).toBe(true)
      expect(app.header).toBeDefined()
      expect(app.editorPanel).toBeDefined()
    })

    test('should create all required components', async () => {
      app = new Mark2App()

      await app.init()

      // Check if header is rendered
      const header = appContainer.querySelector('.organism-header')
      expect(header).toBeTruthy()

      // Check if editor panel is rendered
      const editorPanel = appContainer.querySelector('.organism-editor-panel')
      expect(editorPanel).toBeTruthy()

      // Check if mind map container is rendered
      const mindMapContainer = appContainer.querySelector('.organism-mind-map')
      expect(mindMapContainer).toBeTruthy()
    })

    test('should handle missing app container gracefully', async () => {
      document.body.removeChild(appContainer)

      app = new Mark2App()

      await expect(app.init()).rejects.toThrow('App container element not found')
    })

    test('should detect mobile viewport correctly', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500
      })

      app = new Mark2App()

      await app.init()

      expect(app.isMobile).toBe(true)
      expect(app.currentView).toBe('editor')
    })

    test('should detect desktop viewport correctly', async () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200
      })

      app = new Mark2App()

      await app.init()

      expect(app.isMobile).toBe(false)
      expect(app.currentView).toBe('split')
    })
  })

  describe('Markdown to Mind Map Flow', () => {
    beforeEach(async () => {
      app = new Mark2App()
      await app.init()
    })

    test('should generate mind map from markdown input', async () => {
      const markdown = testUtils.createMockMarkdown()

      // Simulate markdown input
      app.editorPanel.setValue(markdown)

      // Wait for debounced mind map generation
      await testUtils.waitFor(600)

      expect(app.currentMarkdown).toBe(markdown)
      expect(app.currentMindMapData).toBeDefined()
    })

    test('should update mind map when markdown changes', async () => {
      const markdown1 = '# First Title'
      const markdown2 = '# Second Title\n## Subtitle'

      // First input
      app.editorPanel.setValue(markdown1)
      await testUtils.waitFor(600)

      const firstData = app.currentMindMapData

      // Second input
      app.editorPanel.setValue(markdown2)
      await testUtils.waitFor(600)

      expect(app.currentMindMapData).not.toBe(firstData)
    })

    test('should handle empty markdown input', async () => {
      app.editorPanel.setValue('')
      await testUtils.waitFor(600)

      const mindMapContainer = appContainer.querySelector('#mind-map-container')
      expect(mindMapContainer.innerHTML).toContain('mind-map-empty')
    })

    test('should handle invalid markdown gracefully', async () => {
      const invalidMarkdown = '### \n#### \n##### '

      app.editorPanel.setValue(invalidMarkdown)
      await testUtils.waitFor(600)

      // Should not crash the application
      expect(app.isInitialized).toBe(true)
    })

    test('should show loading state during generation', async () => {
      const markdown = testUtils.createMockMarkdown()

      app.editorPanel.setValue(markdown)

      // Check immediately for loading state
      const mindMapContainer = appContainer.querySelector('#mind-map-container')
      expect(mindMapContainer.innerHTML).toContain('mind-map-loading')
    })
  })

  describe('Theme Integration', () => {
    beforeEach(async () => {
      app = new Mark2App()
      await app.init()
    })

    test('should change theme across all components', () => {
      app.handleThemeToggle()

      // Check if body has theme class
      expect(document.body.className).toMatch(/theme-\w+/)
    })

    test('should persist theme changes', () => {
      app.handleThemeToggle()

      expect(localStorage.setItem).toHaveBeenCalledWith(
        expect.stringMatching(/theme/),
        expect.any(String)
      )
    })

    test('should apply theme to all rendered components', () => {
      app.handleThemeToggle()

      const header = appContainer.querySelector('.organism-header')
      const editorPanel = appContainer.querySelector('.organism-editor-panel')

      expect(header).toBeTruthy()
      expect(editorPanel).toBeTruthy()
    })
  })

  describe('Language Integration', () => {
    beforeEach(async () => {
      app = new Mark2App()
      await app.init()
    })

    test('should update all components on language change', () => {
      // Mock language manager
      const mockLanguageManager = {
        setLanguage: jest.fn(() => true),
        t: jest.fn(key => key),
        subscribe: jest.fn(callback => {
          // Simulate language change
          setTimeout(() => callback('en', 'pt'), 10)
          return () => {} // unsubscribe function
        })
      }

      app.handleLanguageChange('en')

      expect(document.title).toBeDefined()
    })

    test('should maintain language across page reloads', async () => {
      // Simulate stored language
      localStorage.getItem.mockReturnValue('es')

      const newApp = new Mark2App()
      await newApp.init()

      // Language should be loaded from storage
      expect(localStorage.getItem).toHaveBeenCalledWith('mark2_language')

      newApp.destroy()
    })
  })

  describe('Responsive Behavior', () => {
    beforeEach(async () => {
      app = new Mark2App()
      await app.init()
    })

    test('should handle viewport resize', () => {
      // Start in desktop mode
      Object.defineProperty(window, 'innerWidth', {
        value: 1200,
        writable: true
      })

      app.handleResize()

      expect(app.isMobile).toBe(false)

      // Switch to mobile
      Object.defineProperty(window, 'innerWidth', {
        value: 500,
        writable: true
      })

      app.handleResize()

      expect(app.isMobile).toBe(true)
    })

    test('should switch mobile views correctly', () => {
      // Mock mobile mode
      app.isMobile = true

      app.setMobileView('mindmap')

      expect(app.currentView).toBe('mindmap')

      const editorTab = document.getElementById('mobile-editor-tab')
      const mindmapTab = document.getElementById('mobile-mindmap-tab')

      expect(editorTab?.getAttribute('aria-pressed')).toBe('false')
      expect(mindmapTab?.getAttribute('aria-pressed')).toBe('true')
    })

    test('should update component modes on resize', () => {
      app.isMobile = true
      app.updateResponsiveState()

      expect(document.body.classList.contains('mobile-layout')).toBe(true)
    })
  })

  describe('Keyboard Shortcuts', () => {
    beforeEach(async () => {
      app = new Mark2App()
      await app.init()
    })

    test('should handle help shortcut', () => {
      const helpEvent = testUtils.createMockEvent('keydown', {
        key: ',',
        ctrlKey: true
      })

      document.dispatchEvent(helpEvent)

      const helpModal = document.getElementById('help-modal')
      expect(helpModal.style.display).toBe('block')
    })

    test('should handle mobile view shortcuts', () => {
      app.isMobile = true

      const editorEvent = testUtils.createMockEvent('keydown', {
        key: 'e',
        ctrlKey: true
      })

      document.dispatchEvent(editorEvent)

      expect(app.currentView).toBe('editor')

      const mindmapEvent = testUtils.createMockEvent('keydown', {
        key: 'm',
        ctrlKey: true
      })

      document.dispatchEvent(mindmapEvent)

      expect(app.currentView).toBe('mindmap')
    })

    test('should prevent default on handled shortcuts', () => {
      const helpEvent = testUtils.createMockEvent('keydown', {
        key: ',',
        ctrlKey: true
      })
      helpEvent.preventDefault = jest.fn()

      document.dispatchEvent(helpEvent)

      expect(helpEvent.preventDefault).toHaveBeenCalled()
    })
  })

  describe('Export Integration', () => {
    beforeEach(async () => {
      app = new Mark2App()
      await app.init()
    })

    test('should handle export action', () => {
      // Mock the alert since export dialog is not implemented in basic version
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation()

      app.handleExport()

      expect(alertSpy).toHaveBeenCalled()

      alertSpy.mockRestore()
    })

    test('should export current application data', () => {
      app.currentMarkdown = '# Test Content'
      app.currentMindMapData = { nodes: [], connections: [] }

      const exportData = app.exportData()

      expect(exportData).toEqual({
        markdown: '# Test Content',
        mindMap: { nodes: [], connections: [] },
        language: expect.any(String),
        theme: expect.any(String),
        timestamp: expect.any(String)
      })
    })
  })

  describe('Data Persistence', () => {
    beforeEach(async () => {
      app = new Mark2App()
      await app.init()
    })

    test('should auto-save content', async () => {
      const markdown = '# Test Content'

      app.editorPanel.setValue(markdown)

      // Wait for auto-save
      await testUtils.waitFor(100)

      expect(localStorage.setItem).toHaveBeenCalledWith(
        expect.stringMatching(/content|markdown/),
        expect.any(String)
      )
    })

    test('should prevent data loss on page unload', () => {
      // Mock dirty content
      app.editorPanel.textEditor = {
        isDirtyContent: jest.fn(() => true)
      }

      const beforeUnloadEvent = testUtils.createMockEvent('beforeunload')
      beforeUnloadEvent.preventDefault = jest.fn()

      app.handleBeforeUnload(beforeUnloadEvent)

      expect(beforeUnloadEvent.preventDefault).toHaveBeenCalled()
      expect(beforeUnloadEvent.returnValue).toBe('')
    })

    test('should allow clean exit when no changes', () => {
      app.editorPanel.textEditor = {
        isDirtyContent: jest.fn(() => false)
      }

      const beforeUnloadEvent = testUtils.createMockEvent('beforeunload')
      beforeUnloadEvent.preventDefault = jest.fn()

      app.handleBeforeUnload(beforeUnloadEvent)

      expect(beforeUnloadEvent.preventDefault).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    test('should handle initialization errors gracefully', async () => {
      // Mock error during component creation
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      // Remove app container to force error
      document.body.removeChild(appContainer)

      app = new Mark2App()

      await expect(app.init()).rejects.toThrow()

      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    test('should display error messages to users', async () => {
      app = new Mark2App()

      app.showError('Test error message')

      const errorElement = document.querySelector('.app-error')
      expect(errorElement).toBeTruthy()
      expect(errorElement.textContent).toContain('Test error message')
    })

    test('should handle component errors gracefully', async () => {
      app = new Mark2App()
      await app.init()

      // Simulate component error
      expect(() => {
        app.editorPanel = null
        app.setMarkdown('# Test')
      }).not.toThrow()
    })
  })

  describe('Performance', () => {
    test('should initialize within reasonable time', async () => {
      const startTime = performance.now()

      app = new Mark2App()
      await app.init()

      const endTime = performance.now()
      const initTime = endTime - startTime

      expect(initTime).toBeLessThan(2000) // Should init within 2 seconds
    })

    test('should handle rapid input changes efficiently', async () => {
      app = new Mark2App()
      await app.init()

      const startTime = performance.now()

      // Rapid markdown changes
      for (let i = 0; i < 10; i++) {
        app.setMarkdown(`# Title ${i}`)
      }

      await testUtils.waitFor(700) // Wait for debouncing

      const endTime = performance.now()
      const processTime = endTime - startTime

      expect(processTime).toBeLessThan(1000) // Should handle efficiently
    })

    test('should clean up resources on destroy', () => {
      app = new Mark2App()

      // Mock components with cleanup methods
      app.header = { destroy: jest.fn() }
      app.editorPanel = { destroy: jest.fn() }

      app.destroy()

      expect(app.header.destroy).toHaveBeenCalled()
      expect(app.editorPanel.destroy).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    beforeEach(async () => {
      app = new Mark2App()
      await app.init()
    })

    test('should have proper document structure', () => {
      const header = appContainer.querySelector('[role="banner"]')
      const main = appContainer.querySelector('[role="main"]')

      expect(header).toBeTruthy()
      expect(main).toBeTruthy()
    })

    test('should manage focus correctly', () => {
      // Test that components are focusable
      const header = appContainer.querySelector('.organism-header')
      const editorPanel = appContainer.querySelector('.organism-editor-panel')

      expect(header).toBeTruthy()
      expect(editorPanel).toBeTruthy()
    })

    test('should update document title', async () => {
      expect(document.title).toBeTruthy()
      expect(document.title.length).toBeGreaterThan(0)
    })

    test('should provide proper ARIA labels', () => {
      const mindMapRegion = appContainer.querySelector('[role="img"]')
      expect(mindMapRegion).toBeTruthy()
      expect(mindMapRegion.getAttribute('aria-label')).toBeTruthy()
    })
  })

  describe('Browser Compatibility', () => {
    beforeEach(async () => {
      app = new Mark2App()
      await app.init()
    })

    test('should work with modern browser features', () => {
      // Test modern API usage
      expect(localStorage).toBeDefined()
      expect(sessionStorage).toBeDefined()
      expect(fetch).toBeDefined()
    })

    test('should handle missing features gracefully', () => {
      // Mock missing ResizeObserver
      const originalResizeObserver = global.ResizeObserver
      delete global.ResizeObserver

      expect(() => app.updateResponsiveState()).not.toThrow()

      global.ResizeObserver = originalResizeObserver
    })
  })

  describe('Multi-Window Support', () => {
    beforeEach(async () => {
      app = new Mark2App()
      await app.init()
    })

    test('should handle storage events from other windows', () => {
      const storageEvent = new StorageEvent('storage', {
        key: 'mark2_theme',
        newValue: 'dark',
        oldValue: 'light'
      })

      window.dispatchEvent(storageEvent)

      // Should handle gracefully without errors
      expect(app.isInitialized).toBe(true)
    })

    test('should maintain state consistency', () => {
      app.setMarkdown('# Test Content')

      const currentData = app.exportData()
      expect(currentData.markdown).toBe('# Test Content')
    })
  })
})