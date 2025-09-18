/**
 * Export Utilities
 * Handles exporting mind maps in various formats
 */

class ExportUtils {
  constructor() {
    this.supportedFormats = ['png', 'svg', 'pdf']
  }

  /**
   * Export the mind map as an image
   * @param {SVGElement} svgElement - The SVG element to export
   * @param {Object} options - Export options
   */
  async exportAsPNG(svgElement, options = {}) {
    const {
      width = 1200,
      height = 800,
      scale = 2,
      filename = 'mind-map.png',
      backgroundColor = '#ffffff'
    } = options

    try {
      // Create a canvas element
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // Set canvas dimensions
      canvas.width = width * scale
      canvas.height = height * scale

      // Set white background
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Get SVG data
      const svgData = this.getSVGData(svgElement, width, height)

      // Convert SVG to image
      const img = new Image()

      return new Promise((resolve, reject) => {
        img.onload = () => {
          // Scale the context for high DPI
          ctx.scale(scale, scale)

          // Draw the image
          ctx.drawImage(img, 0, 0, width, height)

          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (blob) {
              this.downloadBlob(blob, filename)
              resolve(blob)
            } else {
              reject(new Error('Failed to create image blob'))
            }
          }, 'image/png', 1.0)
        }

        img.onerror = () => {
          reject(new Error('Failed to load SVG as image'))
        }

        // Set the SVG data as image source
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
      })
    } catch (error) {
      console.error('Error exporting as PNG:', error)
      throw error
    }
  }

  /**
   * Export the mind map as SVG
   * @param {SVGElement} svgElement - The SVG element to export
   * @param {Object} options - Export options
   */
  async exportAsSVG(svgElement, options = {}) {
    const {
      filename = 'mind-map.svg',
      width = 1200,
      height = 800
    } = options

    try {
      const svgData = this.getSVGData(svgElement, width, height)
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })

      this.downloadBlob(blob, filename)
      return blob
    } catch (error) {
      console.error('Error exporting as SVG:', error)
      throw error
    }
  }

  /**
   * Get SVG data as string
   * @param {SVGElement} svgElement - The SVG element
   * @param {number} width - Target width
   * @param {number} height - Target height
   */
  getSVGData(svgElement, width, height) {
    // Clone the SVG element
    const svgClone = svgElement.cloneNode(true)

    // Set explicit dimensions
    svgClone.setAttribute('width', width)
    svgClone.setAttribute('height', height)
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    // Add any necessary styles inline
    this.inlineStyles(svgClone)

    // Get the outer HTML
    const serializer = new XMLSerializer()
    return serializer.serializeToString(svgClone)
  }

  /**
   * Inline styles for better export compatibility
   * @param {SVGElement} svgElement - The SVG element
   */
  inlineStyles(svgElement) {
    // Get computed styles and apply them inline
    const elements = svgElement.querySelectorAll('*')

    elements.forEach(element => {
      const computedStyle = window.getComputedStyle(element)

      // List of important style properties to inline
      const importantStyles = [
        'font-family',
        'font-size',
        'font-weight',
        'fill',
        'stroke',
        'stroke-width',
        'opacity',
        'visibility'
      ]

      importantStyles.forEach(prop => {
        const value = computedStyle.getPropertyValue(prop)
        if (value && value !== 'initial' && value !== 'inherit') {
          element.style.setProperty(prop, value)
        }
      })
    })
  }

  /**
   * Download a blob as a file
   * @param {Blob} blob - The blob to download
   * @param {string} filename - The filename
   */
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
    URL.revokeObjectURL(url)
  }

  /**
   * Show export modal with format options
   * @param {SVGElement} svgElement - The SVG element to export
   */
  showExportModal(svgElement) {
    if (!svgElement) {
      throw new Error('No SVG element provided for export')
    }

    // Create modal HTML
    const modalHTML = `
      <div id="export-modal" class="molecule-modal" aria-hidden="false" role="dialog" aria-labelledby="export-modal-title">
        <div class="molecule-modal__backdrop"></div>
        <div class="molecule-modal__content">
          <header class="molecule-modal__header">
            <h3 id="export-modal-title">Export Mind Map</h3>
            <button class="atom-button atom-button--ghost" id="export-modal-close" aria-label="Close export">✕</button>
          </header>
          <div class="molecule-modal__body">
            <div class="export-options">
              <div class="export-format-group">
                <label class="export-format-option">
                  <input type="radio" name="export-format" value="png" checked>
                  <span class="export-format-icon">🖼️</span>
                  <div class="export-format-info">
                    <span class="export-format-title">PNG Image</span>
                    <span class="export-format-description">High quality image, best for sharing</span>
                  </div>
                </label>
                <label class="export-format-option">
                  <input type="radio" name="export-format" value="svg">
                  <span class="export-format-icon">🎨</span>
                  <div class="export-format-info">
                    <span class="export-format-title">SVG Vector</span>
                    <span class="export-format-description">Scalable vector format</span>
                  </div>
                </label>
              </div>
              <div class="export-actions">
                <button class="atom-button atom-button--ghost" id="export-cancel">Cancel</button>
                <button class="atom-button atom-button--secondary" id="export-confirm">Export</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    // Add modal to document
    document.body.insertAdjacentHTML('beforeend', modalHTML)
    const modal = document.getElementById('export-modal')

    // Set up event listeners
    this.setupExportModalListeners(modal, svgElement)
  }

  /**
   * Set up export modal event listeners
   * @param {HTMLElement} modal - The modal element
   * @param {SVGElement} svgElement - The SVG element
   */
  setupExportModalListeners(modal, svgElement) {
    const closeButton = modal.querySelector('#export-modal-close')
    const cancelButton = modal.querySelector('#export-cancel')
    const confirmButton = modal.querySelector('#export-confirm')
    const backdrop = modal.querySelector('.molecule-modal__backdrop')

    const closeModal = () => {
      modal.remove()
    }

    const handleExport = async () => {
      const selectedFormat = modal.querySelector('input[name="export-format"]:checked').value
      const timestamp = new Date().toISOString().split('T')[0]

      try {
        confirmButton.textContent = 'Exporting...'
        confirmButton.disabled = true

        if (selectedFormat === 'png') {
          await this.exportAsPNG(svgElement, {
            filename: `mind-map-${timestamp}.png`,
            width: 1200,
            height: 800,
            scale: 2
          })
        } else if (selectedFormat === 'svg') {
          await this.exportAsSVG(svgElement, {
            filename: `mind-map-${timestamp}.svg`,
            width: 1200,
            height: 800
          })
        }

        closeModal()
      } catch (error) {
        console.error('Export failed:', error)
        alert('Export failed: ' + error.message)
        confirmButton.textContent = 'Export'
        confirmButton.disabled = false
      }
    }

    // Event listeners
    closeButton.addEventListener('click', closeModal)
    cancelButton.addEventListener('click', closeModal)
    confirmButton.addEventListener('click', handleExport)
    backdrop.addEventListener('click', closeModal)

    // ESC key to close
    document.addEventListener('keydown', function escapeHandler(e) {
      if (e.key === 'Escape') {
        closeModal()
        document.removeEventListener('keydown', escapeHandler)
      }
    })
  }
}

// Create singleton instance
const exportUtils = new ExportUtils()

export default exportUtils
export { ExportUtils }