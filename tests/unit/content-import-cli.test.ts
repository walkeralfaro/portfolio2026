import assert from 'node:assert/strict';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { stringify } from 'yaml';
import { runCli } from '../../scripts/content-import/cli.ts';
import { intakeWithNarrative, validIntake } from '../fixtures/content-import/intake.ts';

function setupProject(intake: Record<string, any>) {
  const cwd = mkdtempSync(join(tmpdir(), 'content-check-'));
  const projectDir = join(cwd, 'projects', 'pokedex');
  mkdirSync(projectDir, { recursive: true });
  writeFileSync(join(projectDir, 'README.md'), '# Pokedex\n', 'utf8');
  writeFileSync(join(projectDir, 'content.yaml'), stringify(intake), 'utf8');
  return cwd;
}

function capture() {
  const stdout: string[] = [];
  const stderr: string[] = [];
  return {
    stdout,
    stderr,
    options: {
      stdout: (line: string) => stdout.push(line),
      stderr: (line: string) => stderr.push(line),
    },
  };
}

test('check mode validates a complete intake and writes nothing', () => {
  const cwd = setupProject(validIntake());
  const output = capture();

  try {
    const code = runCli(['projects/pokedex', '--check'], {
      cwd,
      ...output.options,
    });

    assert.equal(code, 0);
    assert.match(output.stdout.join('\n'), /pokedex: ok/);
    assert.equal(existsSync(join(cwd, 'src/content/projects/pokedex.yaml')), false);
    assert.equal(existsSync(join(cwd, 'projects/.import-manifest.json')), false);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('write mode writes YAML, MDX, and the manifest', () => {
  const cwd = setupProject(validIntake());
  const output = capture();

  try {
    const code = runCli(['projects/pokedex', '--write'], {
      cwd,
      ...output.options,
    });

    assert.equal(code, 0);
    assert.equal(existsSync(join(cwd, 'src/content/projects/pokedex.yaml')), true);
    assert.equal(existsSync(join(cwd, 'src/content/cases/pokedex.es.mdx')), false);
    assert.equal(existsSync(join(cwd, 'projects/.import-manifest.json')), true);
    assert.match(output.stdout.join('\n'), /pokedex: written \(1 file\(s\)\)/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('write mode generates two four-heading case bodies for a narrative', () => {
  const cwd = setupProject(intakeWithNarrative());
  const output = capture();

  try {
    assert.equal(
      runCli(['projects/pokedex', '--write'], { cwd, ...output.options }),
      0,
    );

    const spanish = readFileSync(
      join(cwd, 'src/content/cases/pokedex.es.mdx'),
      'utf8',
    );
    const english = readFileSync(
      join(cwd, 'src/content/cases/pokedex.en.mdx'),
      'utf8',
    );

    assert.deepEqual(
      [...spanish.matchAll(/^## (.+)$/gm)].map((match) => match[1]),
      ['Problema', 'Rol', 'Decisiones', 'Resultado'],
    );
    assert.deepEqual(
      [...english.matchAll(/^## (.+)$/gm)].map((match) => match[1]),
      ['Problem', 'Role', 'Decisions', 'Result'],
    );
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('status reports missing, stale, and ready projects', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'content-status-'));
  const output = capture();

  const writeProject = (slug: string, order: number) => {
    const intake = validIntake();
    intake.slug = slug;
    intake.order = order;
    const projectDir = join(cwd, 'projects', slug);
    mkdirSync(projectDir, { recursive: true });
    writeFileSync(join(projectDir, 'README.md'), `# ${slug}\n`, 'utf8');
    writeFileSync(join(projectDir, 'content.yaml'), stringify(intake), 'utf8');
    return projectDir;
  };

  try {
    writeProject('pokedex', 1);
    const stale = writeProject('tetris', 2);
    writeProject('todo-mcp', 3);
    const missingIntake = writeProject('weather-app', 4);
    rmSync(join(missingIntake, 'content.yaml'));

    assert.equal(
      runCli(['projects/tetris', '--write'], { cwd, ...output.options }),
      0,
    );
    writeFileSync(join(stale, 'README.md'), '# Tetris changed\n', 'utf8');

    assert.equal(
      runCli(['projects/todo-mcp', '--write'], { cwd, ...output.options }),
      0,
    );

    const status = capture();
    const code = runCli(['status'], { cwd, ...status.options });
    const lines = status.stdout.join('\n');

    assert.equal(code, 0);
    assert.match(lines, /^pokedex: missing$/m);
    assert.match(lines, /^tetris: stale-source$/m);
    assert.match(lines, /^todo-mcp: fresh$/m);
    assert.match(lines, /^weather-app: missing-intake$/m);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('write mode refuses a manually edited generated file unless forced', () => {
  const cwd = setupProject(validIntake());
  const output = capture();

  try {
    assert.equal(
      runCli(['projects/pokedex', '--write'], { cwd, ...output.options }),
      0,
    );

    const generated = join(cwd, 'src/content/projects/pokedex.yaml');
    writeFileSync(generated, 'manual edit\n', 'utf8');

    const refused = capture();
    const refusedCode = runCli(['projects/pokedex', '--write'], {
      cwd,
      ...refused.options,
    });

    assert.equal(refusedCode, 1);
    assert.match(refused.stderr.join('\n'), /refusing to overwrite/);
    assert.equal(readFileSync(generated, 'utf8'), 'manual edit\n');

    const forced = capture();
    const forcedCode = runCli(['projects/pokedex', '--write', '--force'], {
      cwd,
      ...forced.options,
    });

    assert.equal(forcedCode, 0);
    assert.match(readFileSync(generated, 'utf8'), /slug: pokedex/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('an invalid write mode produces no project output', () => {
  const intake = validIntake();
  intake.locales.en.summary = '';
  const cwd = setupProject(intake);
  const output = capture();

  try {
    const code = runCli(['projects/pokedex', '--write'], {
      cwd,
      ...output.options,
    });

    assert.equal(code, 1);
    assert.equal(existsSync(join(cwd, 'src/content/projects/pokedex.yaml')), false);
    assert.equal(existsSync(join(cwd, 'src/content/cases')), false);
    assert.equal(existsSync(join(cwd, 'projects/.import-manifest.json')), false);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('check mode reports every invalid field without writing', () => {
  const intake = validIntake();
  intake.locales.en.summary = '';
  const cwd = setupProject(intake);
  const output = capture();

  try {
    const code = runCli(['projects/pokedex', '--check'], {
      cwd,
      ...output.options,
    });

    assert.equal(code, 1);
    assert.match(output.stderr.join('\n'), /content\.yaml: locales\.en\.summary/);
    assert.equal(existsSync(join(cwd, 'src/content/projects/pokedex.yaml')), false);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
