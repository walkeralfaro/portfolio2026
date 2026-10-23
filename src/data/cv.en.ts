import { parseCv } from './cv.schema.ts';

/**
 * Complete English translation of the Spanish CV structure.
 * The excluded client project is described generically and never published.
 */
export const cvEn = parseCv({
  personal: {
    firstName: "Walker Rómulo",
    lastName: "Alfaro Trelles",
    position:
      "Full-Stack Developer and Electronic Engineer | React, Next.js, TypeScript, Node.js",
    address: "Lima, Peru",
    email: "walkeralfarotrelles@gmail.com",
    homepage: "https://www.walkeralfaro.com",
    linkedin: "https://www.linkedin.com/in/walkeralfaro/",
    github: "https://github.com/walkeralfaro",
  },
  summary:
    "Full-Stack Developer and Electronic Engineer with more than 5 years in web development and more than 10 years in industrial automation and software. Specialized in React, Next.js, TypeScript, JavaScript, Node.js, NestJS, Astro, and Tailwind CSS, with experience in clean architectures, REST APIs, accessibility, responsive design, and security. Has led the development of web applications with MCP server integration, CRUD tools for AI agents, and Prompt Engineering, applying authentication with SHA-256 tokens, persistence with Prisma, SQLite, PostgreSQL, MySQL, and MongoDB, validation with Zod, state management with Zustand, testing with Vitest and Playwright, and deployment on Vercel. Also proficient in Laravel, PHP, Java, Spring Boot, Docker, and Git.\n\nHas experience in IT project management for private- and public-sector clients, coordinating scope, schedule, and resources, with leadership of multidisciplinary teams and 24/7 support and maintenance operations. Has managed biometrics initiatives, nationwide server distribution and installation, and parking equipment maintenance across multiple clients and sites. His foundation in automation, industrial monitoring, and control includes DCS, SCADA in LabVIEW and InTouch, HMI, Batch automation, System Platform, and ArchestrA, with experience in mining, data centers, cement plants, ships, and laboratories. Results-oriented, with experience in requirements gathering, technical documentation, and team coordination; seeking Full-Stack, Frontend, Backend, or IT Project Management roles.",
  education: [
    {
      degree: "Web Developer - Java",
      institution: "Alura ONE - Oracle Next Education",
      location: "Lima, Peru",
      dates: "Jan 2024 - Jul 2024",
      bullets: [
        "Intensive full-stack web development training with a specialization in Java and Spring Boot.",
        "Development of web applications and RESTful APIs with Java, Spring Boot, and MySQL, applying good programming and software design practices.",
        "Solving practical challenges and developing projects with version control and collaborative work.",
      ],
    },
    {
      degree: "Electronic Engineering",
      institution: "Universidad Nacional del Callao",
      location: "Callao, Peru",
      dates: "Mar 2006 - Jun 2011",
      bullets: [
        "Professional degree in Electronic Engineering with a specialization in Automation and Industrial Control.",
        "Graduated in the top fifth of the class.",
      ],
    },
  ],
  experience: [
    {
      position: "Full-Stack Consultant",
      organisation: "Independent",
      location: "Lima, Peru",
      dates: "Feb 2025 - Present",
      bullets: [
        "Development of full-stack web applications with React 19, Next.js 16 (App Router), TypeScript, Astro, Vite, and Tailwind CSS.",
        "Integration of MCP (Model Context Protocol) servers into web applications to expose CRUD tools to AI agents, sharing the same business layer and persistence with Prisma, SQLite, and Zod validation.",
        "Implementation of authentication with per-user access tokens, SHA-256 hashing, 90-day expiration, and immediate revocation, applying security best practices.",
        "Use of AI agents for web application development and workflow automation, together with Prompt Engineering to generate structured seven-line prompts, style catalogs, and anti-cliché filters.",
        "Development of interfaces with Zustand, React Router v7, localStorage, inline editing, live preview, dark mode, and layouts.",
        "Quality assurance with unit, integration, and E2E tests using Vitest and Playwright, interactive architecture documentation, and data modeling with Prisma and SQLite.",
      ],
      techSkills:
        "React, Next.js, TypeScript, JavaScript, Node.js, NestJS, Server Actions, Astro, Vite, Tailwind CSS, MCP (Model Context Protocol), Prisma, SQLite, PostgreSQL, MySQL, MongoDB, Zod, Zustand, React Router, Prompt Engineering, SHA-256 token authentication, application security, Vitest, Playwright, Vercel, Docker, Git.",
      softSkills:
        "Technical communication, problem solving, autonomy, adaptability, results orientation.",
    },
    {
      position: "Web Developer",
      organisation: "GI Administradora de Negocios e Inversiones S.A.C.",
      location: "Lima, Peru",
      dates: "May 2024 - Dec 2024",
      bullets: [
        "Development of the frontend for a real-estate platform with Laravel, PHP, and Alpine.js, creating dynamic, reusable components.",
        "Design of intuitive, responsive UI/UX interfaces aligned with business goals and user needs.",
        "Management of technical and functional requirements with users and stakeholders, ensuring scope.",
        "Design and optimization of the MySQL database, defining table relationships and efficient queries with Eloquent ORM.",
        "Backend development with Laravel and PHP, implementing models, controllers, and reusable components.",
        "Implementation of an administrative panel with Filament for efficient resource management.",
        "Technical and functional documentation of the platform with Docusaurus for users and developers.",
      ],
      techSkills:
        "Alpine.js, Blade, Bootstrap, Swiper, UI/UX, responsive design, MySQL, Eloquent ORM, Laravel, PHP, Filament, Docusaurus, HTML5, CSS3, JavaScript, Git, technical documentation.",
      softSkills:
        "Teamwork, communication, requirements gathering, user orientation.",
    },
    {
      position: "IT Project Coordinator",
      organisation: "Intellisoft S.A.",
      location: "Lima, Peru",
      dates: "Nov 2017 - Jul 2019",
      bullets: [
        "Management of IT projects for private- and public-sector clients, coordinating scope, schedule, and resources.",
        "Leadership of more than 20 people in project coordination, maintenance, and technical support operations.",
        "Management of the biometric gate implementation project at Jorge Chávez International Airport.",
        "Management of the server distribution, installation, and training project across 56 UGELs nationwide.",
        "Coordination of maintenance and support for parking equipment at more than 20 clients and 40 parking facilities.",
      ],
      techSkills:
        "PMP, schedule planning, server installation and distribution, biometrics, training.",
      softSkills:
        "Leadership, communication, organization, decision-making, results orientation, customer service.",
    },
    {
      position: "Project Engineer",
      organisation: "Descom Industrial Process S.A.C.",
      location: "Lima, Peru",
      dates: "Aug 2016 - Jul 2017",
      bullets: [
        "Implementation of Batch automation in a cement manufacturing plant, integrating control logic and process sequences.",
        "Development of SCADA with InTouch for the supervision and operation of industrial processes.",
        "Implementation of an integrated monitoring system with System Platform and ArchestrA for the visualization and supervision of process variables.",
      ],
      techSkills:
        "Batch automation, SCADA, InTouch, System Platform, ArchestrA, process control, industrial monitoring, cement plants.",
      softSkills:
        "Problem solving, teamwork, adaptation to industrial environments.",
    },
    {
      position: "Project Manager",
      organisation: "Sociedad Inducontrol Ingeniería S.A.C.",
      location: "Lima, Peru",
      dates: "Aug 2014 - Dec 2015",
      bullets: [
        "Management of the industrial automation project area in data centers, cement plants, and mining, managing scope, schedule, and resources.",
        "Management of project closures and active pursuit of new business opportunities.",
        "Design and implementation of a technical training plan for the area's engineers, strengthening their technical skills.",
      ],
      techSkills:
        "Industrial automation, project management, resource planning, project closure, business development, team leadership.",
      softSkills:
        "Leadership, communication, decision-making, negotiation, results orientation.",
    },
    {
      position: "Project Engineer",
      organisation: "Sociedad Inducontrol Ingeniería S.A.C.",
      location: "Lima, Peru",
      dates: "Feb 2013 - Jul 2014",
      bullets: [
        "Development of automation, monitoring, and supervision projects in sectors such as mining, data centers, cement plants, ships, and laboratories, covering basic and detailed engineering.",
        "Design of Distributed Control Systems (DCS) for the operation and supervision of industrial processes.",
        "Programming of SCADA applications in LabVIEW and development of custom user interfaces (HMI) for process monitoring.",
        "Preparation of descriptive reports, basic and detailed engineering, and technical documentation for automation projects.",
      ],
      techSkills:
        "Industrial automation, DCS (Distributed Control Systems), SCADA, LabVIEW, HMI, process control, monitoring and supervision, basic and detailed engineering, technical documentation.",
      softSkills:
        "Problem analysis, teamwork, technical communication, attention to detail.",
    },
  ],
  projects: [
    {
      project: "TODO-mcp",
      organisation: "Personal project",
      location: "Lima, Peru",
      dates: "Oct 2026 - Present",
      bullets: [
        "Development of a task management application with a dual architecture: a Next.js 16 interface (App Router, React 19, and Server Actions) and an MCP server on SQLite, sharing the same business layer with Prisma and Zod validation.",
        "Implementation of 5 CRUD tools for AI agents, status filters, paginated search, and automatic completion-date updates.",
        "Management of per-user MCP tokens with SHA-256 hashing and immediate revocation; authentication with Better Auth.",
        "Coverage with unit, integration, and E2E tests using Vitest and Playwright, plus self-contained interactive architecture documentation.",
      ],
      techSkills:
        "Next.js 16, React 19, TypeScript, Server Actions, Prisma, SQLite, Zod, MCP (Model Context Protocol), AI agents, Tailwind CSS, Better Auth, Vitest, Playwright.",
      link: "https://github.com/walkeralfaro/todo-mcp-dual",
    },
    {
      project: "Image Prompt",
      organisation: "Personal project",
      location: "Lima, Peru",
      dates: "Oct 2026",
      bullets: [
        "Development of a web application with a guided questionnaire that generates optimized seven-line prompts for AI image generators (ChatGPT Images, DALL-E, and Midjourney).",
        "Implementation of a Prompt Engineering engine with a catalog of 17 styles, anti-cliché filters across 7 themes, live preview, and an empty-adjective detector.",
        "Management of multiple projects, drafts, history, and an ES/EN language interface with Zustand and localStorage persistence; Markdown export and light/dark themes.",
      ],
      techSkills:
        "React 19, TypeScript, Vite 8, React Router v7, Zustand, Tailwind CSS v4, Prompt Engineering, Lucide React, localStorage.",
      link: "https://github.com/walkeralfaro/image-prompt",
    },
    {
      project: "Cheatsheet Editor",
      organisation: "Personal project",
      location: "Lima, Peru",
      dates: "Jul 2026",
      bullets: [
        "Development of a 100% local web application for creating, organizing, and managing keyboard-shortcut cheat sheets.",
        "Implementation of multiple cheat sheets, inline editing, live preview, dark mode, and localStorage persistence.",
        "Print view optimized for a two-column PDF, built with Astro, React, TypeScript, and Tailwind CSS v4.",
      ],
      techSkills:
        "Astro, React, TypeScript, Tailwind CSS v4, localStorage, PDF printing.",
      link: "https://github.com/walkeralfaro/cheatsheet-editor-",
    },
    {
      project: "REST Countries Explorer",
      organisation: "Personal project",
      location: "Lima, Peru",
      dates: "Apr 2023 - May 2023",
      bullets: [
        "Responsive web application that consumes the REST Countries API to search and filter countries by name or region.",
        "Implementation of light/dark themes, detail views, and an accessible interface with React, Next.js, and TypeScript.",
      ],
      techSkills: "React, Next.js, TypeScript, REST API, Tailwind CSS.",
      link: "https://walkeralfaro.com/",
    },
  ],
  skills: [
    {
      category: "Frontend",
      skills:
        "React, Next.js (App Router), TypeScript, JavaScript (ES6+), HTML5, CSS3, Astro, Tailwind CSS, shadcn/ui, Zustand, React Hook Form, React Router, Server Actions, Alpine.js, Bootstrap",
    },
    {
      category: "Backend",
      skills:
        "Node.js, NestJS, Express, Laravel, PHP, Java, Spring Boot, REST APIs, Zod, Better Auth",
    },
    {
      category: "Databases",
      skills:
        "PostgreSQL, MySQL, MongoDB, SQLite, Prisma, Sequelize, Mongoose, Eloquent ORM",
    },
    {
      category: "AI and Automation",
      skills:
        "MCP (Model Context Protocol), AI agents, Prompt Engineering, CRUD tools, workflow automation",
    },
    {
      category: "Industrial Automation",
      skills:
        "DCS, SCADA, LabVIEW, InTouch, HMI, System Platform, ArchestrA, Batch automation, process control, monitoring and supervision",
    },
    {
      category: "Testing and Quality",
      skills:
        "Vitest, Playwright, unit tests, integration tests, E2E tests, Clean Code, technical documentation",
    },
    {
      category: "Tools and DevOps",
      skills: "Git, GitHub, Docker, Vite, Vercel, Figma, Docusaurus, Filament",
    },
    {
      category: "Competencies",
      skills:
        "Responsive design, mobile-first, web accessibility (a11y), software architecture, project management, team leadership, technical communication, problem solving",
    },
  ],
  courses: [
    {
      course: "React and TypeScript - The Complete Guide with +10 Projects",
      institution: "Udemy",
      date: "Oct 2025",
      link: "https://www.udemy.com/certificate/UC-c291c748-5168-4238-8471-a4a0e0e9756c/",
    },
    {
      course: "shadcn/ui: Accessible and customizable components",
      institution: "DevTalles",
      date: "Sep 2025",
      link: "https://cursos.devtalles.com/certificates/xmpfnsh8on",
    },
    {
      course: "Java Web Training: Build Applications with Spring Boot",
      institution: "Alura",
      date: "Jul 2024",
      link: "https://app.aluracursos.com/degree/certificate/45a11754-0b72-4bae-91d9-081c89440123?lang",
    },
    {
      course: "Programming Logic Training with JavaScript",
      institution: "Alura",
      date: "Feb 2024",
      link: "https://app.aluracursos.com/degree/certificate/47e33992-1ec1-4d2d-b6fd-e4ea1730e56e",
    },
    {
      course: "Complete Web Development with HTML5, CSS3, JS, AJAX, PHP, and MySQL",
      institution: "Udemy",
      date: "Jun 2023",
      link: "https://www.udemy.com/course/desarrollo-web-completo-con-html5-css3-js-php-y-mysql/",
    },
    {
      course: "UX/UI Design Bootcamp: Learn Design Thinking and Figma",
      institution: "Udemy",
      date: "Apr 2023",
      link: "https://www.udemy.com/certificate/UC-d6ba01a5-a970-4f59-88fb-2f323fd23689/",
    },
    {
      course: "Build applications using TypeScript",
      institution: "Microsoft Learn",
      date: "Apr 2023",
      link: "https://learn.microsoft.com/en-us/users/walker-0227/achievements/2q429srv",
    },
    {
      course: "Node: Zero to Expert",
      institution: "Udemy",
      date: "Mar 2023",
      link: "https://www.udemy.com/course/node-de-cero-a-experto/",
    },
  ],
  languages: [
    { language: "Spanish", proficiency: "Native" },
    { language: "English", proficiency: "Intermediate" },
  ],
  settings: {
    highlight: "russell-black",
    sections: [
      "summary",
      "experience",
      "education",
      "projects",
      "skills",
      "courses",
      "languages",
    ],
  },
});
