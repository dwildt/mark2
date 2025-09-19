/**
 * Button Atom Component
 * Basic interactive button element following atomic design principles
 */

class Button {
  constructor(text, onClick, variant = 'primary', disabled = false, icon = null) {
    this.text = text
    this.onClick = onClick
    this.variant = variant
    this.disabled = disabled
    this.icon = icon
    this.loading = false
    this.size = 'medium'
    this.element = null
  }

  render() {
    if (this.element) {
      return this.element
    }

    this.element = document.createElement('button')
    this.element.className = this.getClassName()
    this.element.disabled = this.disabled || this.loading

    // Set ARIA attributes
    this.element.setAttribute('role', 'button')
    this.element.setAttribute('tabindex', this.disabled ? '-1' : '0')
    this.element.setAttribute('aria-busy', this.loading ? 'true' : 'false')

    // Build button content
    this.buildButtonContent()

    // Debug: ensure button is clickable
    this.element.style.position = 'relative'
    this.element.style.zIndex = '10'
    this.element.style.pointerEvents = 'auto'

    if (!this.disabled && !this.loading && this.onClick) {
      console.log('Adding click listener to button:', this.text)
      this.element.addEventListener('click', (event) => {
        console.log('Button clicked:', this.text)
        this.onClick(event)
      })
      this.element.addEventListener('keydown', this.handleKeyDown.bind(this))
    } else {
      console.log('Button created without click handler:', this.text, 'disabled:', this.disabled, 'onClick:', !!this.onClick)
    }

    // Add focus/blur event listeners
    this.element.addEventListener('focus', (event) => {
      if (this.onFocus) this.onFocus(event)
    })

    this.element.addEventListener('blur', (event) => {
      if (this.onBlur) this.onBlur(event)
    })

    return this.element
  }

  buildButtonContent() {
    this.element.innerHTML = ''

    // Add icon if present
    if (this.icon) {
      const iconEl = document.createElement('span')
      iconEl.className = 'atom-button__icon'
      iconEl.textContent = this.icon
      this.element.appendChild(iconEl)
    }

    // Add loading spinner if loading
    if (this.loading) {
      const spinnerEl = document.createElement('span')
      spinnerEl.className = 'atom-button__spinner'
      spinnerEl.textContent = '⏳'
      this.element.appendChild(spinnerEl)
    }

    // Add text
    const textEl = document.createElement('span')
    textEl.className = 'atom-button__text'
    textEl.textContent = this.text
    this.element.appendChild(textEl)
  }

  getClassName() {
    const classes = ['atom-button']

    // Validate variant and fallback to primary
    const validVariants = ['primary', 'secondary', 'danger', 'success', 'warning']
    const variant = validVariants.includes(this.variant) ? this.variant : 'primary'
    classes.push(`atom-button--${variant}`)

    if (this.disabled) classes.push('atom-button--disabled')
    if (this.loading) classes.push('atom-button--loading')
    if (this.size !== 'medium') classes.push(`atom-button--${this.size}`)

    return classes.join(' ')
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
      // Optimize: just update text span if it exists
      const textSpan = this.element.querySelector('.atom-button__text')
      if (textSpan) {
        textSpan.textContent = newText
      } else {
        this.buildButtonContent()
      }
    }
  }

  setDisabled(disabled) {
    this.disabled = disabled
    if (this.element) {
      this.element.disabled = disabled || this.loading
      this.element.className = this.getClassName()
      this.element.setAttribute('tabindex', disabled ? '-1' : '0')
    }
  }

  setVariant(variant) {
    this.variant = variant
    if (this.element) {
      this.element.className = this.getClassName()
    }
  }

  setLoading(loading) {
    this.loading = loading
    if (this.element) {
      this.element.disabled = this.disabled || loading
      this.element.className = this.getClassName()
      this.element.setAttribute('aria-busy', loading ? 'true' : 'false')
      this.buildButtonContent()
    }
  }

  setIcon(icon) {
    this.icon = icon
    if (this.element) {
      this.buildButtonContent()
    }
  }

  setSize(size) {
    this.size = size
    if (this.element) {
      this.element.className = this.getClassName()
    }
  }

  setAriaLabel(label) {
    if (this.element) {
      this.element.setAttribute('aria-label', label)
    }
  }

  setAriaDescribedBy(id) {
    if (this.element) {
      this.element.setAttribute('aria-describedby', id)
    }
  }

  addClass(className) {
    if (this.element) {
      this.element.classList.add(className)
    }
  }

  removeClass(className) {
    if (this.element) {
      this.element.classList.remove(className)
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

  destroy() {
    if (this.element) {
      // Remove all event listeners
      this.element.removeEventListener('click', this.onClick)
      this.element.removeEventListener('keydown', this.handleKeyDown)
      this.element.removeEventListener('focus', this.onFocus)
      this.element.removeEventListener('blur', this.onBlur)

      // Remove from DOM if it has a parent
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element)
      }
    }
    this.element = null
  }
}

export default Button
