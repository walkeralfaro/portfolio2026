import { join } from 'node:path';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { compareKeys, isComplete, collectKeyPaths } from '../src/i18n/validate.ts';
import { uiEn } from '../src/i18n/ui.en.ts';
import { uiEs } from '../src/i18n/ui.es.ts';

const defaultProjectsDir = fileURLToPath(new URL('../src/content/projects', import.meta.url));
const projectsDir = process.env.I18N_PROJECTS_DIR ?? defaultProjectsDir;
const projectFiles = readdirSync(projectsDir)
  .filter((file) => file.endsWith('.yaml'))
  .sort();
const failures: string[] = [];

/**
 * Gallery entries are locale-specific by design: a project can publish
 * screenshots in one language while the other has none yet. The remaining
 * localized fields must stay symmetric.
 */
function withoutGallery(locale: unknown): unknown {
  if (locale === null || typeof locale !== 'object' || Array.isArray(locale)) {
    return locale;
  }

  const copy = { ...(locale as Record<string, unknown>) };
  delete copy.gallery;

  return copy;
}

const uiComparison = compareKeys(uiEs, uiEn);
if (!isComplete(uiComparison)) {
  if (uiComparison.onlyLeft.length > 0) {
    failures.push(`UI keys missing in English: ${uiComparison.onlyLeft.join(', ')}`);
  }
  if (uiComparison.onlyRight.length > 0) {
    failures.push(`UI keys missing in Spanish: ${uiComparison.onlyRight.join(', ')}`);
  }
}

for (const file of projectFiles) {
  const project = parseYaml(readFileSync(join(projectsDir, file), 'utf8')) as {
    slug?: string;
    locales?: { es?: unknown; en?: unknown };
  };

  if (!project.locales?.es || !project.locales.en) {
    failures.push(`${file}: missing locales.es or locales.en`);
    continue;
  }

  const comparison = compareKeys(
    withoutGallery(project.locales.es),
    withoutGallery(project.locales.en),
  );
  if (!isComplete(comparison)) {
    if (comparison.onlyLeft.length > 0) {
      failures.push(
        `${project.slug ?? file}: locale keys missing in English: ${comparison.onlyLeft.join(', ')}`,
      );
    }
    if (comparison.onlyRight.length > 0) {
      failures.push(
        `${project.slug ?? file}: locale keys missing in Spanish: ${comparison.onlyRight.join(', ')}`,
      );
    }
  }
}

const uiKeyCount = collectKeyPaths(uiEs).length;
const i18nDoc = readFileSync(new URL('../docs/i18n.md', import.meta.url), 'utf8');
const documentedValues = [
  'src/i18n/ui.es.ts',
  'src/i18n/ui.en.ts',
  'npm run validate:i18n',
  'locales.es',
  'locales.en',
];

for (const value of documentedValues) {
  if (!i18nDoc.includes(value)) {
    failures.push(`docs/i18n.md does not document: ${value}`);
  }
}

if (failures.length > 0) {
  throw new Error(`i18n validation failed:\n- ${failures.join('\n- ')}`);
}

console.log(
  `i18n validation passed: ${projectFiles.length} projects and ${uiKeyCount} UI keys are complete in es/en.`,
);
