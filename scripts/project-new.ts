import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { isProjectSlug } from '../src/lib/content/taxonomy.ts';
import { PROJECTS_DIRECTORY } from '../src/lib/project-assets.ts';

const TEMPLATE_PATH = resolve(
  '.opencode/skills/add-project/assets/content.template.yaml',
);

const slug = process.argv[2];

if (!slug) {
  console.error('Usage: npm run project:new -- <slug>');
  process.exitCode = 1;
} else if (!isProjectSlug(slug)) {
  console.error(
    `Invalid slug "${slug}". Use lowercase kebab-case, for example "my-project".`,
  );
  process.exitCode = 1;
} else if (!existsSync(TEMPLATE_PATH)) {
  console.error(`Template not found: ${TEMPLATE_PATH}`);
  process.exitCode = 1;
} else {
  const projectsDir = resolve(PROJECTS_DIRECTORY);
  const projectDir = join(projectsDir, slug);

  const contentPath = join(projectDir, 'content.yaml');

  if (existsSync(contentPath)) {
    console.error(`Project content already exists: ${contentPath}`);
    process.exitCode = 1;
  } else {
    const orders = readdirSync(projectsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(projectsDir, entry.name, 'content.yaml'))
      .filter((file) => existsSync(file))
      .map((file) => {
        try {
          const value = parseYaml(readFileSync(file, 'utf8')) as {
            order?: unknown;
          };
          return typeof value.order === 'number' ? value.order : 0;
        } catch {
          return 0;
        }
      });

    const nextOrder = Math.max(0, ...orders) + 1;
    const template = readFileSync(TEMPLATE_PATH, 'utf8');
    const content = template
      .replace('slug: <slug>', `slug: ${slug}`)
      .replace('order: 1', `order: ${nextOrder}`);

    mkdirSync(projectDir, { recursive: true });
    writeFileSync(join(projectDir, 'content.yaml'), content, 'utf8');

    console.log(`Created projects/${slug}/content.yaml with order ${nextOrder}.`);
    console.log('');
    console.log('Next steps:');
    console.log(`1. Add the source note at projects/${slug}/README.md.`);
    console.log(
      `2. Optional: add projects/${slug}/cover.webp and projects/${slug}/screenshots/*.webp.`,
    );
    console.log('3. Ask the add-project skill to complete content.yaml.');
    console.log('4. Run npm run validate:content.');
  }
}
