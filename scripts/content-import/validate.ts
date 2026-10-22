import { existsSync, readdirSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import {
  intakeSchema,
  type IntakeRecord,
} from '../../src/content/schemas.ts';
import { IMAGE_EXTENSIONS, GALLERY_ASSET_DIRECTORY } from '../../src/lib/project-assets.ts';

export interface IntakeIssue {
  path: string;
  message: string;
}

export interface IntakeValidationOptions {
  folderSlug: string;
  existingOrders?: ReadonlyMap<number, string>;
  galleryKeys?: ReadonlyMap<string, readonly string[]>;
}

export type IntakeValidationResult =
  | { ok: true; intake: IntakeRecord; issues: [] }
  | { ok: false; intake: null; issues: IntakeIssue[] };

function addIssue(
  issues: IntakeIssue[],
  path: string,
  message: string,
): void {
  if (issues.some((issue) => issue.path === path && issue.message === message)) {
    return;
  }

  issues.push({ path, message });
}

function hasNarrative(value: unknown): boolean {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'narrative' in value &&
      (value as { narrative?: unknown }).narrative,
  );
}

export function validateIntake(
  value: unknown,
  options: IntakeValidationOptions,
): IntakeValidationResult {
  const issues: IntakeIssue[] = [];
  const parsed = intakeSchema.safeParse(value);

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      addIssue(issues, issue.path.join('.') || 'intake', issue.message);
    }
  }

  const raw = value as
    | {
        slug?: unknown;
        order?: unknown;
        links?: { live?: unknown; code?: unknown };
        locales?: {
          es?: { narrative?: unknown; availability?: unknown };
          en?: { narrative?: unknown; availability?: unknown };
        };
      }
    | null;

  const rawSlug = typeof raw?.slug === 'string' ? raw.slug : null;

  if (rawSlug && rawSlug !== options.folderSlug) {
    addIssue(
      issues,
      'slug',
      `folder slug "${options.folderSlug}" does not match intake slug "${rawSlug}"`,
    );
  }

  const order = typeof raw?.order === 'number' ? raw.order : null;
  const previousSlug = order ? options.existingOrders?.get(order) : undefined;

  if (order && previousSlug && previousSlug !== rawSlug) {
    addIssue(issues, 'order', `order ${order} is already used by "${previousSlug}"`);
  }

  const hasLive = typeof raw?.links?.live === 'string';
  const hasCode = typeof raw?.links?.code === 'string';

  for (const locale of ['es', 'en'] as const) {
    const hasAvailability = Boolean(raw?.locales?.[locale]?.availability);

    if (!hasLive && !hasCode && !hasAvailability) {
      addIssue(
        issues,
        `locales.${locale}.availability`,
        'a locale needs a live link, a code link, or an availability note',
      );
    }

    const gallery = (parsed.success ? parsed.data : null)?.locales[locale].gallery ?? [];
    const keys = options.galleryKeys?.get(rawSlug ?? options.folderSlug) ?? [];

    for (const [index, image] of gallery.entries()) {
      if (!keys.includes(image.src)) {
        addIssue(
          issues,
          `locales.${locale}.gallery.${index}.src`,
          `unknown gallery asset key "${image.src}"; available keys: ${
            keys.length > 0 ? keys.join(', ') : 'none'
          }`,
        );
      }
    }
  }

  if (!parsed.success) {
    if (hasNarrative(raw?.locales?.es) !== hasNarrative(raw?.locales?.en)) {
      addIssue(
        issues,
        'locales',
        'narrative must be present in both locales or neither',
      );
    }

    return { ok: false, intake: null, issues };
  }

  if (issues.length > 0) {
    return { ok: false, intake: null, issues };
  }

  return { ok: true, intake: parsed.data, issues: [] };
}

/** Gallery keys available under `src/assets/gallery/<slug>/`. */
export function readGalleryKeys(
  slug: string,
  assetDirectory = GALLERY_ASSET_DIRECTORY,
): string[] {
  const directory = join(assetDirectory, slug);

  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) =>
      (IMAGE_EXTENSIONS as readonly string[]).includes(
        extname(name).slice(1).toLowerCase(),
      ),
    )
    .map((name) => basename(name, extname(name)))
    .sort();
}
