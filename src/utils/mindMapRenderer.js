/**
 * Mind Map SVG Renderer
 * Creates interactive SVG visualizations from markdown structure
 */

class MindMapRenderer {
  constructor(container) {
    this.container = container
    this.svg = null
    this.nodes = []
    this.connections = []
    this.zoom = 1
    this.panX = 0
    this.panY = 0
    this.isDragging = false
    this.lastMousePos = { x: 0, y: 0 }

    // Configurações visuais
    this.config = {
      nodeWidth: 180,
      nodeHeight: 60,
      nodeSpacing: 300,
      levelSpacing: 280, // Aumentado para mais espaçamento
      itemSpacing: {
        radial: 2.8, // Distância radial para itens normais (aumentado para mais espaço)
        bullet: 3.2, // Distância específica para bullet points (aumentado para separar melhor)
        vertical: 120, // Espaçamento vertical entre bullet points (aumentado)
        horizontal: 500, // Distância horizontal da seção pai para bullets (aumentado)
        minAngle: 0.5 // Ângulo mínimo entre itens radiais (aumentado para mais espaço)
      },
      layout: {
        bulletThreshold: 2, // Número mínimo de bullets para usar layout vertical (reduzido)
        collisionMargin: 30 // Margem de segurança para detecção de colisão (aumentado)
      },
      colors: {
        primary: '#2563eb',
        secondary: '#7c3aed',
        accent: '#059669',
        text: '#1f2937',
        textLight: '#6b7280',
        background: '#ffffff',
        stroke: '#e5e7eb'
      }
    }
  }

  render(data) {
    console.log('Rendering mind map with data:', data)

    // Limpar container
    this.container.innerHTML = ''

    // Criar SVG
    this.createSVG()

    // Processar dados e criar layout
    this.processData(data)

    // Renderizar nós e conexões
    this.renderNodes()
    this.renderConnections()

    // Configurar interatividade
    this.setupInteractivity()

    // Ajustar visualização inicial
    this.fitToView()
  }

  createSVG() {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this.svg.setAttribute('width', '100%')
    this.svg.setAttribute('height', '100%')
    this.svg.setAttribute('viewBox', '0 0 1200 800')
    this.svg.style.background = this.config.colors.background
    this.svg.style.border = `1px solid ${this.config.colors.stroke}`
    this.svg.style.borderRadius = '8px'

    // Criar defs para gradientes e patterns
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')

    // Gradiente para nó principal
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
    gradient.setAttribute('id', 'nodeGradient')
    gradient.setAttribute('x1', '0%')
    gradient.setAttribute('y1', '0%')
    gradient.setAttribute('x2', '100%')
    gradient.setAttribute('y2', '100%')

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop1.setAttribute('offset', '0%')
    stop1.setAttribute('stop-color', this.config.colors.primary)

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop2.setAttribute('offset', '100%')
    stop2.setAttribute('stop-color', this.config.colors.secondary)

    gradient.appendChild(stop1)
    gradient.appendChild(stop2)
    defs.appendChild(gradient)

    // Sombra
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
    filter.setAttribute('id', 'shadow')
    filter.setAttribute('x', '-50%')
    filter.setAttribute('y', '-50%')
    filter.setAttribute('width', '200%')
    filter.setAttribute('height', '200%')

    const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow')
    feDropShadow.setAttribute('dx', '2')
    feDropShadow.setAttribute('dy', '2')
    feDropShadow.setAttribute('stdDeviation', '3')
    feDropShadow.setAttribute('flood-opacity', '0.2')

    filter.appendChild(feDropShadow)
    defs.appendChild(filter)

    this.svg.appendChild(defs)

    // Grupo principal para zoom/pan
    this.mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    this.mainGroup.setAttribute('id', 'main-group')
    this.svg.appendChild(this.mainGroup)

    this.container.appendChild(this.svg)
  }

