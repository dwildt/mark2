/**
 * TextInput Atom Component
 * Basic text input element with support for different input types
 */

class TextInput {
  constructor(options = {}) {
    this.type = options.type || 'text'
    this.placeholder = options.placeholder || ''
    this.value = options.value || ''
    this.disabled = options.disabled || false
    this.required = options.required || false
    this.multiline = options.multiline || false
    this.rows = options.rows || 3
    this.onChange = options.onChange || null
    this.onFocus = options.onFocus || null
    this.onBlur = options.onBlur || null
    this.ariaLabel = options.ariaLabel || ''
    this.id = options.id || `text-input-${Date.now()}`

    this.element = null
  }

  render() {
    if (this.element) {
      return this.element
    }

    this.element = this.multiline
      ? document.createElement('textarea')
      : document.createElement('input')

    this.setupElement()
    this.attachEventListeners()

    return this.element
  }

  setupElement() {
    this.element.className = this.getClassName()
    this.element.placeholder = this.placeholder
    this.element.value = this.value
    this.element.disabled = this.disabled
    this.element.required = this.required
    this.element.id = this.id

    if (this.ariaLabel) {
      this.element.setAttribute('aria-label', this.ariaLabel)
    }

    if (!this.multiline) {
      this.element.type = this.type
    } else {
      this.element.rows = this.rows
      this.element.setAttribute('resize', 'vertical')
    }
  }

  getClassName() {
    const baseClass = 'atom-text-input'
    const multilineClass = this.multiline ? 'atom-text-input--multiline' : ''
    const disabledClass = this.disabled ? 'atom-text-input--disabled' : ''

    return [baseClass, multilineClass, disabledClass]
      .filter(Boolean)
      .join(' ')
  }

  attachEventListeners() {
    if (this.onChange) {
      this.element.addEventListener('input', (event) => {
        this.value = event.target.value
        this.onChange(event.target.value, event)
      })
    }

    if (this.onFocus) {
      this.element.addEventListener('focus', this.onFocus)
    }

    if (this.onBlur) {
      this.element.addEventListener('blur', this.onBlur)
    }

    // Auto-resize for multiline inputs
    if (this.multiline) {
      this.element.addEventListener('input', this.autoResize.bind(this))
    }
  }

  autoResize() {
    if (!this.multiline || !this.element) return

    this.element.style.height = 'auto'
    this.element.style.height = this.element.scrollHeight + 'px'
  }

  getValue() {
    return this.element ? this.element.value : this.value
  }

  setValue(value) {
    this.value = value
    if (this.element) {
      this.element.value = value
      if (this.multiline) {
        this.autoResize()
      }
    }
  }

  setPlaceholder(placeholder) {
    this.placeholder = placeholder
    if (this.element) {
      this.element.placeholder = placeholder
    }
  }

  setDisabled(disabled) {
    this.disabled = disabled
    if (this.element) {
      this.element.disabled = disabled
      this.element.className = this.getClassName()
    }
  }

  focus() {
    if (this.element) {
      this.element.focus()
    }
  }

  blur() {
    if (this.element) {
      this.element.blur()
    }
  }

  select() {
    if (this.element) {
      this.element.select()
    }
  }

  setSelectionRange(start, end) {
    if (this.element && this.element.setSelectionRange) {
      this.element.setSelectionRange(start, end)
    }
  }

  insertTextAtCursor(text) {
    if (!this.element) return

    const start = this.element.selectionStart
    const end = this.element.selectionEnd
    const value = this.element.value

    const newValue = value.slice(0, start) + text + value.slice(end)
    this.setValue(newValue)

    // Set cursor position after inserted text
    const newCursorPos = start + text.length
    setTimeout(() => {
      this.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.removeEventListener('input', this.onChange)
      this.element.removeEventListener('focus', this.onFocus)
      this.element.removeEventListener('blur', this.onBlur)
      this.element.parentNode.removeChild(this.element)
    }
    this.element = null
  }
}

export default TextInput
