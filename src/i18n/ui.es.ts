export const uiEs = {
  localeName: 'Español',
  profile: {
    role: 'Desarrollador Full-Stack',
    location: 'Lima, Perú',
    contact: 'Contacto',
  },
  pages: {
    home: {
      description:
        'Portafolio de Walker Rómulo Alfaro Trelles, desarrollador full-stack con base en Lima, Perú.',
    },
    work: {
      heading: 'Trabajo',
      description:
        'Catálogo de proyectos de producto, frontend, juegos y herramientas de IA, con estudios de caso y notas de estado.',
    },
    about: {
      heading: 'Sobre mí',
      description:
        'Perfil profesional, capacidades, trayectoria y contexto de trabajo de Walker Rómulo Alfaro Trelles.',
    },
    cv: {
      heading: 'Currículum',
      description:
        'Experiencia, formación, habilidades y cursos de Walker Rómulo Alfaro Trelles.',
      pending: 'El currículum completo estará disponible próximamente.',
    },
    notFound: {
      code: '404',
      heading: 'Página no encontrada',
      description: 'La página solicitada no existe o cambió de ubicación.',
      message: 'Puedes volver al inicio o continuar explorando el catálogo de trabajo.',
    },
  },
  nav: {
    primary: 'Navegación principal',
    home: 'Inicio',
    work: 'Trabajo',
    about: 'Sobre mí',
    cv: 'CV',
    social: 'Redes sociales',
  },
  theme: {
    legend: 'Tema',
    system: 'Sistema',
    light: 'Claro',
    dark: 'Oscuro',
  },
  language: {
    switcher: 'Idioma',
    switchLabel: 'Cambiar idioma a inglés',
    targetLabel: 'English',
  },
  a11y: {
    skipToContent: 'Saltar al contenido',
  },
  filters: {
    label: 'Filtrar por categoría',
    all: 'Todos',
    clear: 'Limpiar filtro',
    empty: 'No hay proyectos en esta categoría.',
  },
  categories: {
    ia: 'IA y agentes',
    producto: 'Producto',
    frontend: 'Frontend',
    juegos: 'Juegos',
  },
  statuses: {
    live: 'Publicado',
    'in-development': 'En desarrollo',
    archived: 'Archivado',
  },
  actions: {
    viewProject: 'Ver proyecto',
    viewLive: 'Ver sitio',
    viewCode: 'Ver código',
    backToWork: 'Volver al trabajo',
    downloadCv: 'Descargar CV',
    readCv: 'Ver CV',
    contact: 'Contacto',
    nextProject: 'Siguiente proyecto',
    previousProject: 'Proyecto anterior',
    viewAllWork: 'Ver todo el trabajo',
    backHome: 'Volver al inicio',
  },
  empty: {
    noProjects: 'Todavía no hay proyectos publicados.',
    noFilterResults: 'No hay proyectos que coincidan con este filtro.',
    noCaseStudy: 'El caso de estudio está en preparación.',
  },
  forms: {
    name: 'Nombre',
    email: 'Correo electrónico',
    message: 'Mensaje',
    send: 'Enviar mensaje',
    required: 'Obligatorio',
  },
  project: {
    year: 'Año',
    category: 'Categoría',
    status: 'Estado',
    stack: 'Stack',
    role: 'Rol',
    result: 'Resultado',
    pending: 'Pendiente',
    technologies: 'Tecnologías del proyecto',
    availability: 'Disponibilidad',
  },
};

export type UiStrings = typeof uiEs;
