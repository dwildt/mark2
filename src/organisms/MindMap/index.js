/**
 * MindMap Organism Component
 * Interactive SVG-based mind map visualization
 */

import Node from '../../atoms/Node/index.js'
import languageManager from '../../i18n/LanguageManager.js'

class MindMap {
  constructor(options = {}) {
    this.onNodeClick = options.onNodeClick || null
    this.onNodeHover = options.onNodeHover || null
    this.allowInteraction = options.allowInteraction !== false
    this.showMinimap = options.showMinimap !== false
    this.autoLayout = options.autoLayout !== false

    this.element = null
    this.svgElement = null
    this.groupElement = null
    this.nodes = new Map()
    this.connections = []
    this.selectedNode = null

    // Viewport state
    this.scale = 1
    this.translateX = 0
    this.translateY = 0
    this.isDragging = false
    this.lastPointerPosition = { x: 0, y: 0 }

    // Layout configuration
    this.config = {
      nodeWidth: 160,
      nodeHeight: 40,
      levelSpacing: 280,
      siblingSpacing: 80,
      minZoom: 0.1,
      maxZoom: 3,
      animationDuration: 300
    }

    // Subscribe to language changes
    this.unsubscribe = languageManager.subscribe(this.updateLabels.bind(this))
  }

  render() {
    if (this.element) {
      return this.element
    }

    this.element = document.createElement('div')
    this.element.className = 'organism-mindmap'
    this.element.setAttribute('role', 'img')
    this.element.setAttribute('aria-label', languageManager.t('mindmap.title'))

    // Create SVG container
    this.createSVG()

    // Create controls
    this.createControls()

    // Setup event listeners
    this.setupEventListeners()

    return this.element
  }

  createSVG() {
    this.svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this.svgElement.className = 'organism-mindmap__svg'
    this.svgElement.setAttribute('width', '100%')
    this.svgElement.setAttribute('height', '100%')
    this.svgElement.setAttribute('viewBox', '0 0 1200 800')

    // Define patterns and gradients
    this.createSVGDefinitions()

    // Create main group for transformations
    this.groupElement = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    this.groupElement.className = 'organism-mindmap__group'
    this.svgElement.appendChild(this.groupElement)

    this.element.appendChild(this.svgElement)
  }

  createSVGDefinitions() {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')

    // Connection arrow marker
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
    marker.setAttribute('id', 'arrowhead')
    marker.setAttribute('markerWidth', '10')
    marker.setAttribute('markerHeight', '7')
    marker.setAttribute('refX', '9')
    marker.setAttribute('refY', '3.5')
    marker.setAttribute('orient', 'auto')

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7')
    polygon.setAttribute('fill', 'var(--color-border)')
    marker.appendChild(polygon)

    defs.appendChild(marker)
    this.svgElement.appendChild(defs)
  }

  createControls() {
    const controlsContainer = document.createElement('div')
    controlsContainer.className = 'organism-mindmap__controls'

    // Zoom controls
    const zoomControls = document.createElement('div')
    zoomControls.className = 'organism-mindmap__zoom-controls'

    const zoomInBtn = document.createElement('button')
    zoomInBtn.className = 'organism-mindmap__zoom-btn'
    zoomInBtn.textContent = '+'
    zoomInBtn.setAttribute('aria-label', languageManager.t('mindmap.zoomIn'))
    zoomInBtn.onclick = () => this.zoomIn()

    const zoomOutBtn = document.createElement('button')
    zoomOutBtn.className = 'organism-mindmap__zoom-btn'
    zoomOutBtn.textContent = '−'
    zoomOutBtn.setAttribute('aria-label', languageManager.t('mindmap.zoomOut'))
    zoomOutBtn.onclick = () => this.zoomOut()

    const resetBtn = document.createElement('button')
    resetBtn.className = 'organism-mindmap__zoom-btn'
    resetBtn.textContent = '⌂'
    resetBtn.setAttribute('aria-label', languageManager.t('mindmap.resetView'))
    resetBtn.onclick = () => this.resetView()

    zoomControls.appendChild(zoomInBtn)
    zoomControls.appendChild(zoomOutBtn)
    zoomControls.appendChild(resetBtn)

    controlsContainer.appendChild(zoomControls)
    this.element.appendChild(controlsContainer)
  }

