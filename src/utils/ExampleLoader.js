/**
 * Example Loader Utility
 * Handles loading and managing example markdown files
 */

class ExampleLoader {
  constructor() {
    this.examples = new Map()
    this.loadExamples()
  }

  async loadExamples() {
    // Load atomic design example using inline content
    const atomicDesignContent = this.getInlineExample('atomic-design.md')
    this.examples.set('atomic-design', {
      id: 'atomic-design',
      title: 'Atomic Design',
      description: 'Sistema de design baseado em componentes',
      content: atomicDesignContent,
      category: 'design-systems'
    })
  }

  async loadExampleFile(filename) {
    try {
      // In a real application, you might fetch from a server
      // For now, we'll inline the content or use dynamic imports
      const response = await fetch(`/src/examples/${filename}`)
      if (!response.ok) {
        throw new Error(`Failed to load example: ${response.status}`)
      }
      return await response.text()
    } catch (error) {
      // Fallback: return inline content if fetch fails
      return this.getInlineExample(filename)
    }
  }

  getInlineExample(filename) {
    const examples = {
      'atomic-design.md': `# Atomic Design

## Conceitos Fundamentais
### Metodologia de Design
- Criada por Brad Frost
- Inspirada na química
- Hierarquia de componentes
- Reutilização e consistência

### Benefícios
- Escalabilidade
- Manutenibilidade
- Consistência visual
- Desenvolvimento eficiente
- Documentação clara

## Átomos (Atoms)
### Elementos Básicos
- Botões
- Inputs
- Labels
- Icons
- Tipografia

### Características
- Menor unidade funcional
- Não podem ser decompostos
- Altamente reutilizáveis
- Propriedades básicas
- Estados simples

## Moléculas (Molecules)
### Combinações Simples
- Formulário de busca
- Card de produto
- Menu de navegação
- Toolbar
- Breadcrumb

### Características
- Agrupamento de átomos
- Funcionalidade específica
- Reutilizáveis em contextos
- Interface mais complexa

## Organismos (Organisms)
### Seções Complexas
- Header completo
- Footer
- Sidebar
- Lista de produtos
- Formulário completo

### Características
- Combinação de moléculas
- Seções distintas da interface
- Funcionalidade completa
- Contexto específico

## Templates
### Estrutura de Página
- Layout grid
- Wireframes
- Posicionamento
- Hierarquia visual
- Responsive design

### Características
- Esqueleto da página
- Sem conteúdo real
- Foco na estrutura
- Guias de layout

## Páginas (Pages)
### Instâncias Reais
- Homepage
- Página de produto
- Checkout
- Dashboard
- Perfil do usuário

### Características
- Template com conteúdo real
- Casos de uso específicos
- Testes de usabilidade
- Validação do design`
    }

    return examples[filename] || '# Exemplo não encontrado\n\nO exemplo solicitado não pôde ser carregado.'
  }

  getExample(id) {
    return this.examples.get(id)
  }

  getAllExamples() {
    return Array.from(this.examples.values())
  }

  getExamplesByCategory(category) {
    return this.getAllExamples().filter(example => example.category === category)
  }

  async loadExampleContent(id) {
    const example = this.getExample(id)
    if (!example) {
      throw new Error(`Example with id "${id}" not found`)
    }

    return example.content
  }

  addExample(id, exampleData) {
    this.examples.set(id, {
      id,
      title: exampleData.title,
      description: exampleData.description,
      content: exampleData.content,
      category: exampleData.category || 'custom'
    })
  }

  removeExample(id) {
    return this.examples.delete(id)
  }

  hasExample(id) {
    return this.examples.has(id)
  }

  getExampleMetadata(id) {
    const example = this.getExample(id)
    if (!example) return null

    return {
      id: example.id,
      title: example.title,
      description: example.description,
      category: example.category
    }
  }
}

// Create singleton instance
const exampleLoader = new ExampleLoader()

export default exampleLoader
export { ExampleLoader }