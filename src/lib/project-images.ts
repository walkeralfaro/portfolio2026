import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n/locales';
import { assetKeyFromPath, describeAvailableKeys } from './project-assets';
import type { ProjectEntry } from './projects';

/**
 * The image assets of the catalog, resolved from the content references.
 *
 * Covers live in `src/assets/covers/<project-slug>.<ext>` and gallery
 * screenshots in `src/assets/gallery/<project-slug>/<shot>.<ext>`. Content
 * references them by key, the file name without its extension.
 */

const coverModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/covers/*.{webp,png,jpg,jpeg,avif}',
  { eager: true },
);

const galleryModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/gallery/*/*.{webp,png,jpg,jpeg,avif}',
  { eager: true },
);

const covers = new Map<string, ImageMetadata>();

for (const [path, module] of Object.entries(coverModules)) {
  covers.set(assetKeyFromPath(path), module.default);
}

const gallery = new Map<string, ImageMetadata>();

for (const [path, module] of Object.entries(galleryModules)) {
  const segments = path.split('/');
  const slug = segments[segments.length - 2] ?? '';

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

/** The cover of a project, or null when the record has no cover asset. */
export function getProjectCover(project: ProjectEntry): ImageMetadata | null {
  const key = project.data.cover;

  if (!key) {
    return null;
  }

  const image = covers.get(key);

  if (!image) {
    throw new Error(
      `Project "${project.data.slug}" references the cover asset "${key}", which does not exist in src/assets/covers. Available keys: ${describeAvailableKeys(listCoverKeys())}.`,
    );
  }

  return image;
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
        `Project "${project.data.slug}" (${locale}) references the gallery asset "${reference.src}", which does not exist in src/assets/gallery/${project.data.slug}. Available keys: ${describeAvailableKeys(listGalleryKeys(project.data.slug))}.`,
      );
    }

    return { image, alt: reference.alt };
  });
}
