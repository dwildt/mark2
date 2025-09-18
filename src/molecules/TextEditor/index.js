/**
 * TextEditor Molecule Component
 * Enhanced text input with markdown support and features
 */

import TextInput from '../../atoms/TextInput/index.js'
import languageManager from '../../i18n/LanguageManager.js'

class TextEditor {
  constructor(options = {}) {
    this.value = options.value || ''
    this.placeholder = options.placeholder || languageManager.t('editor.placeholder')
    this.onChange = options.onChange || null
    this.onFocus = options.onFocus || null
    this.onBlur = options.onBlur || null
    this.autoSave = options.autoSave !== false
    this.showStats = options.showStats !== false
    this.enableShortcuts = options.enableShortcuts !== false

    this.element = null
    this.textInput = null
    this.statsElement = null
    this.statusElement = null

    // Editor state
    this.isDirty = false
    this.lastSavedValue = this.value
    this.autoSaveTimeout = null

    // Statistics
    this.stats = {
      characters: 0,
      words: 0,
      lines: 0
    }

    // Subscribe to language changes
    this.unsubscribe = languageManager.subscribe(this.updateLabels.bind(this))
  }

  render() {
    if (this.element) {
      return this.element
    }

    this.element = document.createElement('div')
    this.element.className = 'molecule-text-editor'

    // Create text input
    this.createTextInput()

    // Create stats bar if enabled
    if (this.showStats) {
      this.createStatsBar()
    }

    // Setup auto-save if enabled
    if (this.autoSave) {
      this.setupAutoSave()
    }

    // Setup keyboard shortcuts if enabled
    if (this.enableShortcuts) {
      this.setupKeyboardShortcuts()
    }

    // Initial stats calculation
    this.updateStats()

    return this.element
  }

  createTextInput() {
    this.textInput = new TextInput({
      multiline: true,
      rows: 20,
      placeholder: this.placeholder,
      value: this.value,
      ariaLabel: languageManager.t('editor.title'),
      onChange: this.handleChange.bind(this),
      onFocus: this.handleFocus.bind(this),
      onBlur: this.handleBlur.bind(this)
    })

    const inputElement = this.textInput.render()
    inputElement.classList.add('molecule-text-editor__input')

    this.element.appendChild(inputElement)
  }

  createStatsBar() {
    const statsBar = document.createElement('div')
    statsBar.className = 'molecule-text-editor__stats'

    // Stats display
    this.statsElement = document.createElement('div')
    this.statsElement.className = 'molecule-text-editor__stats-display'
    statsBar.appendChild(this.statsElement)

    // Status display
    this.statusElement = document.createElement('div')
    this.statusElement.className = 'molecule-text-editor__status'
    statsBar.appendChild(this.statusElement)

    this.element.appendChild(statsBar)

    this.updateStatsDisplay()
    this.updateStatusDisplay()
  }

  handleChange(value, event) {
    this.value = value
    this.isDirty = value !== this.lastSavedValue

    // Update stats
    this.updateStats()

    // Trigger auto-save
    if (this.autoSave) {
      this.triggerAutoSave()
    }

    // Call external onChange handler
    if (this.onChange) {
      this.onChange(value, event, this.stats)
    }

    // Update status
    this.updateStatusDisplay()
  }

  handleFocus(event) {
    if (this.onFocus) {
      this.onFocus(event)
    }
  }

  handleBlur(event) {
    if (this.onBlur) {
      this.onBlur(event)
    }

    // Save on blur if auto-save is enabled
    if (this.autoSave && this.isDirty) {
      this.save()
    }
  }

  updateStats() {
    const text = this.value || ''

    this.stats.characters = text.length
    this.stats.words = text.trim() ? text.trim().split(/\s+/).length : 0
    this.stats.lines = text.split('\n').length

    if (this.statsElement) {
      this.updateStatsDisplay()
    }
  }

  updateStatsDisplay() {
    if (!this.statsElement) return

    const parts = [
      `${this.stats.characters} ${languageManager.t('editor.characterCount')}`,
      `${this.stats.words} ${languageManager.t('editor.wordCount')}`,
      `${this.stats.lines} ${languageManager.t('editor.lineCount')}`
    ]

    this.statsElement.textContent = parts.join(' • ')
  }

  updateStatusDisplay() {
    if (!this.statusElement) return

    if (this.isDirty) {
      this.statusElement.textContent = languageManager.t('editor.unsaved')
      this.statusElement.className = 'molecule-text-editor__status molecule-text-editor__status--unsaved'
    } else {
      this.statusElement.textContent = languageManager.t('editor.saved')
      this.statusElement.className = 'molecule-text-editor__status molecule-text-editor__status--saved'
    }
  }

  updateLabels() {
    // Update placeholder
    if (this.textInput) {
      this.textInput.setPlaceholder(languageManager.t('editor.placeholder'))
    }

    // Update stats and status
    this.updateStatsDisplay()
    this.updateStatusDisplay()
  }

