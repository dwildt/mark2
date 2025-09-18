/**
 * EditorPanel Organism Component
 * Complete editor section with toolbar and text editor
 */

import TextEditor from '../../molecules/TextEditor/index.js'
import Toolbar from '../../molecules/Toolbar/index.js'
import languageManager from '../../i18n/LanguageManager.js'
// Example content will be inline to avoid fetch issues

class EditorPanel {
  constructor(options = {}) {
    this.onChange = options.onChange || null
    this.onFocus = options.onFocus || null
    this.onBlur = options.onBlur || null
    this.showToolbar = options.showToolbar !== false
    this.autoSave = options.autoSave !== false
    this.showStats = options.showStats !== false

    this.element = null
    this.headerElement = null
    this.titleElement = null
    this.toolbar = null
    this.textEditor = null

    // Panel state
    this.isVisible = true
    this.isMinimized = false

    // Subscribe to language changes
    this.unsubscribe = languageManager.subscribe(this.updateLabels.bind(this))
  }

  render() {
    if (this.element) {
      return this.element
    }

    this.element = document.createElement('section')
    this.element.className = 'organism-editor-panel'
    this.element.setAttribute('role', 'region')
    this.element.setAttribute('aria-label', languageManager.t('editor.title'))

    // Create header
    this.createHeader()

    // Create content area
    this.createContent()

    // Load example content by default
    this.loadExample()

    return this.element
  }

  createHeader() {
    this.headerElement = document.createElement('div')
    this.headerElement.className = 'organism-editor-panel__header'

    // Title
    this.titleElement = document.createElement('h2')
    this.titleElement.className = 'organism-editor-panel__title'
    this.titleElement.textContent = languageManager.t('editor.title')
    this.headerElement.appendChild(this.titleElement)

    // Toolbar
    if (this.showToolbar) {
      this.createToolbar()
    }

    this.element.appendChild(this.headerElement)
  }

  createToolbar() {
    const actions = [
      {
        key: 'clear',
        variant: 'ghost',
        onClick: this.handleClear.bind(this),
        ariaLabel: 'buttons.clear',
        title: 'buttons.clear'
      },
      {
        key: 'example',
        variant: 'ghost',
        onClick: this.handleLoadExample.bind(this),
        ariaLabel: 'buttons.example',
        title: 'buttons.example'
      }
    ]

    this.toolbar = new Toolbar({
      variant: 'compact',
      actions,
      showLanguageSelector: false,
      orientation: 'horizontal'
    })

    const toolbarElement = this.toolbar.render()
    toolbarElement.classList.add('organism-editor-panel__toolbar')

    this.headerElement.appendChild(toolbarElement)
  }

  createContent() {
    const contentElement = document.createElement('div')
    contentElement.className = 'organism-editor-panel__content'

    // Create text editor
    this.textEditor = new TextEditor({
      placeholder: languageManager.t('editor.placeholder'),
      onChange: this.handleChange.bind(this),
      onFocus: this.handleFocus.bind(this),
      onBlur: this.handleBlur.bind(this),
      autoSave: this.autoSave,
      showStats: this.showStats,
      enableShortcuts: true
    })

    const editorElement = this.textEditor.render()
    contentElement.appendChild(editorElement)

    this.element.appendChild(contentElement)
  }

  handleChange(value, event, stats) {
    // Emit change event to parent
    if (this.onChange) {
      this.onChange(value, stats, this)
    }
  }

  handleFocus(event) {
    this.element.classList.add('organism-editor-panel--focused')

    if (this.onFocus) {
      this.onFocus(event, this)
    }
  }

  handleBlur(event) {
    this.element.classList.remove('organism-editor-panel--focused')

    if (this.onBlur) {
      this.onBlur(event, this)
    }
  }

  handleClear() {
    this.clear()
  }

  handleLoadExample() {
    this.loadExample()
  }

