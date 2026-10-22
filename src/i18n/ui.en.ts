import type { UiStrings } from './ui.es.ts';

export const uiEn = {
  localeName: 'English',
  profile: {
    role: 'Full-Stack Developer',
    location: 'Lima, Peru',
    contact: 'Contact',
  },
  pages: {
    home: {
      description:
        'Portfolio of Walker Rómulo Alfaro Trelles, a full-stack developer based in Lima, Peru.',
    },
    work: {
      heading: 'Work',
      description:
        'A catalog of product, frontend, game, and AI-tool projects, with case studies and status notes.',
    },
    about: {
      heading: 'About',
      description:
        'Professional profile, capabilities, technologies, and working context for Walker Rómulo Alfaro Trelles.',
    },
    notFound: {
      code: '404',
      heading: 'Page not found',
      description: 'The page you requested does not exist or has moved.',
      message: 'You can return home or continue exploring the work catalog.',
    },
    colophon: {
      heading: 'Colophon',
      description: 'How this portfolio was built: stack, typefaces, and publishing principles.',
      intro: 'This site was designed and developed by Walker Rómulo Alfaro Trelles.',
      stack:
        'It is built with Astro, TypeScript, and Tailwind CSS. The Archivo and Source Serif 4 typefaces are self-hosted.',
      privacy: 'The site has no analytics or third-party trackers.',
    },
  },
  nav: {
    primary: 'Primary navigation',
    home: 'Home',
    work: 'Work',
    about: 'About',
    cv: 'CV',
    social: 'Social links',
    menu: 'Menu',
  },
  footer: {
    contact: 'Contact',
    colophon: 'Colophon',
  },
  theme: {
    legend: 'Theme',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
  },
  language: {
    switcher: 'Language',
    switchLabel: 'Switch language to Spanish',
    targetLabel: 'Español',
  },
  a11y: {
    skipToContent: 'Skip to content',
  },
  filters: {
    label: 'Filter by category',
    all: 'All',
    clear: 'Clear filter',
    empty: 'There are no projects in this category.',
    countOne: 'project',
    countMany: 'projects',
  },
  catalog: {
    previewLabel: 'Project preview',
    coverAlt: 'Cover of {title}, category {category}',
  },
  categories: {
    ia: 'AI & agents',
    producto: 'Product',
    frontend: 'Frontend',
    juegos: 'Games',
  },
  statuses: {
    live: 'Live',
    'in-development': 'In development',
    archived: 'Archived',
  },
  actions: {
    viewProject: 'View project',
    viewLive: 'View site',
    viewCode: 'View code',
    backToWork: 'Back to work',
    downloadCv: 'Download CV',
    readCv: 'View CV',
    contact: 'Contact',
    nextProject: 'Next project',
    previousProject: 'Previous project',
    viewAllWork: 'View all work',
    backHome: 'Back home',
    linksPending: 'Links pending.',
  },
  empty: {
    noProjects: 'No projects have been published yet.',
    noFilterResults: 'No projects match this filter.',
    noCaseStudy: 'The case study is in preparation.',
  },
  forms: {
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send message',
    required: 'Required',
  },
  project: {
    year: 'Year',
    category: 'Category',
    status: 'Status',
    stack: 'Stack',
    what: 'What it is',
    role: 'Role',
    result: 'Result',
    pending: 'Pending',
    technologies: 'Project technologies',
    availability: 'Availability',
  },
  caseStudy: {
    navigation: 'Project navigation',
    galleryLabel: 'Project gallery',
    openImage: 'Enlarge image of {title}: {alt}',
    lightboxLabel: 'Enlarged view of {title}',
    closeLightbox: 'Close image',
  },
} satisfies UiStrings;
