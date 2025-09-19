/**
 * Markdown Parser Tests
 * Test suite for markdown parsing utility functions
 */

import { describe, test, expect } from 'vitest'
import { parseHeaders, parseList, parseMarkdown } from '../../src/utils/markdownParser.js'

describe('Markdown Parser', () => {
  describe('parseHeaders', () => {
    test('should parse single level headers', () => {
      const markdown = '# Title\n## Section\n### Subsection'
      const headers = parseHeaders(markdown)

      expect(headers).toHaveLength(3)
      expect(headers[0]).toEqual({
        level: 1,
        text: 'Title',
        index: 0,
        raw: '# Title'
      })
      expect(headers[1]).toEqual({
        level: 2,
        text: 'Section',
        index: 8,
        raw: '## Section'
      })
    })

    test('should handle empty input', () => {
      expect(parseHeaders('')).toEqual([])
      expect(parseHeaders(null)).toEqual([])
      expect(parseHeaders(undefined)).toEqual([])
    })

    test('should handle headers with extra spaces', () => {
      const markdown = '#   Title   \n##  Section  '
      const headers = parseHeaders(markdown)

      expect(headers[0].text).toBe('Title')
      expect(headers[1].text).toBe('Section')
    })

    test('should handle different header levels', () => {
      const markdown = '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6'
      const headers = parseHeaders(markdown)

      expect(headers).toHaveLength(6)
      expect(headers.map(h => h.level)).toEqual([1, 2, 3, 4, 5, 6])
    })
  })

  describe('parseList', () => {
    test('should parse bullet lists', () => {
      const markdown = '- Item 1\n- Item 2\n- Item 3'
      const items = parseList(markdown)

      expect(items).toHaveLength(3)
      expect(items[0]).toEqual({
        level: 0,
        text: 'Item 1',
        type: 'bullet',
        marker: '-'
      })
    })

    test('should parse numbered lists', () => {
      const markdown = '1. First\n2. Second\n3. Third'
      const items = parseList(markdown)

      expect(items).toHaveLength(3)
      expect(items[0].type).toBe('ordered')
      expect(items[0].text).toBe('First')
    })

    test('should handle nested lists', () => {
      const markdown = '- Item 1\n  - Nested 1\n  - Nested 2\n- Item 2'
      const items = parseList(markdown)

      expect(items).toHaveLength(4)
      expect(items[1].level).toBe(1)
      expect(items[1].text).toBe('Nested 1')
    })

    test('should handle empty input', () => {
      expect(parseList('')).toEqual([])
      expect(parseList(null)).toEqual([])
      expect(parseList(undefined)).toEqual([])
    })

    test('should handle mixed list types', () => {
      const markdown = '- Bullet\n1. Number\n* Another bullet'
      const items = parseList(markdown)

      expect(items).toHaveLength(3)
      expect(items[0].marker).toBe('-')
      expect(items[1].type).toBe('ordered')
      expect(items[2].marker).toBe('*')
    })
  })

  describe('parseMarkdown (integration)', () => {
    test('should parse complete markdown with headers and lists', () => {
      const markdown = `# Main Title
## Section 1
- Item A
- Item B

## Section 2
1. First
2. Second`

      const result = parseMarkdown(markdown)

      expect(result.headers).toHaveLength(3)
      expect(result.lists).toHaveLength(4)
      expect(result.structure).toBeDefined()
    })

    test('should handle markdown with mixed content', () => {
      const markdown = `# Project
Some text here

## Features
- Feature 1
- Feature 2

### Details
1. Detail 1
2. Detail 2

## Conclusion`

      const result = parseMarkdown(markdown)

      expect(result.headers[0].text).toBe('Project')
      expect(result.lists).toHaveLength(4)
    })

    test('should handle empty markdown', () => {
      const result = parseMarkdown('')

      expect(result.headers).toEqual([])
      expect(result.lists).toEqual([])
      expect(result.structure).toEqual([])
    })

    test('should preserve content order', () => {
      const markdown = `# Title
- First list item
## Subtitle
- Second list item`

      const result = parseMarkdown(markdown)

      expect(result.structure).toHaveLength(4)
      expect(result.structure[0].type).toBe('header')
      expect(result.structure[1].type).toBe('list')
      expect(result.structure[2].type).toBe('header')
      expect(result.structure[3].type).toBe('list')
    })
  })

  describe('Edge Cases', () => {
    test('should handle malformed headers', () => {
      const markdown = '#No space\n# Good header\n##No space either'
      const headers = parseHeaders(markdown)

      expect(headers).toHaveLength(1)
      expect(headers[0].text).toBe('Good header')
    })

    test('should handle code blocks with headers', () => {
      const markdown = `# Real Header
\`\`\`
# Code header (should be ignored)
\`\`\`
## Another Real Header`

      const headers = parseHeaders(markdown)

      expect(headers).toHaveLength(2)
      expect(headers[0].text).toBe('Real Header')
      expect(headers[1].text).toBe('Another Real Header')
    })

    test('should handle special characters in content', () => {
      const markdown = '# Title with "quotes" & symbols\n- Item with *emphasis*'
      const headers = parseHeaders(markdown)
      const lists = parseList(markdown)

      expect(headers[0].text).toBe('Title with "quotes" & symbols')
      expect(lists[0].text).toBe('Item with *emphasis*')
    })

    test('should handle very long content', () => {
      const longTitle = 'A'.repeat(1000)
      const markdown = `# ${longTitle}`
      const headers = parseHeaders(markdown)

      expect(headers[0].text).toBe(longTitle)
    })
  })

  describe('Performance', () => {
    test('should handle large markdown documents efficiently', () => {
      const lines = []
      for (let i = 0; i < 1000; i++) {
        lines.push(`# Header ${i}`)
        lines.push(`- Item ${i}`)
      }
      const markdown = lines.join('\n')

      const start = performance.now()
      const result = parseMarkdown(markdown)
      const end = performance.now()

      expect(result.headers).toHaveLength(1000)
      expect(result.lists).toHaveLength(1000)
      expect(end - start).toBeLessThan(100) // Should complete in under 100ms
    })
  })
})