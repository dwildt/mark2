/**
 * Theme Manager
 * Handles theme switching and persistence
 */

class ThemeManager {
  constructor() {
    this.themes = ['light', 'dark', 'blue', 'green', 'orange']
    this.currentTheme = 'light'
    this.subscribers = []

    this.init()
  }

  init() {
    // Load stored theme or default
    this.loadStoredTheme()

    // Apply initial theme
    this.applyTheme(this.currentTheme)

    // Listen for system theme changes
    this.listenForSystemThemeChanges()
  }

  loadStoredTheme() {
    try {
      const stored = localStorage.getItem('preferred-theme')
      if (stored && this.themes.includes(stored)) {
        this.currentTheme = stored
      } else {
        // Detect system preference
        this.currentTheme = this.getSystemTheme()
      }
    } catch (error) {
      console.warn('Could not load theme from localStorage:', error)
      this.currentTheme = 'light'
    }
  }

  getSystemTheme() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  setTheme(themeName) {
    if (!this.themes.includes(themeName)) {
      console.warn(`Theme '${themeName}' is not available. Available themes:`, this.themes)
      return false
    }

    const previousTheme = this.currentTheme
    this.currentTheme = themeName

    this.applyTheme(themeName)
    this.storeTheme(themeName)
    this.notifySubscribers(themeName, previousTheme)

    return true
  }

  applyTheme(themeName) {
    if (typeof document === 'undefined') return

    // Remove all existing theme classes from both body and documentElement
    this.themes.forEach(theme => {
      document.body.classList.remove(`theme-${theme}`)
      document.documentElement.classList.remove(`theme-${theme}`)
    })

    // Add new theme class to documentElement (:root)
    document.documentElement.classList.add(`theme-${themeName}`)

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(themeName)
  }

  updateMetaThemeColor(themeName) {
    const themeColors = {
      light: '#ffffff',
      dark: '#0f172a',
      blue: '#eff6ff',
      green: '#f0fdf4',
      orange: '#fff7ed'
    }

    let metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta')
      metaThemeColor.name = 'theme-color'
      document.head.appendChild(metaThemeColor)
    }

    metaThemeColor.content = themeColors[themeName] || themeColors.light
  }

  storeTheme(themeName) {
    try {
      localStorage.setItem('preferred-theme', themeName)
    } catch (error) {
      console.warn('Could not store theme in localStorage:', error)
    }
  }

  getCurrentTheme() {
    return this.currentTheme
  }

  getAvailableThemes() {
    return [...this.themes]
  }

  getThemeDisplayName(themeName) {
    const displayNames = {
      light: 'Light',
      dark: 'Dark',
      blue: 'Blue',
      green: 'Green',
      orange: 'Orange'
    }

    return displayNames[themeName] || themeName
  }

  getThemeDescription(themeName) {
    const descriptions = {
      light: 'Clean white background with black text',
      dark: 'Dark mode for comfortable low-light usage',
      blue: 'Professional blue color palette',
      green: 'Nature-inspired green tones',
      orange: 'Energetic orange theme'
    }

    return descriptions[themeName] || ''
  }

  toggleTheme() {
    const currentIndex = this.themes.indexOf(this.currentTheme)
    const nextIndex = (currentIndex + 1) % this.themes.length
    this.setTheme(this.themes[nextIndex])
  }

  cycleTheme() {
    this.toggleTheme()
  }

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

  notifySubscribers(newTheme, previousTheme) {
    this.subscribers.forEach(callback => {
      try {
        callback(newTheme, previousTheme)
      } catch (error) {
        console.error('Error in theme change subscriber:', error)
      }
    })
  }

  listenForSystemThemeChanges() {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = (e) => {
      // Only auto-switch if user hasn't manually set a theme
      const hasManualTheme = localStorage.getItem('preferred-theme')
      if (!hasManualTheme) {
        const systemTheme = e.matches ? 'dark' : 'light'
        this.setTheme(systemTheme)
      }
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleSystemThemeChange)
    }
  }

  resetToSystemTheme() {
    try {
      localStorage.removeItem('preferred-theme')
      const systemTheme = this.getSystemTheme()
      this.setTheme(systemTheme)
    } catch (error) {
      console.warn('Could not reset to system theme:', error)
    }
  }

  exportThemeSettings() {
    return {
      currentTheme: this.currentTheme,
      availableThemes: this.themes,
      systemTheme: this.getSystemTheme()
    }
  }

  importThemeSettings(settings) {
    if (settings && settings.currentTheme && this.themes.includes(settings.currentTheme)) {
      this.setTheme(settings.currentTheme)
      return true
    }
    return false
  }

  // Utility method to get CSS custom property value
  getCSSCustomProperty(propertyName) {
    if (typeof document === 'undefined') return null

    return getComputedStyle(document.documentElement)
      .getPropertyValue(propertyName)
      .trim()
  }

  // Utility method to set CSS custom property value
  setCSSCustomProperty(propertyName, value) {
    if (typeof document === 'undefined') return

    document.documentElement.style.setProperty(propertyName, value)
  }

  destroy() {
    this.subscribers = []
  }
}

// Create singleton instance
const themeManager = new ThemeManager()

export default themeManager
export { ThemeManager }
