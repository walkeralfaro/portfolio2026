import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import {
  PROJECT_SLUGS,
  type ProjectSlug,
} from '../src/content/project-slugs.ts';
import {
  projectCaseSchema,
  projectSchema,
  type ProjectRecord,
} from '../src/content/schemas.ts';
import {
  COVER_ASSET_DIRECTORY,
  GALLERY_ASSET_DIRECTORY,
  resolveAssetKey,
} from '../src/lib/project-assets.ts';

const FEATURED_PROJECTS = new Set<ProjectSlug>([
  'todo-mcp',
  'image-prompt',
  'url-shortener',
  'tetris',
]);

const CASE_HEADINGS = {
  es: ['Problema', 'Rol', 'Decisiones', 'Resultado'],
  en: ['Problem', 'Role', 'Decisions', 'Result'],
} as const;

const SPANISH_FRAGMENT_PATTERN =
  /\b(Problema|Rol|Decisiones|Resultado|Galería|Desarrollo individual|Proyecto personal)\b/;

type CaseRecord = {
  project: ProjectSlug;
  locale: 'es' | 'en';
  order: number;
  file: string;
  body: string;
};

const errors: string[] = [];
const notices: string[] = [];
const projectsDir = resolve(process.argv[2] ?? 'src/content/projects');
const casesDir = resolve(process.argv[3] ?? 'src/content/cases');
const assetsDir = resolve(process.argv[4] ?? 'src/assets');
const coversDir = join(assetsDir, 'covers');
const galleryDir = join(assetsDir, 'gallery');

const IMAGE_EXTENSIONS = new Set(['webp', 'png', 'jpg', 'jpeg', 'avif']);

/** The asset keys available in a directory, the file name without extension. */
function readImageKeys(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(extname(name).slice(1).toLowerCase()))
    .map((name) => basename(name, extname(name)))
    .sort();
}

function readGalleryKeys(): Map<string, string[]> {
  const keys = new Map<string, string[]>();

  if (!existsSync(galleryDir)) {
    return keys;
  }

  for (const entry of readdirSync(galleryDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      keys.set(entry.name, readImageKeys(join(galleryDir, entry.name)));
    }
  }

  return keys;
}

function readYamlFile(path: string): unknown {
  try {
    return parseYaml(readFileSync(path, 'utf8'));
  } catch (error) {
    errors.push(`${path}: invalid YAML (${(error as Error).message})`);
    return null;
  }
}

function splitFrontmatter(source: string): { data: unknown; body: string } | null {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return null;
  }

  try {
    return { data: parseYaml(match[1]), body: match[2] };
  } catch (error) {
    errors.push(`Invalid MDX frontmatter (${(error as Error).message})`);
    return null;
  }
}

function requireDirectory(path: string, label: string): boolean {
  if (!existsSync(path)) {
    errors.push(`${label} directory does not exist: ${path}`);
    return false;
  }
  return true;
}

const projects = new Map<string, ProjectRecord>();
const coverKeys = readImageKeys(coversDir);
const galleryKeys = readGalleryKeys();
const usedCoverKeys = new Set<string>();
const usedGalleryKeys = new Map<string, Set<string>>();

if (requireDirectory(projectsDir, 'Projects')) {
  const files = readdirSync(projectsDir)
    .filter((file) => file.endsWith('.yaml'))
    .sort();

  if (files.length !== 14) {
    errors.push(`Expected exactly 14 project YAML files, found ${files.length}.`);
  }

  for (const file of files) {
    const path = join(projectsDir, file);
    const raw = readYamlFile(path);
    const result = projectSchema.safeParse(raw);

    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(`${file}: ${issue.path.join('.') || 'record'}: ${issue.message}`);
      }
      continue;
    }

    const project = result.data;
    const expectedSlug = basename(file, '.yaml');

    if (project.slug !== expectedSlug) {
      errors.push(`${file}: slug "${project.slug}" does not match filename.`);
    }
    if (projects.has(project.slug)) {
      errors.push(`${file}: duplicate slug "${project.slug}".`);
    }
    if (JSON.stringify(project).match(/puja/i)) {
      errors.push(`${file}: excluded "Puja" reference found.`);
    }

    if (project.cover) {
      const resolution = resolveAssetKey(project.cover, coverKeys);

      if (resolution.ok) {
        usedCoverKeys.add(project.cover);
      } else {
        errors.push(`${file}: cover: ${resolution.message}`);
      }
    }

    for (const locale of ['es', 'en'] as const) {
      const availableGalleryKeys = galleryKeys.get(project.slug) ?? [];

      for (const entry of project.locales[locale].gallery) {
        const resolution = resolveAssetKey(entry.src, availableGalleryKeys);

        if (resolution.ok) {
          const used = usedGalleryKeys.get(project.slug) ?? new Set<string>();
          used.add(entry.src);
          usedGalleryKeys.set(project.slug, used);
        } else {
          errors.push(`${file}: locales.${locale}.gallery: ${resolution.message}`);
        }
      }
    }

    projects.set(project.slug, project);
  }

  if (projects.size === 14) {
    const expected = new Set<string>(PROJECT_SLUGS);
    for (const slug of PROJECT_SLUGS) {
      if (!projects.has(slug)) {
        errors.push(`Missing required project slug "${slug}".`);
      }
    }
    for (const slug of projects.keys()) {
      if (!expected.has(slug)) {
        errors.push(`Unknown project slug "${slug}".`);
      }
    }
  }

  const orders = new Set<number>();
  for (const project of projects.values()) {
    if (orders.has(project.order)) {
      errors.push(`Duplicate project order ${project.order}.`);
    }
    orders.add(project.order);
  }

  const featured = [...projects.values()]
    .filter((project) => project.featured)
    .map((project) => project.slug);
  if (featured.length !== FEATURED_PROJECTS.size) {
    errors.push(`Expected exactly ${FEATURED_PROJECTS.size} featured projects; found ${featured.length}.`);
  }
  for (const slug of FEATURED_PROJECTS) {
    if (!featured.includes(slug)) {
      errors.push(`Featured project "${slug}" is missing.`);
    }
  }
  for (const slug of featured) {
    if (!FEATURED_PROJECTS.has(slug)) {
      errors.push(`Project "${slug}" must not be featured.`);
    }
  }

  for (const project of projects.values()) {
    for (const locale of ['es', 'en'] as const) {
      if (
        !project.links.live &&
        !project.links.code &&
        !project.locales[locale].availability
      ) {
        errors.push(
          `Project "${project.slug}" needs a link or an availability label in ${locale}.`,
        );
      }
    }
  }
}

