import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  emptyManifest,
  hashText,
  manifestState,
  readManifest,
  recordProject,
  writeManifest,
} from '../../scripts/content-import/manifest.ts';

function outputs() {
  return [
    { path: 'src/content/projects/pokedex.yaml', content: 'slug: pokedex\n' },
  ];
}

test('SHA-256 hashing is stable', () => {
  assert.equal(hashText('pokedex'), hashText('pokedex'));
  assert.notEqual(hashText('pokedex'), hashText('pokedex\n'));
});

test('a recorded project is fresh', () => {
  const manifest = recordProject(emptyManifest(), 'pokedex', 'readme', 'README', outputs());

  assert.equal(manifestState(manifest, 'pokedex', 'README', outputs()), 'fresh');
});

test('a changed README is stale', () => {
  const manifest = recordProject(emptyManifest(), 'pokedex', 'readme', 'README', outputs());

  assert.equal(manifestState(manifest, 'pokedex', '# README', outputs()), 'stale-source');
});

test('a changed generated file is a manual edit', () => {
  const manifest = recordProject(emptyManifest(), 'pokedex', 'readme', 'README', outputs());
  const changed = [{ ...outputs()[0], content: 'slug: edited\n' }];

  assert.equal(manifestState(manifest, 'pokedex', 'README', changed), 'manual-edit');
});

test('a manual edit is reported even when the README also changed', () => {
  const manifest = recordProject(emptyManifest(), 'pokedex', 'readme', 'README', outputs());
  const changed = [{ ...outputs()[0], content: 'slug: edited\n' }];

  assert.equal(manifestState(manifest, 'pokedex', '# README', changed), 'manual-edit');
});

test('a project without a manifest entry is missing', () => {
  assert.equal(manifestState(emptyManifest(), 'pokedex', 'README', outputs()), 'missing');
});

test('the manifest persists and sorts project entries', () => {
  const directory = mkdtempSync(join(tmpdir(), 'content-manifest-'));
  const path = join(directory, '.import-manifest.json');

  try {
    const first = recordProject(emptyManifest(), 'tetris', 'readme', 'README', outputs());
    const second = recordProject(first, 'pokedex', 'readme', 'README', outputs());
    writeManifest(second, path);

    const loaded = readManifest(path);
    assert.deepEqual(Object.keys(loaded.projects), ['pokedex', 'tetris']);
    assert.equal(loaded.projects.pokedex.source, 'readme');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
