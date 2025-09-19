/**
 * mark2 Application Entry Point
 * Main application initialization and orchestration
 */

// Import all styles in correct order
import './styles/variables.css'
import './styles/layout.css'
import './styles/modals.css'
import './styles/themes/light.css'
import './styles/themes/dark.css'
import './styles/themes/blue.css'
import './styles/themes/green.css'
import './styles/themes/orange.css'
import './styles/responsive/mobile.css'
import './atoms/Button/Button.css'
import './atoms/TextInput/TextInput.css'
import './atoms/Node/Node.css'
import './atoms/LanguageSelector/LanguageSelector.css'
import './molecules/Toolbar/Toolbar.css'
import './molecules/TextEditor/TextEditor.css'
import './organisms/Header/Header.css'
import './organisms/EditorPanel/EditorPanel.css'
import './organisms/MindMap/MindMap.css'
import './utils/ExportDialog.css'
import './styles/mindmap.css'

// Import managers
import languageManager from './i18n/LanguageManager.js'
import themeManager from './theme/ThemeManager.js'
// Import utilities
import { parseMarkdown } from './utils/markdownParser.js'
import { generateLayout } from './utils/mindMapGenerator.js'
import MindMapRenderer from './utils/mindMapRenderer.js'
import exportUtils from './utils/ExportUtils.js'
// Import organisms
import Header from './organisms/Header/index.js'
import EditorPanel from './organisms/EditorPanel/index.js'

/**
 * Main Application Class
 * Orchestrates the entire mark2 application
 */
class Mark2App {
  constructor() {
    this.isInitialized = false
    this.isMobile = window.innerWidth <= 767
    this.currentView = this.isMobile ? 'editor' : 'split' // editor, mindmap, split

    // Component instances
    this.header = null
    this.editorPanel = null
    this.mindMapContainer = null
    this.mindMapRenderer = null
    this.mobileNav = null

    // Application state
    this.currentMarkdown = ''
    this.currentMindMapData = null
    this.isGenerating = false

    // DOM elements
    this.appElement = null
    this.mainElement = null

    // Bind methods
    this.handleResize = this.handleResize.bind(this)
    this.handleMarkdownChange = this.handleMarkdownChange.bind(this)
  }

