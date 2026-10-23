/**
 * Shared editorial vocabulary for project content.
 *
 * The catalog no longer keeps a central list of project slugs: the folder
 * name under `projects/` is the slug, and every `content.yaml` carries its
 * own metadata. Only the finite category and status vocabularies live here.
 */

export const PROJECT_CATEGORIES = ['ia', 'producto', 'frontend', 'juegos'] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUSES = ['live', 'in-development', 'archived'] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** A project slug is the kebab-case name of its folder under `projects/`. */
export const PROJECT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type ProjectSlug = string;

export function isProjectSlug(value: string): value is ProjectSlug {
  return PROJECT_SLUG_PATTERN.test(value);
}
