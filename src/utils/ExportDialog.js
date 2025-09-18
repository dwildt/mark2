/**
 * Export Dialog Utility
 * Modal dialog for export format selection
 */

import languageManager from '../i18n/LanguageManager.js'

class ExportDialog {
  constructor() {
    this.element = null
    this.isOpen = false
    this.resolveCallback = null
  }

  show() {
    return new Promise((resolve) => {
      this.resolveCallback = resolve
      this.render()
      this.open()
    })
  }

  render() {
    if (this.element) {
      return this.element
    }

    // Create overlay
    this.element = document.createElement('div')
    this.element.className = 'export-dialog-overlay'
    this.element.setAttribute('role', 'dialog')
    this.element.setAttribute('aria-modal', 'true')
    this.element.setAttribute('aria-labelledby', 'export-dialog-title')

    // Create dialog
    const dialog = document.createElement('div')
    dialog.className = 'export-dialog'

    // Header
    const header = document.createElement('div')
    header.className = 'export-dialog__header'

    const title = document.createElement('h2')
    title.id = 'export-dialog-title'
    title.className = 'export-dialog__title'
    title.textContent = languageManager.t('export.title')

    const closeBtn = document.createElement('button')
    closeBtn.className = 'export-dialog__close'
    closeBtn.innerHTML = '×'
    closeBtn.setAttribute('aria-label', languageManager.t('buttons.close'))
    closeBtn.onclick = () => this.close(null)

    header.appendChild(title)
    header.appendChild(closeBtn)

    // Content
    const content = document.createElement('div')
    content.className = 'export-dialog__content'

    // Format sections
    const mindmapSection = this.createFormatSection(
      languageManager.t('export.mindmap.title'),
      languageManager.t('export.mindmap.description'),
      [
        { key: 'svg', label: 'SVG', description: languageManager.t('export.formats.svg') },
        { key: 'png', label: 'PNG', description: languageManager.t('export.formats.png') },
        { key: 'jpg', label: 'JPG', description: languageManager.t('export.formats.jpg') },
        { key: 'pdf', label: 'PDF', description: languageManager.t('export.formats.pdf') }
      ]
    )

    const contentSection = this.createFormatSection(
      languageManager.t('export.content.title'),
      languageManager.t('export.content.description'),
      [
        { key: 'markdown', label: 'Markdown', description: languageManager.t('export.formats.markdown') },
        { key: 'html', label: 'HTML', description: languageManager.t('export.formats.html') },
        { key: 'json', label: 'JSON', description: languageManager.t('export.formats.json') }
      ]
    )

    const allSection = this.createFormatSection(
      languageManager.t('export.all.title'),
      languageManager.t('export.all.description'),
      [
        { key: 'all', label: languageManager.t('export.all.button'), description: languageManager.t('export.all.info') }
      ]
    )

    content.appendChild(mindmapSection)
    content.appendChild(contentSection)
    content.appendChild(allSection)

    // Footer
    const footer = document.createElement('div')
    footer.className = 'export-dialog__footer'

    const cancelBtn = document.createElement('button')
    cancelBtn.className = 'atom-button atom-button--secondary'
    cancelBtn.textContent = languageManager.t('buttons.cancel')
    cancelBtn.onclick = () => this.close(null)

    footer.appendChild(cancelBtn)

    // Assemble dialog
    dialog.appendChild(header)
    dialog.appendChild(content)
    dialog.appendChild(footer)

    this.element.appendChild(dialog)

    // Close on overlay click
    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.close(null)
      }
    })

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close(null)
      }
    })

    return this.element
  }

  createFormatSection(title, description, formats) {
    const section = document.createElement('div')
    section.className = 'export-dialog__section'

    const sectionHeader = document.createElement('div')
    sectionHeader.className = 'export-dialog__section-header'

    const sectionTitle = document.createElement('h3')
    sectionTitle.className = 'export-dialog__section-title'
    sectionTitle.textContent = title

    const sectionDesc = document.createElement('p')
    sectionDesc.className = 'export-dialog__section-description'
    sectionDesc.textContent = description

    sectionHeader.appendChild(sectionTitle)
    sectionHeader.appendChild(sectionDesc)

    const formatGrid = document.createElement('div')
    formatGrid.className = 'export-dialog__format-grid'

    formats.forEach(format => {
      const formatBtn = document.createElement('button')
      formatBtn.className = 'export-dialog__format-btn'
      formatBtn.setAttribute('data-format', format.key)
      formatBtn.onclick = () => this.close(format.key)

      const formatLabel = document.createElement('div')
      formatLabel.className = 'export-dialog__format-label'
      formatLabel.textContent = format.label

      const formatDesc = document.createElement('div')
      formatDesc.className = 'export-dialog__format-description'
      formatDesc.textContent = format.description

      formatBtn.appendChild(formatLabel)
      formatBtn.appendChild(formatDesc)

      formatGrid.appendChild(formatBtn)
    })

    section.appendChild(sectionHeader)
    section.appendChild(formatGrid)

    return section
  }

  open() {
    if (this.isOpen) return

    document.body.appendChild(this.element)
    document.body.style.overflow = 'hidden'

    // Animate in
    requestAnimationFrame(() => {
      this.element.classList.add('export-dialog-overlay--open')
    })

    // Focus management
    const firstButton = this.element.querySelector('.export-dialog__format-btn')
    if (firstButton) {
      firstButton.focus()
    }

    this.isOpen = true
  }

  close(result) {
    if (!this.isOpen) return

    // Animate out
    this.element.classList.remove('export-dialog-overlay--open')

    setTimeout(() => {
      document.body.removeChild(this.element)
      document.body.style.overflow = ''
      this.isOpen = false

      if (this.resolveCallback) {
        this.resolveCallback(result)
        this.resolveCallback = null
      }
    }, 200)
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }
    this.element = null
    this.isOpen = false
    this.resolveCallback = null
  }
}

export default ExportDialog
