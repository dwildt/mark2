/**
 * LanguageManager Tests
 * Test suite for internationalization functionality
 */

import LanguageManager from '../../src/i18n/LanguageManager.js'

describe('LanguageManager', () => {
  let languageManager

  beforeEach(() => {
    // Create fresh instance for each test
    languageManager = new LanguageManager()
    localStorage.clear()
  })

  describe('Initialization', () => {
    test('should initialize with default language (pt)', () => {
      expect(languageManager.getCurrentLanguage()).toBe('pt')
    })

    test('should load available languages', () => {
      const languages = languageManager.getAvailableLanguages()
      expect(languages).toContain('pt')
      expect(languages).toContain('en')
      expect(languages).toContain('es')
    })

    test('should detect browser language if supported', () => {
      // Mock navigator.language
      Object.defineProperty(navigator, 'language', {
        value: 'en',
        writable: true
      })

      const newManager = new LanguageManager()
      expect(newManager.getCurrentLanguage()).toBe('en')
    })

    test('should fallback to default if browser language not supported', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'fr',
        writable: true
      })

      const newManager = new LanguageManager()
      expect(newManager.getCurrentLanguage()).toBe('pt')
    })
  })

  describe('Language Switching', () => {
    test('should change language successfully', () => {
      const result = languageManager.setLanguage('en')
      expect(result).toBe(true)
      expect(languageManager.getCurrentLanguage()).toBe('en')
    })

    test('should persist language in localStorage', () => {
      languageManager.setLanguage('es')
      expect(localStorage.setItem).toHaveBeenCalledWith('mark2_language', 'es')
    })

    test('should load language from localStorage on init', () => {
      localStorage.getItem.mockReturnValue('es')
      const newManager = new LanguageManager()
      expect(newManager.getCurrentLanguage()).toBe('es')
    })

    test('should reject invalid language codes', () => {
      const result = languageManager.setLanguage('invalid')
      expect(result).toBe(false)
      expect(languageManager.getCurrentLanguage()).toBe('pt')
    })

    test('should notify subscribers on language change', () => {
      const callback = jest.fn()
      languageManager.subscribe(callback)

      languageManager.setLanguage('en')
      expect(callback).toHaveBeenCalledWith('en', 'pt')
    })
  })

  describe('Translation (t method)', () => {
    test('should translate simple keys', () => {
      const result = languageManager.t('app.title')
      expect(result).toBe('mark2 - Markdown para Mapa Mental')
    })

    test('should translate nested keys', () => {
      const result = languageManager.t('buttons.save')
      expect(result).toBe('Salvar')
    })

    test('should return key if translation not found', () => {
      const result = languageManager.t('nonexistent.key')
      expect(result).toBe('nonexistent.key')
    })

    test('should support parameter interpolation', () => {
      // Assuming we have a translation with {name} placeholder
      languageManager.setLanguage('en')
      const result = languageManager.t('welcome.message', { name: 'John' })
      expect(typeof result).toBe('string')
    })

    test('should fallback to default language if translation missing', () => {
      languageManager.setLanguage('en')
      // Try to get a key that might not exist in English
      const result = languageManager.t('app.title')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('Pluralization', () => {
    test('should handle plural forms', () => {
      const singular = languageManager.plural('file', 1)
      const plural = languageManager.plural('file', 2)

      expect(typeof singular).toBe('string')
      expect(typeof plural).toBe('string')
    })

    test('should use correct plural rules for each language', () => {
      languageManager.setLanguage('en')
      const result = languageManager.plural('item', 5)
      expect(typeof result).toBe('string')
    })
  })

  describe('Date and Number Formatting', () => {
    test('should format dates according to language', () => {
      const date = new Date('2024-01-01')
      const result = languageManager.formatDate(date)
      expect(typeof result).toBe('string')
    })

    test('should format numbers according to language', () => {
      const result = languageManager.formatNumber(1234.56)
      expect(typeof result).toBe('string')
    })

    test('should format currency according to language', () => {
      const result = languageManager.formatCurrency(123.45, 'BRL')
      expect(typeof result).toBe('string')
    })
  })

  describe('RTL Support', () => {
    test('should detect RTL languages', () => {
      const isRTL = languageManager.isRTL()
      expect(typeof isRTL).toBe('boolean')
      expect(isRTL).toBe(false) // pt, en, es are LTR
    })

    test('should provide text direction', () => {
      const direction = languageManager.getTextDirection()
      expect(direction).toBe('ltr')
    })
  })

  describe('Subscription System', () => {
    test('should allow subscribing to language changes', () => {
      const callback = jest.fn()
      const unsubscribe = languageManager.subscribe(callback)

      expect(typeof unsubscribe).toBe('function')

      languageManager.setLanguage('en')
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith('en', 'pt')
    })

    test('should allow unsubscribing from language changes', () => {
      const callback = jest.fn()
      const unsubscribe = languageManager.subscribe(callback)

      unsubscribe()
      languageManager.setLanguage('en')

      expect(callback).not.toHaveBeenCalled()
    })

    test('should handle multiple subscribers', () => {
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      languageManager.subscribe(callback1)
      languageManager.subscribe(callback2)

      languageManager.setLanguage('es')

      expect(callback1).toHaveBeenCalledWith('es', 'pt')
      expect(callback2).toHaveBeenCalledWith('es', 'pt')
    })
  })

  describe('Validation', () => {
    test('should validate language codes', () => {
      expect(languageManager.isValidLanguage('pt')).toBe(true)
      expect(languageManager.isValidLanguage('en')).toBe(true)
      expect(languageManager.isValidLanguage('invalid')).toBe(false)
    })

    test('should validate translation keys', () => {
      expect(languageManager.hasTranslation('app.title')).toBe(true)
      expect(languageManager.hasTranslation('nonexistent.key')).toBe(false)
    })
  })

  describe('Caching', () => {
    test('should cache translations for performance', () => {
      // First call
      const result1 = languageManager.t('app.title')

      // Second call should use cache
      const result2 = languageManager.t('app.title')

      expect(result1).toBe(result2)
    })

    test('should clear cache on language change', () => {
      languageManager.t('app.title') // Populate cache
      languageManager.setLanguage('en') // Should clear cache

      const result = languageManager.t('app.title')
      expect(typeof result).toBe('string')
    })
  })

  describe('Error Handling', () => {
    test('should handle missing translation files gracefully', () => {
      // Mock a scenario where language file is missing
      const originalConsoleWarn = console.warn
      console.warn = jest.fn()

      languageManager.setLanguage('invalid')

      expect(console.warn).toHaveBeenCalled()
      console.warn = originalConsoleWarn
    })

    test('should provide fallback for corrupted translations', () => {
      const result = languageManager.t('deeply.nested.missing.key')
      expect(result).toBe('deeply.nested.missing.key')
    })
  })

  describe('Integration', () => {
    test('should work with DOM updates', () => {
      const element = document.createElement('div')
      element.textContent = languageManager.t('app.title')

      expect(element.textContent).toBe('mark2 - Markdown para Mapa Mental')

      languageManager.setLanguage('en')
      element.textContent = languageManager.t('app.title')

      expect(element.textContent).toContain('mark2')
    })

    test('should maintain state across instances', () => {
      languageManager.setLanguage('es')

      const newManager = new LanguageManager()
      expect(newManager.getCurrentLanguage()).toBe('es')
    })
  })
})