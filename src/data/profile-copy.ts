import type { ProjectSlug } from '../content/project-slugs';

const es = {
  intro: {
    value: 'Construyo productos web de extremo a extremo: interfaces, APIs y persistencia, con atención a la accesibilidad y las pruebas.',
    availability: 'Abierto a oportunidades Full-Stack, Frontend, Backend y gestión de proyectos TI.',
    stackLabel: 'Stack principal',
  },
  featured: {
    title: 'Proyectos destacados',
    intro: 'Cuatro proyectos que muestran distintas partes de mi trabajo web.',
  },
  excerpt: {
    title: 'Más trabajo',
    action: 'Explorar los 14 proyectos',
  },
  capabilities: {
    title: 'Cómo trabajo',
    items: [
      { title: 'Producto de extremo a extremo', description: 'De los requisitos y el modelo de datos a una aplicación lista para usar.', slug: 'todo-mcp' as ProjectSlug },
      { title: 'Interfaz y experiencia', description: 'Interfaces responsive con estado, accesibilidad y atención al detalle.', slug: 'image-prompt' as ProjectSlug },
      { title: 'Backend y datos', description: 'APIs propias, validación compartida y persistencia para flujos reales.', slug: 'url-shortener' as ProjectSlug },
      { title: 'Calidad y documentación', description: 'Pruebas en varias capas y decisiones técnicas explicadas con claridad.', slug: 'todo-mcp' as ProjectSlug },
    ],
  },
  trajectory: {
    title: 'Trayectoria',
    eras: [
      { dates: '2006–2019', title: 'Electrónica y automatización industrial', description: 'Ingeniería, control de procesos y coordinación de proyectos técnicos.' },
      { dates: '2023–2024', title: 'Transición al desarrollo web', description: 'Formación y experiencia profesional construyendo aplicaciones web.' },
      { dates: '2025–actualidad', title: 'Desarrollo full-stack independiente', description: 'Productos web de extremo a extremo, desde la arquitectura hasta las pruebas.' },
    ],
  },
  about: {
    intro: 'Soy desarrollador full-stack en Lima. Diseño y construyo aplicaciones web, desde interfaces y APIs hasta datos, pruebas y documentación.',
    backgroundTitle: 'Una base técnica que suma',
    background: 'Mi experiencia en ingeniería electrónica, automatización industrial y gestión de proyectos aporta rigor al levantamiento de requisitos, la documentación y la entrega. Es contexto que complementa mi trabajo web, no lo reemplaza.',
    experienceTitle: 'Experiencia profesional',
  },
  skills: {
    title: 'Tecnologías y contexto',
    groups: [
      { key: 'daily', title: 'Uso habitual', items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Prisma', 'SQLite', 'Zod', 'Tailwind CSS', 'Playwright'] },
      { key: 'production', title: 'Experiencia en producción', items: ['Astro', 'Vite', 'PostgreSQL', 'MongoDB', 'Vitest', 'Docker', 'Vercel', 'Laravel', 'PHP', 'Java', 'Spring Boot'] },
      { key: 'prior', title: 'Experiencia previa', items: ['DCS', 'SCADA', 'LabVIEW', 'InTouch', 'HMI', 'Automatización industrial', 'Gestión de proyectos'] },
    ],
  },
  contact: {
    title: 'Contacto',
    email: 'Escribir por correo',
    cv: 'Ver currículum',
  },
};

const en = {
  intro: {
    value: 'I build end-to-end web products: interfaces, APIs, and persistence, with care for accessibility and testing.',
    availability: 'Open to Full-Stack, Frontend, Backend, and IT Project Management opportunities.',
    stackLabel: 'Core stack',
  },
  featured: {
    title: 'Selected work',
    intro: 'Four projects that show different parts of my web development practice.',
  },
  excerpt: {
    title: 'More work',
    action: 'Explore all 14 projects',
  },
  capabilities: {
    title: 'How I work',
    items: [
      { title: 'End-to-end product', description: 'From requirements and data modeling to an application people can use.', slug: 'todo-mcp' as ProjectSlug },
      { title: 'Interface and experience', description: 'Responsive interfaces with state, accessibility, and attention to detail.', slug: 'image-prompt' as ProjectSlug },
      { title: 'Backend and data', description: 'Purpose-built APIs, shared validation, and persistence for real workflows.', slug: 'url-shortener' as ProjectSlug },
      { title: 'Quality and documentation', description: 'Testing across layers and technical decisions explained clearly.', slug: 'todo-mcp' as ProjectSlug },
    ],
  },
  trajectory: {
    title: 'Trajectory',
    eras: [
      { dates: '2006–2019', title: 'Electronics and industrial automation', description: 'Engineering, process control, and technical project coordination.' },
      { dates: '2023–2024', title: 'Transition to web development', description: 'Training and professional experience building web applications.' },
      { dates: '2025–present', title: 'Independent full-stack development', description: 'End-to-end web products, from architecture through testing.' },
    ],
  },
  about: {
    intro: 'I am a full-stack developer based in Lima. I design and build web applications, from interfaces and APIs to data, testing, and documentation.',
    backgroundTitle: 'A technical foundation that adds value',
    background: 'My background in electronic engineering, industrial automation, and project management brings rigor to requirements gathering, documentation, and delivery. It supports my web work rather than competing with it.',
    experienceTitle: 'Professional experience',
  },
  skills: {
    title: 'Technologies and context',
    groups: [
      { key: 'daily', title: 'Used regularly', items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Prisma', 'SQLite', 'Zod', 'Tailwind CSS', 'Playwright'] },
      { key: 'production', title: 'Production experience', items: ['Astro', 'Vite', 'PostgreSQL', 'MongoDB', 'Vitest', 'Docker', 'Vercel', 'Laravel', 'PHP', 'Java', 'Spring Boot'] },
      { key: 'prior', title: 'Previous experience', items: ['DCS', 'SCADA', 'LabVIEW', 'InTouch', 'HMI', 'Industrial automation', 'Project management'] },
    ],
  },
  contact: {
    title: 'Contact',
    email: 'Email me',
    cv: 'View résumé',
  },
} satisfies typeof es;

export const profileCopy = { es, en };
