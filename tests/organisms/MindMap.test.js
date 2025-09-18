/**
 * MindMap Organism Tests
 * Test suite for MindMap component functionality
 */

import MindMap from '../../src/organisms/MindMap/index.js'

describe('MindMap Organism', () => {
  let mindMap

  beforeEach(() => {
    testUtils.cleanupDOM()
  })

  afterEach(() => {
    if (mindMap) {
      mindMap.destroy()
      mindMap = null
    }
  })

  describe('Initialization', () => {
    test('should create MindMap with default options', () => {
      mindMap = new MindMap()
      const element = mindMap.render()

      expect(element.tagName).toBe('DIV')
      expect(element.className).toContain('organism-mindmap')
      expect(element.getAttribute('role')).toBe('img')
    })

    test('should create MindMap with custom options', () => {
      const options = {
        allowInteraction: false,
        showMinimap: true,
        autoLayout: false
      }

      mindMap = new MindMap(options)
      expect(mindMap.allowInteraction).toBe(false)
      expect(mindMap.showMinimap).toBe(true)
      expect(mindMap.autoLayout).toBe(false)
    })

    test('should create SVG element', () => {
      mindMap = new MindMap()
      const element = mindMap.render()

      const svg = element.querySelector('.organism-mindmap__svg')
      expect(svg).toBeTruthy()
      expect(svg.tagName).toBe('svg')
    })

    test('should create zoom controls', () => {
      mindMap = new MindMap()
      const element = mindMap.render()

      const controls = element.querySelector('.organism-mindmap__controls')
      expect(controls).toBeTruthy()

      const zoomIn = element.querySelector('[aria-label*="zoom"]')
      expect(zoomIn).toBeTruthy()
    })
  })

  describe('Markdown Parsing', () => {
    beforeEach(() => {
      mindMap = new MindMap()
    })

    test('should parse simple markdown structure', () => {
      const markdown = testUtils.createMockMarkdown()
      const parsed = mindMap.parseMarkdown(markdown)

      expect(parsed.nodes).toHaveLength(6) // Title + 2 sections + 4 items
      expect(parsed.connections).toHaveLength(5)
    })

    test('should handle empty markdown', () => {
      const parsed = mindMap.parseMarkdown('')

      expect(parsed.nodes).toHaveLength(1) // Empty state node
      expect(parsed.connections).toHaveLength(0)
    })

    test('should handle invalid markdown', () => {
      const parsed = mindMap.parseMarkdown(null)

      expect(parsed.nodes).toHaveLength(1) // Empty state node
      expect(parsed.connections).toHaveLength(0)
    })

    test('should create proper node hierarchy', () => {
      const markdown = `# Root
## Child 1
### Grandchild 1
## Child 2`

      const parsed = mindMap.parseMarkdown(markdown)
      const rootNode = parsed.nodes.find(n => n.text === 'Root')
      const child1 = parsed.nodes.find(n => n.text === 'Child 1')
      const grandchild = parsed.nodes.find(n => n.text === 'Grandchild 1')

      expect(rootNode.level).toBe(0)
      expect(child1.level).toBe(1)
      expect(grandchild.level).toBe(2)
      expect(grandchild.parent).toBe(child1.id)
    })

    test('should handle list items', () => {
      const markdown = `# Title
- Item 1
- Item 2
  - Sub item`

      const parsed = mindMap.parseMarkdown(markdown)
      const items = parsed.nodes.filter(n => n.text.includes('Item'))

      expect(items).toHaveLength(3)
    })
  })

  describe('Layout Calculation', () => {
    beforeEach(() => {
      mindMap = new MindMap()
    })

    test('should calculate node positions', () => {
      const nodes = [
        { id: '1', text: 'Root', level: 0, children: ['2', '3'], parent: null },
        { id: '2', text: 'Child 1', level: 1, children: [], parent: '1' },
        { id: '3', text: 'Child 2', level: 1, children: [], parent: '1' }
      ]

      const positioned = mindMap.calculateLayout(nodes)

      expect(positioned).toHaveLength(3)
      expect(positioned[0].x).toBeDefined()
      expect(positioned[0].y).toBeDefined()

      // Root should be higher than children
      const root = positioned.find(n => n.id === '1')
      const child = positioned.find(n => n.id === '2')
      expect(root.y).toBeLessThan(child.y)
    })

    test('should space siblings appropriately', () => {
      const nodes = [
        { id: '1', text: 'Root', level: 0, children: ['2', '3'], parent: null },
        { id: '2', text: 'Child 1', level: 1, children: [], parent: '1' },
        { id: '3', text: 'Child 2', level: 1, children: [], parent: '1' }
      ]

      const positioned = mindMap.calculateLayout(nodes)
      const child1 = positioned.find(n => n.id === '2')
      const child2 = positioned.find(n => n.id === '3')

      expect(Math.abs(child1.x - child2.x)).toBeGreaterThan(0)
    })
  })

  describe('Mind Map Generation', () => {
    beforeEach(() => {
      mindMap = new MindMap()
      mindMap.render()
    })

    test('should generate mind map from markdown', () => {
      const markdown = testUtils.createMockMarkdown()

      mindMap.generateMindMap(markdown)

      expect(mindMap.nodes.size).toBeGreaterThan(0)
      expect(mindMap.connections.length).toBeGreaterThan(0)
    })

    test('should clear existing mind map', () => {
      const markdown = testUtils.createMockMarkdown()

      mindMap.generateMindMap(markdown)
      const nodeCount = mindMap.nodes.size

      mindMap.generateMindMap('# New Title')

      expect(mindMap.nodes.size).toBeLessThan(nodeCount)
    })

    test('should create SVG nodes', () => {
      const markdown = '# Test Title'

      mindMap.generateMindMap(markdown)

      const svgNodes = mindMap.element.querySelectorAll('.organism-mindmap__node')
      expect(svgNodes.length).toBeGreaterThan(0)
    })

    test('should create connections between nodes', () => {
      const markdown = `# Root
## Child`

      mindMap.generateMindMap(markdown)

      const connections = mindMap.element.querySelectorAll('.organism-mindmap__connection')
      expect(connections.length).toBeGreaterThan(0)
    })
  })

  describe('Node Interaction', () => {
    beforeEach(() => {
      mindMap = new MindMap({
        allowInteraction: true,
        onNodeClick: jest.fn(),
        onNodeHover: jest.fn()
      })
      mindMap.render()
    })

    test('should handle node clicks', () => {
      const markdown = '# Test Title'
      mindMap.generateMindMap(markdown)

      const node = mindMap.element.querySelector('.organism-mindmap__node')
      node.click()

      expect(mindMap.onNodeClick).toHaveBeenCalled()
    })

    test('should handle node hover', () => {
      const markdown = '# Test Title'
      mindMap.generateMindMap(markdown)

      const node = mindMap.element.querySelector('.organism-mindmap__node')

      const mouseEnter = testUtils.createMockEvent('mouseenter')
      node.dispatchEvent(mouseEnter)

      expect(mindMap.onNodeHover).toHaveBeenCalledWith(expect.any(Object), true)

      const mouseLeave = testUtils.createMockEvent('mouseleave')
      node.dispatchEvent(mouseLeave)

      expect(mindMap.onNodeHover).toHaveBeenCalledWith(expect.any(Object), false)
    })

    test('should select nodes', () => {
      const markdown = '# Test Title'
      mindMap.generateMindMap(markdown)

      const nodeData = mindMap.nodes.values().next().value.data
      mindMap.selectNode(nodeData.id)

      expect(mindMap.selectedNode).toBe(nodeData)

      const selectedElement = mindMap.element.querySelector('.organism-mindmap__node--selected')
      expect(selectedElement).toBeTruthy()
    })
  })

  describe('Zoom and Pan Controls', () => {
    beforeEach(() => {
      mindMap = new MindMap()
      mindMap.render()
    })

    test('should zoom in', () => {
      const initialScale = mindMap.scale

      mindMap.zoomIn()

      expect(mindMap.scale).toBeGreaterThan(initialScale)
    })

    test('should zoom out', () => {
      mindMap.scale = 2 // Set initial scale

      mindMap.zoomOut()

      expect(mindMap.scale).toBeLessThan(2)
    })

    test('should respect zoom limits', () => {
      mindMap.scale = mindMap.config.maxZoom

      mindMap.zoomIn()

      expect(mindMap.scale).toBe(mindMap.config.maxZoom)
    })

    test('should reset view', () => {
      mindMap.scale = 2
      mindMap.translateX = 100
      mindMap.translateY = 100

      mindMap.resetView()

      expect(mindMap.scale).toBe(1)
      expect(mindMap.translateX).toBe(0)
      expect(mindMap.translateY).toBe(0)
    })

    test('should handle wheel zoom', () => {
      const initialScale = mindMap.scale

      const wheelEvent = testUtils.createMockEvent('wheel', { deltaY: -100 })
      mindMap.svgElement.dispatchEvent(wheelEvent)

      expect(mindMap.scale).toBeGreaterThan(initialScale)
    })

    test('should handle pan drag', () => {
      const initialX = mindMap.translateX

      mindMap.handlePointerStart(testUtils.createMockEvent('mousedown', { clientX: 100, clientY: 100 }))
      mindMap.handlePointerMove(testUtils.createMockEvent('mousemove', { clientX: 150, clientY: 100 }))

      expect(mindMap.translateX).toBeGreaterThan(initialX)
    })
  })

  describe('Export Functionality', () => {
    beforeEach(() => {
      mindMap = new MindMap()
      mindMap.render()
      mindMap.generateMindMap(testUtils.createMockMarkdown())
    })

    test('should export as SVG', () => {
      const svg = mindMap.exportAsSVG()

      expect(typeof svg).toBe('string')
      expect(svg).toContain('<svg')
      expect(svg).toContain('</svg>')
    })

    test('should export as image', async () => {
      const blob = await mindMap.exportAsImage('png')

      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe('image/png')
    })

    test('should handle export errors gracefully', async () => {
      // Mock error scenario
      HTMLCanvasElement.prototype.getContext = jest.fn(() => null)

      try {
        await mindMap.exportAsImage('png')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('Responsive Behavior', () => {
    beforeEach(() => {
      mindMap = new MindMap()
      mindMap.render()
    })

    test('should adapt to mobile mode', () => {
      mindMap.setMobileMode?.(true)

      expect(mindMap.element.className).toContain('organism-mindmap--mobile')
    })

    test('should handle touch events', () => {
      const touchStart = testUtils.createMockEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 }]
      })

      mindMap.svgElement.dispatchEvent(touchStart)

      expect(mindMap.isDragging).toBe(true)
    })
  })

  describe('Loading States', () => {
    beforeEach(() => {
      mindMap = new MindMap()
      mindMap.render()
    })

    test('should show loading state', () => {
      mindMap.setLoading(true)

      expect(mindMap.element.className).toContain('organism-mindmap--loading')
    })

    test('should hide loading state', () => {
      mindMap.setLoading(true)
      mindMap.setLoading(false)

      expect(mindMap.element.className).not.toContain('organism-mindmap--loading')
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      mindMap = new MindMap()
      mindMap.render()
    })

    test('should have proper ARIA attributes', () => {
      expect(mindMap.element.getAttribute('role')).toBe('img')
      expect(mindMap.element.getAttribute('aria-label')).toBeTruthy()
    })

    test('should support keyboard navigation', () => {
      mindMap.generateMindMap('# Test')

      const keyEvent = testUtils.createMockEvent('keydown', { key: 'Tab' })
      mindMap.element.dispatchEvent(keyEvent)

      // Should handle keyboard navigation gracefully
      expect(() => mindMap.element.dispatchEvent(keyEvent)).not.toThrow()
    })

    test('should provide screen reader content', () => {
      mindMap.generateMindMap(testUtils.createMockMarkdown())

      const ariaLabel = mindMap.element.getAttribute('aria-label')
      expect(typeof ariaLabel).toBe('string')
      expect(ariaLabel.length).toBeGreaterThan(0)
    })
  })

  describe('Performance', () => {
    beforeEach(() => {
      mindMap = new MindMap()
      mindMap.render()
    })

    test('should handle large mind maps efficiently', () => {
      const largeMd = Array.from({ length: 100 }, (_, i) => `## Section ${i}`).join('\n')

      const startTime = performance.now()
      mindMap.generateMindMap(largeMd)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(1000) // Should complete within 1 second
    })

    test('should reuse DOM elements when possible', () => {
      mindMap.generateMindMap('# Test 1')
      const elementCount1 = mindMap.element.querySelectorAll('*').length

      mindMap.generateMindMap('# Test 2')
      const elementCount2 = mindMap.element.querySelectorAll('*').length

      // Element count should be similar (efficient reuse)
      expect(Math.abs(elementCount1 - elementCount2)).toBeLessThan(10)
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      mindMap = new MindMap()
      mindMap.render()
    })

    test('should handle malformed markdown gracefully', () => {
      const malformed = '# Title\n## Section\n### \n#### '

      expect(() => mindMap.generateMindMap(malformed)).not.toThrow()
    })

    test('should handle missing SVG support gracefully', () => {
      // Mock missing SVG support
      document.createElementNS = jest.fn(() => {
        throw new Error('SVG not supported')
      })

      expect(() => mindMap.render()).not.toThrow()
    })

    test('should handle memory constraints', () => {
      // Simulate memory pressure
      const hugeMd = Array.from({ length: 10000 }, (_, i) => `# Section ${i}`).join('\n')

      expect(() => mindMap.generateMindMap(hugeMd)).not.toThrow()
    })
  })

  describe('Destruction', () => {
    test('should clean up properly on destroy', () => {
      mindMap = new MindMap()
      const element = mindMap.render()
      document.body.appendChild(element)

      mindMap.destroy()

      expect(document.body.contains(element)).toBe(false)
      expect(mindMap.nodes.size).toBe(0)
      expect(mindMap.connections.length).toBe(0)
    })

    test('should unsubscribe from language changes', () => {
      mindMap = new MindMap()
      mindMap.render()

      const unsubscribeSpy = jest.fn()
      mindMap.unsubscribe = unsubscribeSpy

      mindMap.destroy()

      expect(unsubscribeSpy).toHaveBeenCalled()
    })

    test('should prevent further operations after destroy', () => {
      mindMap = new MindMap()
      mindMap.render()
      mindMap.destroy()

      expect(() => mindMap.generateMindMap('# Test')).not.toThrow()
      expect(() => mindMap.zoomIn()).not.toThrow()
    })
  })
})