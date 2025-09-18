/**
 * Language Manager
 * Handles internationalization (i18n) for the mark2 application
 */

// Import language files
import pt from './locales/pt.js'
import en from './locales/en.js'
import es from './locales/es.js'

class LanguageManager {
  constructor() {
    this.languages = {
      pt,
      en,
      es
    }

    this.defaultLanguage = 'pt'
    this.currentLanguage = this.defaultLanguage
    this.fallbackLanguage = 'en'
    this.subscribers = []

    this.init()
  }

  init() {
    // Load stored language or detect system language
    this.loadStoredLanguage()

    // Apply initial language
    this.applyLanguage(this.currentLanguage)

    // Listen for system language changes
    this.listenForSystemLanguageChanges()
  }

  loadStoredLanguage() {
    try {
      const stored = localStorage.getItem('preferred-language')
      if (stored && this.isLanguageAvailable(stored)) {
        this.currentLanguage = stored
      } else {
        // Detect system language
        this.currentLanguage = this.detectSystemLanguage()
      }
    } catch (error) {
      console.warn('Could not load language from localStorage:', error)
      this.currentLanguage = this.defaultLanguage
    }
  }

  detectSystemLanguage() {
    if (typeof navigator === 'undefined') {
      return this.defaultLanguage
    }

    // Get browser language
    const browserLang = navigator.language || navigator.languages?.[0] || this.defaultLanguage

    // Extract language code (e.g., 'pt-BR' -> 'pt')
    const langCode = browserLang.split('-')[0].toLowerCase()

    // Return if available, otherwise fallback
    return this.isLanguageAvailable(langCode) ? langCode : this.defaultLanguage
  }

  isLanguageAvailable(langCode) {
    return Object.keys(this.languages).includes(langCode)
  }

  setLanguage(langCode) {
    if (!this.isLanguageAvailable(langCode)) {
      console.warn(`Language '${langCode}' is not available. Available languages:`, Object.keys(this.languages))
      return false
    }

    const previousLanguage = this.currentLanguage
    this.currentLanguage = langCode

    this.applyLanguage(langCode)
    this.storeLanguage(langCode)
    this.notifySubscribers(langCode, previousLanguage)

    return true
  }

  applyLanguage(langCode) {
    if (typeof document === 'undefined') return

    // Set document language
    document.documentElement.lang = langCode

    // Set document direction (for RTL languages)
    const language = this.languages[langCode]
    if (language?.meta?.direction) {
      document.documentElement.dir = language.meta.direction
    }

    // Update page title
    if (language?.app?.title) {
      document.title = language.app.title
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription && language?.app?.description) {
      metaDescription.content = language.app.description
    }
  }

  storeLanguage(langCode) {
    try {
      localStorage.setItem('preferred-language', langCode)
    } catch (error) {
      console.warn('Could not store language in localStorage:', error)
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage
  }

  getAvailableLanguages() {
    return Object.keys(this.languages).map(code => ({
      code,
      name: this.languages[code].meta?.name || code,
      nativeName: this.languages[code].meta?.nativeName || code,
      direction: this.languages[code].meta?.direction || 'ltr'
    }))
  }

  getLanguageDisplayName(langCode) {
    const language = this.languages[langCode]
    return language?.meta?.nativeName || language?.meta?.name || langCode
  }

  // Translation methods
  t(key, params = {}) {
    return this.translate(key, params)
  }

  translate(key, params = {}) {
    const value = this.getTranslation(key, this.currentLanguage)

    if (value === null) {
      // Try fallback language
      const fallbackValue = this.getTranslation(key, this.fallbackLanguage)
      if (fallbackValue !== null) {
        console.warn(`Translation missing for key '${key}' in language '${this.currentLanguage}', using fallback`)
        return this.interpolate(fallbackValue, params)
      }

      // Return key if no translation found
      console.warn(`Translation missing for key '${key}' in both current and fallback languages`)
      return key
    }

    return this.interpolate(value, params)
  }

  getTranslation(key, langCode) {
    const language = this.languages[langCode]
    if (!language) {
      return null
    }

    // Navigate through nested object using dot notation
    const keys = key.split('.')
    let current = language

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        return null
      }
    }

