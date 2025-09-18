/**
 * Mind Map Generator Utility
 * Generates layout and positioning for mind map nodes
 */

export const calculateNodePositions = (nodes, config = {}) => {
  const {
    width = 800,
    height = 600,
    nodeSpacing = 150,
    levelSpacing = 200,
    centerX = width / 2,
    centerY = height / 2
  } = config

  if (!nodes || nodes.length === 0) {
    return []
  }

  const positionedNodes = [...nodes]
  const rootNode = positionedNodes.find(node => node.level === 1)

  if (!rootNode) {
    return positionedNodes
  }

  // Position root node at center
  rootNode.x = centerX
  rootNode.y = centerY

  // Group nodes by level
  const nodesByLevel = {}
  positionedNodes.forEach(node => {
    if (!nodesByLevel[node.level]) {
      nodesByLevel[node.level] = []
    }
    nodesByLevel[node.level].push(node)
  })

  // Position nodes level by level
  const levels = Object.keys(nodesByLevel).map(Number).sort((a, b) => a - b)

  for (let i = 1; i < levels.length; i++) {
    const level = levels[i]
    const levelNodes = nodesByLevel[level]

    positionLevelNodes(levelNodes, level, rootNode, levelSpacing, nodeSpacing)
  }

  return positionedNodes
}

const positionLevelNodes = (levelNodes, level, rootNode, levelSpacing, _nodeSpacing) => {
  const radius = level * levelSpacing
  const angleStep = (2 * Math.PI) / levelNodes.length

  levelNodes.forEach((node, index) => {
    const angle = index * angleStep - Math.PI / 2 // Start from top
    node.x = rootNode.x + radius * Math.cos(angle)
    node.y = rootNode.y + radius * Math.sin(angle)
  })
}

export const generateConnections = (nodes) => {
  const connections = []

  nodes.forEach(node => {
    if (node.parent) {
      const parentNode = nodes.find(n => n.id === node.parent)
      if (parentNode) {
        connections.push({
          id: `connection-${parentNode.id}-${node.id}`,
          from: parentNode.id,
          to: node.id,
          fromX: parentNode.x || 0,
          fromY: parentNode.y || 0,
          toX: node.x || 0,
          toY: node.y || 0
        })
      }
    }
  })

  return connections
}

export const generateLayout = (parsedData, containerWidth = 800, containerHeight = 600) => {
  try {
    const nodes = calculateNodePositions(parsedData.nodes, {
      width: containerWidth,
      height: containerHeight
    })

    const connections = generateConnections(nodes)

    return {
      nodes,
      connections,
      bounds: calculateBounds(nodes),
      center: { x: containerWidth / 2, y: containerHeight / 2 }
    }
  } catch (error) {
    console.error('Error generating layout:', error)
    return {
      nodes: [],
      connections: [],
      bounds: { minX: 0, minY: 0, maxX: containerWidth, maxY: containerHeight },
      center: { x: containerWidth / 2, y: containerHeight / 2 }
    }
  }
}

const calculateBounds = (nodes) => {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 800, maxY: 600 }
  }

  const xs = nodes.map(node => node.x || 0)
  const ys = nodes.map(node => node.y || 0)

  return {
    minX: Math.min(...xs) - 100,
    minY: Math.min(...ys) - 100,
    maxX: Math.max(...xs) + 100,
    maxY: Math.max(...ys) + 100
  }
}

export default {
  calculateNodePositions,
  generateConnections,
  generateLayout
}
