import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse as parseYaml } from 'yaml';
import type { IntakeRecord } from '../../src/content/schemas.ts';
import {
  MANIFEST_PATH,
  manifestState,
  readManifest,
  recordProject,
  writeManifest,
  type ExpectedOutput,
} from './manifest.ts';
import { renderCaseMdx, renderProjectYaml } from './render.ts';
import { readGalleryKeys, validateIntake, type IntakeIssue } from './validate.ts';

export interface CliOptions {
  cwd?: string;
  stdout?: (line: string) => void;
  stderr?: (line: string) => void;
}

interface LoadedProject {
  slug: string;
  projectDir: string;
  sourcePath: string;
  intakePath: string;
  sourceContent: string;
  intake: IntakeRecord;
  outputs: ExpectedOutput[];
}

interface ProjectValidation {
  project: LoadedProject | null;
  issues: IntakeIssue[];
  slug: string;
  projectDir: string;
}

const HELP = `Usage:
  npm run content:status
  npm run content:import -- projects/<slug> --check
  npm run content:import -- projects/<slug> --write [--force]

Modes:
  status   Scan projects/*/README.md and report missing, stale, edited, or ready intakes.
  --check  Validate an intake and render output in memory without writing files.
  --write  Validate and write the generated YAML and MDX files.
  --force  Allow --write to replace a generated file that was edited manually.

The normalized intake is projects/<slug>/content.yaml. The README is the raw source.
`;

function log(options: CliOptions, line: string): void {
  (options.stdout ?? console.log)(line);
}

function error(options: CliOptions, line: string): void {
  (options.stderr ?? console.error)(line);
}

function toPosix(path: string): string {
  return path.split('\\').join('/');
}

function relativeTo(cwd: string, path: string): string {
  return toPosix(relative(cwd, path));
}

function readOrders(cwd: string, projectsRoot: string): Map<number, string> {
  const orders = new Map<number, string>();
  const directory = join(cwd, projectsRoot);

  if (!existsSync(directory)) {
    return orders;
  }

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const intakePath = join(directory, entry.name, 'content.yaml');

    if (!existsSync(intakePath)) {
      continue;
    }

    try {
      const raw = parseYaml(readFileSync(intakePath, 'utf8')) as {
        order?: unknown;
      };

      if (typeof raw.order === 'number') {
        orders.set(raw.order, entry.name);
      }
    } catch {
      // Invalid YAML is reported when that project is validated.
    }
  }

  return orders;
}

function validateProject(
  projectDir: string,
  cwd: string,
  projectsRoot: string,
): ProjectValidation {
  const slug = basename(projectDir);
  const sourcePath = join(projectDir, 'README.md');
  const intakePath = join(projectDir, 'content.yaml');

  if (!existsSync(sourcePath)) {
    return {
      project: null,
      slug,
      projectDir,
      issues: [{ path: 'README.md', message: 'source README does not exist' }],
    };
  }

  if (!existsSync(intakePath)) {
    return {
      project: null,
      slug,
      projectDir,
      issues: [{ path: 'content.yaml', message: 'normalized intake does not exist' }],
    };
  }

  let raw: unknown;

  try {
    raw = parseYaml(readFileSync(intakePath, 'utf8'));
  } catch (caught) {
    return {
      project: null,
      slug,
      projectDir,
      issues: [{ path: 'content.yaml', message: (caught as Error).message }],
    };
  }

  const validation = validateIntake(raw, {
    folderSlug: slug,
    existingOrders: readOrders(cwd, projectsRoot),
    galleryKeys: new Map([[slug, readGalleryKeys(slug, join(cwd, 'src/assets/gallery'))]]),
  });

  if (!validation.ok) {
    return { project: null, slug, projectDir, issues: validation.issues };
  }

  const intake = validation.intake;
  const sourceContent = readFileSync(sourcePath, 'utf8');
  const intakeRelative = relativeTo(cwd, intakePath);
  const sourceRelative = relativeTo(cwd, sourcePath);
  const outputs: ExpectedOutput[] = [
    {
      path: `src/content/projects/${slug}.yaml`,
      content: renderProjectYaml(intake, sourceRelative, intakeRelative),
    },
  ];

  for (const locale of ['es', 'en'] as const) {
    const caseContent = renderCaseMdx(intake, locale, sourceRelative, intakeRelative);

    if (caseContent) {
      outputs.push({
        path: `src/content/cases/${slug}.${locale}.mdx`,
        content: caseContent,
      });
    }
  }

  return {
    project: {
      slug,
      projectDir,
      sourcePath,
      intakePath,
      sourceContent,
      intake,
      outputs,
    },
    slug,
    projectDir,
    issues: [],
  };
}

function printIssues(
  validation: ProjectValidation,
  cwd: string,
  options: CliOptions,
): void {
  const file = relativeTo(cwd, join(validation.projectDir, 'content.yaml'));

  for (const issue of validation.issues) {
    error(options, `${file}: ${issue.path}: ${issue.message}`);
  }
}