    return typeof current === 'string' ? current : null
  }

  interpolate(text, params) {
    if (!params || Object.keys(params).length === 0) {
      return text
    }

    return text.replace(/\{([^}]+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match
    })
  }

  // Pluralization
  plural(key, count, params = {}) {
    const pluralKey = this.getPluralKey(key, count)
    const mergedParams = { ...params, count }
    return this.translate(pluralKey, mergedParams)
  }

  getPluralKey(key, count) {
    // Simple English-style pluralization
    // For more complex pluralization rules, this would need to be language-specific
    if (count === 1) {
      return `${key}.one`
    } else {
      return `${key}.other`
    }
  }

  // Time formatting
  formatTime(key, value) {
    if (value === 1) {
      return `1 ${this.translate(`time.${key}`)}`
    } else {
      return `${value} ${this.translate(`time.${key}s`)}`
    }
  }

  // Date formatting
  formatDate(date, options = {}) {
    const language = this.languages[this.currentLanguage]
    const locale = language?.meta?.code || this.currentLanguage

    try {
      return new Intl.DateTimeFormat(locale, options).format(date)
    } catch (error) {
      console.warn('Error formatting date:', error)
      return date.toString()
    }
  }

  // Number formatting
  formatNumber(number, options = {}) {
    const language = this.languages[this.currentLanguage]
    const locale = language?.meta?.code || this.currentLanguage

    try {
      return new Intl.NumberFormat(locale, options).format(number)
    } catch (error) {
      console.warn('Error formatting number:', error)
      return number.toString()
    }
  }

  // Currency formatting
  formatCurrency(amount, currency = 'USD', options = {}) {
    return this.formatNumber(amount, {
      style: 'currency',
      currency,
      ...options
    })
  }

  // Subscription system
  subscribe(callback) {
    if (typeof callback === 'function') {
      this.subscribers.push(callback)

      // Return unsubscribe function
      return () => {
        const index = this.subscribers.indexOf(callback)
        if (index > -1) {
          this.subscribers.splice(index, 1)
        }
      }
    }
  }

  notifySubscribers(newLanguage, previousLanguage) {
    this.subscribers.forEach(callback => {
      try {
        callback(newLanguage, previousLanguage)
      } catch (error) {
        console.error('Error in language change subscriber:', error)
      }
    })
  }

  listenForSystemLanguageChanges() {
    if (typeof window === 'undefined') return

    window.addEventListener('languagechange', () => {
      // Only auto-switch if user hasn't manually set a language
      const hasManualLanguage = localStorage.getItem('preferred-language')
      if (!hasManualLanguage) {
        const systemLanguage = this.detectSystemLanguage()
        this.setLanguage(systemLanguage)
      }
    })
  }

  resetToSystemLanguage() {
    try {
      localStorage.removeItem('preferred-language')
      const systemLanguage = this.detectSystemLanguage()
      this.setLanguage(systemLanguage)
    } catch (error) {
      console.warn('Could not reset to system language:', error)
    }
  }

  // Utility methods for adding new languages
  addLanguage(langCode, translations) {
    if (this.isLanguageAvailable(langCode)) {
      console.warn(`Language '${langCode}' already exists. Use updateLanguage() to modify it.`)
      return false
    }

    this.languages[langCode] = translations
    return true
  }

  updateLanguage(langCode, translations) {
    if (!this.isLanguageAvailable(langCode)) {
      console.warn(`Language '${langCode}' does not exist. Use addLanguage() to create it.`)
      return false
    }

    this.languages[langCode] = { ...this.languages[langCode], ...translations }

    // Refresh current language if it's being updated
    if (langCode === this.currentLanguage) {
      this.applyLanguage(langCode)
      this.notifySubscribers(langCode, langCode)
    }

    return true
  }

  removeLanguage(langCode) {
    if (langCode === this.defaultLanguage) {
      console.warn('Cannot remove default language')
      return false
    }

    if (!this.isLanguageAvailable(langCode)) {
      return false
    }

    delete this.languages[langCode]

    // Switch to default if current language was removed
    if (langCode === this.currentLanguage) {
      this.setLanguage(this.defaultLanguage)
    }

    return true
  }

  // Export/Import functionality
  exportLanguageSettings() {
    return {
      currentLanguage: this.currentLanguage,
      availableLanguages: Object.keys(this.languages),
      systemLanguage: this.detectSystemLanguage()
    }
  }

  importLanguageSettings(settings) {
    if (settings && settings.currentLanguage &&
        this.isLanguageAvailable(settings.currentLanguage)) {
      this.setLanguage(settings.currentLanguage)
      return true
    }
    return false
  }

  destroy() {
    this.subscribers = []
  }
}

// Create singleton instance
const languageManager = new LanguageManager()

export default languageManager
export { LanguageManager }