  async init() {
    try {
      console.log('Initializing mark2 application...')

      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve)
        })
      }

      // Initialize managers
      await this.initializeManagers()

      // Get app container
      this.appElement = document.getElementById('app')
      if (!this.appElement) {
        throw new Error('App container element not found')
      }

      // Initialize UI components
      this.initializeComponents()

      // Setup event listeners
      this.setupEventListeners()

      // Setup responsive behavior
      this.setupResponsive()

      // Initial render
      this.render()

      // Show initial animation
      this.animateIn()

      this.isInitialized = true
      console.log('mark2 application initialized successfully')
    } catch (error) {
      console.error('Failed to initialize mark2 application:', error)
      this.showError('Failed to initialize application: ' + error.message)
      this.isInitialized = false
      throw error
    }
  }

  async initializeManagers() {
    // Language manager is auto-initialized
    console.log(`Language: ${languageManager.getCurrentLanguage()}`)

    // Theme manager is auto-initialized
    console.log(`Theme: ${themeManager.getCurrentTheme()}`)

    // Update page title
    document.title = languageManager.t('app.title')
  }

  initializeComponents() {
    // Create header
    this.header = new Header({
      onThemeToggle: this.handleThemeToggle.bind(this),
      onExport: this.handleExport.bind(this),
      onExample: this.handleExample.bind(this),
      onHelp: this.handleHelp.bind(this)
    })

    // Create editor panel
    this.editorPanel = new EditorPanel({
      onChange: this.handleMarkdownChange,
      showToolbar: true,
      autoSave: true,
      showStats: true
    })

    // Setup mobile navigation if needed
    if (this.isMobile) {
      this.setupMobileNavigation()
    }
  }

  setupEventListeners() {
    // Window resize
    window.addEventListener('resize', this.handleResize)

    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this))

    // Language changes
    languageManager.subscribe(this.handleLanguageChange.bind(this))

    // Theme changes
    themeManager.subscribe(this.handleThemeChange.bind(this))

    // Prevent accidental page leave
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this))
  }

  setupResponsive() {
    // Initial responsive setup
    this.updateResponsiveState()

    // Listen for orientation changes
    if ('orientation' in screen) {
      screen.orientation.addEventListener('change', () => {
        setTimeout(() => this.updateResponsiveState(), 100)
      })
    }
  }

  setupMobileNavigation() {
    this.mobileNav = document.querySelector('.organism-mobile-nav')
    if (this.mobileNav) {
      const editorTab = this.mobileNav.querySelector('#mobile-editor-tab')
      const mindmapTab = this.mobileNav.querySelector('#mobile-mindmap-tab')

      if (editorTab && mindmapTab) {
        editorTab.addEventListener('click', () => this.setMobileView('editor'))
        mindmapTab.addEventListener('click', () => this.setMobileView('mindmap'))
      }
    }
  }

  render() {
    // Instead of clearing and rebuilding, connect to existing HTML elements
    this.connectToExistingHTML()

    // Initialize UI texts with current language
    this.updateUITexts()

    // Apply initial view state
    this.updateViewState()
  }

  connectToExistingHTML() {
    console.log('Connecting to existing HTML elements...')

    // Connect to header buttons
    this.connectHeaderButtons()

    // Connect to editor elements
    this.connectEditorElements()

    // Connect to mind map container
    this.connectMindMapContainer()

    // Connect mobile navigation
    this.connectMobileNavigation()
  }

  connectHeaderButtons() {
    // Language button
    const languageButton = document.getElementById('language-toggle')
    if (languageButton) {
      console.log('Connecting language button')
      languageButton.addEventListener('click', this.handleLanguageToggle.bind(this))
    }

    // Theme button
    const themeButton = document.getElementById('theme-toggle')
    if (themeButton) {
      console.log('Connecting theme button')
      themeButton.addEventListener('click', this.handleThemeToggle.bind(this))
    }

    // Export button
    const exportButton = document.getElementById('export-button')
    if (exportButton) {
      console.log('Connecting export button')
      exportButton.addEventListener('click', this.handleExport.bind(this))
    }

    // Help button
    const helpButton = document.getElementById('help-button')
    if (helpButton) {
      console.log('Connecting help button')
      helpButton.addEventListener('click', this.handleHelp.bind(this))
    }

    // Connect language modal
    this.connectLanguageModal()

    // Connect theme modal
    this.connectThemeModal()

    // Connect help modal
    this.connectHelpModal()
  }

  connectEditorElements() {
    // Connect to existing editor elements
    const markdownInput = document.getElementById('markdown-input')
    if (markdownInput) {
      console.log('Connecting markdown input')
      markdownInput.addEventListener('input', (e) => {
        this.handleMarkdownChange(e.target.value)
      })
    }

    // Connect editor buttons
    const clearButton = document.getElementById('clear-button')
    if (clearButton) {
      console.log('Connecting clear button')
      clearButton.addEventListener('click', () => {
        if (markdownInput) markdownInput.value = ''
        this.handleMarkdownChange('')
      })
    }

    const exampleButton = document.getElementById('example-button')
    if (exampleButton) {
      console.log('Connecting example button')
      exampleButton.addEventListener('click', this.handleExample.bind(this))
    }
  }

  connectMindMapContainer() {
    this.mindMapContainer = document.getElementById('mind-map-container')
    if (this.mindMapContainer) {
      console.log('Connected to mind map container')

      // Inicializar o renderer
      this.mindMapRenderer = new MindMapRenderer(this.mindMapContainer)
      console.log('Mind map renderer initialized')

      // Conectar botões de controle
      this.connectMindMapControls()
    }
  }

  connectMindMapControls() {
    const zoomInBtn = document.getElementById('zoom-in-button')
    const zoomOutBtn = document.getElementById('zoom-out-button')
    const fitScreenBtn = document.getElementById('fit-screen-button')

    if (zoomInBtn && this.mindMapRenderer) {
      zoomInBtn.addEventListener('click', () => {
        console.log('Zoom in clicked')
        this.mindMapRenderer.zoomIn()
      })
    }

    if (zoomOutBtn && this.mindMapRenderer) {
      zoomOutBtn.addEventListener('click', () => {
        console.log('Zoom out clicked')
        this.mindMapRenderer.zoomOut()
      })
    }

    if (fitScreenBtn && this.mindMapRenderer) {
      fitScreenBtn.addEventListener('click', () => {
        console.log('Fit screen clicked')
        this.mindMapRenderer.resetView()
      })
    }
  }

  connectMobileNavigation() {
    const editorTab = document.getElementById('mobile-editor-tab')
    const mindmapTab = document.getElementById('mobile-mindmap-tab')

    if (editorTab && mindmapTab) {
      console.log('Connecting mobile navigation')
      editorTab.addEventListener('click', () => this.setMobileView('editor'))
      mindmapTab.addEventListener('click', () => this.setMobileView('mindmap'))
    }
  }

  createMindMapContainer() {
    const mindMapSection = document.createElement('section')
    mindMapSection.className = 'organism-mind-map'
    mindMapSection.setAttribute('role', 'img')
    mindMapSection.setAttribute('aria-label', languageManager.t('mindMap.title'))

    // Header
    const header = document.createElement('div')
    header.className = 'organism-mind-map__header'

    const title = document.createElement('h2')
    title.className = 'organism-mind-map__title'
    title.textContent = languageManager.t('mindMap.title')
    header.appendChild(title)

    // Placeholder toolbar
    const toolbar = document.createElement('div')
    toolbar.className = 'molecule-toolbar molecule-toolbar--compact'
    toolbar.innerHTML = `
      <button class="atom-button atom-button--ghost atom-button--small" id="zoom-in-button">
        ${languageManager.t('buttons.zoomIn')}
      </button>
      <button class="atom-button atom-button--ghost atom-button--small" id="zoom-out-button">
        ${languageManager.t('buttons.zoomOut')}
      </button>
      <button class="atom-button atom-button--ghost atom-button--small" id="fit-screen-button">
        ${languageManager.t('buttons.fitScreen')}
      </button>
    `
    header.appendChild(toolbar)

    mindMapSection.appendChild(header)

    // Content
    const content = document.createElement('div')
    content.className = 'organism-mind-map__content'

    const container = document.createElement('div')
    container.id = 'mind-map-container'
    container.className = 'mind-map-container'

    // Empty state
    const emptyState = document.createElement('div')
    emptyState.id = 'empty-state'
    emptyState.className = 'mind-map-empty'
    emptyState.innerHTML = `<p>${languageManager.t('mindMap.empty')}</p>`
    container.appendChild(emptyState)

    content.appendChild(container)
    mindMapSection.appendChild(content)

    this.mindMapContainer = mindMapSection
    this.mainElement.appendChild(mindMapSection)
  }

  // Event handlers
  handleMarkdownChange(value, _stats) {
    console.log('handleMarkdownChange called with value length:', value.length)
    console.log('First 100 chars:', value.substring(0, 100))
    this.currentMarkdown = value

    // Debounce mind map generation
    if (this.generateTimeout) {
      clearTimeout(this.generateTimeout)
    }

    this.generateTimeout = setTimeout(() => {
      console.log('About to generate mind map for markdown')
      this.generateMindMap(value)
    }, 500)
  }

  async generateMindMap(markdown) {
    if (!markdown.trim()) {
      this.showEmptyState()
      return
    }

    try {
      this.setGenerating(true)

      // Parse markdown
      const parsedData = parseMarkdown(markdown)

      if (parsedData.error) {
        throw new Error(parsedData.error)
      }

      // Generate layout
      const layout = generateLayout(parsedData, 800, 600)

      this.currentMindMapData = layout

      // For now, just show a simple representation
      this.renderMindMapPlaceholder(parsedData)
    } catch (error) {
      console.error('Error generating mind map:', error)
      this.showMindMapError(error.message)
    } finally {
      this.setGenerating(false)
    }
  }

  renderMindMapPlaceholder(data) {
    if (!this.mindMapRenderer) {
      console.error('Mind map renderer not initialized')
      return
    }

    console.log('Rendering mind map with SVG renderer:', data)

    // Hide loading and empty states
    const loadingIndicator = document.getElementById('loading-indicator')
    const emptyState = document.getElementById('empty-state')
    const errorState = document.getElementById('error-state')

    if (loadingIndicator) loadingIndicator.style.display = 'none'
    if (emptyState) emptyState.style.display = 'none'
    if (errorState) errorState.style.display = 'none'

    // Render the actual mind map
    try {
      this.mindMapRenderer.render(data)
      console.log('Mind map rendered successfully')
    } catch (error) {
      console.error('Error rendering mind map:', error)
      this.showMindMapError('Erro ao renderizar o mapa mental: ' + error.message)
    }
  }

  showEmptyState() {
    const container = document.getElementById('mind-map-container')
    if (container) {
      container.innerHTML = `
        <div class="mind-map-empty">
          <p>${languageManager.t('mindMap.empty')}</p>
        </div>
      `
    }
  }

  showMindMapError(message) {
    const container = document.getElementById('mind-map-container')
    if (container) {
      container.innerHTML = `
        <div class="mind-map-error">
          <p>${languageManager.t('mindMap.error')}</p>
          <small>${message}</small>
        </div>
      `
    }
  }

  setGenerating(generating) {
    this.isGenerating = generating

    const container = document.getElementById('mind-map-container')
    if (container) {
      if (generating) {
        container.innerHTML = `
          <div class="mind-map-loading">
            <div class="atom-spinner"></div>
            <p>${languageManager.t('mindMap.generating')}</p>
          </div>
        `
      }
    }
  }

  handleThemeToggle() {
    console.log('handleThemeToggle called - opening theme modal')
    this.showThemeModal()
  }

  handleExport() {
    console.log('handleExport called')

    if (!this.mindMapRenderer) {
      alert('No mind map to export. Please create a mind map first.')
      return
    }

    // Get the SVG element from the mind map renderer
    const svgElement = this.mindMapContainer.querySelector('svg')

    if (!svgElement) {
      alert('No mind map visualization found. Please create a mind map first.')
      return
    }

    try {
      exportUtils.showExportModal(svgElement)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to show export options: ' + error.message)
    }
  }

  handleExample() {
    console.log('handleExample called')

    // Load Atomic Design example directly into textarea
    const markdownInput = document.getElementById('markdown-input')
    if (markdownInput) {
      const atomicDesignExample = `# Atomic Design

## Conceitos Fundamentais

O Atomic Design é uma metodologia para criar sistemas de design escaláveis e reutilizáveis.

## Átomos
### Elementos básicos
- Botões
- Inputs de texto
- Labels
- Ícones
- Cores
- Tipografia

### Características
- Não podem ser decompostos
- Elementos HTML básicos
- Propriedades fundamentais

## Moléculas
### Grupos de átomos
- Formulários de busca
- Barras de navegação
- Cards de produto
- Campos de formulário

### Características
- Combinam múltiplos átomos
- Têm função específica
- Reutilizáveis

## Organismos
### Seções complexas
- Header completo
- Sidebar com navegação
- Footer com links
- Lista de produtos

### Características
- Combinam moléculas e átomos
- Seções distintas da interface
- Contexto específico

## Templates
### Estruturas de página
- Layout de homepage
- Sistema de grid
- Wireframes
- Estrutura de conteúdo

### Características
- Esqueleto da página
- Sem conteúdo real
- Foco na estrutura

## Páginas
### Instâncias finais
- Homepage com conteúdo real
- Dashboard do usuário
- Página de configurações
- Página de produto

### Características
- Templates com dados reais
- Experiência final do usuário
- Casos de uso específicos`

      console.log('Loading example content into textarea')
      markdownInput.value = atomicDesignExample

      // Trigger the markdown change event
      this.handleMarkdownChange(atomicDesignExample)

      console.log('Example loaded successfully')
    } else {
      console.error('Markdown input textarea not found')
    }

    // If on mobile, switch to editor view to show the loaded content
    if (this.isMobile) {
      console.log('Setting mobile view to editor')
      this.setMobileView('editor')
    }
  }

  handleHelp() {
    this.showHelpModal()
  }

  handleLanguageToggle() {
    console.log('handleLanguageToggle called - opening language modal')
    this.showLanguageModal()
  }

  // Theme Modal Methods
  connectThemeModal() {
    const themeModal = document.getElementById('theme-modal')
    if (!themeModal) return

    // Close button
    const closeButton = document.getElementById('theme-modal-close')
    if (closeButton) {
      closeButton.addEventListener('click', () => this.hideThemeModal())
    }

    // Backdrop click to close
    const backdrop = themeModal.querySelector('.molecule-modal__backdrop')
    if (backdrop) {
      backdrop.addEventListener('click', () => this.hideThemeModal())
    }

    // Theme radio buttons
    const themeInputs = themeModal.querySelectorAll('input[name="theme"]')
    themeInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        if (e.target.checked) {
          console.log('Theme selected:', e.target.value)
          themeManager.setTheme(e.target.value)
          this.hideThemeModal()
        }
      })
    })

    // Set current theme as selected
    this.updateThemeModalSelection()
  }

  showThemeModal() {
    const themeModal = document.getElementById('theme-modal')
    if (themeModal) {
      this.updateThemeModalSelection()
      themeModal.setAttribute('aria-hidden', 'false')
      themeModal.style.display = 'flex'

      // Focus management
      const firstRadio = themeModal.querySelector('input[name="theme"]:checked')
      if (firstRadio) {
        firstRadio.focus()
      }
    }
  }

  hideThemeModal() {
    const themeModal = document.getElementById('theme-modal')
    if (themeModal) {
      themeModal.setAttribute('aria-hidden', 'true')
      themeModal.style.display = 'none'
    }
  }

  updateThemeModalSelection() {
    const currentTheme = themeManager.getCurrentTheme()
    const themeInput = document.querySelector(`input[name="theme"][value="${currentTheme}"]`)
    if (themeInput) {
      themeInput.checked = true
    }
  }

  // Help Modal Methods
  connectHelpModal() {
    const helpModal = document.getElementById('help-modal')
    if (!helpModal) return

    // Close button
    const closeButton = document.getElementById('help-modal-close')
    if (closeButton) {
      closeButton.addEventListener('click', () => this.hideHelpModal())
    }

    // Backdrop click to close
    const backdrop = helpModal.querySelector('.molecule-modal__backdrop')
    if (backdrop) {
      backdrop.addEventListener('click', () => this.hideHelpModal())
    }

    // Tab buttons
    const tabButtons = helpModal.querySelectorAll('.help-tabs__button')
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const targetTab = e.target.getAttribute('data-tab')
        this.switchHelpTab(targetTab)
      })
    })

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (helpModal.getAttribute('aria-hidden') === 'false') {
          this.hideHelpModal()
        }
        const themeModal = document.getElementById('theme-modal')
        if (themeModal && themeModal.getAttribute('aria-hidden') === 'false') {
          this.hideThemeModal()
        }
      }
    })
  }

  switchHelpTab(tabId) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.help-tabs__button')
    tabButtons.forEach(button => {
      button.classList.remove('active')
      if (button.getAttribute('data-tab') === tabId) {
        button.classList.add('active')
      }
    })

    // Update tab content
    const tabContents = document.querySelectorAll('.help-tab-content')
    tabContents.forEach(content => {
      content.classList.remove('active')
    })

    const targetContent = document.getElementById(`tab-${tabId}`)
    if (targetContent) {
      targetContent.classList.add('active')
    }
  }

  showHelpModal() {
    const helpModal = document.getElementById('help-modal')
    if (helpModal) {
      helpModal.setAttribute('aria-hidden', 'false')
      helpModal.style.display = 'flex'
    }
  }

  hideHelpModal() {
    const helpModal = document.getElementById('help-modal')
    if (helpModal) {
      helpModal.setAttribute('aria-hidden', 'true')
      helpModal.style.display = 'none'
    }
  }

  // Language Modal Methods
  connectLanguageModal() {
    const languageModal = document.getElementById('language-modal')
    if (!languageModal) return

    // Close button
    const closeButton = document.getElementById('language-modal-close')
    if (closeButton) {
      closeButton.addEventListener('click', () => this.hideLanguageModal())
    }

    // Backdrop click to close
    const backdrop = languageModal.querySelector('.molecule-modal__backdrop')
    if (backdrop) {
      backdrop.addEventListener('click', () => this.hideLanguageModal())
    }

    // Language radio buttons
    const languageInputs = languageModal.querySelectorAll('input[name="language"]')
    languageInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        if (e.target.checked) {
          console.log('Language selected:', e.target.value)
          languageManager.setLanguage(e.target.value)
          this.hideLanguageModal()
        }
      })
    })

    // Set current language as selected
    this.updateLanguageModalSelection()
  }

  showLanguageModal() {
    const languageModal = document.getElementById('language-modal')
    if (languageModal) {
      this.updateLanguageModalSelection()
      languageModal.setAttribute('aria-hidden', 'false')
      languageModal.style.display = 'flex'

      // Focus management
      const firstRadio = languageModal.querySelector('input[name="language"]:checked')
      if (firstRadio) {
        firstRadio.focus()
      }
    }
  }

  hideLanguageModal() {
    const languageModal = document.getElementById('language-modal')
    if (languageModal) {
      languageModal.setAttribute('aria-hidden', 'true')
      languageModal.style.display = 'none'
    }
  }

  updateLanguageModalSelection() {
    const currentLanguage = languageManager.getCurrentLanguage()
    const languageInput = document.querySelector(`input[name="language"][value="${currentLanguage}"]`)
    if (languageInput) {
      languageInput.checked = true
    }
  }

  handleResize() {
    const wasMobile = this.isMobile
    this.isMobile = window.innerWidth <= 767

    if (wasMobile !== this.isMobile) {
      this.updateResponsiveState()
    }
  }

  updateResponsiveState() {
    if (this.isMobile) {
      document.body.classList.add('mobile-layout')
      this.currentView = 'editor'

      if (this.header) {
        this.header.setMobileMode(true)
      }
      if (this.editorPanel) {
        this.editorPanel.setMobileMode(true)
      }
    } else {
      document.body.classList.remove('mobile-layout')
      this.currentView = 'split'

      if (this.header) {
        this.header.setMobileMode(false)
      }
      if (this.editorPanel) {
        this.editorPanel.setMobileMode(false)
      }
    }

    this.updateViewState()
  }

  setMobileView(view) {
    if (!this.isMobile) return

    this.currentView = view
    this.updateViewState()

    // Update mobile nav tabs
    const editorTab = document.getElementById('mobile-editor-tab')
    const mindmapTab = document.getElementById('mobile-mindmap-tab')

    if (editorTab && mindmapTab) {
      editorTab.setAttribute('aria-pressed', view === 'editor' ? 'true' : 'false')
      mindmapTab.setAttribute('aria-pressed', view === 'mindmap' ? 'true' : 'false')
    }
  }

  updateViewState() {
    const editorElement = this.editorPanel?.element
    const mindMapElement = this.mindMapContainer

    if (!editorElement || !mindMapElement) return

    if (this.isMobile) {
      // Mobile: show only active panel
      if (this.currentView === 'editor') {
        editorElement.classList.add('active')
        mindMapElement.classList.remove('active')
      } else {
        editorElement.classList.remove('active')
        mindMapElement.classList.add('active')
      }
    } else {
      // Desktop: show both panels
      editorElement.classList.add('active')
      mindMapElement.classList.add('active')
    }
  }

  handleKeyboardShortcuts(event) {
    // Global shortcuts
    if ((event.ctrlKey || event.metaKey)) {
      switch (event.key) {
      case ',':
        event.preventDefault()
        this.handleHelp()
        break
      case 'e':
        if (this.isMobile) {
          event.preventDefault()
          this.setMobileView('editor')
        }
        break
      case 'm':
        if (this.isMobile) {
          event.preventDefault()
          this.setMobileView('mindmap')
        }
        break
      }
    }
  }

  handleLanguageChange(newLanguage) {
    console.log(`Language changed to: ${newLanguage}`)
    document.title = languageManager.t('app.title')
    this.updateUITexts()
  }

  updateUITexts() {
    // Update all elements with data-i18n attribute
    const elementsWithI18n = document.querySelectorAll('[data-i18n]')

    elementsWithI18n.forEach(element => {
      const translationKey = element.getAttribute('data-i18n')

      // Handle specific elements that need special treatment
      if (element.tagName === 'INPUT' && element.type === 'text') {
        // For input placeholders
        const placeholderKey = element.getAttribute('data-i18n-attr')
        if (placeholderKey && placeholderKey.includes('placeholder')) {
          element.placeholder = languageManager.t(translationKey)
        }
      } else if (element.tagName === 'TEXTAREA') {
        // For textarea placeholders
        const placeholderKey = element.getAttribute('data-i18n-attr')
        if (placeholderKey && placeholderKey.includes('placeholder')) {
          element.placeholder = languageManager.t(translationKey)
        }
      } else {
        // For regular text content
        const translatedText = languageManager.t(translationKey)
        if (translatedText) {
          element.textContent = translatedText
        }
      }
    })

    // Update elements with data-i18n-attr (attributes)
    const elementsWithI18nAttr = document.querySelectorAll('[data-i18n-attr]')

    elementsWithI18nAttr.forEach(element => {
      const attributes = element.getAttribute('data-i18n-attr').split(',')
      const translationKey = element.getAttribute('data-i18n')

      if (translationKey) {
        const translatedText = languageManager.t(translationKey)

        attributes.forEach(attr => {
          const trimmedAttr = attr.trim()
          if (trimmedAttr && translatedText) {
            element.setAttribute(trimmedAttr, translatedText)
          }
        })
      }
    })

    // Force update of placeholders and special elements
    const markdownInput = document.getElementById('markdown-input')
    if (markdownInput) {
      markdownInput.placeholder = languageManager.t('editor.placeholder')
    }

    // Update language labels to show native names correctly
    this.updateLanguageLabels()
  }

  updateLanguageLabels() {
    const ptInput = document.querySelector('input[value="pt"]')
    const enInput = document.querySelector('input[value="en"]')
    const esInput = document.querySelector('input[value="es"]')

    const ptLabel = ptInput?.closest('.atom-language-option')?.querySelector('.atom-language-option__label')
    const enLabel = enInput?.closest('.atom-language-option')?.querySelector('.atom-language-option__label')
    const esLabel = esInput?.closest('.atom-language-option')?.querySelector('.atom-language-option__label')

    if (ptLabel) ptLabel.textContent = 'Português'
    if (enLabel) enLabel.textContent = 'English'
    if (esLabel) esLabel.textContent = 'Español'
  }

  handleThemeChange(newTheme) {
    console.log(`Theme changed to: ${newTheme}`)
  }

  handleBeforeUnload(event) {
    if (this.editorPanel && this.editorPanel.textEditor &&
        this.editorPanel.textEditor.isDirtyContent()) {
      event.preventDefault()
      event.returnValue = ''
      return ''
    }
  }

  animateIn() {
    if (this.header) {
      this.header.animateIn()
    }

    setTimeout(() => {
      if (this.editorPanel) {
        this.editorPanel.animateIn()
      }
    }, 200)
  }

  showError(message) {
    console.error('Application Error:', message)

    // Show error in UI
    const errorDiv = document.createElement('div')
    errorDiv.className = 'app-error'
    errorDiv.innerHTML = `
      <h2>Error</h2>
      <p>${message}</p>
      <button onclick="location.reload()">Reload</button>
    `

    document.body.appendChild(errorDiv)
  }

  // Public API
  getMarkdown() {
    return this.currentMarkdown
  }

  setMarkdown(markdown) {
    if (this.editorPanel) {
      this.editorPanel.setValue(markdown)
    }
  }

  exportData() {
    return {
      markdown: this.currentMarkdown,
      mindMap: this.currentMindMapData,
      language: languageManager.getCurrentLanguage(),
      theme: themeManager.getCurrentTheme(),
      timestamp: new Date().toISOString()
    }
  }

  destroy() {
    // Clean up event listeners
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('keydown', this.handleKeyboardShortcuts)
    window.removeEventListener('beforeunload', this.handleBeforeUnload)

    // Clear timeouts
    if (this.generateTimeout) {
      clearTimeout(this.generateTimeout)
    }

    // Destroy components
    if (this.header) {
      this.header.destroy()
    }
    if (this.editorPanel) {
      this.editorPanel.destroy()
    }

    console.log('mark2 application destroyed')
  }
}

// Initialize application when DOM is ready
const app = new Mark2App()

// Auto-initialize
app.init().catch(error => {
  console.error('Failed to start mark2:', error)
})

// Export for global access (debugging)
window.mark2App = app

// Export the class
export default Mark2App
