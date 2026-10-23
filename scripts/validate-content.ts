import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import {
  projectSchema,
  type ProjectRecord,
} from '../src/lib/content/schema.ts';
import {
  GALLERY_DIRECTORY,
  IMAGE_EXTENSIONS,
  PROJECTS_DIRECTORY,
  resolveAssetKey,
} from '../src/lib/project-assets.ts';

const SPANISH_FRAGMENT_PATTERN =
  /\b(Problema|Rol|Decisiones|Resultado|Galería|Desarrollo individual|Proyecto personal)\b/;
const PLACEHOLDER_PATTERN = /<[^>\s]+>|\bTODO\b/;

const errors: string[] = [];
const notices: string[] = [];
const projectsDir = resolve(process.argv[2] ?? PROJECTS_DIRECTORY);

const IMAGE_EXTENSION_SET = new Set<string>(IMAGE_EXTENSIONS);

/** The asset keys available in a directory, the file name without extension. */
function readImageKeys(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) =>
      IMAGE_EXTENSION_SET.has(extname(name).slice(1).toLowerCase()),
    )
    .map((name) => basename(name, extname(name)))
    .sort();
}

function readYamlFile(path: string): unknown {
  try {
    return parseYaml(readFileSync(path, 'utf8'));
  } catch (error) {
    errors.push(`${path}: invalid YAML (${(error as Error).message})`);
    return null;
  }
}

function findPlaceholder(value: unknown, path = ''): string | null {
  if (typeof value === 'string') {
    return PLACEHOLDER_PATTERN.test(value) ? path || 'value' : null;
  }

  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) {
      const found = findPlaceholder(item, `${path}.${index}`);
      if (found) return found;
    }
    return null;
  }

  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      const found = findPlaceholder(item, path ? `${path}.${key}` : key);
      if (found) return found;
    }
  }

  return null;
}

const projects = new Map<string, ProjectRecord>();

if (!existsSync(projectsDir)) {
  errors.push(`Projects directory does not exist: ${projectsDir}`);
} else {
  const projectFolders = readdirSync(projectsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const folder of projectFolders) {
    const contentPath = join(projectsDir, folder, 'content.yaml');

    if (!existsSync(contentPath)) {
      continue;
    }

    if (!existsSync(join(projectsDir, folder, 'README.md'))) {
      notices.push(
        `Project "${folder}" has content.yaml but no README.md source note.`,
      );
    }

    const raw = readYamlFile(contentPath);
    const result = projectSchema.safeParse(raw);

    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(
          `${folder}/content.yaml: ${issue.path.join('.') || 'record'}: ${issue.message}`,
        );
      }
      continue;
    }

    const project = result.data;

    if (project.slug !== folder) {
      errors.push(
        `${folder}/content.yaml: slug "${project.slug}" does not match folder "${folder}".`,
      );
    }

    const placeholder = findPlaceholder(raw);
    if (placeholder) {
      errors.push(
        `${folder}/content.yaml: unresolved placeholder at ${placeholder}.`,
      );
    }

    if (JSON.stringify(project).match(/puja/i)) {
      errors.push(`${folder}/content.yaml: excluded "Puja" reference found.`);
    }

    if (projects.has(project.slug)) {
      errors.push(`${folder}/content.yaml: duplicate slug "${project.slug}".`);
    }

    const galleryKeys = readImageKeys(
      join(projectsDir, folder, GALLERY_DIRECTORY),
    );

    for (const locale of ['es', 'en'] as const) {
      if (
        !project.links.live &&
        !project.links.code &&
        !project.locales[locale].availability
      ) {
        errors.push(
          `${folder}/content.yaml: locales.${locale}.availability is required when both links are null.`,
        );
      }

      if (
        locale === 'en' &&
        SPANISH_FRAGMENT_PATTERN.test(
          [
            project.locales.en.title,
            project.locales.en.summary,
            project.locales.en.role,
            project.locales.en.result,
            project.locales.en.availability ?? '',
            project.locales.en.narrative?.problem ?? '',
            project.locales.en.narrative?.role ?? '',
            project.locales.en.narrative?.result ?? '',
            ...(project.locales.en.narrative?.decisions.flatMap((decision) => [
              decision.title,
              decision.body,
            ]) ?? []),
          ].join(' '),
        )
      ) {
        errors.push(
          `${folder}/content.yaml: untranslated Spanish fragment found in English content.`,
        );
      }

      for (const [index, image] of project.locales[locale].gallery.entries()) {
        const resolution = resolveAssetKey(image.src, galleryKeys);

        if (!resolution.ok) {
          errors.push(
            `${folder}/content.yaml: locales.${locale}.gallery.${index}.src: ${resolution.message}`,
          );
        }
      }
    }

    projects.set(project.slug, project);
  }

  const orders = new Set<number>();
  for (const project of projects.values()) {
    if (orders.has(project.order)) {
      errors.push(`Duplicate project order ${project.order}.`);
    }
    orders.add(project.order);
  }

  const featured = [...projects.values()].filter((project) => project.featured);
  if (projects.size > 0 && (featured.length < 1 || featured.length > 4)) {
    errors.push(
      `Expected between 1 and 4 featured projects; found ${featured.length}.`,
    );
  }

  for (const folder of projectFolders) {
    const galleryKeys = readImageKeys(
      join(projectsDir, folder, GALLERY_DIRECTORY),
    );
    const project = projects.get(folder);

    if (!project) {
      continue;
    }

    const used = new Set(
      (['es', 'en'] as const).flatMap((locale) =>
        project.locales[locale].gallery.map((image) => image.src),
      ),
    );

    for (const key of galleryKeys) {
      if (!used.has(key)) {
        notices.push(
          `Unused gallery asset "${key}" in ${PROJECTS_DIRECTORY}/${folder}/${GALLERY_DIRECTORY}.`,
        );
      }
    }
  }

  if (projects.size === 0) {
    notices.push(
      'No project content found. Add projects/<slug>/content.yaml to publish a project.',
    );
  }
}

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} error(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  const narratives = [...projects.values()].filter(
    (project) => project.locales.es.narrative,
  ).length;
  console.log(
    `Content validation passed: ${projects.size} projects, ${narratives} narratives.`,
  );
}

for (const notice of notices) {
  console.log(`- ${notice}`);
}
