export const PROJECT_SLUGS = [
  'todo-mcp',
  'image-prompt',
  'cheatsheet-editor',
  'url-shortener',
  'multi-step-form',
  'pokedex',
  'todo-app',
  'tic-tac-toe',
  'tip-calculator',
  'weather-app',
  'rest-countries-explorer',
  'tetris',
  'portfolio-profesional',
  'portfolio-2026',
] as const;

export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export const PROJECT_CATEGORIES = ['ia', 'producto', 'frontend', 'juegos'] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUSES = ['live', 'in-development', 'archived'] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
