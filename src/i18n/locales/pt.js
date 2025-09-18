/**
 * Portuguese (Brazil) translations
 * Default language for mark2 application
 */

export default {
  // Meta information
  meta: {
    code: 'pt',
    name: 'Português',
    nativeName: 'Português (Brasil)',
    direction: 'ltr'
  },

  // Application
  app: {
    title: 'mark2 - Markdown para Mapa Mental',
    description: 'Transforme texto Markdown em mapas mentais interativos',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso'
  },

  // Navigation and Header
  header: {
    title: 'mark2',
    subtitle: 'Markdown para Mapa Mental'
  },

  // Buttons and Actions
  buttons: {
    save: 'Salvar',
    cancel: 'Cancelar',
    close: 'Fechar',
    clear: 'Limpar',
    example: 'Exemplo',
    export: 'Exportar',
    import: 'Importar',
    help: 'Ajuda',
    settings: 'Configurações',
    theme: 'Tema',
    language: 'Idioma',
    zoomIn: 'Aumentar zoom',
    zoomOut: 'Diminuir zoom',
    fitScreen: 'Ajustar à tela',
    reset: 'Resetar',
    copy: 'Copiar',
    paste: 'Colar',
    undo: 'Desfazer',
    redo: 'Refazer'
  },

  // Editor Panel
  editor: {
    title: 'Editor Markdown',
    placeholder: `Digite seu texto markdown aqui...

Exemplo:
# Título Principal
## Subtítulo
- Item da lista
- Outro item`,
    wordCount: 'palavras',
    lineCount: 'linhas',
    characterCount: 'caracteres',
    saved: 'Salvo automaticamente',
    unsaved: 'Alterações não salvas'
  },

  // Mind Map
  mindMap: {
    title: 'Mapa Mental',
    generating: 'Gerando mapa mental...',
    empty: 'Digite texto markdown para ver seu mapa mental',
    error: 'Não foi possível gerar o mapa mental',
    errorDetails: 'Verifique se o texto markdown está formatado corretamente',
    nodeSelected: 'Nó selecionado',
    nodeEdit: 'Clique duas vezes para editar',
    nodeDelete: 'Pressione Delete para remover',
    connectionHover: 'Conexão entre nós',
    zoomLevel: 'Nível de zoom: {level}%'
  },

  // Themes
  themes: {
    title: 'Escolher Tema',
    light: 'Claro',
    dark: 'Escuro',
    blue: 'Azul',
    green: 'Verde',
    orange: 'Laranja',
    description: {
      light: 'Fundo branco limpo com texto preto',
      dark: 'Modo escuro para uso confortável em pouca luz',
      blue: 'Paleta de cores azul profissional',
      green: 'Tons de verde inspirados na natureza',
      orange: 'Tema laranja energético'
    }
  },

  // Languages
  languages: {
    title: 'Escolher Idioma',
    portuguese: 'Português',
    english: 'English',
    spanish: 'Español',
    systemDefault: 'Padrão do sistema'
  },

  // Help and Instructions
  help: {
    title: 'Como usar o mark2',
    introduction: 'O mark2 cria mapas mentais organizados em hierarquia radial, com cores diferentes para cada nível:',
    hierarchy: {
      title: 'Estrutura Hierárquica:',
      center: 'Centro: Título principal (#) - núcleo do mapa',
      sections: 'Primeiro nível: Seções (##) em azul - conectadas ao centro',
      subsections: 'Segundo nível: Subsections (###) em roxo - filhas das seções',
      items: 'Terceiro nível: Itens (-) em verde - filhos das subsections'
    },
    instructions: {
      headers: 'Use # para o tópico central (aparece no centro do mapa)',
      subheaders: 'Use ## para seções principais (nós azuis ao redor do centro)',
      subsubheaders: 'Use ### para subsections (nós roxos, filhos das seções)',
      bullets: 'Use - para itens específicos (nós verdes, filhos das subsections)',
      numbers: 'Use números para listas ordenadas',
      text: 'Texto puro serve como documentação e contexto (não vira nós visuais)'
    },
    supportText: {
      title: 'Texto de Apoio:',
      description: 'Texto sem marcação (como "O Atomic Design é uma metodologia...") serve para:',
      documentation: '• Documentação e explicações detalhadas',
      context: '• Contexto e informações complementares',
      reference: '• Material de referência e apoio',
      note: 'Este texto não aparece como nós no mapa, mas ajuda a entender o conteúdo.'
    },
    example: 'Clique em "Exemplo" para ver como "Conceitos Fundamentais" usa texto de apoio.',
    tips: {
      title: 'Navegação:',
      zoom: 'Use os controles de zoom para navegar pelo mapa',
      drag: 'Arraste para mover a visualização',
      select: 'Clique nos nós para selecioná-los',
      hierarchy: 'Observe as cores: azul → roxo → verde = hierarquia'
    }
  },

  // Export and Import
  export: {
    title: 'Exportar Mapa Mental',
    formats: {
      png: 'Imagem PNG',
      svg: 'Vetor SVG',
      pdf: 'Documento PDF',
      json: 'Dados JSON'
    },
    options: {
      includeBackground: 'Incluir fundo',
      highResolution: 'Alta resolução',
      transparent: 'Fundo transparente'
    },
    success: 'Mapa mental exportado com sucesso',
    error: 'Erro ao exportar mapa mental'
  },

  // Settings
  settings: {
    title: 'Configurações',
    general: 'Geral',
    appearance: 'Aparência',
    editor: 'Editor',
    mindMap: 'Mapa Mental',
    options: {
      autoSave: 'Salvamento automático',
      wordWrap: 'Quebra de linha automática',
      lineNumbers: 'Números de linha',
      minimap: 'Mini mapa',
      animations: 'Animações',
      sounds: 'Sons',
      notifications: 'Notificações'
    }
  },

  // Accessibility
  accessibility: {
    close: 'Fechar',
    menu: 'Menu',
    navigation: 'Navegação',
    main: 'Conteúdo principal',
    sidebar: 'Barra lateral',
    toolbar: 'Barra de ferramentas',
    dialog: 'Diálogo',
    button: 'Botão',
    textInput: 'Campo de texto',
    checkbox: 'Caixa de seleção',
    radioButton: 'Botão de opção',
    select: 'Seletor',
    link: 'Link',
    image: 'Imagem',
    video: 'Vídeo',
    audio: 'Áudio'
  },

  // Error Messages
  errors: {
    general: 'Ocorreu um erro inesperado',
    network: 'Erro de conexão de rede',
    fileNotFound: 'Arquivo não encontrado',
    invalidFormat: 'Formato de arquivo inválido',
    saveError: 'Erro ao salvar',
    loadError: 'Erro ao carregar',
    parseError: 'Erro ao analisar markdown',
    renderError: 'Erro ao renderizar mapa mental',
    permissionDenied: 'Permissão negada',
    quotaExceeded: 'Limite de armazenamento excedido'
  },

  // Success Messages
  success: {
    saved: 'Salvo com sucesso',
    loaded: 'Carregado com sucesso',
    exported: 'Exportado com sucesso',
    imported: 'Importado com sucesso',
    copied: 'Copiado para a área de transferência',
    reset: 'Configurações resetadas'
  },

  // File Operations
  file: {
    new: 'Novo',
    open: 'Abrir',
    save: 'Salvar',
    saveAs: 'Salvar como',
    recent: 'Recentes',
    untitled: 'Sem título',
    modified: 'Modificado',
    size: 'Tamanho',
    created: 'Criado',
    modified: 'Modificado'
  },

  // Mobile Interface
  mobile: {
    editor: 'Editor',
    mindMap: 'Mapa',
    menu: 'Menu',
    back: 'Voltar',
    fullscreen: 'Tela cheia',
    exitFullscreen: 'Sair da tela cheia'
  },

  // Time and Date
  time: {
    now: 'agora',
    today: 'hoje',
    yesterday: 'ontem',
    lastWeek: 'semana passada',
    lastMonth: 'mês passado',
    minute: 'minuto',
    minutes: 'minutos',
    hour: 'hora',
    hours: 'horas',
    day: 'dia',
    days: 'dias',
    week: 'semana',
    weeks: 'semanas',
    month: 'mês',
    months: 'meses',
    year: 'ano',
    years: 'anos'
  },

  // Markdown Examples
  examples: {
    atomicDesign: {
      title: 'Exemplo: Atomic Design',
      description: 'Demonstração de como estruturar componentes usando Atomic Design'
    },
    projectPlanning: {
      title: 'Exemplo: Planejamento de Projeto',
      description: 'Como organizar fases e tarefas de um projeto'
    },
    studyNotes: {
      title: 'Exemplo: Notas de Estudo',
      description: 'Estruturação de conteúdo acadêmico em mapa mental'
    }
  }
}