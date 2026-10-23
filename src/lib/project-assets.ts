/**
 * Rules for the project image asset contract.
 *
 * Each project folder is self-contained:
 *
 *   projects/<slug>/cover.webp
 *   projects/<slug>/screenshots/<key>.webp
 *
 * The cover is detected automatically. Gallery entries reference a key, the
 * file name without its extension.
 *
 * This module stays free of filesystem and Vite APIs so the Astro build and
 * the standalone content validator share the same rules.
 */

export const PROJECTS_DIRECTORY = 'projects';
export const COVER_FILE_KEY = 'cover';
export const GALLERY_DIRECTORY = 'screenshots';

export const IMAGE_EXTENSIONS = ['webp'] as const;

/** The key of an asset is its file name without the extension. */
export function assetKeyFromPath(path: string): string {
  const fileName = path.split('/').pop() ?? '';
  const extensionIndex = fileName.lastIndexOf('.');

  return extensionIndex > 0 ? fileName.slice(0, extensionIndex) : fileName;
}

/** The keys of a set of asset paths, without duplicates and sorted. */
export function listAssetKeys(paths: readonly string[]): string[] {
  return [...new Set(paths.map(assetKeyFromPath))].sort();
}

/** A readable list of keys for an error message. */
export function describeAvailableKeys(keys: readonly string[]): string {
  return keys.length > 0 ? keys.join(', ') : 'none';
}

export type AssetResolution =
  | { ok: true; key: string }
  | { ok: false; message: string };

/** Resolve a reference against the keys that exist in its directory. */
export function resolveAssetKey(
  key: string,
  availableKeys: readonly string[],
): AssetResolution {
  if (availableKeys.includes(key)) {
    return { ok: true, key };
  }

  return {
    ok: false,
    message: `unknown asset key "${key}"; available keys: ${describeAvailableKeys(availableKeys)}`,
  };
}