  processData(data) {
    this.nodes = []
    this.connections = []

    if (!data || !data.sections) {
      return
    }

    // Nó central (título principal)
    const centerX = 600
    const centerY = 400

    const rootNode = {
      id: 'root',
      text: data.title || 'Mapa Mental',
      x: centerX,
      y: centerY,
      level: 0,
      type: 'root',
      width: this.config.nodeWidth * 1.2,
      height: this.config.nodeHeight * 1.2
    }
    this.nodes.push(rootNode)

    // Distribuir seções ao redor do centro
    const angleStep = (2 * Math.PI) / data.sections.length
    const radius = this.config.levelSpacing * 2

    data.sections.forEach((section, index) => {
      const angle = index * angleStep
      const sectionX = centerX + Math.cos(angle) * radius
      const sectionY = centerY + Math.sin(angle) * radius

      const sectionNode = {
        id: `section-${index}`,
        text: section.title,
        x: sectionX,
        y: sectionY,
        level: 1,
        type: 'section',
        width: this.config.nodeWidth,
        height: this.config.nodeHeight,
        parentId: 'root'
      }
      this.nodes.push(sectionNode)

      // Conexão do centro para a seção
      this.connections.push({
        from: 'root',
        to: `section-${index}`,
        type: 'primary'
      })

      // Adicionar subsections e itens
      const allItems = []

      // Adicionar itens diretos da seção
      if (section.items && section.items.length > 0) {
        section.items.forEach(item => {
          allItems.push({
            text: item,
            type: 'item',
            parentId: `section-${index}`
          })
        })
      }

      // Adicionar subsections (###)
      if (section.subsections && section.subsections.length > 0) {
        section.subsections.forEach((subsection, subIndex) => {
          allItems.push({
            text: subsection.title,
            type: 'subsection',
            parentId: `section-${index}`,
            subsectionIndex: subIndex,
            items: subsection.items || []
          })
        })
      }

      // Distribuir todos os itens com hierarquia adequada
      if (allItems.length > 0) {
        // Separar bullet points de subsections para tratamento diferenciado
        const bulletItems = allItems.filter(item => item.type === 'item')
        const subsectionItems = allItems.filter(item => item.type === 'subsection')

        // Primeiro, posicionar subsections como nível intermediário
        if (subsectionItems.length > 0) {
          this.layoutSubsectionsAsIntermediateLevel(subsectionItems, sectionX,
            sectionY, angle, index)
        }

        // Depois, posicionar bullet points diretos da seção
        if (bulletItems.length > 0) {
          const useVerticalForBullets = bulletItems.length >= this.config.layout.bulletThreshold

          if (useVerticalForBullets) {
            // Layout vertical para bullet points
            this.layoutBulletsVertically(bulletItems, sectionX, sectionY, angle, index)
          } else {
            // Layout radial para poucos bullets
            this.layoutItemsRadially(bulletItems, sectionX, sectionY, angle, index)
          }
        }
      }
    })
  }

  layoutBulletsVertically(bulletItems, sectionX, sectionY, sectionAngle, sectionIndex) {
    const verticalSpacing = this.config.itemSpacing.vertical
    const horizontalOffset = this.config.itemSpacing.horizontal

    // Determinar lado da seção para colocar os bullets
    const side = sectionAngle > Math.PI ? -1 : 1 // Esquerda ou direita baseado no ângulo
    const startY = sectionY - ((bulletItems.length - 1) * verticalSpacing) / 2

    bulletItems.forEach((item, itemIndex) => {
      const itemX = sectionX + (horizontalOffset * side)
      const itemY = startY + (itemIndex * verticalSpacing)

      // Criar nó para bullet point
      const itemNode = {
        id: `item-${sectionIndex}-${itemIndex}`,
        text: item.text,
        x: itemX,
        y: itemY,
        level: 3,
        type: 'item',
        width: this.config.nodeWidth * 0.8,
        height: this.config.nodeHeight * 0.8,
        parentId: `section-${sectionIndex}`
      }
      this.nodes.push(itemNode)

      // Conexão da seção para o item
      this.connections.push({
        from: `section-${sectionIndex}`,
        to: `item-${sectionIndex}-${itemIndex}`,
        type: 'secondary'
      })
    })
  }

