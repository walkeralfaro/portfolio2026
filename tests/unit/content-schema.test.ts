import assert from 'node:assert/strict';
import test from 'node:test';
import { intakeSchema } from '../../src/content/schemas.ts';

function validIntake(): Record<string, any> {
  return {
    slug: 'pokedex',
    year: 'pending' as const,
    category: 'frontend' as const,
    tags: ['pokeapi'],
    status: 'in-development' as const,
    featured: false,
    order: 6,
    stack: ['React 19', 'TypeScript', 'Vite'],
    links: { live: null, code: null },
    cover: null,
    locales: {
      es: {
        title: 'Pokedex',
        summary: 'Explorador de Pokémon.',
        role: 'Desarrollo individual.',
        result: 'Lista y detalle de Pokémon.',
        gallery: [],
      },
      en: {
        title: 'Pokedex',
        summary: 'Pokémon explorer.',
        role: 'Individual development.',
        result: 'Pokémon list and detail.',
        gallery: [],
      },
    },
  };
}

function narrative() {
  return {
    problem: 'A problem.',
    role: 'A role.',
    decisions: ['First decision.', 'Second decision.', 'Third decision.'],
    result: 'A result.',
  };
}

test('a complete intake passes validation', () => {
  assert.equal(intakeSchema.safeParse(validIntake()).success, true);
});

test('a missing localized field is reported at its path', () => {
  const intake = validIntake();
  delete (intake.locales.en as { summary?: string }).summary;

  const result = intakeSchema.safeParse(intake);

  assert.equal(result.success, false);
  assert.match(
    result.success ? '' : result.error.issues.map((issue) => issue.path.join('.')).join(' '),
    /locales\.en\.summary/,
  );
});

test('an unknown intake field is rejected', () => {
  const intake = { ...validIntake(), unexpected: true };
  const result = intakeSchema.safeParse(intake);

  assert.equal(result.success, false);
  assert.match(
    result.success ? '' : result.error.issues.map((issue) => issue.message).join(' '),
    /unrecognized|unknown/i,
  );
});

test('the stack must contain three to five items', () => {
  const tooShort = { ...validIntake(), stack: ['React', 'TypeScript'] };
  const tooLong = {
    ...validIntake(),
    stack: ['One', 'Two', 'Three', 'Four', 'Five', 'Six'],
  };

  assert.equal(intakeSchema.safeParse(tooShort).success, false);
  assert.equal(intakeSchema.safeParse(tooLong).success, false);
});

test('a narrative must be present in both locales or neither', () => {
  const intake = validIntake();
  intake.locales.es.narrative = narrative();

  const result = intakeSchema.safeParse(intake);

  assert.equal(result.success, false);
  assert.match(
    result.success ? '' : result.error.issues.map((issue) => issue.message).join(' '),
    /narrative must be present in both locales or neither/,
  );
});

test('a balanced narrative passes validation', () => {
  const intake = validIntake();
  intake.locales.es.narrative = narrative();
  intake.locales.en.narrative = narrative();

  assert.equal(intakeSchema.safeParse(intake).success, true);
});
