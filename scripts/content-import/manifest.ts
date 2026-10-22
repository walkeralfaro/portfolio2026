import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export const MANIFEST_PATH = 'projects/.import-manifest.json';

export interface GeneratedFile {
  path: string;
  hash: string;
}

export interface ManifestEntry {
  source: string;
  sourceHash: string;
  generated: GeneratedFile[];
}

export interface ImportManifest {
  version: 1;
  projects: Record<string, ManifestEntry>;
}

export type ManifestState = 'missing' | 'stale-source' | 'manual-edit' | 'fresh';

export interface ExpectedOutput {
  path: string;
  content: string | null;
}

export function hashText(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

export function emptyManifest(): ImportManifest {
  return { version: 1, projects: {} };
}

export function readManifest(path = MANIFEST_PATH): ImportManifest {
  const absolutePath = resolve(path);

  if (!existsSync(absolutePath)) {
    return emptyManifest();
  }

  const parsed = JSON.parse(readFileSync(absolutePath, 'utf8')) as ImportManifest;

  if (parsed.version !== 1 || !parsed.projects || typeof parsed.projects !== 'object') {
    throw new Error(`Invalid import manifest: ${path}`);
  }

  return parsed;
}

export function writeManifest(
  manifest: ImportManifest,
  path = MANIFEST_PATH,
): void {
  const absolutePath = resolve(path);
  mkdirSync(dirname(absolutePath), { recursive: true });

  const sorted: ImportManifest = {
    version: 1,
    projects: Object.fromEntries(
      Object.entries(manifest.projects).sort(([first], [second]) =>
        first.localeCompare(second),
      ),
    ),
  };

  writeFileSync(absolutePath, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
}

export function recordProject(
  manifest: ImportManifest,
  slug: string,
  source: string,
  sourceContent: string,
  outputs: ExpectedOutput[],
): ImportManifest {
  return {
    version: 1,
    projects: {
      ...manifest.projects,
      [slug]: {
        source,
        sourceHash: hashText(sourceContent),
        generated: outputs.map((output) => {
          if (output.content === null) {
            throw new Error(`Cannot record missing output: ${output.path}`);
          }

          return {
            path: output.path,
            hash: hashText(output.content),
          };
        }),
      },
    },
  };
}

export function expectedOutputsMatch(
  entry: ManifestEntry,
  outputs: ExpectedOutput[],
): boolean {
  if (entry.generated.length !== outputs.length) {
    return false;
  }

  return outputs.every((output) => {
    const recorded = entry.generated.find((file) => file.path === output.path);
    return output.content !== null && recorded?.hash === hashText(output.content);
  });
}

export function manifestState(
  manifest: ImportManifest,
  slug: string,
  sourceContent: string,
  outputs: ExpectedOutput[],
): ManifestState {
  const entry = manifest.projects[slug];

  if (!entry) {
    return 'missing';
  }

  if (!expectedOutputsMatch(entry, outputs)) {
    return 'manual-edit';
  }

  if (entry.sourceHash !== hashText(sourceContent)) {
    return 'stale-source';
  }

  return 'fresh';
}
