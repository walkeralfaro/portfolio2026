import { getCollection, type CollectionEntry } from 'astro:content';
import type { ProjectSlug } from '../content/project-slugs';
import type { Locale } from '../i18n/locales';

export type ProjectEntry = CollectionEntry<'projects'>;
export type CaseEntry = CollectionEntry<'cases'>;

export async function getProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection('projects');
  return projects.sort((first, second) => first.data.order - second.data.order);
}

export async function getVisibleProjects(): Promise<ProjectEntry[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.data.tier <= 2);
}

export function getProjectCopy(project: ProjectEntry, locale: Locale) {
  return project.data.locales[locale];
}

export async function getCaseEntry(
  slug: ProjectSlug,
  locale: Locale,
): Promise<CaseEntry | null> {
  const cases = await getCollection('cases');
  return (
    cases.find(
      (entry) => entry.data.project === slug && entry.data.locale === locale,
    ) ?? null
  );
}

/**
 * Previous and next detail pages in catalog order. Tier 3 has no internal page,
 * so it is already absent from `getVisibleProjects()` and cannot receive a dead
 * link here. The sequence wraps at both ends.
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
