import { stringify } from 'yaml';
import type { IntakeRecord, IntakeLocale } from '../../src/content/schemas.ts';

type Locale = 'es' | 'en';

const CASE_HEADINGS = {
  es: {
    problem: 'Problema',
    role: 'Rol',
    decisions: 'Decisiones',
    result: 'Resultado',
  },
  en: {
    problem: 'Problem',
    role: 'Role',
    decisions: 'Decisions',
    result: 'Result',
  },
} as const;

export function generatedHeader(sourcePath: string, intakePath: string): string {
  return [
    `# Generated from ${sourcePath}.`,
    `# Edit ${intakePath} and run npm run content:import instead.`,
  ].join('\n');
}

function projectLocale(locale: IntakeLocale) {
  return {
    title: locale.title,
    summary: locale.summary,
    role: locale.role,
    result: locale.result,
    ...(locale.availability ? { availability: locale.availability } : {}),
    gallery: locale.gallery.map((image) => ({
      src: image.src,
      alt: image.alt,
    })),
  };
}

/** Render the project collection record without narrative-only fields. */
export function renderProjectYaml(
  intake: IntakeRecord,
  sourcePath: string,
  intakePath: string,
): string {
  const record = {
    slug: intake.slug,
    year: intake.year,
    category: intake.category,
    tags: intake.tags,
    status: intake.status,
    featured: intake.featured,
    order: intake.order,
    stack: intake.stack,
    links: {
      live: intake.links.live,
      code: intake.links.code,
    },
    cover: intake.cover,
    locales: {
      es: projectLocale(intake.locales.es),
      en: projectLocale(intake.locales.en),
    },
  };

  return `${generatedHeader(sourcePath, intakePath)}\n${stringify(record, {
    lineWidth: 0,
  })}`;
}

/** Render a case body, or null when the locale has no narrative. */
export function renderCaseMdx(
  intake: IntakeRecord,
  locale: Locale,
  sourcePath: string,
  intakePath: string,
): string | null {
  const narrative = intake.locales[locale].narrative;

  if (!narrative) {
    return null;
  }

  const headings = CASE_HEADINGS[locale];
  const decisions = narrative.decisions
    .map((decision, index) => {
      const lines = decision.trim().split(/\r?\n/);
      return `${index + 1}. ${lines.join('\n   ')}`;
    })
    .join('\n');

  return `---
${generatedHeader(sourcePath, intakePath)}
project: ${intake.slug}
locale: ${locale}
order: ${intake.order}
---

## ${headings.problem}

${narrative.problem.trim()}

## ${headings.role}

${narrative.role.trim()}

## ${headings.decisions}

${decisions}

## ${headings.result}

${narrative.result.trim()}
`;
}
