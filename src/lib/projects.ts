import { getCollection, type CollectionEntry } from 'astro:content';
import type { ProjectSlug } from '../lib/content/taxonomy';
import type { Locale } from '../i18n/locales';

export type ProjectEntry = CollectionEntry<'projects'>;

/** Numeric sort key for a documented year and month; null when pending. */
export function getProjectDateValue(project: ProjectEntry): number | null {
  const { year, month } = project.data;

  if (year === 'pending' || month === undefined) {
    return null;
  }

  return year * 100 + month;
}

/** Newest first, with the editorial order as a stable tiebreaker. */
export function sortProjectsByDateDesc(projects: ProjectEntry[]): ProjectEntry[] {
  return [...projects].sort((first, second) => {
    const firstDate = getProjectDateValue(first);
    const secondDate = getProjectDateValue(second);

    if (firstDate === null && secondDate === null) {
      return first.data.order - second.data.order;
    }

    if (firstDate === null) return 1;
    if (secondDate === null) return -1;
    if (firstDate !== secondDate) return secondDate - firstDate;

    return first.data.order - second.data.order;
  });
}

export async function getProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection('projects');
  return sortProjectsByDateDesc(projects);
}

/** Localized month and year, or null when the date is pending. */
export function getProjectDateLabel(
  project: ProjectEntry,
  locale: Locale,
): string | null {
  const { year, month } = project.data;

  if (year === 'pending' || month === undefined) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const parts = formatter.formatToParts(new Date(Date.UTC(year, month - 1, 1)));
  const monthPart = parts.find((part) => part.type === 'month')?.value ?? '';
  const yearLabel = parts.find((part) => part.type === 'year')?.value ?? '';
  const monthLabel =
    monthPart.charAt(0).toUpperCase() + monthPart.slice(1);

  return `${monthLabel} ${yearLabel}`.trim();
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