  layoutItemsRadially(items, sectionX, sectionY, sectionAngle, sectionIndex) {
    const itemRadius = this.config.levelSpacing * this.config.itemSpacing.radial
    const totalAngleSpan = Math.PI * 1.4
    const minAngleStep = this.config.itemSpacing.minAngle

    // Garantir espaçamento mínimo entre itens
    const idealAngleStep = totalAngleSpan / Math.max(items.length, 1)
    const itemAngleStep = Math.max(idealAngleStep, minAngleStep)
    const actualSpan = Math.min(totalAngleSpan, itemAngleStep * (items.length - 1))

    const baseAngle = sectionAngle - (actualSpan / 2)

    items.forEach((item, itemIndex) => {
      const itemAngle = baseAngle + itemIndex * itemAngleStep
      const itemX = sectionX + Math.cos(itemAngle) * itemRadius
      const itemY = sectionY + Math.sin(itemAngle) * itemRadius

      if (item.type === 'subsection') {
        // Criar nó para subsection (###)
        const subsectionNode = {
          id: `subsection-${sectionIndex}-${item.subsectionIndex}`,
          text: item.text,
          x: itemX,
          y: itemY,
          level: 3,
          type: 'subsection',
          width: this.config.nodeWidth * 0.9,
          height: this.config.nodeHeight * 0.9,
          parentId: `section-${sectionIndex}`
        }
        this.nodes.push(subsectionNode)

        // Conexão da seção para subsection
        this.connections.push({
          from: `section-${sectionIndex}`,
          to: `subsection-${sectionIndex}-${item.subsectionIndex}`,
          type: 'secondary'
        })

        // Adicionar itens da subsection
        if (item.items && item.items.length > 0) {
          // Aumentado de 0.75 para 1.0
          const subItemRadius = this.config.levelSpacing * 1.0
          // Aumentado de 1.0 para 1.2
          const subItemAngleStep = (Math.PI * 1.2) / Math.max(item.items.length, 1)
          const subBaseAngle = itemAngle - (subItemAngleStep * (item.items.length - 1)) / 2

          item.items.forEach((subItem, subItemIndex) => {
            const subItemAngle = subBaseAngle + subItemIndex * subItemAngleStep
            const subItemX = itemX + Math.cos(subItemAngle) * subItemRadius
            const subItemY = itemY + Math.sin(subItemAngle) * subItemRadius

            const subItemNode = {
              id: `subitem-${sectionIndex}-${item.subsectionIndex}-${subItemIndex}`,
              text: subItem,
              x: subItemX,
              y: subItemY,
              level: 4,
              type: 'subitem',
              width: this.config.nodeWidth * 0.7,
              height: this.config.nodeHeight * 0.7,
              parentId: `subsection-${sectionIndex}-${item.subsectionIndex}`
            }
            this.nodes.push(subItemNode)

            // Conexão da subsection para o subitem
            this.connections.push({
              from: `subsection-${sectionIndex}-${item.subsectionIndex}`,
              to: `subitem-${sectionIndex}-${item.subsectionIndex}-${subItemIndex}`,
              type: 'tertiary'
            })
          })
        }
      } else {
        // Criar nó para item direto
        const itemNode = {
          id: `item-${sectionIndex}-${itemIndex}`,
          text: item.text,
          x: itemX,
          y: itemY,
          level: 3,
          type: 'item',
          width: this.config.nodeWidth * 0.8,
          height: this.config.nodeHeight * 0.8,
          parentId: `section-${sectionIndex}`
        }
        this.nodes.push(itemNode)

        // Conexão da seção para o item
        this.connections.push({
          from: `section-${sectionIndex}`,
          to: `item-${sectionIndex}-${itemIndex}`,
          type: 'secondary'
        })
      }
    })
  }

