/**
 * Export Manager Utility
 * Handles exporting mind maps and content to various formats
 */

import languageManager from '../i18n/LanguageManager.js'

class ExportManager {
  constructor() {
    this.supportedFormats = {
      mindmap: ['svg', 'png', 'jpg', 'pdf'],
      content: ['md', 'txt', 'html', 'json']
    }
  }

  // Mind map export methods
  async exportMindMapAsSVG(mindmapComponent, options = {}) {
    try {
      const svgContent = mindmapComponent.exportAsSVG()
      const filename = options.filename || this.generateFilename('mindmap', 'svg')

      // Clean up SVG for export
      const cleanSVG = this.cleanSVGForExport(svgContent, options)

      return this.downloadFile(cleanSVG, filename, 'image/svg+xml')
    } catch (error) {
      throw new Error(languageManager.t('export.errors.svgFailed', { error: error.message }))
    }
  }

  async exportMindMapAsPNG(mindmapComponent, options = {}) {
    try {
      const blob = await mindmapComponent.exportAsImage('png')
      const filename = options.filename || this.generateFilename('mindmap', 'png')

      return this.downloadBlob(blob, filename)
    } catch (error) {
      throw new Error(languageManager.t('export.errors.pngFailed', { error: error.message }))
    }
  }

  async exportMindMapAsJPG(mindmapComponent, options = {}) {
    try {
      const blob = await mindmapComponent.exportAsImage('jpg')
      const filename = options.filename || this.generateFilename('mindmap', 'jpg')

      return this.downloadBlob(blob, filename)
    } catch (error) {
      throw new Error(languageManager.t('export.errors.jpgFailed', { error: error.message }))
    }
  }

  async exportMindMapAsPDF(mindmapComponent, options = {}) {
    try {
      // For PDF export, we'll use SVG as base and convert
      const svgContent = mindmapComponent.exportAsSVG()
      const pdfBlob = await this.convertSVGToPDF(svgContent, options)
      const filename = options.filename || this.generateFilename('mindmap', 'pdf')

      return this.downloadBlob(pdfBlob, filename)
    } catch (error) {
      throw new Error(languageManager.t('export.errors.pdfFailed', { error: error.message }))
    }
  }

  // Content export methods
  exportContentAsMarkdown(content, options = {}) {
    try {
      const filename = options.filename || this.generateFilename('content', 'md')
      return this.downloadFile(content, filename, 'text/markdown')
    } catch (error) {
      throw new Error(languageManager.t('export.errors.markdownFailed', { error: error.message }))
    }
  }

  exportContentAsText(content, options = {}) {
    try {
      // Convert markdown to plain text
      const plainText = this.markdownToText(content)
      const filename = options.filename || this.generateFilename('content', 'txt')

      return this.downloadFile(plainText, filename, 'text/plain')
    } catch (error) {
      throw new Error(languageManager.t('export.errors.textFailed', { error: error.message }))
    }
  }

  exportContentAsHTML(content, options = {}) {
    try {
      const htmlContent = this.markdownToHTML(content, options)
      const filename = options.filename || this.generateFilename('content', 'html')

      return this.downloadFile(htmlContent, filename, 'text/html')
    } catch (error) {
      throw new Error(languageManager.t('export.errors.htmlFailed', { error: error.message }))
    }
  }

