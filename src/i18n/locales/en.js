/**
 * English translations
 * International language for mark2 application
 */

export default {
  // Meta information
  meta: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr'
  },

  // Application
  app: {
    title: 'mark2 - Markdown to Mind Map',
    description: 'Transform Markdown text into interactive mind maps',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success'
  },

  // Navigation and Header
  header: {
    title: 'mark2',
    subtitle: 'Markdown to Mind Map'
  },

  // Buttons and Actions
  buttons: {
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    clear: 'Clear',
    example: 'Example',
    export: 'Export',
    import: 'Import',
    help: 'Help',
    settings: 'Settings',
    theme: 'Theme',
    language: 'Language',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    fitScreen: 'Fit to screen',
    reset: 'Reset',
    copy: 'Copy',
    paste: 'Paste',
    undo: 'Undo',
    redo: 'Redo'
  },

  // Editor Panel
  editor: {
    title: 'Markdown Editor',
    placeholder: `Enter your markdown text here...

Example:
# Main Title
## Subtitle
- List item
- Another item`,
    wordCount: 'words',
    lineCount: 'lines',
    characterCount: 'characters',
    saved: 'Auto-saved',
    unsaved: 'Unsaved changes'
  },

  // Mind Map
  mindMap: {
    title: 'Mind Map',
    generating: 'Generating mind map...',
    empty: 'Enter markdown text to see your mind map',
    error: 'Unable to generate mind map',
    errorDetails: 'Please check if the markdown text is properly formatted',
    nodeSelected: 'Node selected',
    nodeEdit: 'Double-click to edit',
    nodeDelete: 'Press Delete to remove',
    connectionHover: 'Connection between nodes',
    zoomLevel: 'Zoom level: {level}%'
  },

  // Themes
  themes: {
    title: 'Choose Theme',
    light: 'Light',
    dark: 'Dark',
    blue: 'Blue',
    green: 'Green',
    orange: 'Orange',
    description: {
      light: 'Clean white background with black text',
      dark: 'Dark mode for comfortable low-light usage',
      blue: 'Professional blue color palette',
      green: 'Nature-inspired green tones',
      orange: 'Energetic orange theme'
    }
  },

  // Languages
  languages: {
    title: 'Choose Language',
    portuguese: 'Português',
    english: 'English',
    spanish: 'Español',
    systemDefault: 'System default'
  },

  // Help and Instructions
  help: {
    title: 'How to use mark2',
    introduction: 'mark2 creates mind maps organized in radial hierarchy, with different colors for each level:',
    hierarchy: {
      title: 'Hierarchical Structure:',
      center: 'Center: Main title (#) - core of the map',
      sections: 'First level: Sections (##) in blue - connected to center',
      subsections: 'Second level: Subsections (###) in purple - children of sections',
      items: 'Third level: Items (-) in green - children of subsections'
    },
    instructions: {
      headers: 'Use # for the central topic (appears at the center of the map)',
      subheaders: 'Use ## for main sections (blue nodes around the center)',
      subsubheaders: 'Use ### for subsections (purple nodes, children of sections)',
      bullets: 'Use - for specific items (green nodes, children of subsections)',
      numbers: 'Use numbers for ordered lists',
      text: 'Plain text serves as documentation and context (does not become visual nodes)'
    },
    supportText: {
      title: 'Support Text:',
      description: 'Text without markup (like "Atomic Design is a methodology...") serves for:',
      documentation: '• Documentation and detailed explanations',
      context: '• Context and complementary information',
      reference: '• Reference material and support',
      note: 'This text does not appear as nodes in the map, but helps understand the content.'
    },
    example: 'Click "Example" to see how "Fundamental Concepts" uses support text.',
    tips: {
      title: 'Navigation:',
      zoom: 'Use zoom controls to navigate the map',
      drag: 'Drag to move the view',
      select: 'Click nodes to select them',
      hierarchy: 'Notice the colors: blue → purple → green = hierarchy'
    }
  },

  // Export and Import
  export: {
    title: 'Export Mind Map',
    formats: {
      png: 'PNG Image',
      svg: 'SVG Vector',
      pdf: 'PDF Document',
      json: 'JSON Data'
    },
    options: {
      includeBackground: 'Include background',
      highResolution: 'High resolution',
      transparent: 'Transparent background'
    },
    success: 'Mind map exported successfully',
    error: 'Error exporting mind map'
  },

  // Settings
  settings: {
    title: 'Settings',
    general: 'General',
    appearance: 'Appearance',
    editor: 'Editor',
    mindMap: 'Mind Map',
    options: {
      autoSave: 'Auto-save',
      wordWrap: 'Word wrap',
      lineNumbers: 'Line numbers',
      minimap: 'Minimap',
      animations: 'Animations',
      sounds: 'Sounds',
      notifications: 'Notifications'
    }
  },

  // Accessibility
  accessibility: {
    close: 'Close',
    menu: 'Menu',
    navigation: 'Navigation',
    main: 'Main content',
    sidebar: 'Sidebar',
    toolbar: 'Toolbar',
    dialog: 'Dialog',
    button: 'Button',
    textInput: 'Text input',
    checkbox: 'Checkbox',
    radioButton: 'Radio button',
    select: 'Select',
    link: 'Link',
    image: 'Image',
    video: 'Video',
    audio: 'Audio'
  },

  // Error Messages
  errors: {
    general: 'An unexpected error occurred',
    network: 'Network connection error',
    fileNotFound: 'File not found',
    invalidFormat: 'Invalid file format',
    saveError: 'Error saving',
    loadError: 'Error loading',
    parseError: 'Error parsing markdown',
    renderError: 'Error rendering mind map',
    permissionDenied: 'Permission denied',
    quotaExceeded: 'Storage quota exceeded'
  },

  // Success Messages
  success: {
    saved: 'Saved successfully',
    loaded: 'Loaded successfully',
    exported: 'Exported successfully',
    imported: 'Imported successfully',
    copied: 'Copied to clipboard',
    reset: 'Settings reset'
  },

  // File Operations
  file: {
    new: 'New',
    open: 'Open',
    save: 'Save',
    saveAs: 'Save as',
    recent: 'Recent',
    untitled: 'Untitled',
    modified: 'Modified',
    size: 'Size',
    created: 'Created',
    modified: 'Modified'
  },

  // Mobile Interface
  mobile: {
    editor: 'Editor',
    mindMap: 'Mind Map',
    menu: 'Menu',
    back: 'Back',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen'
  },

  // Time and Date
  time: {
    now: 'now',
    today: 'today',
    yesterday: 'yesterday',
    lastWeek: 'last week',
    lastMonth: 'last month',
    minute: 'minute',
    minutes: 'minutes',
    hour: 'hour',
    hours: 'hours',
    day: 'day',
    days: 'days',
    week: 'week',
    weeks: 'weeks',
    month: 'month',
    months: 'months',
    year: 'year',
    years: 'years'
  },

  // Markdown Examples
  examples: {
    atomicDesign: {
      title: 'Example: Atomic Design',
      description: 'Demonstration of how to structure components using Atomic Design'
    },
    projectPlanning: {
      title: 'Example: Project Planning',
      description: 'How to organize project phases and tasks'
    },
    studyNotes: {
      title: 'Example: Study Notes',
      description: 'Structuring academic content as a mind map'
    }
  }
}