  // Auto-save functionality
  setupAutoSave() {
    // Load from localStorage if available
    try {
      const saved = localStorage.getItem('mark2-editor-content')
      if (saved && !this.value) {
        this.setValue(saved)
        this.lastSavedValue = saved
        this.isDirty = false
      }
    } catch (error) {
      console.warn('Could not load auto-saved content:', error)
    }
  }

  triggerAutoSave() {
    // Debounce auto-save
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout)
    }

    this.autoSaveTimeout = setTimeout(() => {
      this.save()
    }, 2000) // Save after 2 seconds of inactivity
  }

  save() {
    try {
      localStorage.setItem('mark2-editor-content', this.value)
      this.lastSavedValue = this.value
      this.isDirty = false
      this.updateStatusDisplay()

      // Show temporary saved indicator
      this.showSavedIndicator()
    } catch (error) {
      console.error('Could not save content:', error)
      this.showError(languageManager.t('errors.saveError'))
    }
  }

  showSavedIndicator() {
    if (!this.statusElement) return

    this.statusElement.classList.add('molecule-text-editor__status--flash')
    setTimeout(() => {
      this.statusElement.classList.remove('molecule-text-editor__status--flash')
    }, 1000)
  }

  showError(message) {
    if (!this.statusElement) return

    const originalText = this.statusElement.textContent
    this.statusElement.textContent = message
    this.statusElement.className = 'molecule-text-editor__status molecule-text-editor__status--error'

    setTimeout(() => {
      this.updateStatusDisplay()
    }, 3000)
  }

  // Keyboard shortcuts
  setupKeyboardShortcuts() {
    if (!this.textInput || !this.textInput.element) return

    this.textInput.element.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + S to save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        this.save()
      }

      // Ctrl/Cmd + B for bold
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault()
        this.insertMarkdown('**', '**')
      }

      // Ctrl/Cmd + I for italic
      if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
        event.preventDefault()
        this.insertMarkdown('*', '*')
      }

      // Ctrl/Cmd + K for link
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        this.insertMarkdown('[', '](url)')
      }

      // Tab for list indentation
      if (event.key === 'Tab') {
        const cursorPos = this.textInput.element.selectionStart
        const lineStart = this.value.lastIndexOf('\n', cursorPos - 1) + 1
        const lineText = this.value.substring(lineStart, cursorPos)

        if (lineText.match(/^\s*[-*+]\s/) || lineText.match(/^\s*\d+\.\s/)) {
          event.preventDefault()
          this.indentLine(event.shiftKey ? -1 : 1)
        }
      }
    })
  }

  insertMarkdown(before, after = '') {
    if (!this.textInput) return

    const element = this.textInput.element
    const start = element.selectionStart
    const end = element.selectionEnd
    const selectedText = this.value.substring(start, end)

    const newText = before + selectedText + after
    this.textInput.insertTextAtCursor(newText)

    // Set cursor position
    const newCursorPos = start + before.length + selectedText.length
    setTimeout(() => {
      element.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  indentLine(direction) {
    if (!this.textInput) return

    const element = this.textInput.element
    const cursorPos = element.selectionStart
    const lineStart = this.value.lastIndexOf('\n', cursorPos - 1) + 1
    const lineEnd = this.value.indexOf('\n', cursorPos)
    const lineEndPos = lineEnd === -1 ? this.value.length : lineEnd

    const lineText = this.value.substring(lineStart, lineEndPos)
    let newLineText

    if (direction > 0) {
      // Indent
      newLineText = '  ' + lineText
    } else {
      // Unindent
      newLineText = lineText.replace(/^  /, '')
    }

    const newValue = this.value.substring(0, lineStart) + newLineText + this.value.substring(lineEndPos)
    this.setValue(newValue)

    // Restore cursor position
    const newCursorPos = cursorPos + (newLineText.length - lineText.length)
    setTimeout(() => {
      element.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  // Public API
  getValue() {
    return this.value
  }

  setValue(value) {
    this.value = value
    if (this.textInput) {
      this.textInput.setValue(value)
    }
    this.updateStats()
    this.isDirty = value !== this.lastSavedValue
    this.updateStatusDisplay()
  }

  clear() {
    this.setValue('')
  }

  focus() {
    if (this.textInput) {
      this.textInput.focus()
    }
  }

  insertText(text) {
    if (this.textInput) {
      this.textInput.insertTextAtCursor(text)
    }
  }

  getStats() {
    return { ...this.stats }
  }

  isDirtyContent() {
    return this.isDirty
  }

  destroy() {
    // Clear auto-save timeout
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout)
    }

    // Save before destroying if dirty
    if (this.autoSave && this.isDirty) {
      this.save()
    }

    // Unsubscribe from language changes
    if (this.unsubscribe) {
      this.unsubscribe()
    }

    // Destroy text input
    if (this.textInput) {
      this.textInput.destroy()
    }

    // Remove element
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }

    this.element = null
    this.textInput = null
    this.statsElement = null
    this.statusElement = null
  }
}

export default TextEditor