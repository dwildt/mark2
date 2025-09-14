# mark2 - Markdown to Mind Map Project Plan

## Visão Geral
Aplicação web que converte texto markdown em mapas mentais visuais interativos, desenvolvida com JavaScript vanilla seguindo os princípios do Atomic Design.

## Objetivos
- Ferramenta para rabiscar ideias e visualizar hierarquia de texto
- Interface mobile-first responsiva
- Sistema de temas customizável
- Deploy via GitHub Pages

## Arquitetura Técnica

### Stack
- **Frontend**: JavaScript Vanilla (ES6+)
- **Arquitetura**: Atomic Design
- **Styling**: CSS3 com Custom Properties
- **Build**: Webpack/Rollup para bundling
- **Deploy**: GitHub Pages
- **Testing**: Jest
- **Linting**: ESLint

### Estrutura de Pastas
```
mark2/
├── src/
│   ├── atoms/           # Componentes básicos
│   │   ├── Button/
│   │   ├── TextInput/
│   │   ├── Node/        # Nó do mapa mental
│   │   └── Connection/  # Linha conectora
│   ├── molecules/       # Combinações de atoms
│   │   ├── Toolbar/
│   │   ├── TextEditor/
│   │   └── NodeGroup/
│   ├── organisms/       # Seções completas
│   │   ├── EditorPanel/
│   │   ├── MindMap/
│   │   └── Header/
│   ├── templates/       # Layouts
│   │   └── AppLayout/
│   ├── pages/          # Páginas
│   │   └── HomePage/
│   ├── utils/          # Utilitários
│   │   ├── markdownParser.js
│   │   ├── mindMapGenerator.js
│   │   └── domUtils.js
│   ├── theme/          # Sistema de temas
│   │   └── ThemeManager.js
│   ├── styles/         # CSS modular
│   │   ├── themes/
│   │   │   ├── light.css     # Padrão: branco, preto, cinza
│   │   │   ├── dark.css      # Dark mode
│   │   │   ├── blue.css      # Tons de azul
│   │   │   ├── green.css     # Tons de verde
│   │   │   └── orange.css    # Tons de laranja
│   │   ├── responsive/
│   │   └── variables.css
│   └── examples/
│       └── atomicDesignExample.md
├── tests/              # Testes Jest
│   ├── units/
│   ├── integration/
│   └── __mocks__/
├── public/
├── docs/              # GitHub Pages
├── tasks/             # Documentação de desenvolvimento
└── dist/              # Build output
```

## Funcionalidades Core

### 1. Parser de Markdown
- Converter markdown em estrutura hierárquica
- Suporte a headers (# ## ###), listas, links
- Preservar formatação básica

### 2. Gerador de Mapa Mental
- Algoritmo de layout hierárquico
- Cálculo de posições dos nós
- Conexões entre elementos

### 3. Renderização Visual
- SVG para desenho do mapa
- Animações suaves
- Zoom e pan interativo

### 4. Interface Responsiva
- **Mobile**: Editor/mapa em abas
- **Tablet**: Split horizontal
- **Desktop**: Split vertical (editor esquerda, mapa direita)

### 5. Sistema de Temas
- Tema padrão: fundo branco, texto preto, cinza
- Dark mode
- Paletas coloridas (azul, verde, laranja)
- CSS custom properties para fácil customização

## Fluxo de Dados
1. Input markdown no editor
2. Parse em estrutura de dados
3. Geração de layout do mapa
4. Renderização visual
5. Interações do usuário
6. Sincronização bidirecional

## Exemplo Pré-carregado
Mapa mental sobre Atomic Design será carregado por padrão para demonstrar funcionalidades.

## Scripts de Desenvolvimento
```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "npm run lint && npm run test && webpack --mode production",
    "lint": "eslint src/ --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

## Qualidade de Código
- ESLint configurado para JavaScript vanilla
- Jest para testes unitários (>80% cobertura)
- Testes para parser, layout, componentes
- GitHub Actions para CI/CD

## Deploy e Performance
- Build otimizado para GitHub Pages
- Minificação CSS/JS
- Service Worker para cache
- Lazy loading de componentes grandes
- Imagens otimizadas