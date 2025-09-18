/**
 * Markdown Parser Utility
 * Converts markdown text into a structured data format for mind map generation
 */

export const parseHeaders = (text) => {
  if (!text || typeof text !== 'string') {
    return []
  }

  const headerRegex = /^(#{1,6})\s+(.+)$/gm
  const headers = []
  let match

  while ((match = headerRegex.exec(text)) !== null) {
    headers.push({
      level: match[1].length,
      text: match[2].trim(),
      index: match.index,
      raw: match[0]
    })
  }

  return headers
}

export const parseList = (text) => {
  if (!text || typeof text !== 'string') {
    return []
  }

  const lines = text.split('\n')
  const items = []
  let charIndex = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Unordered list (-, *, +)
    const unorderedMatch = line.match(/^[-*+]\s+(.+)$/)
    if (unorderedMatch) {
      items.push({
        text: unorderedMatch[1].trim(),
        type: 'unordered',
        level: (lines[i].match(/^\s*/)[0].length / 2) + 1,
        index: charIndex
      })
    }

    // Ordered list (1., 2., etc.)
    const orderedMatch = line.match(/^\d+\.\s+(.+)$/)
    if (orderedMatch) {
      items.push({
        text: orderedMatch[1].trim(),
        type: 'ordered',
        level: (lines[i].match(/^\s*/)[0].length / 2) + 1,
        index: charIndex
      })
    }

    // Incrementar posição do caractere (linha + quebra de linha)
    charIndex += lines[i].length + 1
  }

  return items
}

export const parseMarkdown = (markdown) => {
  if (!markdown || typeof markdown !== 'string') {
    return {
      title: '',
      sections: [],
      nodes: [],
      error: null
    }
  }

  try {
    const headers = parseHeaders(markdown)
    const lists = parseList(markdown)
    const lines = markdown.split('\n')

    if (headers.length === 0) {
      return {
        title: 'Mind Map',
        sections: [],
        nodes: [],
        error: 'No headers found in markdown'
      }
    }

    // Build hierarchical structure
    const root = {
      title: headers[0].text,
      level: headers[0].level,
      sections: [],
      items: []
    }

    let currentSection = null
    let currentSubsection = null

    // Process headers and build hierarchy
    for (let i = 1; i < headers.length; i++) {
      const header = headers[i]

      if (header.level === 2) {
        // New main section (H2)
        currentSection = {
          title: header.text,
          level: header.level,
          items: [],
          subsections: [],
          startIndex: header.index
        }
        root.sections.push(currentSection)
        currentSubsection = null
      } else if (header.level === 3 && currentSection) {
        // New subsection (H3)
        currentSubsection = {
          title: header.text,
          level: header.level,
          items: [],
          startIndex: header.index
        }
        currentSection.subsections.push(currentSubsection)
      }
    }

    // Process lists and associate them with the correct section/subsection
    lists.forEach(item => {
      // Find which section this list item belongs to
      let targetSection = null
      let targetSubsection = null

      // Find the most recent section before this item
      for (const section of root.sections) {
        if (section.startIndex < item.index) {
          targetSection = section
        } else {
          break
        }
      }

      if (targetSection) {
        // Find the most recent subsection within this section before this item
        for (const subsection of targetSection.subsections) {
          if (subsection.startIndex < item.index) {
            // Check if there's a next section that comes before this item
            const nextSectionIndex = root.sections.findIndex(s => s === targetSection) + 1
            const nextSection = root.sections[nextSectionIndex]

            if (!nextSection || item.index < nextSection.startIndex) {
              targetSubsection = subsection
            }
          } else {
            break
          }
        }
      }

      // Add item to the most specific section/subsection
      if (targetSubsection) {
        targetSubsection.items.push(item.text)
      } else if (targetSection) {
        targetSection.items.push(item.text)
      } else {
        root.items.push(item.text)
      }
    })

    return {
      title: root.title,
      sections: root.sections,
      nodes: buildNodeStructure(root),
      error: null
    }

  } catch (error) {
    return {
      title: '',
      sections: [],
      nodes: [],
      error: error.message
    }
  }
}

const buildNodeStructure = (data) => {
  const nodes = []
  let nodeId = 1

  // Root node
  const rootNode = {
    id: nodeId++,
    text: data.title,
    level: 1,
    children: []
  }
  nodes.push(rootNode)

  // Section nodes
  data.sections.forEach(section => {
    const sectionNode = {
      id: nodeId++,
      text: section.title,
      level: 2,
      parent: rootNode.id,
      children: []
    }
    nodes.push(sectionNode)
    rootNode.children.push(sectionNode.id)

    // Direct section items (not under subsections)
    section.items.forEach(item => {
      const itemNode = {
        id: nodeId++,
        text: item,
        level: 3,
        parent: sectionNode.id,
        children: []
      }
      nodes.push(itemNode)
      sectionNode.children.push(itemNode.id)
    })

    // Subsection nodes (H3)
    if (section.subsections) {
      section.subsections.forEach(subsection => {
        const subsectionNode = {
          id: nodeId++,
          text: subsection.title,
          level: 3,
          parent: sectionNode.id,
          children: []
        }
        nodes.push(subsectionNode)
        sectionNode.children.push(subsectionNode.id)

        // Subsection items
        subsection.items.forEach(item => {
          const itemNode = {
            id: nodeId++,
            text: item,
            level: 4,
            parent: subsectionNode.id,
            children: []
          }
          nodes.push(itemNode)
          subsectionNode.children.push(itemNode.id)
        })
      })
    }
  })

  return nodes
}

export default { parseHeaders, parseList, parseMarkdown }