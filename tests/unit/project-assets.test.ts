import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assetKeyFromPath,
  describeAvailableKeys,
  listAssetKeys,
  resolveAssetKey,
} from '../../src/lib/project-assets.ts';

test('an asset key drops the directory and the extension', () => {
  assert.equal(assetKeyFromPath('/projects/tetris/cover.webp'), 'cover');
  assert.equal(
    assetKeyFromPath('/projects/tetris/screenshots/start-screen.webp'),
    'start-screen',
  );
  assert.equal(assetKeyFromPath('start-screen.png'), 'start-screen');
});

test('listing keys removes duplicates and sorts them', () => {
  assert.deepEqual(
    listAssetKeys([
      '/projects/a/screenshots/b.webp',
      '/projects/a/screenshots/a.png',
      '/projects/a/screenshots/b.webp',
    ]),
    ['a', 'b'],
  );
});

test('a known key resolves', () => {
  const resolution = resolveAssetKey('start-screen', ['start-screen', 'game-over']);

  assert.equal(resolution.ok, true);
});

test('an unknown key reports the available keys', () => {
  const resolution = resolveAssetKey('missing', ['start-screen']);

  assert.equal(resolution.ok, false);
  assert.match(resolution.ok === false ? resolution.message : '', /missing/);
  assert.match(resolution.ok === false ? resolution.message : '', /start-screen/);
});

test('an empty directory reports no available keys', () => {
  assert.equal(describeAvailableKeys([]), 'none');
});
