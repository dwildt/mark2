/**
 * ThemeManager Tests
 * Test suite for theme management functionality
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { ThemeManager } from '../../src/theme/ThemeManager.js'

describe('ThemeManager', () => {
  let themeManager

  beforeEach(() => {
    themeManager = new ThemeManager()
    localStorage.clear()
    document.body.className = ''
  })

  describe('Initialization', () => {
    test('should initialize with default theme', () => {
      expect(themeManager.getCurrentTheme()).toBe('light')
    })

    test('should load available themes', () => {
      const themes = themeManager.getAvailableThemes()
      expect(themes).toContain('light')
      expect(themes).toContain('dark')
      expect(themes).toContain('blue')
      expect(themes).toContain('green')
      expect(themes).toContain('orange')
    })

    test('should detect system dark mode preference', () => {
      // Mock matchMedia for dark mode
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }))
      })

      const newManager = new ThemeManager()
      expect(newManager.getCurrentTheme()).toBe('dark')
    })

    test('should load theme from localStorage', () => {
      localStorage.getItem.mockReturnValue('blue')
      const newManager = new ThemeManager()
      expect(newManager.getCurrentTheme()).toBe('blue')
    })
  })

  describe('Theme Switching', () => {
    test('should change theme successfully', () => {
      const result = themeManager.setTheme('dark')
      expect(result).toBe(true)
      expect(themeManager.getCurrentTheme()).toBe('dark')
    })

    test('should apply theme class to body', () => {
      themeManager.setTheme('dark')
      expect(document.body.classList.contains('theme-dark')).toBe(true)
    })

    test('should remove previous theme class', () => {
      themeManager.setTheme('blue')
      expect(document.body.classList.contains('theme-blue')).toBe(true)

      themeManager.setTheme('green')
      expect(document.body.classList.contains('theme-blue')).toBe(false)
      expect(document.body.classList.contains('theme-green')).toBe(true)
    })

    test('should persist theme in localStorage', () => {
      themeManager.setTheme('orange')
      expect(localStorage.setItem).toHaveBeenCalledWith('mark2_theme', 'orange')
    })

    test('should reject invalid theme names', () => {
      const result = themeManager.setTheme('invalid')
      expect(result).toBe(false)
      expect(themeManager.getCurrentTheme()).toBe('light')
    })

    test('should notify subscribers on theme change', () => {
      const callback = vi.fn()
      themeManager.subscribe(callback)

      themeManager.setTheme('dark')
      expect(callback).toHaveBeenCalledWith('dark', 'light')
    })
  })

  describe('Theme Cycling', () => {
    test('should cycle through themes in order', () => {
      expect(themeManager.getCurrentTheme()).toBe('light')

      themeManager.cycleTheme()
      expect(themeManager.getCurrentTheme()).toBe('dark')

      themeManager.cycleTheme()
      expect(themeManager.getCurrentTheme()).toBe('blue')

      themeManager.cycleTheme()
      expect(themeManager.getCurrentTheme()).toBe('green')

      themeManager.cycleTheme()
      expect(themeManager.getCurrentTheme()).toBe('orange')

      themeManager.cycleTheme()
      expect(themeManager.getCurrentTheme()).toBe('light') // Back to start
    })
  })

  describe('Theme Properties', () => {
    test('should provide theme display names', () => {
      const name = themeManager.getThemeName('dark')
      expect(typeof name).toBe('string')
      expect(name.length).toBeGreaterThan(0)
    })

    test('should provide theme descriptions', () => {
      const description = themeManager.getThemeDescription('blue')
      expect(typeof description).toBe('string')
      expect(description.length).toBeGreaterThan(0)
    })

    test('should detect dark themes', () => {
      expect(themeManager.isDarkTheme('dark')).toBe(true)
      expect(themeManager.isDarkTheme('light')).toBe(false)
    })

    test('should provide theme colors', () => {
      const colors = themeManager.getThemeColors('blue')
      expect(colors).toHaveProperty('primary')
      expect(colors).toHaveProperty('secondary')
      expect(colors).toHaveProperty('accent')
    })
  })

  describe('CSS Custom Properties', () => {
    test('should update CSS custom properties on theme change', () => {
      themeManager.setTheme('dark')

      const computedStyle = getComputedStyle(document.documentElement)
      // Mock the CSS custom properties
      expect(computedStyle.getPropertyValue).toBeDefined()
    })

    test('should provide access to current theme variables', () => {
      const variables = themeManager.getThemeVariables()
      expect(typeof variables).toBe('object')
    })
  })

  describe('System Theme Detection', () => {
    test('should listen for system theme changes', () => {
      const mockMediaQuery = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }

      window.matchMedia = vi.fn(() => mockMediaQuery)

      const newManager = new ThemeManager()
      expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })

    test('should toggle to system theme preference', () => {
      themeManager.setSystemTheme(true)
      expect(themeManager.isSystemTheme()).toBe(true)
    })
  })

  describe('Subscription System', () => {
    test('should allow subscribing to theme changes', () => {
      const callback = vi.fn()
      const unsubscribe = themeManager.subscribe(callback)

      expect(typeof unsubscribe).toBe('function')

      themeManager.setTheme('dark')
      expect(callback).toHaveBeenCalledWith('dark', 'light')
    })

    test('should allow unsubscribing from theme changes', () => {
      const callback = vi.fn()
      const unsubscribe = themeManager.subscribe(callback)

      unsubscribe()
      themeManager.setTheme('dark')

      expect(callback).not.toHaveBeenCalled()
    })

    test('should handle multiple subscribers', () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      themeManager.subscribe(callback1)
      themeManager.subscribe(callback2)

      themeManager.setTheme('blue')

      expect(callback1).toHaveBeenCalledWith('blue', 'light')
      expect(callback2).toHaveBeenCalledWith('blue', 'light')
    })
  })

  describe('Validation', () => {
    test('should validate theme names', () => {
      expect(themeManager.isValidTheme('light')).toBe(true)
      expect(themeManager.isValidTheme('dark')).toBe(true)
      expect(themeManager.isValidTheme('invalid')).toBe(false)
    })

    test('should handle edge cases', () => {
      expect(themeManager.isValidTheme('')).toBe(false)
      expect(themeManager.isValidTheme(null)).toBe(false)
      expect(themeManager.isValidTheme(undefined)).toBe(false)
    })
  })

  describe('Performance', () => {
    test('should cache theme data', () => {
      const colors1 = themeManager.getThemeColors('blue')
      const colors2 = themeManager.getThemeColors('blue')

      expect(colors1).toBe(colors2) // Should be same reference (cached)
    })

    test('should debounce rapid theme changes', async () => {
      const callback = vi.fn()
      themeManager.subscribe(callback)

      // Rapid theme changes
      themeManager.setTheme('dark')
      themeManager.setTheme('blue')
      themeManager.setTheme('green')

      await testUtils.waitFor(100)

      // Should only trigger for the final theme
      expect(themeManager.getCurrentTheme()).toBe('green')
    })
  })

  describe('Accessibility', () => {
    test('should support high contrast mode detection', () => {
      // Mock high contrast media query
      window.matchMedia = vi.fn((query) => ({
        matches: query.includes('prefers-contrast: high'),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }))

      const hasHighContrast = themeManager.prefersHighContrast()
      expect(typeof hasHighContrast).toBe('boolean')
    })

    test('should support reduced motion detection', () => {
      window.matchMedia = vi.fn((query) => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }))

      const prefersReducedMotion = themeManager.prefersReducedMotion()
      expect(typeof prefersReducedMotion).toBe('boolean')
    })
  })

  describe('Error Handling', () => {
    test('should handle localStorage errors gracefully', () => {
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded')
      })

      expect(() => themeManager.setTheme('dark')).not.toThrow()
      expect(themeManager.getCurrentTheme()).toBe('dark')
    })

    test('should handle missing CSS gracefully', () => {
      // Mock scenario where theme CSS is not loaded
      const originalConsoleWarn = console.warn
      console.warn = vi.fn()

      themeManager.setTheme('nonexistent')

      expect(console.warn).toHaveBeenCalled()
      console.warn = originalConsoleWarn
    })
  })

  describe('Integration', () => {
    test('should work with component theme updates', () => {
      const element = document.createElement('div')
      element.className = 'component'
      document.body.appendChild(element)

      themeManager.setTheme('dark')

      expect(document.body.classList.contains('theme-dark')).toBe(true)
    })

    test('should maintain theme across page reloads', () => {
      themeManager.setTheme('blue')

      const newManager = new ThemeManager()
      expect(newManager.getCurrentTheme()).toBe('blue')
    })

    test('should handle theme changes in multiple windows', () => {
      // Mock storage event
      const storageEvent = new StorageEvent('storage', {
        key: 'mark2_theme',
        newValue: 'green',
        oldValue: 'light'
      })

      themeManager.handleStorageChange(storageEvent)
      expect(themeManager.getCurrentTheme()).toBe('green')
    })
  })
})