  setupEventListeners() {
    // Mouse/touch events for pan and zoom
    this.svgElement.addEventListener('mousedown', this.handlePointerStart.bind(this))
    this.svgElement.addEventListener('mousemove', this.handlePointerMove.bind(this))
    this.svgElement.addEventListener('mouseup', this.handlePointerEnd.bind(this))
    this.svgElement.addEventListener('wheel', this.handleWheel.bind(this))

    // Touch events
    this.svgElement.addEventListener('touchstart', this.handlePointerStart.bind(this))
    this.svgElement.addEventListener('touchmove', this.handlePointerMove.bind(this))
    this.svgElement.addEventListener('touchend', this.handlePointerEnd.bind(this))

    // Prevent context menu
    this.svgElement.addEventListener('contextmenu', (e) => e.preventDefault())
  }

  parseMarkdown(markdown) {
    if (!markdown || typeof markdown !== 'string') {
      return this.createEmptyState()
    }

    const lines = markdown.split('\n').filter(line => line.trim())
    if (lines.length === 0) {
      return this.createEmptyState()
    }

    const nodes = []
    const connections = []
    let nodeId = 0

    // Parse markdown hierarchy
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      // Determine level based on heading level or indentation
      let level = 0
      let text = trimmed

      if (trimmed.startsWith('#')) {
        const match = trimmed.match(/^(#+)\s*(.+)/)
        if (match) {
          level = match[1].length - 1
          text = match[2].trim()
        }
      } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        // List items - should be children of the most recent header
        const leadingSpaces = line.length - line.trimStart().length
        // Base list level starts at 3 (after H1=0, H2=1, H3=2)
        level = 3 + Math.floor(leadingSpaces / 2)
        text = trimmed.substring(1).trim()
      }

      const node = {
        id: `node-${nodeId++}`,
        text: text,
        level: level,
        children: [],
        parent: null
      }

      nodes.push(node)
    }

    // Build hierarchy
    const nodeStack = [null] // Root level
    for (const node of nodes) {
      // Find parent based on level
      while (nodeStack.length > node.level + 1) {
        nodeStack.pop()
      }

      const parent = nodeStack[nodeStack.length - 1]
      if (parent) {
        node.parent = parent.id
        parent.children.push(node.id)
        connections.push({
          source: parent.id,
          target: node.id
        })
      }

      nodeStack.push(node)
    }

    return { nodes, connections }
  }

  createEmptyState() {
    return {
      nodes: [{
        id: 'empty-node',
        text: languageManager.t('mindmap.emptyState'),
        level: 0,
        children: [],
        parent: null
      }],
      connections: []
    }
  }

  generateMindMap(markdown) {
    // Clear existing nodes
    this.clearMindMap()

    // Parse markdown into node structure
    const { nodes, connections } = this.parseMarkdown(markdown)

    // Calculate layout positions
    const positionedNodes = this.calculateLayout(nodes)

    // Create and render nodes
    this.renderNodes(positionedNodes)

    // Create and render connections
    this.renderConnections(connections)

    // Auto-fit view
    if (this.autoLayout) {
      this.fitToContent()
    }
  }

  calculateLayout(nodes) {
    if (nodes.length === 0) return []

    const positionedNodes = nodes.map(node => ({ ...node, x: 0, y: 0 }))
    const levels = {}

    // Group nodes by level
    positionedNodes.forEach(node => {
      if (!levels[node.level]) {
        levels[node.level] = []
      }
      levels[node.level].push(node)
    })

    // Position nodes level by level with improved spacing
    Object.keys(levels).forEach(level => {
      const levelNodes = levels[level]
      const levelNum = parseInt(level)

      // Calculate Y position with clear separation between headers and list items
      let y
      if (levelNum === 0) {
        y = 100 // Root level (H1)
      } else if (levelNum === 1) {
        y = 100 + this.config.levelSpacing // H2 level
      } else if (levelNum === 2) {
        y = 100 + 2 * this.config.levelSpacing // H3 level
      } else {
        // List items start much further down with generous spacing
        const baseListY = 100 + 2 * this.config.levelSpacing + this.config.levelSpacing * 0.8
        y = baseListY + (levelNum - 3) * (this.config.levelSpacing * 0.5)
      }

      // Calculate X positions to center the level
      const totalWidth = (levelNodes.length - 1) * this.config.siblingSpacing
      const startX = 600 - totalWidth / 2 // Center horizontally

      levelNodes.forEach((node, index) => {
        node.x = startX + index * this.config.siblingSpacing
        node.y = y
      })
    })

    return positionedNodes
  }

