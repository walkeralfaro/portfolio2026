import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assetKeyFromPath,
  describeAvailableKeys,
  listAssetKeys,
  resolveAssetKey,
} from '../../src/lib/project-assets.ts';

test('an asset key drops the directory and the extension', () => {
  assert.equal(assetKeyFromPath('/src/assets/covers/tetris.webp'), 'tetris');
  assert.equal(assetKeyFromPath('/src/assets/gallery/tetris/start-screen.webp'), 'start-screen');
  assert.equal(assetKeyFromPath('tetris.png'), 'tetris');
});

test('listing keys removes duplicates and sorts them', () => {
  assert.deepEqual(
    listAssetKeys([
      '/src/assets/covers/b.webp',
      '/src/assets/covers/a.png',
      '/src/assets/covers/b.webp',
    ]),
    ['a', 'b'],
  );
});

test('a known key resolves', () => {
  const resolution = resolveAssetKey('tetris', ['tetris', 'url-shortener']);

  assert.equal(resolution.ok, true);
});

test('an unknown key reports the available keys', () => {
  const resolution = resolveAssetKey('missing', ['tetris']);

  assert.equal(resolution.ok, false);
  assert.match(resolution.ok === false ? resolution.message : '', /missing/);
  assert.match(resolution.ok === false ? resolution.message : '', /tetris/);
});

test('an empty directory reports no available keys', () => {
  assert.equal(describeAvailableKeys([]), 'none');
});
