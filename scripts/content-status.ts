import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { projectSchema } from '../src/lib/content/schema.ts';
import { PROJECTS_DIRECTORY } from '../src/lib/project-assets.ts';

const projectsDir = resolve(process.argv[2] ?? PROJECTS_DIRECTORY);

if (!existsSync(projectsDir)) {
  console.error(`Projects directory does not exist: ${projectsDir}`);
  process.exitCode = 1;
} else {
  const folders = readdirSync(projectsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const rows: Array<{
    date: string;
    dateValue: number;
    order: string;
    slug: string;
    category: string;
    status: string;
    featured: string;
  }> = [];
  const pending: string[] = [];
  const invalid: string[] = [];

  for (const folder of folders) {
    const contentPath = join(projectsDir, folder, 'content.yaml');

    if (!existsSync(contentPath)) {
      pending.push(folder);
      continue;
    }

    let raw: unknown;

    try {
      raw = parseYaml(readFileSync(contentPath, 'utf8'));
    } catch (error) {
      invalid.push(`${folder}: invalid YAML (${(error as Error).message})`);
      continue;
    }

    const result = projectSchema.safeParse(raw);

    if (!result.success) {
      invalid.push(
        `${folder}: ${result.error.issues
          .map((issue) => `${issue.path.join('.') || 'record'}: ${issue.message}`)
          .join('; ')}`,
      );
      continue;
    }

    if (result.data.slug !== folder) {
      invalid.push(
        `${folder}: slug "${result.data.slug}" does not match its folder.`,
      );
      continue;
    }

    const hasDate =
      typeof result.data.year === 'number' && result.data.month !== undefined;
    const date = hasDate
      ? `${result.data.year}-${String(result.data.month).padStart(2, '0')}`
      : 'pending';

    rows.push({
      date,
      dateValue: hasDate
        ? (result.data.year as number) * 100 + (result.data.month as number)
        : Number.NEGATIVE_INFINITY,
      order: String(result.data.order),
      slug: result.data.slug,
      category: result.data.category,
      status: result.data.status,
      featured: result.data.featured ? 'yes' : 'no',
    });
  }

  rows.sort(
    (first, second) =>
      second.dateValue - first.dateValue ||
      Number(first.order) - Number(second.order),
  );

  if (rows.length > 0) {
    const widths = {
      date: Math.max(4, ...rows.map((row) => row.date.length)),
      order: Math.max(5, ...rows.map((row) => row.order.length)),
      slug: Math.max(4, ...rows.map((row) => row.slug.length)),
      category: Math.max(8, ...rows.map((row) => row.category.length)),
      status: Math.max(6, ...rows.map((row) => row.status.length)),
    };

    console.log(
      `${'DATE'.padEnd(widths.date)}  ${'ORDER'.padEnd(widths.order)}  ${'SLUG'.padEnd(widths.slug)}  ${'CATEGORY'.padEnd(widths.category)}  ${'STATUS'.padEnd(widths.status)}  FEATURED`,
    );

    for (const row of rows) {
      console.log(
        `${row.date.padEnd(widths.date)}  ${row.order.padEnd(widths.order)}  ${row.slug.padEnd(widths.slug)}  ${row.category.padEnd(widths.category)}  ${row.status.padEnd(widths.status)}  ${row.featured}`,
      );
    }

    console.log('');
  }

  for (const slug of pending) {
    console.log(`- ${slug}: missing content.yaml`);
  }

  for (const message of invalid) {
    console.log(`- ${message}`);
  }

  console.log(
    `${folders.length} project folders, ${rows.length} with valid content.yaml, ${pending.length} pending, ${invalid.length} invalid.`,
  );
}
