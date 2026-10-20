import assert from 'node:assert/strict';
import test from 'node:test';
import { compareKeys, isComplete } from '../../src/i18n/validate.ts';

test('a UI key added to only one locale fails completeness', () => {
  const spanish = { actions: { view: 'Ver', back: 'Volver' } };
  const english = { actions: { view: 'View' } };
  const comparison = compareKeys(spanish, english);

  assert.equal(isComplete(comparison), false);
  assert.deepEqual(comparison.onlyLeft, ['actions.back']);
  assert.deepEqual(comparison.onlyRight, []);
});

test('matching UI keys in both locales pass completeness', () => {
  const spanish = { actions: { view: 'Ver', back: 'Volver' } };
  const english = { actions: { view: 'View', back: 'Back' } };
  const comparison = compareKeys(spanish, english);

  assert.equal(isComplete(comparison), true);
});
