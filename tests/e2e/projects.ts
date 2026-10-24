import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

export interface E2EProject {
  slug: string;
  title: string;
  englishTitle: string;
  year: number | 'pending';
  month: number | null;
  order: number;
  category: string;
  status: string;
  featured: boolean;
  stack: string[];
  links: { live: string | null; code: string | null };
  narrative: boolean;
  gallery: { es: string[]; en: string[] };
  summary: { es: string; en: string };
}

const projectsDirectory = join(process.cwd(), 'projects');
const imageExtensions = new Set(['webp']);

function readProjects(): E2EProject[] {
  if (!existsSync(projectsDirectory)) {
    return [];
  }

  return readdirSync(projectsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const file = join(projectsDirectory, entry.name, 'content.yaml');

      if (!existsSync(file)) {
        return [];
      }

      const record = parse(readFileSync(file, 'utf8')) as {
        slug: string;
        year: number | 'pending';
        month?: number;
        order: number;
        category: string;
        status: string;
        featured: boolean;
        stack: string[];
        links?: { live?: string | null; code?: string | null };
        locales: {
          es: {
            title: string;
            summary: string;
            gallery?: { alt: string }[];
            narrative?: unknown;
          };
          en: {
            title: string;
            summary: string;
            gallery?: { alt: string }[];
            narrative?: unknown;
          };
        };
      };

      return [
        {
          slug: record.slug,
          title: record.locales.es.title,
          englishTitle: record.locales.en.title,
          year: record.year,
          month: record.month ?? null,
          order: record.order,
          category: record.category,
          status: record.status,
          featured: record.featured,
          stack: record.stack,
          links: {
            live: record.links?.live ?? null,
            code: record.links?.code ?? null,
          },
          narrative: Boolean(record.locales.es.narrative),
          gallery: {
            es: record.locales.es.gallery?.map((image) => image.alt) ?? [],
            en: record.locales.en.gallery?.map((image) => image.alt) ?? [],
          },
          summary: {
            es: record.locales.es.summary,
            en: record.locales.en.summary,
          },
        },
      ];
    })
    .sort((first, second) => {
      const firstDate =
        first.year === 'pending' || first.month === null
          ? Number.NEGATIVE_INFINITY
          : first.year * 100 + first.month;
      const secondDate =
        second.year === 'pending' || second.month === null
          ? Number.NEGATIVE_INFINITY
          : second.year * 100 + second.month;

      return secondDate - firstDate || first.order - second.order;
    });
}

export const projects = readProjects();
export const hasProjects = projects.length > 0;
export const featuredProjects = projects.filter((project) => project.featured);
export const narrativeProjects = projects.filter((project) => project.narrative);
export const baselineProjects = projects.filter((project) => !project.narrative);
export const galleryProjects = projects.filter(
  (project) => project.gallery.es.length > 0 || project.gallery.en.length > 0,
);

export const categoryCounts = {
  all: projects.length,
  ia: projects.filter((project) => project.category === 'ia').length,
  producto: projects.filter((project) => project.category === 'producto').length,
  frontend: projects.filter((project) => project.category === 'frontend').length,
  juegos: projects.filter((project) => project.category === 'juegos').length,
} as const;

export function projectPath(slug: string, locale: 'es' | 'en' = 'es'): string {
  return locale === 'es' ? `/work/${slug}/` : `/en/work/${slug}/`;
}

/** True when the project folder contains a cover file with an accepted extension. */
export function hasCover(slug: string): boolean {
  const directory = join(projectsDirectory, slug);

  if (!existsSync(directory)) {
    return false;
  }

  return readdirSync(directory, { withFileTypes: true }).some(
    (entry) =>
      entry.isFile() &&
      entry.name.startsWith('cover.') &&
      imageExtensions.has(entry.name.split('.').pop()?.toLowerCase() ?? ''),
  );
}

export function firstProjectWithoutCover(): E2EProject | undefined {
  return projects.find((project) => !hasCover(project.slug));
}

export function firstProjectWithCover(): E2EProject | undefined {
  return projects.find((project) => hasCover(project.slug));
}

export function firstProjectWithGallery(): E2EProject | undefined {
  return galleryProjects[0];
}
