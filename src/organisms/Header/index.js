/**
 * Header Organism Component
 * Main application header with title and navigation
 */

import Toolbar from '../../molecules/Toolbar/index.js'
import languageManager from '../../i18n/LanguageManager.js'
import themeManager from '../../theme/ThemeManager.js'

class Header {
  constructor(options = {}) {
    this.title = options.title || languageManager.t('header.title')
    this.subtitle = options.subtitle || languageManager.t('header.subtitle')
    this.showToolbar = options.showToolbar !== false
    this.onThemeToggle = options.onThemeToggle || null
    this.onExport = options.onExport || null
    this.onExample = options.onExample || null
    this.onHelp = options.onHelp || null

    this.element = null
    this.titleElement = null
    this.subtitleElement = null
    this.toolbar = null

    // Subscribe to language changes
    this.unsubscribe = languageManager.subscribe(this.updateLabels.bind(this))
  }

  render() {
    if (this.element) {
      return this.element
    }

    this.element = document.createElement('header')
    this.element.className = 'organism-header'
    this.element.setAttribute('role', 'banner')

    // Create header container
    const container = document.createElement('div')
    container.className = 'organism-header__container'

    // Create title section
    this.createTitleSection(container)

    // Create toolbar if enabled
    if (this.showToolbar) {
      this.createToolbar(container)
    }

    this.element.appendChild(container)

    return this.element
  }

  createTitleSection(container) {
    const titleSection = document.createElement('div')
    titleSection.className = 'organism-header__title-section'

    // Main title
    this.titleElement = document.createElement('h1')
    this.titleElement.className = 'organism-header__title'
    this.titleElement.textContent = this.title
    titleSection.appendChild(this.titleElement)

    // Subtitle (if provided)
    if (this.subtitle) {
      this.subtitleElement = document.createElement('p')
      this.subtitleElement.className = 'organism-header__subtitle'
      this.subtitleElement.textContent = this.subtitle
      titleSection.appendChild(this.subtitleElement)
    }

    container.appendChild(titleSection)
  }

  createToolbar(container) {
    const actions = [
      {
        key: 'theme',
        variant: 'secondary',
        onClick: this.handleThemeToggle.bind(this),
        ariaLabel: 'buttons.theme',
        title: 'buttons.theme'
      },
      {
        key: 'example',
        variant: 'secondary',
        onClick: this.handleExample.bind(this),
        ariaLabel: 'buttons.example',
        title: 'buttons.example'
      },
      {
        key: 'export',
        variant: 'secondary',
        onClick: this.handleExport.bind(this),
        ariaLabel: 'buttons.export',
        title: 'buttons.export'
      },
      {
        key: 'help',
        variant: 'secondary',
        onClick: this.handleHelp.bind(this),
        ariaLabel: 'buttons.help',
        title: 'buttons.help'
      }
    ]

    this.toolbar = new Toolbar({
      variant: 'compact',
      actions,
      showLanguageSelector: true,
      orientation: 'horizontal'
    })

    const toolbarElement = this.toolbar.render()
    toolbarElement.classList.add('organism-header__toolbar')

    container.appendChild(toolbarElement)
  }

  handleThemeToggle() {
    console.log('Theme toggle clicked!')
    if (this.onThemeToggle) {
      this.onThemeToggle()
    } else {
      // Default behavior: cycle through themes
      themeManager.cycleTheme()
    }
  }

  handleExample() {
    console.log('Example button clicked!')
    if (this.onExample) {
      this.onExample()
    } else {
      console.log('Example functionality not implemented')
    }
  }

  handleExport() {
    console.log('Export button clicked!')
    if (this.onExport) {
      this.onExport()
    } else {
      console.log('Export functionality not implemented')
    }
  }

  handleHelp() {
    console.log('Help button clicked!')
    if (this.onHelp) {
      this.onHelp()
    } else {
      console.log('Help functionality not implemented')
    }
  }

  updateLabels() {
    // Update title and subtitle
    if (this.titleElement) {
      this.titleElement.textContent = languageManager.t('header.title')
    }

    if (this.subtitleElement) {
      this.subtitleElement.textContent = languageManager.t('header.subtitle')
    }

    // Update document title
    document.title = languageManager.t('app.title')
  }

  // Public API
  setTitle(title) {
    this.title = title
    if (this.titleElement) {
      this.titleElement.textContent = title
    }
  }

  setSubtitle(subtitle) {
    this.subtitle = subtitle
    if (this.subtitleElement) {
      this.subtitleElement.textContent = subtitle
    } else if (subtitle) {
      // Create subtitle element if it doesn't exist
      this.subtitleElement = document.createElement('p')
      this.subtitleElement.className = 'organism-header__subtitle'
      this.subtitleElement.textContent = subtitle

      const titleSection = this.element?.querySelector('.organism-header__title-section')
      if (titleSection) {
        titleSection.appendChild(this.subtitleElement)
      }
    }
  }

  hideToolbar() {
    if (this.toolbar && this.toolbar.element) {
      this.toolbar.element.style.display = 'none'
    }
  }

  showToolbar() {
    if (this.toolbar && this.toolbar.element) {
      this.toolbar.element.style.display = 'flex'
    }
  }

  enableAction(key) {
    if (this.toolbar) {
      this.toolbar.enableAction(key)
    }
  }

  disableAction(key) {
    if (this.toolbar) {
      this.toolbar.disableAction(key)
    }
  }

  updateAction(key, updates) {
    if (this.toolbar) {
      this.toolbar.updateAction(key, updates)
    }
  }

  // State management
  setLoading(loading) {
    if (loading) {
      this.element?.classList.add('organism-header--loading')
      this.disableAction('export')
    } else {
      this.element?.classList.remove('organism-header--loading')
      this.enableAction('export')
    }
  }

  // Responsive behavior
  setMobileMode(isMobile) {
    if (isMobile) {
      this.element?.classList.add('organism-header--mobile')
      if (this.toolbar) {
        this.toolbar.setVariant('mobile')
      }
    } else {
      this.element?.classList.remove('organism-header--mobile')
      if (this.toolbar) {
        this.toolbar.setVariant('compact')
      }
    }
  }

  // Animation
  animateIn() {
    if (this.element) {
      this.element.classList.add('organism-header--animate-in')

      setTimeout(() => {
        this.element.classList.remove('organism-header--animate-in')
      }, 500)
    }
  }

  // Focus management
  focus() {
    if (this.toolbar) {
      this.toolbar.focus()
    } else if (this.titleElement) {
      this.titleElement.focus()
    }
  }

  destroy() {
    // Unsubscribe from language changes
    if (this.unsubscribe) {
      this.unsubscribe()
    }

    // Destroy toolbar
    if (this.toolbar) {
      this.toolbar.destroy()
    }

    // Remove element
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }

    this.element = null
    this.titleElement = null
    this.subtitleElement = null
    this.toolbar = null
  }
}

export default Header