  processItemRadially(item, itemIndex, sectionX, sectionY, sectionAngle, sectionIndex, totalItems) {
    // Função para processar itens no modo radial (quando há poucos bullets)
    const itemRadius = this.config.levelSpacing * this.config.itemSpacing.radial
    const totalAngleSpan = Math.PI * 1.4
    const itemAngleStep = totalAngleSpan / Math.max(totalItems, 1)
    const baseAngle = sectionAngle - (itemAngleStep * (totalItems - 1)) / 2

    const itemAngle = baseAngle + itemIndex * itemAngleStep
    const itemX = sectionX + Math.cos(itemAngle) * itemRadius
    const itemY = sectionY + Math.sin(itemAngle) * itemRadius

    // Criar nó para item direto (modo radial - poucos bullets)
    const itemNode = {
      id: `item-${sectionIndex}-${itemIndex}`,
      text: item.text,
      x: itemX,
      y: itemY,
      level: 3,
      type: 'item',
      width: this.config.nodeWidth * 0.8,
      height: this.config.nodeHeight * 0.8,
      parentId: `section-${sectionIndex}`
    }
    this.nodes.push(itemNode)

    // Conexão da seção para o item
    this.connections.push({
      from: `section-${sectionIndex}`,
      to: `item-${sectionIndex}-${itemIndex}`,
      type: 'secondary'
    })
  }

  renderNodes() {
    this.nodes.forEach(node => {
      const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      nodeGroup.setAttribute('class', `mind-map-node mind-map-node--${node.type}`)
      nodeGroup.setAttribute('data-node-id', node.id)

      // Retângulo do nó
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', node.x - node.width / 2)
      rect.setAttribute('y', node.y - node.height / 2)
      rect.setAttribute('width', node.width)
      rect.setAttribute('height', node.height)
      rect.setAttribute('rx', node.type === 'root' ? '20' : '10')
      rect.setAttribute('ry', node.type === 'root' ? '20' : '10')

      if (node.type === 'root') {
        rect.setAttribute('fill', 'url(#nodeGradient)')
      } else if (node.type === 'section') {
        rect.setAttribute('fill', this.config.colors.primary)
      } else if (node.type === 'subsection') {
        rect.setAttribute('fill', this.config.colors.secondary)
      } else if (node.type === 'subitem') {
        rect.setAttribute('fill', '#10b981') // Verde mais claro para subitems
      } else {
        rect.setAttribute('fill', this.config.colors.accent)
      }

      rect.setAttribute('stroke', this.config.colors.stroke)
      rect.setAttribute('stroke-width', '2')
      rect.setAttribute('filter', 'url(#shadow)')

      nodeGroup.appendChild(rect)

      // Texto do nó
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', node.x)
      text.setAttribute('y', node.y)
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('dominant-baseline', 'middle')
      // Configurar cor do texto baseado no tipo
      let textColor = '#ffffff'
      if (node.type === 'item' || node.type === 'subitem') {
        textColor = this.config.colors.text
      }

      text.setAttribute('fill', textColor)
      text.setAttribute('font-family', 'var(--font-family)')

      // Configurar peso da fonte
      let fontWeight = 'normal'
      if (node.type === 'root') fontWeight = 'bold'
      else if (node.type === 'section') fontWeight = '600'
      else if (node.type === 'subsection') fontWeight = '500'

      text.setAttribute('font-weight', fontWeight)

      // Configurar tamanho da fonte
      let fontSize = '12'
      if (node.type === 'root') fontSize = '16'
      else if (node.type === 'section') fontSize = '14'
      else if (node.type === 'subsection') fontSize = '13'
      else if (node.type === 'item') fontSize = '12'
      else if (node.type === 'subitem') fontSize = '11'

      text.setAttribute('font-size', fontSize)

      // Quebrar texto longo
      const maxChars = node.type === 'root' ? 20 : node.type === 'section' ? 15 : 12
      if (node.text.length > maxChars) {
        const words = node.text.split(' ')
        const lines = []
        let currentLine = ''

        words.forEach(word => {
          if ((currentLine + word).length > maxChars && currentLine) {
            lines.push(currentLine.trim())
            currentLine = word + ' '
          } else {
            currentLine += word + ' '
          }
        })
        if (currentLine) lines.push(currentLine.trim())

        lines.forEach((line, i) => {
          const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
          tspan.setAttribute('x', node.x)
          tspan.setAttribute('dy', i === 0 ? '0' : '1.2em')
          tspan.textContent = line
          text.appendChild(tspan)
        })
      } else {
        text.textContent = node.text
      }

      nodeGroup.appendChild(text)

      // Adicionar interatividade
      nodeGroup.style.cursor = 'pointer'
      nodeGroup.addEventListener('click', () => {
        console.log('Node clicked:', node.text)
        this.highlightNode(node.id)
      })

      this.mainGroup.appendChild(nodeGroup)
    })
  }

