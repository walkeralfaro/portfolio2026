import { getCollection, type CollectionEntry } from 'astro:content';
import type { ProjectSlug } from '../lib/content/taxonomy';
import type { Locale } from '../i18n/locales';

export type ProjectEntry = CollectionEntry<'projects'>;

export async function getProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection('projects');
  return projects.sort((first, second) => first.data.order - second.data.order);
}

export function getFeaturedProjects(projects: ProjectEntry[]): ProjectEntry[] {
  return projects.filter((project) => project.data.featured);
}

export function getProjectCopy(project: ProjectEntry, locale: Locale) {
  return project.data.locales[locale];
}

/**
 * Previous and next detail pages in catalog order. Every project has an
 * internal page, and the sequence wraps at both ends.
 */
export function getAdjacentProjects(
  projects: ProjectEntry[],
  slug: ProjectSlug,
): { previous: ProjectEntry; next: ProjectEntry } | null {
  const index = projects.findIndex((project) => project.data.slug === slug);

  if (index === -1 || projects.length < 2) {
    return null;
  }

  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
}
