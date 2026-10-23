import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n/locales';
import {
  assetKeyFromPath,
  describeAvailableKeys,
  GALLERY_DIRECTORY,
  PROJECTS_DIRECTORY,
} from './project-assets';
import type { ProjectEntry } from './projects';

/**
 * The image assets of the catalog, resolved from each project folder.
 *
 * Covers live in `projects/<slug>/cover.<ext>` and gallery screenshots in
 * `projects/<slug>/screenshots/<key>.<ext>`. The cover is detected
 * automatically; gallery entries reference their key.
 */

const coverModules = import.meta.glob<{ default: ImageMetadata }>(
  '/projects/*/cover.webp',
  { eager: true },
);

const galleryModules = import.meta.glob<{ default: ImageMetadata }>(
  '/projects/*/screenshots/*.webp',
  { eager: true },
);

const covers = new Map<string, ImageMetadata>();

for (const [path, module] of Object.entries(coverModules)) {
  const segments = path.split('/');
  const slug = segments[segments.length - 2] ?? '';
  covers.set(slug, module.default);
}

const gallery = new Map<string, ImageMetadata>();

for (const [path, module] of Object.entries(galleryModules)) {
  const segments = path.split('/');
  const slug = segments[segments.length - 3] ?? '';

  gallery.set(`${slug}/${assetKeyFromPath(path)}`, module.default);
}

export interface ResolvedGalleryImage {
  image: ImageMetadata;
  alt: string;
}

export function listCoverKeys(): string[] {
  return [...covers.keys()].sort();
}

export function listGalleryKeys(slug: string): string[] {
  return [...gallery.keys()]
    .filter((key) => key.startsWith(`${slug}/`))
    .map((key) => key.slice(slug.length + 1))
    .sort();
}

/** The cover of a project, or null when the project has no cover file. */
export function getProjectCover(project: ProjectEntry): ImageMetadata | null {
  return covers.get(project.data.slug) ?? null;
}

/** The gallery screenshots of a project for a locale, in declared order. */
export function getProjectGallery(
  project: ProjectEntry,
  locale: Locale,
): ResolvedGalleryImage[] {
  return project.data.locales[locale].gallery.map((reference) => {
    const image = gallery.get(`${project.data.slug}/${reference.src}`);

    if (!image) {
      throw new Error(
        `Project "${project.data.slug}" (${locale}) references the gallery asset "${reference.src}", which does not exist in ${PROJECTS_DIRECTORY}/${project.data.slug}/${GALLERY_DIRECTORY}. Available keys: ${describeAvailableKeys(listGalleryKeys(project.data.slug))}.`,
      );
    }

    return { image, alt: reference.alt };
  });
}
