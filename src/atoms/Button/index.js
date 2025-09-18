/**
 * Button Atom Component
 * Basic interactive button element following atomic design principles
 */

class Button {
  constructor(text, onClick, variant = 'primary', disabled = false) {
    this.text = text
    this.onClick = onClick
    this.variant = variant
    this.disabled = disabled
    this.element = null
  }

  render() {
    if (this.element) {
      return this.element
    }

    this.element = document.createElement('button')
    this.element.className = this.getClassName()
    this.element.textContent = this.text
    this.element.disabled = this.disabled

    // Debug: ensure button is clickable
    this.element.style.position = 'relative'
    this.element.style.zIndex = '10'
    this.element.style.pointerEvents = 'auto'

    if (!this.disabled && this.onClick) {
      console.log('Adding click listener to button:', this.text)
      this.element.addEventListener('click', (event) => {
        console.log('Button clicked:', this.text)
        this.onClick(event)
      })
      this.element.addEventListener('keydown', this.handleKeyDown.bind(this))
    } else {
      console.log('Button created without click handler:', this.text, 'disabled:', this.disabled, 'onClick:', !!this.onClick)
    }

    return this.element
  }

  getClassName() {
    const baseClass = 'atom-button'
    const variantClass = `atom-button--${this.variant}`
    const disabledClass = this.disabled ? 'atom-button--disabled' : ''

    return [baseClass, variantClass, disabledClass]
      .filter(Boolean)
      .join(' ')
  }

  handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (this.onClick) {
        this.onClick(event)
      }
    }
  }

  setText(newText) {
    this.text = newText
    if (this.element) {
      this.element.textContent = newText
    }
  }

  setDisabled(disabled) {
    this.disabled = disabled
    if (this.element) {
      this.element.disabled = disabled
      this.element.className = this.getClassName()
    }
  }

  setVariant(variant) {
    this.variant = variant
    if (this.element) {
      this.element.className = this.getClassName()
    }
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.removeEventListener('click', this.onClick)
      this.element.removeEventListener('keydown', this.handleKeyDown)
      this.element.parentNode.removeChild(this.element)
    }
    this.element = null
  }
}

export default Button
