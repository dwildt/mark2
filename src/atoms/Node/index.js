/**
 * Node Atom Component
 * Individual node element for mind maps
 */

class Node {
  constructor(text, level = 1, x = 0, y = 0, options = {}) {
    this.text = text
    this.level = level
    this.x = x
    this.y = y
    this.width = options.width || 0
    this.height = options.height || 0
    this.id = options.id || `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Hierarchy
    this.parent = null
    this.children = []

    // State
    this.selected = false
    this.hovered = false
    this.expanded = true

    // Event handlers
    this.onClick = options.onClick || null
    this.onDoubleClick = options.onDoubleClick || null
    this.onHover = options.onHover || null

    // DOM elements
    this.element = null
    this.textElement = null
  }

  addChild(childNode) {
    if (childNode && !this.children.includes(childNode)) {
      childNode.parent = this
      this.children.push(childNode)
    }
    return this
  }

  removeChild(childNode) {
    const index = this.children.indexOf(childNode)
    if (index > -1) {
      this.children.splice(index, 1)
      childNode.parent = null
    }
    return this
  }

  getDepth() {
    let depth = 0
    let current = this.parent
    while (current) {
      depth++
      current = current.parent
    }
    return depth
  }

  isRoot() {
    return this.parent === null
  }

  isLeaf() {
    return this.children.length === 0
  }

  renderSVG() {
    if (this.element) {
      return this.element
    }

    // Create group element for the node
    this.element = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    this.element.setAttribute('class', this.getClassName())
    this.element.setAttribute('id', this.id)
    this.element.setAttribute('transform', `translate(${this.x}, ${this.y})`)

    // Calculate text dimensions
    this.calculateDimensions()

    // Create background rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('class', 'mind-map-node__background')
    rect.setAttribute('x', -this.width / 2)
    rect.setAttribute('y', -this.height / 2)
    rect.setAttribute('width', this.width)
    rect.setAttribute('height', this.height)
    rect.setAttribute('rx', 6) // Border radius

    // Create text element
    this.textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    this.textElement.setAttribute('class', 'mind-map-node__text')
    this.textElement.setAttribute('text-anchor', 'middle')
    this.textElement.setAttribute('dominant-baseline', 'central')
    this.textElement.textContent = this.text

    // Add elements to group
    this.element.appendChild(rect)
    this.element.appendChild(this.textElement)

    // Attach event listeners
    this.attachEventListeners()

    return this.element
  }

  calculateDimensions() {
    // Create temporary text element to measure dimensions
    const tempText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    tempText.setAttribute('class', 'mind-map-node__text')
    tempText.textContent = this.text
    tempText.style.visibility = 'hidden'

    // Add to DOM temporarily to measure
    const svg = document.querySelector('#mind-map-svg')
    if (svg) {
      svg.appendChild(tempText)
      const bbox = tempText.getBBox()
      svg.removeChild(tempText)

      // Add padding
      const padding = 16
      this.width = Math.max(bbox.width + padding * 2, 80) // Minimum width
      this.height = Math.max(bbox.height + padding, 40) // Minimum height
    } else {
      // Fallback dimensions
      this.width = Math.max(this.text.length * 8, 80)
      this.height = 40
    }
  }

  getClassName() {
    const baseClass = 'mind-map-node'
    const levelClass = `mind-map-node--level-${this.level}`
    const selectedClass = this.selected ? 'mind-map-node--selected' : ''
    const hoveredClass = this.hovered ? 'mind-map-node--hovered' : ''
    const rootClass = this.isRoot() ? 'mind-map-node--root' : ''
    const leafClass = this.isLeaf() ? 'mind-map-node--leaf' : ''

    return [baseClass, levelClass, selectedClass, hoveredClass, rootClass, leafClass]
      .filter(Boolean)
      .join(' ')
  }

  attachEventListeners() {
    if (!this.element) return

    // Click handler
    if (this.onClick) {
      this.element.addEventListener('click', (event) => {
        event.stopPropagation()
        this.onClick(this, event)
      })
    }

    // Double click handler
    if (this.onDoubleClick) {
      this.element.addEventListener('dblclick', (event) => {
        event.stopPropagation()
        this.onDoubleClick(this, event)
      })
    }

    // Hover handlers
    this.element.addEventListener('mouseenter', (event) => {
      this.setHovered(true)
      if (this.onHover) {
        this.onHover(this, true, event)
      }
    })

    this.element.addEventListener('mouseleave', (event) => {
      this.setHovered(false)
      if (this.onHover) {
        this.onHover(this, false, event)
      }
    })

    // Keyboard navigation
    this.element.setAttribute('tabindex', '0')
    this.element.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  handleKeyDown(event) {
    switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (this.onClick) {
        this.onClick(this, event)
      }
      break
    case 'Escape':
      this.setSelected(false)
      break
    }
  }

  setPosition(x, y) {
    this.x = x
    this.y = y
    if (this.element) {
      this.element.setAttribute('transform', `translate(${x}, ${y})`)
    }
    return this
  }

  setText(newText) {
    this.text = newText
    if (this.textElement) {
      this.textElement.textContent = newText
      this.calculateDimensions()
      this.updateBackground()
    }
    return this
  }

  updateBackground() {
    if (!this.element) return

    const rect = this.element.querySelector('.mind-map-node__background')
    if (rect) {
      rect.setAttribute('x', -this.width / 2)
      rect.setAttribute('y', -this.height / 2)
      rect.setAttribute('width', this.width)
      rect.setAttribute('height', this.height)
    }
  }

  setSelected(selected) {
    this.selected = selected
    if (this.element) {
      this.element.setAttribute('class', this.getClassName())
    }
    return this
  }

  setHovered(hovered) {
    this.hovered = hovered
    if (this.element) {
      this.element.setAttribute('class', this.getClassName())
    }
    return this
  }

  setLevel(level) {
    this.level = level
    if (this.element) {
      this.element.setAttribute('class', this.getClassName())
    }
    return this
  }

  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height,
      centerX: this.x,
      centerY: this.y
    }
  }

  getConnectionPoint(direction = 'right') {
    const bounds = this.getBounds()

    switch (direction) {
    case 'right':
      return { x: bounds.x + bounds.width, y: bounds.centerY }
    case 'left':
      return { x: bounds.x, y: bounds.centerY }
    case 'top':
      return { x: bounds.centerX, y: bounds.y }
    case 'bottom':
      return { x: bounds.centerX, y: bounds.y + bounds.height }
    default:
      return { x: bounds.centerX, y: bounds.centerY }
    }
  }

  animate(properties, duration = 300) {
    if (!this.element) return Promise.resolve()

    return new Promise((resolve) => {
      const startTime = performance.now()
      const startProps = {
        x: this.x,
        y: this.y
      }

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3)

        if (properties.x !== undefined) {
          const newX = startProps.x + (properties.x - startProps.x) * eased
          this.setPosition(newX, this.y)
        }

        if (properties.y !== undefined) {
          const newY = startProps.y + (properties.y - startProps.y) * eased
          this.setPosition(this.x, newY)
        }

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }

      requestAnimationFrame(animate)
    })
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }
    this.element = null
    this.textElement = null

    // Clean up hierarchy
    this.children.forEach(child => child.destroy())
    this.children = []
    this.parent = null
  }
}

export default Node