  renderConnections() {
    this.connections.forEach(connection => {
      const fromNode = this.nodes.find(n => n.id === connection.from)
      const toNode = this.nodes.find(n => n.id === connection.to)

      if (!fromNode || !toNode) return

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', fromNode.x)
      line.setAttribute('y1', fromNode.y)
      line.setAttribute('x2', toNode.x)
      line.setAttribute('y2', toNode.y)
      line.setAttribute('stroke', connection.type === 'primary' ? this.config.colors.primary : this.config.colors.accent)
      line.setAttribute('stroke-width', connection.type === 'primary' ? '3' : '2')
      line.setAttribute('stroke-opacity', '0.6')
      line.setAttribute('class', `mind-map-connection mind-map-connection--${connection.type}`)

      // Inserir no início para ficar atrás dos nós
      this.mainGroup.insertBefore(line, this.mainGroup.firstChild)
    })
  }

  setupInteractivity() {
    // Zoom com scroll
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      this.zoom = Math.max(0.1, Math.min(3, this.zoom * delta))
      this.updateTransform()
    })

    // Pan com drag
    this.container.addEventListener('mousedown', (e) => {
      if (e.target === this.svg || e.target === this.container) {
        this.isDragging = true
        this.lastMousePos = { x: e.clientX, y: e.clientY }
        this.container.style.cursor = 'grabbing'
      }
    })

    this.container.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.lastMousePos.x
        const deltaY = e.clientY - this.lastMousePos.y
        this.panX += deltaX / this.zoom
        this.panY += deltaY / this.zoom
        this.lastMousePos = { x: e.clientX, y: e.clientY }
        this.updateTransform()
      }
    })

    this.container.addEventListener('mouseup', () => {
      this.isDragging = false
      this.container.style.cursor = 'default'
    })

    this.container.addEventListener('mouseleave', () => {
      this.isDragging = false
      this.container.style.cursor = 'default'
    })
  }

  updateTransform() {
    this.mainGroup.setAttribute('transform',
      `translate(${this.panX}, ${this.panY}) scale(${this.zoom})`
    )
  }

  highlightNode(nodeId) {
    // Remover highlights anteriores
    this.container.querySelectorAll('.mind-map-node').forEach(node => {
      node.style.opacity = '1'
    })

    // Destacar nó selecionado
    const selectedNode = this.container.querySelector(`[data-node-id="${nodeId}"]`)
    if (selectedNode) {
      selectedNode.style.opacity = '0.8'

      // Animar
      selectedNode.style.transform = 'scale(1.05)'
      setTimeout(() => {
        selectedNode.style.transform = 'scale(1)'
      }, 200)
    }
  }

  fitToView() {
    if (this.nodes.length === 0) return

    // Calcular bounding box considerando o tamanho real dos nós
    let minX = Infinity; let maxX = -Infinity
    let minY = Infinity; let maxY = -Infinity

    this.nodes.forEach(node => {
      const halfWidth = (node.width || this.config.nodeWidth) / 2
      const halfHeight = (node.height || this.config.nodeHeight) / 2

      minX = Math.min(minX, node.x - halfWidth)
      maxX = Math.max(maxX, node.x + halfWidth)
      minY = Math.min(minY, node.y - halfHeight)
      maxY = Math.max(maxY, node.y + halfHeight)
    })

    // Adicionar margem proporcional ao tamanho dos nós
    const avgNodeWidth = this.config.nodeWidth
    const avgNodeHeight = this.config.nodeHeight
    const marginX = avgNodeWidth * 0.8 // Margem proporcional
    const marginY = avgNodeHeight * 0.8

    minX -= marginX
    maxX += marginX
    minY -= marginY
    maxY += marginY

    const width = maxX - minX
    const height = maxY - minY
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2

    // Ajustar zoom para caber na tela com fator de redução menor
    const containerRect = this.container.getBoundingClientRect()
    const scaleX = containerRect.width / width
    const scaleY = containerRect.height / height

    // Usar 0.95 ao invés de 0.8 e garantir zoom mínimo de 0.3
    this.zoom = Math.max(0.3, Math.min(scaleX, scaleY, 2) * 0.95)

    // Centralizar
    this.panX = (containerRect.width / 2) - centerX * this.zoom
    this.panY = (containerRect.height / 2) - centerY * this.zoom

    this.updateTransform()
  }

  // Métodos públicos para controles
  zoomIn() {
    this.zoom = Math.min(3, this.zoom * 1.2)
    this.updateTransform()
  }

  zoomOut() {
    this.zoom = Math.max(0.2, this.zoom * 0.8) // Aumentado de 0.1 para 0.2
    this.updateTransform()
  }

  resetView() {
    this.fitToView()
  }

  layoutSubsectionsAsIntermediateLevel(subsectionItems, sectionX, sectionY,
    sectionAngle, sectionIndex) {
    // Posicionar subsections como um nível intermediário entre seção e bullets
    const intermediateRadius = this.config.levelSpacing * 1.2 // Distância intermediária
    // Arco de 144 graus
    const subsectionAngleStep = (Math.PI * 0.8) / Math.max(1, subsectionItems.length - 1)
    const startAngle = sectionAngle - (Math.PI * 0.4) // Começar 72 graus antes

    subsectionItems.forEach((subsection, subIndex) => {
      const subsectionAngle = startAngle + (subIndex * subsectionAngleStep)
      const subsectionX = sectionX + Math.cos(subsectionAngle) * intermediateRadius
      const subsectionY = sectionY + Math.sin(subsectionAngle) * intermediateRadius

      const subsectionNode = {
        id: `subsection-${sectionIndex}-${subIndex}`,
        text: subsection.text,
        x: subsectionX,
        y: subsectionY,
        level: 2,
        type: 'subsection',
        width: this.config.nodeWidth * 0.9, // Slightly smaller than sections
        height: this.config.nodeHeight * 0.8,
        parentId: `section-${sectionIndex}`
      }
      this.nodes.push(subsectionNode)

      // Conexão da seção para a subsection
      this.connections.push({
        from: `section-${sectionIndex}`,
        to: `subsection-${sectionIndex}-${subIndex}`,
        type: 'secondary'
      })

      // Agora posicionar os bullet points desta subsection
      if (subsection.items && subsection.items.length > 0) {
        const bulletRadius = this.config.levelSpacing * 0.8 // Distância menor para bullets
        const bulletAngleStep = (Math.PI * 0.6) / Math.max(1, subsection.items.length - 1)
        const bulletStartAngle = subsectionAngle - (Math.PI * 0.3)

        subsection.items.forEach((bulletText, bulletIndex) => {
          const bulletAngle = bulletStartAngle + (bulletIndex * bulletAngleStep)
          const bulletX = subsectionX + Math.cos(bulletAngle) * bulletRadius
          const bulletY = subsectionY + Math.sin(bulletAngle) * bulletRadius

          const bulletNode = {
            id: `bullet-${sectionIndex}-${subIndex}-${bulletIndex}`,
            text: bulletText,
            x: bulletX,
            y: bulletY,
            level: 3,
            type: 'subitem',
            width: this.config.nodeWidth * 0.8,
            height: this.config.nodeHeight * 0.7,
            parentId: `subsection-${sectionIndex}-${subIndex}`
          }
          this.nodes.push(bulletNode)

          // Conexão da subsection para o bullet
          this.connections.push({
            from: `subsection-${sectionIndex}-${subIndex}`,
            to: `bullet-${sectionIndex}-${subIndex}-${bulletIndex}`,
            type: 'tertiary'
          })
        })
      }
    })
  }
}

export default MindMapRenderer
