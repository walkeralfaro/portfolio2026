import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import {
  PROJECT_CATEGORIES,
  PROJECT_SLUGS,
  PROJECT_STATUSES,
  type ProjectSlug,
} from '../src/content/project-slugs.ts';

const projectSchema = z.object({
  slug: z.enum(PROJECT_SLUGS),
  year: z.union([z.number().int().min(2000).max(2100), z.literal('pending')]),
  category: z.enum(PROJECT_CATEGORIES),
  tags: z.array(z.string().min(1)).min(1),
  tier: z.number().int().min(1).max(3),
  status: z.enum(PROJECT_STATUSES),
  featured: z.boolean(),
  order: z.number().int().positive(),
  stack: z.array(z.string().min(1)).min(3).max(5),
  links: z
    .object({
      live: z.url().nullable().default(null),
      code: z.url().nullable().default(null),
    })
    .default({ live: null, code: null }),
  cover: z.string().min(1).nullable().default(null),
  locales: z.object({
    es: z.object({
      title: z.string().min(1),
      summary: z.string().min(1),
      role: z.string().min(1),
      result: z.string().min(1),
      availability: z.string().min(1).optional(),
    }),
    en: z.object({
      title: z.string().min(1),
      summary: z.string().min(1),
      role: z.string().min(1),
      result: z.string().min(1),
      availability: z.string().min(1).optional(),
    }),
  }),
});

const projectCaseSchema = z.object({
  project: z.enum(PROJECT_SLUGS),
  locale: z.enum(['es', 'en']),
  order: z.number().int().positive(),
  updated: z.coerce.date().optional(),
});

const TIER_COUNTS = { 1: 6, 2: 4, 3: 4 } as const;
const FEATURED_PROJECTS = new Set<ProjectSlug>([
  'todo-mcp',
  'image-prompt',
  'url-shortener',
  'tetris',
]);
const TIER_1_PROJECTS = new Set<ProjectSlug>([
  'todo-mcp',
  'image-prompt',
  'url-shortener',
  'tetris',
  'multi-step-form',
  'cheatsheet-editor',
]);

const CASE_HEADINGS = {
  es: ['Problema', 'Rol', 'Decisiones', 'Resultado', 'Stack', 'Galería'],
  en: ['Problem', 'Role', 'Decisions', 'Result', 'Stack', 'Gallery'],
} as const;

const SPANISH_FRAGMENT_PATTERN =
  /\b(Problema|Rol|Decisiones|Resultado|Galería|Desarrollo individual|Proyecto personal)\b/;

type ProjectRecord = z.infer<typeof projectSchema>;

type CaseRecord = {
  project: ProjectSlug;
  locale: 'es' | 'en';
  order: number;
  file: string;
  body: string;
};

const errors: string[] = [];
const projectsDir = resolve(process.argv[2] ?? 'src/content/projects');
const casesDir = resolve(process.argv[3] ?? 'src/content/cases');

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

  for (const tier of [1, 2, 3] as const) {
    const count = [...projects.values()].filter((project) => project.tier === tier).length;
    if (count !== TIER_COUNTS[tier]) {
      errors.push(`Tier ${tier} must contain ${TIER_COUNTS[tier]} projects; found ${count}.`);
    }
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
    if (project.tier === 1 && !TIER_1_PROJECTS.has(project.slug)) {
      errors.push(`Tier 1 contains unexpected project "${project.slug}".`);
    }
    if (project.tier === 3 && project.featured) {
      errors.push(`Tier 3 project "${project.slug}" cannot be featured.`);
    }
    if (project.tier === 2 && !project.links.live && !project.links.code && !project.locales.es.availability) {
      errors.push(`Tier 2 project "${project.slug}" needs an action or an availability label.`);
    }
    if (project.tier === 3 && !project.links.live && !project.links.code && !project.locales.es.availability) {
      errors.push(`Tier 3 project "${project.slug}" needs an external destination or an availability label.`);
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

      const project = projects.get(result.data.project);
      if (project && project.tier !== 1) {
        errors.push(`${file}: cases are only allowed for tier 1 projects.`);
      }

      cases.push({
        project: result.data.project,
        locale: result.data.locale,
        order: result.data.order,
        file,
        body: split.body,
      });
    }

    const expectedCases = new Set(
      [...TIER_1_PROJECTS].flatMap((slug) => [`${slug}.es`, `${slug}.en`]),
    );
    const actualCases = new Set(cases.map((entry) => `${entry.project}.${entry.locale}`));

    for (const expected of expectedCases) {
      if (!actualCases.has(expected)) {
        errors.push(`Missing case body for "${expected}".`);
      }
    }
    for (const actual of actualCases) {
      if (!expectedCases.has(actual)) {
        errors.push(`Unexpected case body for "${actual}".`);
      }
    }

    if (cases.length !== expectedCases.size) {
      errors.push(`Expected ${expectedCases.size} tier 1 case bodies; found ${cases.length}.`);
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
  const tierCounts = [1, 2, 3]
    .map(
      (tier) =>
        `tier ${tier}: ${[...projects.values()].filter((project) => project.tier === tier).length}`,
    )
    .join(', ');
  console.log(
    `Content validation passed: ${projects.size} projects (${tierCounts}), ${cases.length} tier 1 case bodies.`,
  );
}