  exportContentAsJSON(editorData, mindmapData, options = {}) {
    try {
      const exportData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        language: languageManager.getCurrentLanguage(),
        content: editorData.content,
        stats: editorData.stats,
        mindmap: mindmapData,
        metadata: {
          userAgent: navigator.userAgent,
          exportOptions: options
        }
      }

      const jsonContent = JSON.stringify(exportData, null, 2)
      const filename = options.filename || this.generateFilename('export', 'json')

      return this.downloadFile(jsonContent, filename, 'application/json')
    } catch (error) {
      throw new Error(languageManager.t('export.errors.jsonFailed', { error: error.message }))
    }
  }

  // Export all functionality
  async exportAll(editorComponent, mindmapComponent, options = {}) {
    try {
      const timestamp = new Date().toISOString().split('T')[0]
      const baseName = options.baseName || `mark2-export-${timestamp}`

      const exportPromises = []

      // Export content in multiple formats
      const editorData = editorComponent.exportContent()

      exportPromises.push(
        this.exportContentAsMarkdown(editorData.content, {
          filename: `${baseName}.md`
        })
      )

      exportPromises.push(
        this.exportContentAsHTML(editorData.content, {
          filename: `${baseName}.html`,
          includeStyles: true
        })
      )

      // Export mind map
      exportPromises.push(
        this.exportMindMapAsSVG(mindmapComponent, {
          filename: `${baseName}-mindmap.svg`
        })
      )

      exportPromises.push(
        this.exportMindMapAsPNG(mindmapComponent, {
          filename: `${baseName}-mindmap.png`
        })
      )

      // Export complete data as JSON
      const mindmapData = {
        selectedNode: mindmapComponent.getSelectedNode(),
        viewState: {
          scale: mindmapComponent.scale,
          translateX: mindmapComponent.translateX,
          translateY: mindmapComponent.translateY
        }
      }

      exportPromises.push(
        this.exportContentAsJSON(editorData, mindmapData, {
          filename: `${baseName}-data.json`
        })
      )

      await Promise.all(exportPromises)

      return {
        success: true,
        message: languageManager.t('export.success.all'),
        files: exportPromises.length
      }
    } catch (error) {
      throw new Error(languageManager.t('export.errors.allFailed', { error: error.message }))
    }
  }

  // Utility methods
  generateFilename(type, extension) {
    const timestamp = new Date().toISOString()
      .replace(/[:.]/g, '-')
      .split('T')[0]

    return `mark2-${type}-${timestamp}.${extension}`
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType })
    return this.downloadBlob(blob, filename)
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = filename
    link.style.display = 'none'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100)

    return {
      success: true,
      filename,
      size: blob.size
    }
  }

  cleanSVGForExport(svgContent, options = {}) {
    // Create a clean SVG for export
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml')
    const svgElement = svgDoc.documentElement

    // Set proper dimensions if not specified
    if (!svgElement.getAttribute('width')) {
      svgElement.setAttribute('width', options.width || '1200')
    }
    if (!svgElement.getAttribute('height')) {
      svgElement.setAttribute('height', options.height || '800')
    }

    // Add XML declaration
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>\n'

    // Add CSS styles inline for standalone SVG
    const styleElement = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'style')
    styleElement.textContent = this.getSVGStyles()

    const defsElement = svgElement.querySelector('defs') || svgDoc.createElementNS('http://www.w3.org/2000/svg', 'defs')
    if (!svgElement.querySelector('defs')) {
      svgElement.insertBefore(defsElement, svgElement.firstChild)
    }
    defsElement.appendChild(styleElement)

    return xmlDeclaration + new XMLSerializer().serializeToString(svgElement)
  }

  getSVGStyles() {
    return `
      .organism-mindmap__node-bg {
        fill: #f8fafc;
        stroke: #e2e8f0;
        stroke-width: 2;
      }
      .organism-mindmap__node-bg--level-0 {
        fill: #3b82f6;
        stroke: #1d4ed8;
      }
      .organism-mindmap__node-bg--level-1 {
        fill: #60a5fa;
        stroke: #3b82f6;
      }
      .organism-mindmap__node-bg--level-2 {
        fill: #93c5fd;
        stroke: #60a5fa;
      }
      .organism-mindmap__node-text {
        fill: #1f2937;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
      }
      .organism-mindmap__connection {
        stroke: #6b7280;
        stroke-width: 2;
        fill: none;
      }
    `
  }

  async convertSVGToPDF(svgContent, options = {}) {
    // Simple PDF conversion using canvas and jsPDF (would need to be imported)
    // For now, we'll return a placeholder
    return new Promise((resolve, reject) => {
      try {
        // This would require jsPDF library for actual PDF generation
        // For now, we'll convert to canvas and then to PDF
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
          canvas.width = options.width || 1200
          canvas.height = options.height || 800

          // Fill white background
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          canvas.toBlob((blob) => {
            // For actual PDF generation, we would use jsPDF here
            // For now, return the canvas as PNG
            resolve(blob)
          }, 'image/png')
        }

        img.onerror = () => reject(new Error('Failed to load SVG for PDF conversion'))
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent)))
      } catch (error) {
        reject(error)
      }
    })
  }

  markdownToText(markdown) {
    // Simple markdown to text converter
    return markdown
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links, keep text
      .replace(/`(.+?)`/g, '$1') // Remove code backticks
      .replace(/^\s*[-*+]\s+/gm, '• ') // Convert lists to bullets
      .replace(/^\s*\d+\.\s+/gm, '• ') // Convert numbered lists to bullets
      .trim()
  }

  markdownToHTML(markdown, options = {}) {
    // Simple markdown to HTML converter
    let html = markdown
      .replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>')
      .replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>')
      .replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
      .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
      .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
      .replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      .replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '<p>$1</p>')

    if (options.includeStyles) {
      const styles = `
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          h1, h2, h3, h4, h5, h6 { color: #1f2937; margin-top: 1.5em; margin-bottom: 0.5em; }
          p { line-height: 1.6; margin-bottom: 1em; }
          ul { margin: 1em 0; padding-left: 2em; }
          li { margin-bottom: 0.5em; }
          code { background: #f3f4f6; padding: 0.2em 0.4em; border-radius: 0.25em; }
          a { color: #3b82f6; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      `
      html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Mark2 Export</title>
  ${styles}
</head>
<body>
  ${html}
</body>
</html>`
    }

    return html
  }

  // Import functionality
  async importFromJSON(file) {
    try {
      const text = await this.readFileAsText(file)
      const data = JSON.parse(text)

      // Validate the import data
      if (!data.version || !data.content) {
        throw new Error(languageManager.t('import.errors.invalidFormat'))
      }

      return {
        content: data.content,
        stats: data.stats,
        mindmap: data.mindmap,
        metadata: data.metadata,
        timestamp: data.timestamp
      }
    } catch (error) {
      throw new Error(languageManager.t('import.errors.jsonFailed', { error: error.message }))
    }
  }

  async importMarkdown(file) {
    try {
      const content = await this.readFileAsText(file)
      return { content }
    } catch (error) {
      throw new Error(languageManager.t('import.errors.markdownFailed', { error: error.message }))
    }
  }

  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  // Validation methods
  isSupportedFormat(type, format) {
    return this.supportedFormats[type]?.includes(format.toLowerCase())
  }

  getSupportedFormats(type) {
    return this.supportedFormats[type] || []
  }

  validateExportOptions(options) {
    const errors = []

    if (options.filename && !/^[a-zA-Z0-9._-]+$/.test(options.filename)) {
      errors.push(languageManager.t('export.errors.invalidFilename'))
    }

    if (options.width && (options.width < 100 || options.width > 5000)) {
      errors.push(languageManager.t('export.errors.invalidWidth'))
    }

    if (options.height && (options.height < 100 || options.height > 5000)) {
      errors.push(languageManager.t('export.errors.invalidHeight'))
    }

    return errors
  }
}

// Create singleton instance
const exportManager = new ExportManager()

export default exportManager