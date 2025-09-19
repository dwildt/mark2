/**
 * Theme Manager
 * Handles theme switching and persistence
 */

class ThemeManager {
  constructor() {
    this.themes = ['light', 'dark', 'blue', 'green', 'orange']
    this.currentTheme = 'dark'
    this.subscribers = []
    this.useSystemTheme = false

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
      const stored = localStorage.getItem('mark2_theme')
      if (stored && this.themes.includes(stored)) {
        this.currentTheme = stored
      } else {
        // Detect system preference
        this.currentTheme = this.getSystemTheme()
      }
    } catch (error) {
      console.warn('Could not load theme from localStorage:', error)
      this.currentTheme = 'dark'
    }
  }

  getSystemTheme() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark'
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

    // Add new theme class to both body and documentElement
    document.body.classList.add(`theme-${themeName}`)
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
      localStorage.setItem('mark2_theme', themeName)
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
      const hasManualTheme = localStorage.getItem('mark2_theme')
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
      localStorage.removeItem('mark2_theme')
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

  // Missing methods expected by tests
  getThemeName(themeName) {
    const themeNames = {
      light: 'Light',
      dark: 'Dark',
      blue: 'Blue',
      green: 'Green',
      orange: 'Orange'
    }
    return themeNames[themeName] || themeName
  }

  getThemeDescription(themeName) {
    const descriptions = {
      light: 'Clean light theme with white background',
      dark: 'Comfortable dark theme for low-light environments',
      blue: 'Calm blue theme inspired by the sky',
      green: 'Natural green theme for a fresh look',
      orange: 'Warm orange theme for energy and creativity'
    }
    return descriptions[themeName] || 'Custom theme'
  }

  isDarkTheme(themeName = null) {
    const theme = themeName || this.currentTheme
    return theme === 'dark'
  }

  getThemeColors(themeName) {
    const colors = {
      light: { primary: '#000000', secondary: '#666666', accent: '#0066cc' },
      dark: { primary: '#ffffff', secondary: '#cccccc', accent: '#3399ff' },
      blue: { primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa' },
      green: { primary: '#166534', secondary: '#22c55e', accent: '#4ade80' },
      orange: { primary: '#c2410c', secondary: '#f97316', accent: '#fb923c' }
    }
    return colors[themeName] || colors.light
  }

  getThemeVariables() {
    const theme = this.currentTheme
    return {
      '--color-primary': this.getCSSCustomProperty('--color-primary'),
      '--color-secondary': this.getCSSCustomProperty('--color-secondary'),
      '--color-accent': this.getCSSCustomProperty('--color-accent'),
      '--bg-primary': this.getCSSCustomProperty('--bg-primary'),
      '--bg-secondary': this.getCSSCustomProperty('--bg-secondary')
    }
  }

  setSystemTheme(useSystem) {
    this.useSystemTheme = useSystem
    if (useSystem) {
      localStorage.removeItem('mark2_theme')
      this.setTheme(this.getSystemTheme())
    }
  }

  isSystemTheme() {
    return this.useSystemTheme || !localStorage.getItem('mark2_theme')
  }

  isValidTheme(themeName) {
    return this.themes.includes(themeName)
  }

  prefersHighContrast() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-contrast: high)').matches
    }
    return false
  }

  prefersReducedMotion() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  }

  handleStorageChange(event) {
    if (event.key === 'mark2_theme' && event.newValue) {
      this.setTheme(event.newValue)
    }
  }

  destroy() {
    this.subscribers = []
  }
}

// Create singleton instance
const themeManager = new ThemeManager()

export default themeManager
export { ThemeManager }
