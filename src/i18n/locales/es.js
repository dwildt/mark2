/**
 * Spanish translations
 * International language for mark2 application
 */

export default {
  // Meta information
  meta: {
    code: 'es',
    name: 'Español',
    nativeName: 'Español',
    direction: 'ltr'
  },

  // Application
  app: {
    title: 'mark2 - Markdown a Mapa Mental',
    description: 'Transforma texto Markdown en mapas mentales interactivos',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito'
  },

  // Navigation and Header
  header: {
    title: 'mark2',
    subtitle: 'Markdown a Mapa Mental'
  },

  // Buttons and Actions
  buttons: {
    save: 'Guardar',
    cancel: 'Cancelar',
    close: 'Cerrar',
    clear: 'Limpiar',
    example: 'Ejemplo',
    export: 'Exportar',
    import: 'Importar',
    help: 'Ayuda',
    settings: 'Configuración',
    theme: 'Tema',
    language: 'Idioma',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    fitScreen: 'Ajustar a pantalla',
    reset: 'Restablecer',
    copy: 'Copiar',
    paste: 'Pegar',
    undo: 'Deshacer',
    redo: 'Rehacer'
  },

  // Editor Panel
  editor: {
    title: 'Editor Markdown',
    placeholder: `Ingresa tu texto markdown aquí...

Ejemplo:
# Título Principal
## Subtítulo
- Elemento de lista
- Otro elemento`,
    wordCount: 'palabras',
    lineCount: 'líneas',
    characterCount: 'caracteres',
    saved: 'Guardado automáticamente',
    unsaved: 'Cambios no guardados'
  },

  // Mind Map
  mindMap: {
    title: 'Mapa Mental',
    generating: 'Generando mapa mental...',
    empty: 'Ingresa texto markdown para ver tu mapa mental',
    error: 'No se pudo generar el mapa mental',
    errorDetails: 'Por favor verifica que el texto markdown esté formateado correctamente',
    nodeSelected: 'Nodo seleccionado',
    nodeEdit: 'Doble clic para editar',
    nodeDelete: 'Presiona Suprimir para eliminar',
    connectionHover: 'Conexión entre nodos',
    zoomLevel: 'Nivel de zoom: {level}%'
  },

  // Themes
  themes: {
    title: 'Elegir Tema',
    light: 'Claro',
    dark: 'Oscuro',
    blue: 'Azul',
    green: 'Verde',
    orange: 'Naranja',
    description: {
      light: 'Fondo blanco limpio con texto negro',
      dark: 'Modo oscuro para uso cómodo con poca luz',
      blue: 'Paleta de colores azul profesional',
      green: 'Tonos verdes inspirados en la naturaleza',
      orange: 'Tema naranja energético'
    }
  },

  // Languages
  languages: {
    title: 'Elegir Idioma',
    portuguese: 'Português',
    english: 'English',
    spanish: 'Español',
    systemDefault: 'Predeterminado del sistema'
  },

  // Help and Instructions
  help: {
    title: 'Cómo usar mark2',
    introduction: 'mark2 crea mapas mentales organizados en jerarquía radial, con colores diferentes para cada nivel:',
    hierarchy: {
      title: 'Estructura Jerárquica:',
      center: 'Centro: Título principal (#) - núcleo del mapa',
      sections: 'Primer nivel: Secciones (##) en azul - conectadas al centro',
      subsections: 'Segundo nivel: Subsecciones (###) en morado - hijas de las secciones',
      items: 'Tercer nivel: Elementos (-) en verde - hijos de las subsecciones'
    },
    instructions: {
      headers: 'Usa # para el tópico central (aparece en el centro del mapa)',
      subheaders: 'Usa ## para secciones principales (nodos azules alrededor del centro)',
      subsubheaders: 'Usa ### para subsecciones (nodos morados, hijos de las secciones)',
      bullets: 'Usa - para elementos específicos (nodos verdes, hijos de las subsecciones)',
      numbers: 'Usa números para listas ordenadas',
      text: 'Texto puro sirve como documentación y contexto (no se convierte en nodos visuales)'
    },
    supportText: {
      title: 'Texto de Apoyo:',
      description: 'Texto sin marcado (como "El Diseño Atómico es una metodología...") sirve para:',
      documentation: '• Documentación y explicaciones detalladas',
      context: '• Contexto e información complementaria',
      reference: '• Material de referencia y apoyo',
      note: 'Este texto no aparece como nodos en el mapa, pero ayuda a entender el contenido.'
    },
    example: 'Haz clic en "Ejemplo" para ver cómo "Conceptos Fundamentales" usa texto de apoyo.',
    tips: {
      title: 'Navegación:',
      zoom: 'Usa los controles de zoom para navegar el mapa',
      drag: 'Arrastra para mover la vista',
      select: 'Haz clic en los nodos para seleccionarlos',
      hierarchy: 'Observa los colores: azul → morado → verde = jerarquía'
    }
  },

  // Export and Import
  export: {
    title: 'Exportar Mapa Mental',
    formats: {
      png: 'Imagen PNG',
      svg: 'Vector SVG',
      pdf: 'Documento PDF',
      json: 'Datos JSON'
    },
    options: {
      includeBackground: 'Incluir fondo',
      highResolution: 'Alta resolución',
      transparent: 'Fondo transparente'
    },
    success: 'Mapa mental exportado exitosamente',
    error: 'Error al exportar mapa mental'
  },

  // Settings
  settings: {
    title: 'Configuración',
    general: 'General',
    appearance: 'Apariencia',
    editor: 'Editor',
    mindMap: 'Mapa Mental',
    options: {
      autoSave: 'Guardado automático',
      wordWrap: 'Ajuste de línea',
      lineNumbers: 'Números de línea',
      minimap: 'Minimapa',
      animations: 'Animaciones',
      sounds: 'Sonidos',
      notifications: 'Notificaciones'
    }
  },

  // Accessibility
  accessibility: {
    close: 'Cerrar',
    menu: 'Menú',
    navigation: 'Navegación',
    main: 'Contenido principal',
    sidebar: 'Barra lateral',
    toolbar: 'Barra de herramientas',
    dialog: 'Diálogo',
    button: 'Botón',
    textInput: 'Entrada de texto',
    checkbox: 'Casilla de verificación',
    radioButton: 'Botón de opción',
    select: 'Selector',
    link: 'Enlace',
    image: 'Imagen',
    video: 'Video',
    audio: 'Audio'
  },

  // Error Messages
  errors: {
    general: 'Ocurrió un error inesperado',
    network: 'Error de conexión de red',
    fileNotFound: 'Archivo no encontrado',
    invalidFormat: 'Formato de archivo inválido',
    saveError: 'Error al guardar',
    loadError: 'Error al cargar',
    parseError: 'Error al analizar markdown',
    renderError: 'Error al renderizar mapa mental',
    permissionDenied: 'Permiso denegado',
    quotaExceeded: 'Cuota de almacenamiento excedida'
  },

  // Success Messages
  success: {
    saved: 'Guardado exitosamente',
    loaded: 'Cargado exitosamente',
    exported: 'Exportado exitosamente',
    imported: 'Importado exitosamente',
    copied: 'Copiado al portapapeles',
    reset: 'Configuración restablecida'
  },

  // File Operations
  file: {
    new: 'Nuevo',
    open: 'Abrir',
    save: 'Guardar',
    saveAs: 'Guardar como',
    recent: 'Recientes',
    untitled: 'Sin título',
    modified: 'Modificado',
    size: 'Tamaño',
    created: 'Creado',
    modified: 'Modificado'
  },

  // Mobile Interface
  mobile: {
    editor: 'Editor',
    mindMap: 'Mapa',
    menu: 'Menú',
    back: 'Atrás',
    fullscreen: 'Pantalla completa',
    exitFullscreen: 'Salir de pantalla completa'
  },

  // Time and Date
  time: {
    now: 'ahora',
    today: 'hoy',
    yesterday: 'ayer',
    lastWeek: 'semana pasada',
    lastMonth: 'mes pasado',
    minute: 'minuto',
    minutes: 'minutos',
    hour: 'hora',
    hours: 'horas',
    day: 'día',
    days: 'días',
    week: 'semana',
    weeks: 'semanas',
    month: 'mes',
    months: 'meses',
    year: 'año',
    years: 'años'
  },

  // Markdown Examples
  examples: {
    atomicDesign: {
      title: 'Ejemplo: Diseño Atómico',
      description: 'Demostración de cómo estructurar componentes usando Diseño Atómico'
    },
    projectPlanning: {
      title: 'Ejemplo: Planificación de Proyecto',
      description: 'Cómo organizar fases y tareas de un proyecto'
    },
    studyNotes: {
      title: 'Ejemplo: Notas de Estudio',
      description: 'Estructuración de contenido académico en mapa mental'
    }
  }
}
