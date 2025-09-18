/**
 * Language Selector Atom Component
 * Dropdown selector for changing application language
 */

import languageManager from '../../i18n/LanguageManager.js'

class LanguageSelector {
  constructor(options = {}) {
    this.onLanguageChange = options.onLanguageChange || null
    this.compact = options.compact || false
    this.showFlags = options.showFlags !== false

    this.element = null
    this.selectElement = null
    this.currentLanguage = languageManager.getCurrentLanguage()

    this.unsubscribe = languageManager.subscribe(this.handleLanguageChange.bind(this))
  }

  render() {
    if (this.element) {
      return this.element
    }

    this.element = document.createElement('div')
    this.element.className = this.getClassName()

    if (!this.compact) {
      const label = document.createElement('label')
      label.className = 'atom-language-selector__label'
      label.textContent = languageManager.t('buttons.language')
      label.setAttribute('for', 'language-selector')
      this.element.appendChild(label)
    }

    this.selectElement = document.createElement('select')
    this.selectElement.className = 'atom-language-selector__select'
    this.selectElement.id = 'language-selector'
    this.selectElement.setAttribute('aria-label', languageManager.t('buttons.language'))

    this.populateOptions()

    this.selectElement.addEventListener('change', this.handleSelectionChange.bind(this))

    this.element.appendChild(this.selectElement)

    return this.element
  }

  populateOptions() {
    if (!this.selectElement) return

    this.selectElement.innerHTML = ''

    const availableLanguages = languageManager.getAvailableLanguages()

    availableLanguages.forEach(lang => {
      const option = document.createElement('option')
      option.value = lang.code
      option.textContent = this.formatLanguageName(lang)
      option.selected = lang.code === this.currentLanguage

      this.selectElement.appendChild(option)
    })
  }

  formatLanguageName(language) {
    if (this.compact) {
      return language.code.toUpperCase()
    }

    const flag = this.getLanguageFlag(language.code)
    const name = language.nativeName || language.name

    return this.showFlags ? `${flag} ${name}` : name
  }

  getLanguageFlag(langCode) {
    const flags = {
      pt: '',
      en: '',
      es: ''
    }

    return flags[langCode] || ''
  }

  getClassName() {
    const baseClass = 'atom-language-selector'
    const compactClass = this.compact ? 'atom-language-selector--compact' : ''

    return [baseClass, compactClass]
      .filter(Boolean)
      .join(' ')
  }

  handleSelectionChange(event) {
    const selectedLanguage = event.target.value

    if (selectedLanguage !== this.currentLanguage) {
      languageManager.setLanguage(selectedLanguage)

      if (this.onLanguageChange) {
        this.onLanguageChange(selectedLanguage, this.currentLanguage)
      }
    }
  }

  handleLanguageChange(newLanguage, previousLanguage) {
    this.currentLanguage = newLanguage

    if (this.selectElement) {
      this.selectElement.value = newLanguage

      this.populateOptions()
    }

    if (!this.compact) {
      const label = this.element?.querySelector('.atom-language-selector__label')
      if (label) {
        label.textContent = languageManager.t('buttons.language')
      }
    }
  }

  setCompact(compact) {
    this.compact = compact
    if (this.element) {
      this.element.className = this.getClassName()
      this.populateOptions()
    }
  }

  setShowFlags(showFlags) {
    this.showFlags = showFlags
    if (this.selectElement) {
      this.populateOptions()
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage
  }

  focus() {
    if (this.selectElement) {
      this.selectElement.focus()
    }
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }

    if (this.selectElement) {
      this.selectElement.removeEventListener('change', this.handleSelectionChange)
    }

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }

    this.element = null
    this.selectElement = null
  }
}

export default LanguageSelector