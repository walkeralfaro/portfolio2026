import assert from 'node:assert/strict';
import test from 'node:test';
import { validateIntake } from '../../scripts/content-import/validate.ts';
import { narrative, validIntake } from '../fixtures/content-import/intake.ts';

function issuePaths(input: unknown, options: Parameters<typeof validateIntake>[1]) {
  const result = validateIntake(input, options);

  assert.equal(result.ok, false);
  return result.ok ? [] : result.issues.map((issue) => issue.path);
}

test('a complete intake with matching folder and order passes', () => {
  const result = validateIntake(validIntake(), { folderSlug: 'pokedex' });

  assert.equal(result.ok, true);
});

test('a folder slug mismatch is reported', () => {
  const paths = issuePaths(validIntake(), { folderSlug: 'tetris' });

  assert.deepEqual(paths, ['slug']);
});

test('a duplicate order is reported', () => {
  const paths = issuePaths(validIntake(), {
    folderSlug: 'pokedex',
    existingOrders: new Map([[6, 'tetris']]),
  });

  assert.deepEqual(paths, ['order']);
});

test('an unknown gallery key is reported at its locale and index', () => {
  const intake = validIntake();
  intake.locales.es.gallery = [{ src: 'missing', alt: 'Missing image' }];

  const paths = issuePaths(intake, {
    folderSlug: 'pokedex',
    galleryKeys: new Map([['pokedex', ['start-screen']]]),
  });

  assert.deepEqual(paths, ['locales.es.gallery.0.src']);
});

test('a known gallery key passes', () => {
  const intake = validIntake();
  intake.locales.es.gallery = [{ src: 'start-screen', alt: 'Start screen' }];

  const result = validateIntake(intake, {
    folderSlug: 'pokedex',
    galleryKeys: new Map([['pokedex', ['start-screen']]]),
  });

  assert.equal(result.ok, true);
});

test('a narrative in only one locale is reported', () => {
  const intake = validIntake();
  intake.locales.es.narrative = narrative();

  const paths = issuePaths(intake, { folderSlug: 'pokedex' });

  assert.ok(paths.includes('locales'));
});

test('a locale without links or availability is reported', () => {
  const intake = validIntake();
  delete intake.locales.en.availability;

  const paths = issuePaths(intake, { folderSlug: 'pokedex' });

  assert.deepEqual(paths, ['locales.en.availability']);
});