function currentOutputs(cwd: string, outputs: ExpectedOutput[]): ExpectedOutput[] {
  return outputs.map((output) => {
    const path = join(cwd, output.path);
    return {
      path: output.path,
      content: existsSync(path) ? readFileSync(path, 'utf8') : null,
    };
  });
}

function writeOutputs(cwd: string, outputs: ExpectedOutput[]): void {
  for (const output of outputs) {
    const path = join(cwd, output.path);
    mkdirSync(dirname(path), { recursive: true });

    if (output.content === null) {
      throw new Error(`Cannot write missing output: ${output.path}`);
    }

    writeFileSync(path, output.content, 'utf8');
  }
}

function printHelp(options: CliOptions): void {
  log(options, HELP);
}

function runProject(
  projectArgument: string,
  args: string[],
  options: CliOptions,
  projectsRoot: string,
): number {
  const cwd = options.cwd ?? process.cwd();
  const projectDir = resolve(cwd, projectArgument);
  const mode = args.includes('--write') ? 'write' : 'check';
  const force = args.includes('--force');

  if (force && mode !== 'write') {
    error(options, '--force is only valid with --write');
    return 1;
  }

  const validation = validateProject(projectDir, cwd, projectsRoot);

  if (!validation.project) {
    error(options, `${validation.slug}: invalid`);
    printIssues(validation, cwd, options);
    return 1;
  }

  const project = validation.project;

  if (mode === 'check') {
    log(options, `${project.slug}: ok (${project.outputs.length} generated file(s))`);
    return 0;
  }

  const manifestPath = join(cwd, MANIFEST_PATH);
  const manifest = readManifest(manifestPath);
  const existing = currentOutputs(cwd, project.outputs);
  const state = manifestState(
    manifest,
    project.slug,
    project.sourceContent,
    existing,
  );
  const hasUnrecordedOutput = existing.some((output) => output.content !== null);

  if (!force && (state === 'manual-edit' || (state === 'missing' && hasUnrecordedOutput))) {
    error(
      options,
      `${project.slug}: refusing to overwrite generated files that do not match the manifest; use --force to replace them`,
    );
    return 1;
  }

  writeOutputs(cwd, project.outputs);
  writeManifest(
    recordProject(
      manifest,
      project.slug,
      relativeTo(cwd, project.sourcePath),
      project.sourceContent,
      project.outputs,
    ),
    manifestPath,
  );

  log(options, `${project.slug}: written (${project.outputs.length} file(s))`);
  return 0;
}

function runStatus(options: CliOptions, projectsRoot: string): number {
  const cwd = options.cwd ?? process.cwd();
  const directory = join(cwd, projectsRoot);
  const manifest = readManifest(join(cwd, MANIFEST_PATH));
  const counts = new Map<string, number>();

  if (!existsSync(directory)) {
    log(options, `No projects directory found at ${projectsRoot}`);
    return 0;
  }

  const projectDirectories = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(directory, entry.name))
    .filter((projectDir) => existsSync(join(projectDir, 'README.md')))
    .sort();

  for (const projectDir of projectDirectories) {
    const slug = basename(projectDir);
    const validation = validateProject(projectDir, cwd, projectsRoot);

    if (!validation.project) {
      const missingIntake = validation.issues.some(
        (issue) => issue.path === 'content.yaml' && issue.message.includes('does not exist'),
      );
      const state = missingIntake ? 'missing-intake' : 'invalid';
      counts.set(state, (counts.get(state) ?? 0) + 1);
      log(options, `${slug}: ${state}`);

      if (!missingIntake) {
        printIssues(validation, cwd, options);
      }
      continue;
    }

    const project = validation.project;
    const state = manifestState(
      manifest,
      project.slug,
      project.sourceContent,
      currentOutputs(cwd, project.outputs),
    );

    counts.set(state, (counts.get(state) ?? 0) + 1);
    log(options, `${slug}: ${state}`);
  }

  const summary = [...counts.entries()]
    .map(([state, count]) => `${count} ${state}`)
    .join(', ');

  log(options, summary || 'No project READMEs found');
  return 0;
}

export function runCli(args: string[], options: CliOptions = {}): number {
  const projectsRoot = 'projects';

  if (args.length === 0 || args.includes('--help') || args.includes('help')) {
    printHelp(options);
    return 0;
  }

  if (args[0] === 'status') {
    return runStatus(options, projectsRoot);
  }

  const projectArgument = args.find((argument) => !argument.startsWith('--'));

  if (!projectArgument) {
    error(options, 'Expected a project path. Run with --help for usage.');
    return 1;
  }

  return runProject(projectArgument, args, options, projectsRoot);
}

const entryPoint = process.argv[1];

if (entryPoint && pathToFileURL(resolve(entryPoint)).href === import.meta.url) {
  process.exitCode = runCli(process.argv.slice(2));
}