  renderNodes(nodes) {
    nodes.forEach(nodeData => {
      const nodeElement = this.createNodeElement(nodeData)
      this.groupElement.appendChild(nodeElement)
      this.nodes.set(nodeData.id, { data: nodeData, element: nodeElement })
    })
  }

  createNodeElement(nodeData) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    group.className = 'organism-mindmap__node'
    group.setAttribute('data-node-id', nodeData.id)
    group.setAttribute('transform', `translate(${nodeData.x}, ${nodeData.y})`)

    // Node background
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('width', this.config.nodeWidth)
    rect.setAttribute('height', this.config.nodeHeight)
    rect.setAttribute('x', -this.config.nodeWidth / 2)
    rect.setAttribute('y', -this.config.nodeHeight / 2)
    rect.setAttribute('rx', '8')
    rect.setAttribute('ry', '8')
    rect.className = `organism-mindmap__node-bg organism-mindmap__node-bg--level-${nodeData.level}`

    // Node text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('dominant-baseline', 'middle')
    text.className = 'organism-mindmap__node-text'

    // Split long text into multiple lines
    const words = nodeData.text.split(' ')
    const maxWordsPerLine = 3
    const lines = []

    for (let i = 0; i < words.length; i += maxWordsPerLine) {
      lines.push(words.slice(i, i + maxWordsPerLine).join(' '))
    }

    if (lines.length === 1) {
      text.textContent = lines[0]
    } else {
      lines.forEach((line, index) => {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
        tspan.textContent = line
        tspan.setAttribute('x', '0')
        tspan.setAttribute('dy', index === 0 ? '0' : '1.2em')
        text.appendChild(tspan)
      })
    }

    group.appendChild(rect)
    group.appendChild(text)

    // Add interaction
    if (this.allowInteraction) {
      group.style.cursor = 'pointer'
      group.addEventListener('click', () => this.handleNodeClick(nodeData))
      group.addEventListener('mouseenter', () => this.handleNodeHover(nodeData, true))
      group.addEventListener('mouseleave', () => this.handleNodeHover(nodeData, false))
    }

