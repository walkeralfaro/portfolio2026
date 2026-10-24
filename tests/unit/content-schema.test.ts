import assert from 'node:assert/strict';
import test from 'node:test';
import { projectSchema } from '../../src/lib/content/schema.ts';

function validProject(): Record<string, any> {
  return {
    slug: 'pokedex',
    year: 'pending' as const,
    category: 'frontend' as const,
    tags: ['pokeapi'],
    status: 'live' as const,
    featured: false,
    order: 6,
    stack: ['React 19', 'TypeScript', 'Vite'],
    links: { live: null, code: null },
    locales: {
      es: {
        title: 'Pokedex',
        summary: 'Explorador de Pokémon.',
        role: 'Desarrollo individual.',
        result: 'Lista y detalle de Pokémon.',
        availability: 'Demo pública pendiente.',
        gallery: [],
      },
      en: {
        title: 'Pokedex',
        summary: 'Pokémon explorer.',
        role: 'Individual development.',
        result: 'Pokémon list and detail.',
        availability: 'Public demo pending.',
        gallery: [],
      },
    },
  };
}

function narrative() {
  return {
    problem: 'A problem.',
    role: 'A role.',
    decisions: [
      { title: 'First', body: 'First decision.' },
      { title: 'Second', body: 'Second decision.' },
      { title: 'Third', body: 'Third decision.' },
    ],
    result: 'A result.',
  };
}

test('a complete project passes validation', () => {
  assert.equal(projectSchema.safeParse(validProject()).success, true);
});

test('a missing localized field is reported at its path', () => {
  const project = validProject();
  delete (project.locales.en as { summary?: string }).summary;

  const result = projectSchema.safeParse(project);

  assert.equal(result.success, false);
  assert.match(
    result.success ? '' : result.error.issues.map((issue) => issue.path.join('.')).join(' '),
    /locales\.en\.summary/,
  );
});

test('an unknown project field is rejected', () => {
  const project = { ...validProject(), unexpected: true };
  const result = projectSchema.safeParse(project);

  assert.equal(result.success, false);
  assert.match(
    result.success ? '' : result.error.issues.map((issue) => issue.message).join(' '),
    /unrecognized|unknown/i,
  );
});

test('the stack must contain three to five items', () => {
  const tooShort = { ...validProject(), stack: ['React', 'TypeScript'] };
  const tooLong = {
    ...validProject(),
    stack: ['One', 'Two', 'Three', 'Four', 'Five', 'Six'],
  };

  assert.equal(projectSchema.safeParse(tooShort).success, false);
  assert.equal(projectSchema.safeParse(tooLong).success, false);
});

test('a narrative must be present in both locales or neither', () => {
  const project = validProject();
  project.locales.es.narrative = narrative();

  const result = projectSchema.safeParse(project);

  assert.equal(result.success, false);
  assert.match(
    result.success ? '' : result.error.issues.map((issue) => issue.message).join(' '),
    /narrative must be present in both locales or neither/,
  );
});

test('availability must be present in both locales or neither', () => {
  const project = validProject();
  delete project.locales.en.availability;

  const result = projectSchema.safeParse(project);

  assert.equal(result.success, false);
  assert.match(
    result.success ? '' : result.error.issues.map((issue) => issue.message).join(' '),
    /availability must be present in both locales or neither/,
  );
});

test('a balanced narrative passes validation', () => {
  const project = validProject();
  project.locales.es.narrative = narrative();
  project.locales.en.narrative = narrative();

  assert.equal(projectSchema.safeParse(project).success, true);
});

test('a narrative requires three or four structured decisions', () => {
  const project = validProject();
  const short = narrative();
  short.decisions = short.decisions.slice(0, 2);
  project.locales.es.narrative = short;
  project.locales.en.narrative = short;

  assert.equal(projectSchema.safeParse(project).success, false);
});

test('a numeric year requires a month between 1 and 12', () => {
  const project = { ...validProject(), year: 2026, month: 3 };
  assert.equal(projectSchema.safeParse(project).success, true);

  const missingMonth = { ...validProject(), year: 2026 };
  assert.equal(projectSchema.safeParse(missingMonth).success, false);

  for (const month of [0, 13]) {
    assert.equal(
      projectSchema.safeParse({ ...validProject(), year: 2026, month }).success,
      false,
    );
  }
});

test('a pending year cannot carry a month', () => {
  const project = { ...validProject(), month: 3 };
  assert.equal(projectSchema.safeParse(project).success, false);
});

test('the slug must be lowercase kebab-case', () => {
  for (const slug of ['Pokedex', 'poke_dex', 'pokedex-', 'pokedex--app']) {
    assert.equal(projectSchema.safeParse({ ...validProject(), slug }).success, false);
  }

  assert.equal(
    projectSchema.safeParse({ ...validProject(), slug: 'rest-countries-explorer' }).success,
    true,
  );
});
