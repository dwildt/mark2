/**
 * Button Atom Tests
 * Test suite for Button component functionality
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import Button from '../../src/atoms/Button/index.js'

describe('Button Atom', () => {
  let button

  beforeEach(() => {
    testUtils.cleanupDOM()
  })

  afterEach(() => {
    if (button) {
      button.destroy()
      button = null
    }
  })

  describe('Initialization', () => {
    test('should create button with default properties', () => {
      button = new Button('Test Button')
      const element = button.render()

      expect(element.tagName).toBe('BUTTON')
      expect(element.textContent).toBe('Test Button')
      expect(element.className).toContain('atom-button')
      expect(element.className).toContain('atom-button--primary')
    })

    test('should create button with custom variant', () => {
      button = new Button('Test', null, 'secondary')
      const element = button.render()

      expect(element.className).toContain('atom-button--secondary')
    })

    test('should create disabled button', () => {
      button = new Button('Test', null, 'primary', true)
      const element = button.render()

      expect(element.disabled).toBe(true)
      expect(element.className).toContain('atom-button--disabled')
    })

    test('should create button with icon', () => {
      button = new Button('Test', null, 'primary', false, '📁')
      const element = button.render()

      const icon = element.querySelector('.atom-button__icon')
      expect(icon).toBeTruthy()
      expect(icon.textContent).toBe('📁')
    })
  })

  describe('Event Handling', () => {
    test('should handle click events', () => {
      const clickHandler = vi.fn()
      button = new Button('Test', clickHandler)
      const element = button.render()

      element.click()
      expect(clickHandler).toHaveBeenCalledTimes(1)
    })

    test('should not trigger click when disabled', () => {
      const clickHandler = vi.fn()
      button = new Button('Test', clickHandler, 'primary', true)
      const element = button.render()

      element.click()
      expect(clickHandler).not.toHaveBeenCalled()
    })

    test('should handle keyboard events', () => {
      const clickHandler = vi.fn()
      button = new Button('Test', clickHandler)
      const element = button.render()

      const enterEvent = testUtils.createMockEvent('keydown', { key: 'Enter' })
      element.dispatchEvent(enterEvent)
      expect(clickHandler).toHaveBeenCalledTimes(1)

      const spaceEvent = testUtils.createMockEvent('keydown', { key: ' ' })
      element.dispatchEvent(spaceEvent)
      expect(clickHandler).toHaveBeenCalledTimes(2)
    })

    test('should prevent default on space key', () => {
      button = new Button('Test', vi.fn())
      const element = button.render()

      const spaceEvent = testUtils.createMockEvent('keydown', { key: ' ' })
      spaceEvent.preventDefault = vi.fn()

      element.dispatchEvent(spaceEvent)
      expect(spaceEvent.preventDefault).toHaveBeenCalled()
    })
  })

  describe('State Management', () => {
    beforeEach(() => {
      button = new Button('Test', vi.fn())
    })

    test('should enable/disable button', () => {
      const element = button.render()

      button.setDisabled(true)
      expect(element.disabled).toBe(true)
      expect(element.className).toContain('atom-button--disabled')

      button.setDisabled(false)
      expect(element.disabled).toBe(false)
      expect(element.className).not.toContain('atom-button--disabled')
    })

    test('should change button text', () => {
      const element = button.render()

      button.setText('New Text')
      const textSpan = element.querySelector('.atom-button__text')
      expect(textSpan.textContent).toBe('New Text')
    })

    test('should change button variant', () => {
      const element = button.render()

      button.setVariant('secondary')
      expect(element.className).toContain('atom-button--secondary')
      expect(element.className).not.toContain('atom-button--primary')
    })

    test('should set loading state', () => {
      const element = button.render()

      button.setLoading(true)
      expect(element.className).toContain('atom-button--loading')
      expect(element.disabled).toBe(true)

      const spinner = element.querySelector('.atom-button__spinner')
      expect(spinner).toBeTruthy()
    })

    test('should clear loading state', () => {
      const element = button.render()

      button.setLoading(true)
      button.setLoading(false)

      expect(element.className).not.toContain('atom-button--loading')
      expect(element.disabled).toBe(false)

      const spinner = element.querySelector('.atom-button__spinner')
      expect(spinner).toBeFalsy()
    })
  })

  describe('Icon Handling', () => {
    test('should add icon to button', () => {
      button = new Button('Test', vi.fn())
      const element = button.render()

      button.setIcon('🎨')
      const icon = element.querySelector('.atom-button__icon')
      expect(icon).toBeTruthy()
      expect(icon.textContent).toBe('🎨')
    })

    test('should remove icon from button', () => {
      button = new Button('Test', vi.fn(), 'primary', false, '📁')
      const element = button.render()

      button.setIcon(null)
      const icon = element.querySelector('.atom-button__icon')
      expect(icon).toBeFalsy()
    })

    test('should update existing icon', () => {
      button = new Button('Test', vi.fn(), 'primary', false, '📁')
      const element = button.render()

      button.setIcon('🎨')
      const icon = element.querySelector('.atom-button__icon')
      expect(icon.textContent).toBe('🎨')
    })
  })

  describe('Accessibility', () => {
    test('should have proper ARIA attributes', () => {
      button = new Button('Test Button', vi.fn())
      const element = button.render()

      expect(element.getAttribute('role')).toBe('button')
      expect(element.getAttribute('tabindex')).toBe('0')
    })

    test('should support aria-label', () => {
      button = new Button('Test', vi.fn())
      const element = button.render()

      button.setAriaLabel('Custom Label')
      expect(element.getAttribute('aria-label')).toBe('Custom Label')
    })

    test('should support aria-described-by', () => {
      button = new Button('Test', vi.fn())
      const element = button.render()

      button.setAriaDescribedBy('description-id')
      expect(element.getAttribute('aria-describedby')).toBe('description-id')
    })

    test('should indicate loading state for screen readers', () => {
      button = new Button('Test', vi.fn())
      const element = button.render()

      button.setLoading(true)
      expect(element.getAttribute('aria-busy')).toBe('true')

      button.setLoading(false)
      expect(element.getAttribute('aria-busy')).toBe('false')
    })

    test('should be focusable when enabled', () => {
      button = new Button('Test', vi.fn())
      const element = button.render()

      expect(element.tabIndex).toBe(0)
    })

    test('should not be focusable when disabled', () => {
      button = new Button('Test', vi.fn(), 'primary', true)
      const element = button.render()

      expect(element.tabIndex).toBe(-1)
    })
  })

  describe('CSS Classes', () => {
    test('should apply size classes', () => {
      button = new Button('Test', vi.fn())
      const element = button.render()

      button.setSize('small')
      expect(element.className).toContain('atom-button--small')

      button.setSize('large')
      expect(element.className).toContain('atom-button--large')
      expect(element.className).not.toContain('atom-button--small')
    })

    test('should apply custom CSS classes', () => {
      button = new Button('Test', vi.fn())
      const element = button.render()

      button.addClass('custom-class')
      expect(element.className).toContain('custom-class')

      button.removeClass('custom-class')
      expect(element.className).not.toContain('custom-class')
    })

    test('should maintain base classes', () => {
      button = new Button('Test', vi.fn())
      const element = button.render()

      button.addClass('custom')
      button.removeClass('custom')

      expect(element.className).toContain('atom-button')
    })
  })

  describe('Focus Management', () => {
    test('should focus button programmatically', () => {
      button = new Button('Test', vi.fn())
      const element = button.render()
      document.body.appendChild(element)

      button.focus()
      expect(document.activeElement).toBe(element)
    })

    test('should blur button programmatically', () => {
      button = new Button('Test', vi.fn())
      const element = button.render()
      document.body.appendChild(element)

      element.focus()
      button.blur()
      expect(document.activeElement).not.toBe(element)
    })

    test('should handle focus events', () => {
      const focusHandler = vi.fn()
      button = new Button('Test', vi.fn())
      button.onFocus = focusHandler
      const element = button.render()

      const focusEvent = testUtils.createMockEvent('focus')
      element.dispatchEvent(focusEvent)
      expect(focusHandler).toHaveBeenCalled()
    })

    test('should handle blur events', () => {
      const blurHandler = vi.fn()
      button = new Button('Test', vi.fn())
      button.onBlur = blurHandler
      const element = button.render()

      const blurEvent = testUtils.createMockEvent('blur')
      element.dispatchEvent(blurEvent)
      expect(blurHandler).toHaveBeenCalled()
    })
  })

  describe('Performance', () => {
    test('should reuse DOM element on multiple renders', () => {
      button = new Button('Test', vi.fn())

      const element1 = button.render()
      const element2 = button.render()

      expect(element1).toBe(element2)
    })

    test('should efficiently update text content', () => {
      button = new Button('Test', vi.fn())
      const element = button.render()

      const textSpan = element.querySelector('.atom-button__text')
      const originalSpan = textSpan

      button.setText('New Text')
      const updatedSpan = element.querySelector('.atom-button__text')

      expect(updatedSpan).toBe(originalSpan) // Same element, updated content
    })
  })

  describe('Error Handling', () => {
    test('should handle null click handler gracefully', () => {
      button = new Button('Test', null)
      const element = button.render()

      expect(() => element.click()).not.toThrow()
    })

    test('should handle invalid variant gracefully', () => {
      button = new Button('Test', vi.fn(), 'invalid-variant')
      const element = button.render()

      expect(element.className).toContain('atom-button--primary') // Falls back to primary
    })

    test('should handle missing text gracefully', () => {
      button = new Button('', vi.fn())
      const element = button.render()

      expect(element.textContent.trim()).toBe('')
      expect(element.className).toContain('atom-button')
    })
  })

  describe('Destruction', () => {
    test('should clean up event listeners on destroy', () => {
      button = new Button('Test', vi.fn())
      const element = button.render()
      document.body.appendChild(element)

      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener')

      button.destroy()

      expect(removeEventListenerSpy).toHaveBeenCalled()
    })

    test('should remove element from DOM on destroy', () => {
      button = new Button('Test', vi.fn())
      const element = button.render()
      document.body.appendChild(element)

      expect(document.body.contains(element)).toBe(true)

      button.destroy()

      expect(document.body.contains(element)).toBe(false)
    })

    test('should prevent further operations after destroy', () => {
      button = new Button('Test', vi.fn())
      const element = button.render()

      button.destroy()

      expect(() => button.setText('New')).not.toThrow()
      expect(() => button.setDisabled(true)).not.toThrow()
    })
  })
})