export interface KeyComparison {
  onlyLeft: string[];
  onlyRight: string[];
}

export function collectKeyPaths(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return collectKeyPaths(child, path);
  });
}

export function compareKeys(left: unknown, right: unknown): KeyComparison {
  const leftKeys = new Set(collectKeyPaths(left));
  const rightKeys = new Set(collectKeyPaths(right));

  return {
    onlyLeft: [...leftKeys].filter((key) => !rightKeys.has(key)).sort(),
    onlyRight: [...rightKeys].filter((key) => !leftKeys.has(key)).sort(),
  };
}

export function isComplete(comparison: KeyComparison): boolean {
  return comparison.onlyLeft.length === 0 && comparison.onlyRight.length === 0;
}
