import assert from 'node:assert/strict';
import test from 'node:test';
import { parse } from 'yaml';
import { renderCaseMdx, renderProjectYaml } from '../../scripts/content-import/render.ts';
import { intakeWithNarrative, validIntake } from '../fixtures/content-import/intake.ts';

test('project YAML keeps the stack and omits narrative bodies', () => {
  const output = renderProjectYaml(
    intakeWithNarrative() as never,
    'projects/pokedex/README.md',
    'projects/pokedex/content.yaml',
  );
  const record = parse(output);

  assert.match(output, /Generated from projects\/pokedex\/README\.md/);
  assert.deepEqual(record.stack, ['React 19', 'TypeScript', 'Vite']);
  assert.equal(record.locales.es.narrative, undefined);
  assert.equal(record.locales.en.narrative, undefined);
  assert.equal(record.locales.es.title, 'Pokedex');
  assert.equal(record.slug, 'pokedex');
});

test('project YAML uses a stable field order', () => {
  const output = renderProjectYaml(
    intakeWithNarrative() as never,
    'projects/pokedex/README.md',
    'projects/pokedex/content.yaml',
  );
  const fieldOrder = [
    'slug:',
    'year:',
    'category:',
    'tags:',
    'status:',
    'featured:',
    'order:',
    'stack:',
    'links:',
    'cover:',
    'locales:',
  ];
  const positions = fieldOrder.map((field) => output.indexOf(`\n${field}`));

  assert.deepEqual(
    positions,
    [...positions].sort((first, second) => first - second),
  );
});

test('case MDX uses the four Spanish headings and numbered decisions', () => {
  const output = renderCaseMdx(
    intakeWithNarrative() as never,
    'es',
    'projects/pokedex/README.md',
    'projects/pokedex/content.yaml',
  );

  assert.ok(output);
  assert.deepEqual(
    [...output.matchAll(/^## (.+)$/gm)].map((match) => match[1]),
    ['Problema', 'Rol', 'Decisiones', 'Resultado'],
  );
  assert.match(output, /^1\. /m);
  assert.match(output, /^2\. /m);
  assert.match(output, /^3\. /m);
  assert.doesNotMatch(output, /^## (Stack|Galería|Gallery)$/m);
});

test('case MDX uses the four English headings', () => {
  const output = renderCaseMdx(
    intakeWithNarrative() as never,
    'en',
    'projects/pokedex/README.md',
    'projects/pokedex/content.yaml',
  );

  assert.ok(output);
  assert.deepEqual(
    [...output.matchAll(/^## (.+)$/gm)].map((match) => match[1]),
    ['Problem', 'Role', 'Decisions', 'Result'],
  );
});

test('a locale without narrative renders no case body', () => {
  assert.equal(
    renderCaseMdx(
      validIntake() as never,
      'es',
      'projects/pokedex/README.md',
      'projects/pokedex/content.yaml',
    ),
    null,
  );
});
