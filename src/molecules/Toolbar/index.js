/**
 * Toolbar Molecule Component
 * Container for action buttons with different layouts
 */

import Button from '../../atoms/Button/index.js'
import LanguageSelector from '../../atoms/LanguageSelector/index.js'
import languageManager from '../../i18n/LanguageManager.js'

class Toolbar {
  constructor(options = {}) {
    this.variant = options.variant || 'default' // default, compact, mobile
    this.actions = options.actions || []
    this.showLanguageSelector = options.showLanguageSelector !== false
    this.orientation = options.orientation || 'horizontal' // horizontal, vertical

    this.element = null
    this.buttons = new Map()
    this.languageSelector = null

    // Subscribe to language changes for button text updates
    this.unsubscribe = languageManager.subscribe(this.updateButtonTexts.bind(this))
  }

  render() {
    if (this.element) {
      return this.element
    }

    this.element = document.createElement('div')
    this.element.className = this.getClassName()
    this.element.setAttribute('role', 'toolbar')
    this.element.setAttribute('aria-label', languageManager.t('accessibility.toolbar'))

    // Create buttons
    this.createButtons()

    // Add language selector if enabled
    if (this.showLanguageSelector) {
      this.createLanguageSelector()
    }

    return this.element
  }

  createButtons() {
    this.actions.forEach((action, index) => {
      const button = new Button(
        this.getButtonText(action.key),
        action.onClick,
        action.variant || 'secondary',
        action.disabled || false
      )

      const buttonElement = button.render()

      // Add additional attributes
      if (action.ariaLabel) {
        buttonElement.setAttribute('aria-label', languageManager.t(action.ariaLabel))
      }

      if (action.title) {
        buttonElement.setAttribute('title', languageManager.t(action.title))
      }

      if (action.icon) {
        buttonElement.innerHTML = `${action.icon} ${buttonElement.textContent}`
        buttonElement.classList.add('atom-button--with-icon')
      }

      this.buttons.set(action.key, button)
      this.element.appendChild(buttonElement)

      // Add separator if specified
      if (action.separator && index < this.actions.length - 1) {
        this.addSeparator()
      }
    })
  }

  createLanguageSelector() {
    const separator = this.addSeparator()

    this.languageSelector = new LanguageSelector({
      compact: this.variant === 'compact' || this.variant === 'mobile',
      showFlags: this.variant !== 'compact',
      onLanguageChange: this.handleLanguageChange.bind(this)
    })

    const selectorElement = this.languageSelector.render()
    this.element.appendChild(selectorElement)
  }

  addSeparator() {
    const separator = document.createElement('div')
    separator.className = 'molecule-toolbar__separator'
    separator.setAttribute('role', 'separator')
    this.element.appendChild(separator)
    return separator
  }

  getButtonText(key) {
    // Map action keys to translation keys
    const textMap = {
      theme: 'buttons.theme',
      export: 'buttons.export',
      help: 'buttons.help',
      clear: 'buttons.clear',
      example: 'buttons.example',
      'zoom-in': 'buttons.zoomIn',
      'zoom-out': 'buttons.zoomOut',
      'fit-screen': 'buttons.fitScreen',
      save: 'buttons.save',
      settings: 'buttons.settings'
    }

    return languageManager.t(textMap[key] || `buttons.${key}`)
  }

  getClassName() {
    const baseClass = 'molecule-toolbar'
    const variantClass = `molecule-toolbar--${this.variant}`
    const orientationClass = `molecule-toolbar--${this.orientation}`

    return [baseClass, variantClass, orientationClass]
      .filter(Boolean)
      .join(' ')
  }

  updateButtonTexts() {
    // Update button texts when language changes
    this.buttons.forEach((button, key) => {
      const newText = this.getButtonText(key)
      button.setText(newText)
    })

    // Update aria-label for toolbar
    if (this.element) {
      this.element.setAttribute('aria-label', languageManager.t('accessibility.toolbar'))
    }
  }

  handleLanguageChange(newLanguage, previousLanguage) {
    // Optional callback for language changes
    console.log(`Language changed from ${previousLanguage} to ${newLanguage}`)
  }

  // Action management
  addAction(action) {
    this.actions.push(action)

    if (this.element) {
      // Re-render if already rendered
      this.element.innerHTML = ''
      this.buttons.clear()
      this.createButtons()

      if (this.showLanguageSelector) {
        this.createLanguageSelector()
      }
    }
  }

  removeAction(key) {
    const index = this.actions.findIndex(action => action.key === key)
    if (index > -1) {
      this.actions.splice(index, 1)

      // Remove button
      const button = this.buttons.get(key)
      if (button) {
        button.destroy()
        this.buttons.delete(key)
      }

      // Re-render if needed
      if (this.element) {
        this.element.innerHTML = ''
        this.createButtons()

        if (this.showLanguageSelector) {
          this.createLanguageSelector()
        }
      }
    }
  }

  updateAction(key, updates) {
    const action = this.actions.find(a => a.key === key)
    if (action) {
      Object.assign(action, updates)

      const button = this.buttons.get(key)
      if (button) {
        if (updates.text) {
          button.setText(this.getButtonText(key))
        }
        if (updates.disabled !== undefined) {
          button.setDisabled(updates.disabled)
        }
        if (updates.variant) {
          button.setVariant(updates.variant)
        }
      }
    }
  }

  // State management
  enableAction(key) {
    this.updateAction(key, { disabled: false })
  }

  disableAction(key) {
    this.updateAction(key, { disabled: true })
  }

  showAction(key) {
    const button = this.buttons.get(key)
    if (button && button.element) {
      button.element.style.display = ''
    }
  }

  hideAction(key) {
    const button = this.buttons.get(key)
    if (button && button.element) {
      button.element.style.display = 'none'
    }
  }

  // Variant management
  setVariant(variant) {
    this.variant = variant
    if (this.element) {
      this.element.className = this.getClassName()

      // Update language selector if present
      if (this.languageSelector) {
        const isCompact = variant === 'compact' || variant === 'mobile'
        this.languageSelector.setCompact(isCompact)
        this.languageSelector.setShowFlags(variant !== 'compact')
      }
    }
  }

  setOrientation(orientation) {
    this.orientation = orientation
    if (this.element) {
      this.element.className = this.getClassName()
    }
  }

  // Accessibility
  focus() {
    // Focus first button
    const firstButton = this.element?.querySelector('.atom-button')
    if (firstButton) {
      firstButton.focus()
    }
  }

  // Keyboard navigation
  setupKeyboardNavigation() {
    if (!this.element) return

    this.element.addEventListener('keydown', (event) => {
      const buttons = Array.from(this.element.querySelectorAll('.atom-button:not([disabled])'))
      const currentIndex = buttons.findIndex(btn => btn === document.activeElement)

      let newIndex = currentIndex

      switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        newIndex = (currentIndex + 1) % buttons.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        newIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1
        break
      case 'Home':
        newIndex = 0
        break
      case 'End':
        newIndex = buttons.length - 1
        break
      default:
        return
      }

      event.preventDefault()
      buttons[newIndex]?.focus()
    })
  }

  destroy() {
    // Unsubscribe from language changes
    if (this.unsubscribe) {
      this.unsubscribe()
    }

    // Destroy all buttons
    this.buttons.forEach(button => button.destroy())
    this.buttons.clear()

    // Destroy language selector
    if (this.languageSelector) {
      this.languageSelector.destroy()
    }

    // Remove element
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }

    this.element = null
  }
}

export default Toolbar
