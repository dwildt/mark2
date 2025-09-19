# Claude Code Instructions - mark2 Project

This document provides Claude Code with essential information about the mark2 project for effective assistance.

> **Related Documentation**: For GitHub Copilot-specific patterns and guidelines, see [.copilot-instructions.md](./.copilot-instructions.md)

## Project Overview
- **Name**: mark2 - Markdown to Mind Map converter
- **Tech Stack**: Vanilla JavaScript (ES6+), CSS3, HTML5
- **Architecture**: Atomic Design pattern
- **Purpose**: Convert markdown text into interactive mind maps

## Development Standards

### Code Quality Commands
```bash
# Always run these before considering work complete
npm run lint        # ESLint code linting
npm run test        # Vitest unit tests
npm run test:coverage # Coverage report (current: 66%)
```

### Build and Deploy
```bash
npm run dev         # Development server
npm run build       # Production build (includes lint + test)
npm run deploy      # Deploy to GitHub Pages
```

## Project Structure
```
src/
├── atoms/          # Basic UI components (Button, TextInput, Node, Connection)
├── molecules/      # Combined components (Toolbar, TextEditor, NodeGroup)
├── organisms/      # Complex sections (EditorPanel, MindMap, Header)
├── templates/      # Page layouts (AppLayout)
├── pages/          # Complete pages (HomePage)
├── utils/          # Pure functions (markdownParser, mindMapGenerator, domUtils)
├── theme/          # Theme management (ThemeManager.js)
├── styles/         # CSS organization
│   ├── themes/     # Color schemes (light.css, dark.css, blue.css, green.css, orange.css)
│   ├── responsive/ # Mobile-first breakpoints
│   └── variables.css # CSS custom properties
└── examples/       # Sample content (atomicDesignExample.md)
```

## Code Conventions

### JavaScript
- **ES6+ syntax**: Use const/let, arrow functions, modules
- **No frameworks**: Pure vanilla JavaScript only
- **Atomic Design**: Follow component hierarchy strictly
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Modules**: ES6 import/export syntax

### CSS
- **Mobile-first**: Start with mobile styles, add desktop with media queries
- **Custom Properties**: Use CSS variables for theming
- **BEM-like**: Atomic design component naming
- **No preprocessors**: Pure CSS3 only

### File Organization
- Each component in its own folder with index.js and styles.css
- Tests adjacent to source files (ComponentName.test.js)
- Utils are pure functions with comprehensive tests

## Theme System
- Base theme: light (white background, black text, gray accents)
- Additional themes: dark, blue, green, orange
- CSS custom properties in `styles/variables.css`
- ThemeManager.js for programmatic theme switching
- New themes follow the pattern in `THEMES.md`

## Key Features to Maintain
1. **Mobile-First Responsive Design**
   - Mobile: tabs/accordion layout
   - Tablet: horizontal split
   - Desktop: vertical split (editor left, map right)

2. **Markdown Parser**
   - Support headers (#, ##, ###)
   - Support lists (-, *, numbers)
   - Generate hierarchical structure

3. **Mind Map Rendering**
   - SVG-based drawing
   - Interactive zoom/pan
   - Touch gesture support

4. **Example Content**
   - Atomic Design mind map loads by default
   - Reset functionality to restore example

## Testing Strategy
- **Unit Tests**: All utils functions, component logic
- **Integration Tests**: Markdown parsing → mind map generation
- **Visual Tests**: Theme switching, responsive behavior
- **Coverage Current**: 66% code coverage
- **Test Framework**: Vitest with native ES modules support
- **Configuration**: vitest.config.js in project root

## Dependencies Management
- Minimal external dependencies
- Prefer vanilla implementations
- Document any new dependencies in package.json
- Build tools: webpack/rollup for bundling

## Performance Considerations
- Lazy loading for large mind maps
- Service worker for offline functionality
- Minification for production builds
- Optimize SVG rendering for smooth interactions

## Common Tasks

### Adding New Components
1. Create folder in appropriate atomic level
2. Add index.js with component logic
3. Add styles.css with component styles
4. Add ComponentName.test.js with tests
5. Update parent component imports

### Adding New Themes
1. Create new theme CSS file in `src/styles/themes/`
2. Define all CSS custom properties
3. Update ThemeManager.js
4. Add theme to selection UI
5. Test with example content

### Debugging Issues
1. Check browser console for errors
2. Verify lint passes: `npm run lint`
3. Verify tests pass: `npm run test`
4. Test mobile responsiveness
5. Verify theme switching works

## Integration Notes
- GitHub Pages deployment ready
- No backend required
- LocalStorage for user preferences
- Import/export functionality for mind maps

## Expected User Workflow
1. User enters markdown in left panel
2. Real-time parsing and mind map generation
3. Interactive exploration of mind map
4. Theme customization
5. Export/sharing capabilities

Remember: This project emphasizes simplicity, performance, and accessibility while maintaining visual appeal and interactive functionality.

## Documentation Maintenance

**Important**: When this Claude documentation is updated, the corresponding GitHub Copilot documentation (`.copilot-instructions.md`) must also be updated to maintain consistency. Both AI assistant tools should have aligned understanding of:

- Project structure and architecture
- Code conventions and patterns  
- Component hierarchy and naming
- Testing strategies
- Development workflows
- Theme system implementation

This ensures seamless collaboration between different AI coding assistants working on the project.