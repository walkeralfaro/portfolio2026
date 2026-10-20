import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/locales';

export type ProjectEntry = CollectionEntry<'projects'>;

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