  updateLabels() {
    // Update title
    if (this.titleElement) {
      this.titleElement.textContent = languageManager.t('editor.title')
    }

    // Update aria-label
    if (this.element) {
      this.element.setAttribute('aria-label', languageManager.t('editor.title'))
    }
  }

  // Content management
  getValue() {
    return this.textEditor ? this.textEditor.getValue() : ''
  }

  setValue(value) {
    if (this.textEditor) {
      this.textEditor.setValue(value)
    }
  }

  clear() {
    if (this.textEditor) {
      this.textEditor.clear()
    }
  }

  insertText(text) {
    if (this.textEditor) {
      this.textEditor.insertText(text)
    }
  }

  loadExample() {
    // Use inline atomic design example content
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

    this.setValue(atomicDesignExample)
  }

  // Statistics
  getStats() {
    return this.textEditor ? this.textEditor.getStats() : { characters: 0, words: 0, lines: 0 }
  }

  // State management
  focus() {
    if (this.textEditor) {
      this.textEditor.focus()
    }
  }

  show() {
    this.isVisible = true
    if (this.element) {
      this.element.style.display = 'flex'
      this.element.classList.remove('organism-editor-panel--hidden')
      this.element.classList.add('organism-editor-panel--visible')
    }
  }

  hide() {
    this.isVisible = false
    if (this.element) {
      this.element.classList.remove('organism-editor-panel--visible')
      this.element.classList.add('organism-editor-panel--hidden')

      setTimeout(() => {
        if (!this.isVisible) {
          this.element.style.display = 'none'
        }
      }, 300)
    }
  }

  minimize() {
    this.isMinimized = true
    if (this.element) {
      this.element.classList.add('organism-editor-panel--minimized')
    }
  }

  maximize() {
    this.isMinimized = false
    if (this.element) {
      this.element.classList.remove('organism-editor-panel--minimized')
    }
  }

  toggleMinimize() {
    if (this.isMinimized) {
      this.maximize()
    } else {
      this.minimize()
    }
  }

  setLoading(loading) {
    if (loading) {
      this.element?.classList.add('organism-editor-panel--loading')
      if (this.toolbar) {
        this.toolbar.disableAction('clear')
        this.toolbar.disableAction('example')
      }
    } else {
      this.element?.classList.remove('organism-editor-panel--loading')
      if (this.toolbar) {
        this.toolbar.enableAction('clear')
        this.toolbar.enableAction('example')
      }
    }
  }

  // Responsive behavior
  setMobileMode(isMobile) {
    if (isMobile) {
      this.element?.classList.add('organism-editor-panel--mobile')
      if (this.toolbar) {
        this.toolbar.setVariant('mobile')
      }
    } else {
      this.element?.classList.remove('organism-editor-panel--mobile')
      if (this.toolbar) {
        this.toolbar.setVariant('compact')
      }
    }
  }

  // Animation
  animateIn() {
    if (this.element) {
      this.element.classList.add('organism-editor-panel--animate-in')

      setTimeout(() => {
        this.element.classList.remove('organism-editor-panel--animate-in')
      }, 500)
    }
  }

  // Export/Import
  exportContent() {
    const content = this.getValue()
    const stats = this.getStats()

    return {
      content,
      stats,
      timestamp: new Date().toISOString(),
      language: languageManager.getCurrentLanguage()
    }
  }

  importContent(data) {
    if (data && data.content) {
      this.setValue(data.content)
      return true
    }
    return false
  }

  // Error handling
  showError(message) {
    this.element?.classList.add('organism-editor-panel--error')

    // Show error message in status area
    if (this.textEditor && this.textEditor.showError) {
      this.textEditor.showError(message)
    }

    setTimeout(() => {
      this.element?.classList.remove('organism-editor-panel--error')
    }, 3000)
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

    // Destroy text editor
    if (this.textEditor) {
      this.textEditor.destroy()
    }

    // Remove element
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }

    this.element = null
    this.headerElement = null
    this.titleElement = null
    this.toolbar = null
    this.textEditor = null
  }
}

export default EditorPanel