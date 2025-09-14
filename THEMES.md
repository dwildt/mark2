# Theme Creation Guide - mark2

This guide helps contributors create new color palettes and themes for the mark2 application.

## Theme System Overview

The mark2 theme system uses CSS custom properties (CSS variables) to enable dynamic theme switching. All themes follow a consistent structure with standardized color tokens.

## Current Themes

### Light Theme (Default)
- **Background**: White (#ffffff)
- **Text**: Black (#000000)
- **Accents**: Gray scale (#f5f5f5, #e0e0e0, #999999)
- **Use case**: Default, clean, professional

### Dark Theme
- **Background**: Dark gray (#1a1a1a, #2d2d2d)
- **Text**: Light gray/white (#ffffff, #e0e0e0)
- **Accents**: Lighter grays for contrast
- **Use case**: Low light environments, modern look

### Blue Theme
- **Background**: White/light blue
- **Text**: Dark blue/black
- **Accents**: Various blue tones (#007acc, #4a90e2, #e3f2fd)
- **Use case**: Professional, corporate, tech-focused

### Green Theme
- **Background**: White/light green
- **Text**: Dark green/black
- **Accents**: Nature-inspired greens (#4caf50, #81c784, #e8f5e8)
- **Use case**: Natural, growth, eco-friendly

### Orange Theme
- **Background**: White/warm tones
- **Text**: Dark orange/brown
- **Accents**: Warm oranges (#ff9800, #ffb74d, #fff3e0)
- **Use case**: Creative, energetic, warm

## CSS Custom Properties Structure

Each theme must define these CSS variables:

### Background Colors
```css
:root.theme-name {
  /* Primary backgrounds */
  --color-bg-primary: #ffffff;      /* Main background */
  --color-bg-secondary: #f5f5f5;    /* Secondary areas */
  --color-bg-tertiary: #e0e0e0;     /* Tertiary elements */

  /* Interactive backgrounds */
  --color-bg-hover: #f0f0f0;        /* Hover states */
  --color-bg-active: #e0e0e0;       /* Active/pressed states */
  --color-bg-disabled: #f9f9f9;     /* Disabled elements */
}
```

### Text Colors
```css
:root.theme-name {
  /* Text hierarchy */
  --color-text-primary: #000000;     /* Main text */
  --color-text-secondary: #666666;   /* Secondary text */
  --color-text-tertiary: #999999;    /* Tertiary text */
  --color-text-inverse: #ffffff;     /* Text on dark backgrounds */
  --color-text-disabled: #cccccc;    /* Disabled text */

  /* Special text colors */
  --color-text-accent: #007acc;      /* Links, highlights */
  --color-text-error: #d32f2f;       /* Error messages */
  --color-text-success: #388e3c;     /* Success messages */
}
```

### Border and Outline Colors
```css
:root.theme-name {
  /* Borders */
  --color-border: #e0e0e0;           /* Default borders */
  --color-border-light: #f0f0f0;     /* Light borders */
  --color-border-dark: #cccccc;      /* Emphasized borders */
  --color-border-accent: #007acc;    /* Accent borders */

  /* Focus and selection */
  --color-focus: #007acc;            /* Focus indicators */
  --color-selection: rgba(0, 122, 204, 0.2); /* Selection background */
}
```

### Mind Map Specific Colors
```css
:root.theme-name {
  /* Node colors by level */
  --color-node-level-1: #007acc;     /* Root nodes */
  --color-node-level-2: #4a90e2;     /* Second level */
  --color-node-level-3: #7bb3f0;     /* Third level */
  --color-node-level-4: #a4c8f5;     /* Fourth level */
  --color-node-level-5: #d1e3fa;     /* Fifth level and beyond */

  /* Node states */
  --color-node-hover: rgba(0, 122, 204, 0.1);
  --color-node-selected: rgba(0, 122, 204, 0.2);
  --color-node-text: var(--color-text-primary);

  /* Connections */
  --color-connection: #cccccc;        /* Lines between nodes */
  --color-connection-hover: #999999;  /* Hovered connections */
}
```

## Creating a New Theme

### Step 1: Choose Your Color Palette
Select a primary color and create variations:
- **Primary**: Main accent color
- **Light variants**: 20%, 40%, 60% opacity of primary
- **Dark variants**: Darker shades for text/borders
- **Neutral**: Grays that complement your palette

### Step 2: Create the CSS File
Create a new file: `src/styles/themes/your-theme-name.css`

```css
/* Example: Purple Theme */
:root.theme-purple {
  /* Background Colors */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f3e5f5;
  --color-bg-tertiary: #e1bee7;
  --color-bg-hover: #f3e5f5;
  --color-bg-active: #e1bee7;
  --color-bg-disabled: #fafafa;

  /* Text Colors */
  --color-text-primary: #4a148c;
  --color-text-secondary: #7b1fa2;
  --color-text-tertiary: #9c27b0;
  --color-text-inverse: #ffffff;
  --color-text-disabled: #e0e0e0;
  --color-text-accent: #9c27b0;
  --color-text-error: #d32f2f;
  --color-text-success: #388e3c;

  /* Border Colors */
  --color-border: #e1bee7;
  --color-border-light: #f3e5f5;
  --color-border-dark: #ce93d8;
  --color-border-accent: #9c27b0;
  --color-focus: #9c27b0;
  --color-selection: rgba(156, 39, 176, 0.2);

  /* Mind Map Colors */
  --color-node-level-1: #9c27b0;
  --color-node-level-2: #ba68c8;
  --color-node-level-3: #ce93d8;
  --color-node-level-4: #e1bee7;
  --color-node-level-5: #f3e5f5;
  --color-node-hover: rgba(156, 39, 176, 0.1);
  --color-node-selected: rgba(156, 39, 176, 0.2);
  --color-node-text: var(--color-text-primary);
  --color-connection: #e1bee7;
  --color-connection-hover: #ce93d8;
}
```

### Step 3: Update ThemeManager
Add your theme to `src/theme/ThemeManager.js`:

```javascript
class ThemeManager {
  constructor() {
    this.themes = [
      'light',
      'dark',
      'blue',
      'green',
      'orange',
      'purple'  // Add your theme here
    ]
  }

  // Rest of the ThemeManager code...
}
```

### Step 4: Test Your Theme
1. Load the application
2. Switch to your theme using the theme selector
3. Test all components and interactions
4. Verify contrast ratios for accessibility

## Design Guidelines

### Accessibility
- **Contrast Ratio**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Color Blindness**: Test with tools like Colorblinding.com
- **Focus Indicators**: Ensure focus states are clearly visible

### Consistency
- Use your primary color sparingly for accents
- Maintain hierarchy with color intensity
- Keep neutral backgrounds for readability

### Mind Map Considerations
- **Node Hierarchy**: Use color intensity to show levels
- **Readability**: Ensure text is readable on all node backgrounds
- **Connections**: Keep connection lines subtle but visible

## Color Tools and Resources

### Online Tools
- [Coolors.co](https://coolors.co/) - Color palette generator
- [Material Design Colors](https://material.io/design/color/) - Color system guidelines
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Accessibility testing

### CSS Color Functions
```css
/* Use CSS functions for variations */
--color-primary: #9c27b0;
--color-primary-light: color-mix(in srgb, var(--color-primary) 60%, white);
--color-primary-dark: color-mix(in srgb, var(--color-primary) 80%, black);
```

## Testing Your Theme

### Manual Testing Checklist
- [ ] All text is readable with sufficient contrast
- [ ] Hover states are visible and consistent
- [ ] Focus indicators are clear
- [ ] Mind map nodes show proper hierarchy
- [ ] Theme switching works without page reload
- [ ] Mobile interface remains usable
- [ ] Print styles work (if applicable)

### Automated Testing
```bash
# Run accessibility tests
npm run test:a11y

# Run visual regression tests
npm run test:visual
```

## Theme Submission

### Pull Request Checklist
- [ ] Theme CSS file created
- [ ] ThemeManager updated
- [ ] All tests passing
- [ ] Screenshots provided
- [ ] Accessibility verified
- [ ] Mobile tested

### Documentation
Include in your PR description:
- Theme name and inspiration
- Primary use cases
- Accessibility test results
- Screenshots of key components

## Advanced Theme Features

### Dynamic Properties
```css
/* Create themes that adapt to system preferences */
@media (prefers-color-scheme: dark) {
  :root.theme-auto {
    --color-bg-primary: #1a1a1a;
    --color-text-primary: #ffffff;
  }
}
```

### Seasonal Themes
Create themes for special occasions or seasons by extending base themes with decorative elements.

### High Contrast Mode
```css
:root.theme-high-contrast {
  --color-bg-primary: #ffffff;
  --color-text-primary: #000000;
  --color-border: #000000;
  /* Maximum contrast for accessibility */
}
```

## Troubleshooting

### Common Issues
1. **Theme not loading**: Check CSS selector specificity
2. **Colors not updating**: Verify CSS custom property names
3. **Poor contrast**: Use contrast checking tools
4. **Mobile issues**: Test on actual devices

### Debug Tools
```javascript
// Check current theme in browser console
console.log(getComputedStyle(document.documentElement).getPropertyValue('--color-bg-primary'))
```

Happy theming! 🎨