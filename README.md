# mark2 🧠

> Transform Markdown into Interactive Mind Maps

A vanilla JavaScript application that converts markdown text into beautiful, interactive mind maps. Perfect for visualizing ideas, notes, and hierarchical content.

## ✨ Features

- 📝 **Markdown to Mind Map**: Convert any markdown text into visual mind maps
- 📱 **Mobile First**: Responsive design that works on all devices
- 🎨 **Multiple Themes**: Light, dark, and colorful theme options
- ⚡ **Vanilla JS**: No frameworks, fast and lightweight
- 🔧 **Atomic Design**: Clean, maintainable component architecture
- 🚀 **GitHub Pages Ready**: Easy deployment and sharing

## 🎨 Available Themes

- **Light**: Clean white background with black text and gray accents
- **Dark**: Dark mode for comfortable night usage
- **Blue**: Professional blue color palette
- **Green**: Nature-inspired green tones
- **Orange**: Energetic orange theme

## 🚀 Quick Start

### Online Version
Visit [mark2 on GitHub Pages](https://your-username.github.io/mark2)

### Local Development
```bash
# Clone the repository
git clone https://github.com/your-username/mark2.git
cd mark2

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📖 Usage

1. **Write Markdown**: Enter your markdown text in the left editor panel
2. **See the Map**: Watch your content transform into a mind map on the right
3. **Interact**: Zoom, pan, and explore your visual ideas
4. **Theme**: Switch between different color themes
5. **Export**: Save or share your mind map

### Example Markdown
```markdown
# Project Planning

## Research Phase
- Market analysis
- User interviews
- Competitor research

## Development Phase
- Design mockups
- Code implementation
- Testing

## Launch Phase
- Marketing campaign
- User onboarding
- Feedback collection
```

## 🏗️ Architecture

Built with **Atomic Design** principles:

- **Atoms**: Basic components (buttons, inputs, nodes)
- **Molecules**: Component combinations (toolbar, editor)
- **Organisms**: Complex sections (editor panel, mind map)
- **Templates**: Page layouts
- **Pages**: Complete interfaces

## 🧪 Quality Assurance

- **ESLint**: Code linting and formatting
- **Jest**: Unit testing with >80% coverage
- **Mobile Testing**: Touch gestures and responsive design
- **Cross-browser**: Support for modern browsers

## 🎯 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run tests
npm run test:watch   # Watch mode testing
npm run lint         # Lint code
npm run deploy       # Deploy to GitHub Pages
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guides:

- [THEMES.md](./THEMES.md) - Creating new color themes
- [TESTING.md](./TESTING.md) - Testing guidelines
- [CLAUDE.md](./CLAUDE.md) - AI assistant integration
- [.copilot-instructions.md](./.copilot-instructions.md) - GitHub Copilot setup

## 📋 Development Process

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Implement your changes
5. Run `npm run lint && npm run test`
6. Submit a pull request

## 📁 Project Structure

```
mark2/
├── src/                 # Source code
│   ├── atoms/          # Basic components
│   ├── molecules/      # Component combinations
│   ├── organisms/      # Complex sections
│   └── utils/          # Helper functions
├── tests/              # Test files
├── public/             # Static assets
└── tasks/              # Development documentation
```

## 🌟 Example Use Cases

- **Study Notes**: Convert lecture notes into visual mind maps
- **Project Planning**: Break down complex projects into manageable parts
- **Brainstorming**: Organize ideas and thoughts visually
- **Documentation**: Create visual guides from markdown docs
- **Learning**: Understand complex topics through visual hierarchy

## 📜 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🐛 Issues & Support

- Report bugs: [GitHub Issues](https://github.com/your-username/mark2/issues)
- Feature requests: [GitHub Discussions](https://github.com/your-username/mark2/discussions)
- Documentation: Check the `tasks/` folder for detailed guides

## 🚀 Roadmap

- [ ] Export to PNG/SVG
- [ ] Collaborative editing
- [ ] Custom node styling
- [ ] Integration with note-taking apps
- [ ] Advanced markdown support (tables, math)

---

Made with ❤️ using Vanilla JavaScript and Atomic Design