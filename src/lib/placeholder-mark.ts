export interface PlaceholderMark {
  seed: number;
  rotation: number;
  ticks: number[];
}

/**
 * FNV-1a keeps the cover mark stable across builds and independent of render
 * order, so the same project slug always gets the same geometry.
 */
export function hashSlug(slug: string): number {
  let hash = 2166136261;

  for (let index = 0; index < slug.length; index += 1) {
    hash ^= slug.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function getPlaceholderMark(slug: string): PlaceholderMark {
  const seed = hashSlug(slug);
  const rotation = (seed % 15) - 7;
  const ticks = Array.from({ length: 12 }, (_, index) => {
    const value = (seed ^ Math.imul(index + 1, 0x9e3779b1)) >>> 0;
    return 10 + (value % 18);
  });

  return { seed, rotation, ticks };
}
