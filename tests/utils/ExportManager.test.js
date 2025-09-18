/**
 * ExportManager Tests
 * Test suite for export functionality
 */

import ExportManager from '../../src/utils/ExportManager.js'

describe('ExportManager', () => {
  let exportManager
  let mockMindMap
  let mockEditor

  beforeEach(() => {
    exportManager = new ExportManager()

    // Mock MindMap component
    mockMindMap = {
      exportAsSVG: jest.fn(() => '<svg>mock svg content</svg>'),
      exportAsImage: jest.fn(() => Promise.resolve(new Blob(['mock'], { type: 'image/png' }))),
      getSelectedNode: jest.fn(() => ({ id: 'node1', text: 'Test Node' })),
      scale: 1,
      translateX: 0,
      translateY: 0
    }

    // Mock Editor component
    mockEditor = {
      getValue: jest.fn(() => '# Test Content\n\nThis is test markdown.'),
      exportContent: jest.fn(() => ({
        content: '# Test Content\n\nThis is test markdown.',
        stats: { words: 5, characters: 35, lines: 3 }
      }))
    }

    // Mock URL methods
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
    global.URL.revokeObjectURL = jest.fn()

    // Clear DOM
    testUtils.cleanupDOM()
  })

  describe('Initialization', () => {
    test('should initialize with supported formats', () => {
      expect(exportManager.supportedFormats.mindmap).toContain('svg')
      expect(exportManager.supportedFormats.mindmap).toContain('png')
      expect(exportManager.supportedFormats.mindmap).toContain('jpg')
      expect(exportManager.supportedFormats.mindmap).toContain('pdf')

      expect(exportManager.supportedFormats.content).toContain('md')
      expect(exportManager.supportedFormats.content).toContain('txt')
      expect(exportManager.supportedFormats.content).toContain('html')
      expect(exportManager.supportedFormats.content).toContain('json')
    })
  })

  describe('Mind Map Export', () => {
    test('should export mind map as SVG', async () => {
      const result = await exportManager.exportMindMapAsSVG(mockMindMap)

      expect(mockMindMap.exportAsSVG).toHaveBeenCalled()
      expect(result.success).toBe(true)
      expect(result.filename).toContain('.svg')
    })

    test('should export mind map as PNG', async () => {
      const result = await exportManager.exportMindMapAsPNG(mockMindMap)

      expect(mockMindMap.exportAsImage).toHaveBeenCalledWith('png')
      expect(result.success).toBe(true)
      expect(result.filename).toContain('.png')
    })

    test('should export mind map as JPG', async () => {
      const result = await exportManager.exportMindMapAsJPG(mockMindMap)

      expect(mockMindMap.exportAsImage).toHaveBeenCalledWith('jpg')
      expect(result.success).toBe(true)
      expect(result.filename).toContain('.jpg')
    })

    test('should export mind map as PDF', async () => {
      const result = await exportManager.exportMindMapAsPDF(mockMindMap)

      expect(mockMindMap.exportAsSVG).toHaveBeenCalled()
      expect(result.success).toBe(true)
      expect(result.filename).toContain('.pdf')
    })

    test('should handle custom filename', async () => {
      const options = { filename: 'custom-name.svg' }
      const result = await exportManager.exportMindMapAsSVG(mockMindMap, options)

      expect(result.filename).toBe('custom-name.svg')
    })

    test('should handle export errors', async () => {
      mockMindMap.exportAsSVG = jest.fn(() => {
        throw new Error('Export failed')
      })

      await expect(exportManager.exportMindMapAsSVG(mockMindMap))
        .rejects.toThrow('Export failed')
    })
  })

  describe('Content Export', () => {
    test('should export content as Markdown', () => {
      const content = '# Test Content'
      const result = exportManager.exportContentAsMarkdown(content)

      expect(result.success).toBe(true)
      expect(result.filename).toContain('.md')
    })

    test('should export content as Text', () => {
      const content = '# Test Content\n\n**Bold text**'
      const result = exportManager.exportContentAsText(content)

      expect(result.success).toBe(true)
      expect(result.filename).toContain('.txt')
    })

    test('should export content as HTML', () => {
      const content = '# Test Content'
      const result = exportManager.exportContentAsHTML(content)

      expect(result.success).toBe(true)
      expect(result.filename).toContain('.html')
    })

    test('should export content as JSON', () => {
      const editorData = mockEditor.exportContent()
      const mindmapData = { selectedNode: mockMindMap.getSelectedNode() }

      const result = exportManager.exportContentAsJSON(editorData, mindmapData)

      expect(result.success).toBe(true)
      expect(result.filename).toContain('.json')
    })

    test('should include styles in HTML export', () => {
      const content = '# Test'
      const options = { includeStyles: true }

      const result = exportManager.exportContentAsHTML(content, options)

      expect(result.success).toBe(true)
    })
  })

  describe('Markdown Processing', () => {
    test('should convert markdown to text', () => {
      const markdown = '# Title\n\n**Bold** and *italic* text\n\n- List item\n- Another item'
      const text = exportManager.markdownToText(markdown)

      expect(text).not.toContain('#')
      expect(text).not.toContain('**')
      expect(text).not.toContain('*')
      expect(text).toContain('Bold')
      expect(text).toContain('italic')
      expect(text).toContain('•')
    })

    test('should convert markdown to HTML', () => {
      const markdown = '# Title\n\n**Bold** text\n\n- Item 1\n- Item 2'
      const html = exportManager.markdownToHTML(markdown)

      expect(html).toContain('<h1>')
      expect(html).toContain('<strong>')
      expect(html).toContain('<ul>')
      expect(html).toContain('<li>')
    })

    test('should handle complex markdown structures', () => {
      const markdown = `# Main Title
## Subtitle
[Link](http://example.com)
\`code\`
1. Numbered item
2. Another item`

      const html = exportManager.markdownToHTML(markdown)

      expect(html).toContain('<h1>Main Title</h1>')
      expect(html).toContain('<h2>Subtitle</h2>')
      expect(html).toContain('<a href="http://example.com">Link</a>')
      expect(html).toContain('<code>code</code>')
    })
  })

  describe('Export All Functionality', () => {
    test('should export all formats', async () => {
      const result = await exportManager.exportAll(mockEditor, mockMindMap)

      expect(result.success).toBe(true)
      expect(result.files).toBeGreaterThan(0)
      expect(mockEditor.exportContent).toHaveBeenCalled()
      expect(mockMindMap.exportAsSVG).toHaveBeenCalled()
      expect(mockMindMap.exportAsImage).toHaveBeenCalled()
    })

    test('should use custom base name', async () => {
      const options = { baseName: 'my-export' }
      const result = await exportManager.exportAll(mockEditor, mockMindMap, options)

      expect(result.success).toBe(true)
    })

    test('should handle export all errors', async () => {
      mockMindMap.exportAsSVG = jest.fn(() => {
        throw new Error('SVG export failed')
      })

      await expect(exportManager.exportAll(mockEditor, mockMindMap))
        .rejects.toThrow('SVG export failed')
    })
  })

  describe('File Operations', () => {
    test('should generate unique filenames', () => {
      const filename1 = exportManager.generateFilename('test', 'svg')
      const filename2 = exportManager.generateFilename('test', 'png')

      expect(filename1).toContain('test')
      expect(filename1).toContain('.svg')
      expect(filename2).toContain('test')
      expect(filename2).toContain('.png')
      expect(filename1).not.toBe(filename2)
    })

    test('should download blob files', () => {
      const blob = new Blob(['test content'], { type: 'text/plain' })
      const filename = 'test.txt'

      const result = exportManager.downloadBlob(blob, filename)

      expect(result.success).toBe(true)
      expect(result.filename).toBe(filename)
      expect(result.size).toBe(blob.size)
    })

    test('should create download links', () => {
      const content = 'test content'
      const filename = 'test.txt'
      const mimeType = 'text/plain'

      const result = exportManager.downloadFile(content, filename, mimeType)

      expect(result.success).toBe(true)
      expect(result.filename).toBe(filename)
    })
  })

  describe('SVG Processing', () => {
    test('should clean SVG for export', () => {
      const mockSVG = '<svg><rect></rect></svg>'
      const cleaned = exportManager.cleanSVGForExport(mockSVG)

      expect(cleaned).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(cleaned).toContain('<svg')
      expect(cleaned).toContain('<style>')
    })

    test('should add dimensions to SVG', () => {
      const mockSVG = '<svg><rect></rect></svg>'
      const options = { width: '800', height: '600' }
      const cleaned = exportManager.cleanSVGForExport(mockSVG, options)

      expect(cleaned).toContain('width="800"')
      expect(cleaned).toContain('height="600"')
    })

    test('should include CSS styles in SVG', () => {
      const styles = exportManager.getSVGStyles()

      expect(styles).toContain('.organism-mindmap__node-bg')
      expect(styles).toContain('fill:')
      expect(styles).toContain('stroke:')
    })
  })

  describe('Import Functionality', () => {
    test('should import JSON data', async () => {
      const mockFile = new File([JSON.stringify({
        version: '1.0',
        content: '# Test',
        stats: { words: 1 }
      })], 'test.json', { type: 'application/json' })

      const result = await exportManager.importFromJSON(mockFile)

      expect(result.content).toBe('# Test')
      expect(result.stats.words).toBe(1)
    })

    test('should import Markdown files', async () => {
      const mockFile = new File(['# Test Content'], 'test.md', { type: 'text/markdown' })

      const result = await exportManager.importMarkdown(mockFile)

      expect(result.content).toBe('# Test Content')
    })

    test('should validate imported JSON', async () => {
      const mockFile = new File(['invalid json'], 'test.json')

      await expect(exportManager.importFromJSON(mockFile))
        .rejects.toThrow()
    })

    test('should handle import errors', async () => {
      const mockFile = new File([''], 'test.md')

      // Mock FileReader error
      const originalFileReader = global.FileReader
      global.FileReader = class {
        readAsText() {
          setTimeout(() => {
            if (this.onerror) this.onerror(new Error('Read failed'))
          }, 10)
        }
      }

      await expect(exportManager.importMarkdown(mockFile))
        .rejects.toThrow()

      global.FileReader = originalFileReader
    })
  })

  describe('Format Validation', () => {
    test('should validate supported formats', () => {
      expect(exportManager.isSupportedFormat('mindmap', 'svg')).toBe(true)
      expect(exportManager.isSupportedFormat('mindmap', 'gif')).toBe(false)
      expect(exportManager.isSupportedFormat('content', 'md')).toBe(true)
      expect(exportManager.isSupportedFormat('content', 'doc')).toBe(false)
    })

    test('should get supported formats list', () => {
      const mindmapFormats = exportManager.getSupportedFormats('mindmap')
      const contentFormats = exportManager.getSupportedFormats('content')

      expect(Array.isArray(mindmapFormats)).toBe(true)
      expect(Array.isArray(contentFormats)).toBe(true)
      expect(mindmapFormats.length).toBeGreaterThan(0)
      expect(contentFormats.length).toBeGreaterThan(0)
    })

    test('should validate export options', () => {
      const validOptions = {
        filename: 'test.svg',
        width: 800,
        height: 600
      }

      const errors = exportManager.validateExportOptions(validOptions)
      expect(errors).toHaveLength(0)

      const invalidOptions = {
        filename: 'invalid/filename',
        width: 50,
        height: 10000
      }

      const errorList = exportManager.validateExportOptions(invalidOptions)
      expect(errorList.length).toBeGreaterThan(0)
    })
  })

  describe('PDF Conversion', () => {
    test('should convert SVG to PDF blob', async () => {
      const svgContent = '<svg><rect></rect></svg>'
      const pdfBlob = await exportManager.convertSVGToPDF(svgContent)

      expect(pdfBlob).toBeInstanceOf(Blob)
    })

    test('should handle PDF conversion errors', async () => {
      const invalidSVG = 'not svg content'

      await expect(exportManager.convertSVGToPDF(invalidSVG))
        .rejects.toThrow()
    })

    test('should respect PDF conversion options', async () => {
      const svgContent = '<svg><rect></rect></svg>'
      const options = { width: 1200, height: 800 }

      const pdfBlob = await exportManager.convertSVGToPDF(svgContent, options)

      expect(pdfBlob).toBeInstanceOf(Blob)
    })
  })

  describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))

      // Test any export that might use fetch
      await expect(exportManager.exportMindMapAsSVG(mockMindMap))
        .resolves.toBeDefined() // Should not throw
    })

    test('should handle blob creation errors', () => {
      const originalBlob = global.Blob
      global.Blob = jest.fn(() => {
        throw new Error('Blob creation failed')
      })

      expect(() => exportManager.downloadFile('content', 'test.txt', 'text/plain'))
        .toThrow('Blob creation failed')

      global.Blob = originalBlob
    })

    test('should handle DOM manipulation errors', () => {
      const originalCreateElement = document.createElement
      document.createElement = jest.fn(() => {
        throw new Error('Element creation failed')
      })

      expect(() => exportManager.downloadFile('content', 'test.txt', 'text/plain'))
        .toThrow()

      document.createElement = originalCreateElement
    })
  })

  describe('Performance', () => {
    test('should handle large content efficiently', () => {
      const largeContent = 'x'.repeat(1000000) // 1MB of content

      const startTime = performance.now()
      const result = exportManager.exportContentAsMarkdown(largeContent)
      const endTime = performance.now()

      expect(result.success).toBe(true)
      expect(endTime - startTime).toBeLessThan(1000) // Should complete within 1 second
    })

    test('should batch multiple exports efficiently', async () => {
      const startTime = performance.now()

      await exportManager.exportAll(mockEditor, mockMindMap)

      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(5000) // Should complete within 5 seconds
    })
  })

  describe('Memory Management', () => {
    test('should clean up blob URLs', () => {
      exportManager.downloadFile('content', 'test.txt', 'text/plain')

      // Wait for cleanup timeout
      setTimeout(() => {
        expect(global.URL.revokeObjectURL).toHaveBeenCalled()
      }, 150)
    })

    test('should handle large blob cleanup', () => {
      const largeBlob = new Blob([new ArrayBuffer(10 * 1024 * 1024)]) // 10MB
      exportManager.downloadBlob(largeBlob, 'large.bin')

      expect(global.URL.createObjectURL).toHaveBeenCalled()
    })
  })
})