    return group
  }

  renderConnections(connections) {
    connections.forEach(connection => {
      const line = this.createConnectionElement(connection)
      this.groupElement.insertBefore(line, this.groupElement.firstChild)
    })
    this.connections = connections
  }

  createConnectionElement(connection) {
    const sourceNode = this.nodes.get(connection.source)
    const targetNode = this.nodes.get(connection.target)

    if (!sourceNode || !targetNode) return null

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.className = 'organism-mindmap__connection'
    line.setAttribute('x1', sourceNode.data.x)
    line.setAttribute('y1', sourceNode.data.y + this.config.nodeHeight / 2)
    line.setAttribute('x2', targetNode.data.x)
    line.setAttribute('y2', targetNode.data.y - this.config.nodeHeight / 2)
    line.setAttribute('marker-end', 'url(#arrowhead)')

    return line
  }

  clearMindMap() {
    while (this.groupElement.firstChild) {
      this.groupElement.removeChild(this.groupElement.firstChild)
    }
    this.nodes.clear()
    this.connections = []
    this.selectedNode = null
  }

  // Event handlers
  handleNodeClick(nodeData) {
    // Update selection
    if (this.selectedNode) {
      const prevSelected = this.nodes.get(this.selectedNode.id)
      if (prevSelected) {
        prevSelected.element.classList.remove('organism-mindmap__node--selected')
      }
    }

    this.selectedNode = nodeData
    const currentNode = this.nodes.get(nodeData.id)
    if (currentNode) {
      currentNode.element.classList.add('organism-mindmap__node--selected')
    }

    if (this.onNodeClick) {
      this.onNodeClick(nodeData)
    }
  }

  handleNodeHover(nodeData, isEntering) {
    const node = this.nodes.get(nodeData.id)
    if (node) {
      if (isEntering) {
        node.element.classList.add('organism-mindmap__node--hover')
      } else {
        node.element.classList.remove('organism-mindmap__node--hover')
      }
    }

    if (this.onNodeHover) {
      this.onNodeHover(nodeData, isEntering)
    }
  }

  handlePointerStart(event) {
    event.preventDefault()
    this.isDragging = true

    const pointer = event.touches ? event.touches[0] : event
    this.lastPointerPosition = { x: pointer.clientX, y: pointer.clientY }

    this.svgElement.style.cursor = 'grabbing'
  }

  handlePointerMove(event) {
    if (!this.isDragging) return

    event.preventDefault()
    const pointer = event.touches ? event.touches[0] : event

    const deltaX = pointer.clientX - this.lastPointerPosition.x
    const deltaY = pointer.clientY - this.lastPointerPosition.y

    this.translateX += deltaX
    this.translateY += deltaY

    this.updateTransform()

    this.lastPointerPosition = { x: pointer.clientX, y: pointer.clientY }
  }

  handlePointerEnd(event) {
    event.preventDefault()
    this.isDragging = false
    this.svgElement.style.cursor = 'grab'
  }

  handleWheel(event) {
    event.preventDefault()

    const delta = -event.deltaY * 0.001
    const newScale = Math.max(this.config.minZoom, Math.min(this.config.maxZoom, this.scale + delta))

    if (newScale !== this.scale) {
      this.scale = newScale
      this.updateTransform()
    }
  }

  // Zoom controls
  zoomIn() {
    const newScale = Math.min(this.config.maxZoom, this.scale * 1.2)
    this.scale = newScale
    this.updateTransform()
  }

  zoomOut() {
    const newScale = Math.max(this.config.minZoom, this.scale / 1.2)
    this.scale = newScale
    this.updateTransform()
  }

  resetView() {
    this.scale = 1
    this.translateX = 0
    this.translateY = 0
    this.updateTransform()
  }

  fitToContent() {
    if (this.nodes.size === 0) return

    // Calculate bounds of all nodes
    let minX = Infinity, maxX = -Infinity
    let minY = Infinity, maxY = -Infinity

    this.nodes.forEach(({ data }) => {
      minX = Math.min(minX, data.x - this.config.nodeWidth / 2)
      maxX = Math.max(maxX, data.x + this.config.nodeWidth / 2)
      minY = Math.min(minY, data.y - this.config.nodeHeight / 2)
      maxY = Math.max(maxY, data.y + this.config.nodeHeight / 2)
    })

    // Calculate scale and translation to fit content
    const padding = 50
    const contentWidth = maxX - minX + padding * 2
    const contentHeight = maxY - minY + padding * 2
    const viewBox = this.svgElement.viewBox.baseVal

    const scaleX = viewBox.width / contentWidth
    const scaleY = viewBox.height / contentHeight
    this.scale = Math.min(scaleX, scaleY, 1)

    // Center the content
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2
    this.translateX = viewBox.width / 2 - centerX * this.scale
    this.translateY = viewBox.height / 2 - centerY * this.scale

    this.updateTransform()
  }

  updateTransform() {
    const transform = `translate(${this.translateX}, ${this.translateY}) scale(${this.scale})`
    this.groupElement.setAttribute('transform', transform)
  }

  updateLabels() {
    if (this.element) {
      this.element.setAttribute('aria-label', languageManager.t('mindmap.title'))
    }
  }

  // Public API
  setMarkdown(markdown) {
    this.generateMindMap(markdown)
  }

  getSelectedNode() {
    return this.selectedNode
  }

  selectNode(nodeId) {
    const nodeData = this.nodes.get(nodeId)?.data
    if (nodeData) {
      this.handleNodeClick(nodeData)
    }
  }

  expandNode(nodeId) {
    // Placeholder for node expansion/collapse functionality
    console.log('Expand node:', nodeId)
  }

  collapseNode(nodeId) {
    // Placeholder for node expansion/collapse functionality
    console.log('Collapse node:', nodeId)
  }

  exportAsSVG() {
    return this.svgElement.outerHTML
  }

  exportAsImage(format = 'png') {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const svgData = this.svgElement.outerHTML
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        canvas.toBlob(resolve, `image/${format}`)
      }

      img.onerror = reject
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    })
  }

  setLoading(loading) {
    if (loading) {
      this.element?.classList.add('organism-mindmap--loading')
    } else {
      this.element?.classList.remove('organism-mindmap--loading')
    }
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }

    this.nodes.clear()
    this.connections = []
    this.element = null
    this.svgElement = null
    this.groupElement = null
  }
}

export default MindMap