const cases: CaseRecord[] = [];

if (requireDirectory(casesDir, 'Cases')) {
  const files = readdirSync(casesDir)
    .filter((file) => file.endsWith('.mdx'))
    .sort();

  if (files.length > 0) {
    for (const file of files) {
      const path = join(casesDir, file);
      const source = readFileSync(path, 'utf8');
      const split = splitFrontmatter(source);

      if (!split) {
        errors.push(`${file}: missing MDX frontmatter.`);
        continue;
      }

      const result = projectCaseSchema.safeParse(split.data);
      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push(`${file}: ${issue.path.join('.') || 'frontmatter'}: ${issue.message}`);
        }
        continue;
      }

      const expectedFile = `${result.data.project}.${result.data.locale}.mdx`;
      if (file !== expectedFile) {
        errors.push(`${file}: expected filename "${expectedFile}".`);
      }
      if (split.body.match(/puja/i)) {
        errors.push(`${file}: excluded "Puja" reference found.`);
      }

      const headings = [...split.body.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => match[1]);
      const expectedHeadings = CASE_HEADINGS[result.data.locale];
      if (headings.join('|') !== expectedHeadings.join('|')) {
        errors.push(
          `${file}: expected section sequence ${expectedHeadings.join(', ')}; found ${headings.join(', ') || 'none'}.`,
        );
      } else {
        const headingMatches = [...split.body.matchAll(/^##\s+(.+?)\s*$/gm)];
        for (const [index, match] of headingMatches.entries()) {
          const contentStart = (match.index ?? 0) + match[0].length;
          const contentEnd = headingMatches[index + 1]?.index ?? split.body.length;
          const section = split.body.slice(contentStart, contentEnd).trim();

          if (section.length < 10) {
            errors.push(`${file}: section "${match[1]}" is empty or incomplete.`);
          }

          if (match[1] === expectedHeadings[2]) {
            const decisions = section.match(/^\d+\.\s+\S/gm) ?? [];
            if (decisions.length < 3 || decisions.length > 4) {
              errors.push(`${file}: decisions must contain 3 or 4 items; found ${decisions.length}.`);
            }
          }
        }
      }

      if (result.data.locale === 'en' && SPANISH_FRAGMENT_PATTERN.test(split.body)) {
        errors.push(`${file}: untranslated Spanish fragment found in English body.`);
      }

      cases.push({
        project: result.data.project,
        locale: result.data.locale,
        order: result.data.order,
        file,
        body: split.body,
      });
    }

    const seenCases = new Set<string>();

    for (const entry of cases) {
      const key = `${entry.project}.${entry.locale}`;

      if (seenCases.has(key)) {
        errors.push(`Duplicate case body for "${key}".`);
      }
      seenCases.add(key);
    }
  }
}

for (const key of coverKeys) {
  if (!usedCoverKeys.has(key)) {
    notices.push(`Unused cover asset "${key}" in ${COVER_ASSET_DIRECTORY}.`);
  }
}

for (const [slug, keys] of galleryKeys) {
  const used = usedGalleryKeys.get(slug) ?? new Set<string>();

  for (const key of keys) {
    if (!used.has(key)) {
      notices.push(`Unused gallery asset "${key}" in ${GALLERY_ASSET_DIRECTORY}/${slug}.`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} error(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Content validation passed: ${projects.size} projects, ${cases.length} case bodies.`,
  );
}

for (const notice of notices) {
  console.log(`- ${notice}`);
}
