import { readFileSync } from 'node:fs';
import {
  THEME_ATTRIBUTE,
  THEME_MODES,
  THEME_PREFERENCE_ATTRIBUTE,
  THEME_STORAGE_KEY,
} from '../src/lib/theme-contract.ts';

const tokensCss = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');

function readBlock(marker: string): string {
  const markerIndex = tokensCss.indexOf(marker);
  if (markerIndex === -1) throw new Error(`Missing token block: ${marker}`);

  const open = tokensCss.indexOf('{', markerIndex);
  const close = tokensCss.indexOf('}', open);
  if (open === -1 || close === -1) throw new Error(`Malformed token block: ${marker}`);

  return tokensCss.slice(open + 1, close);
}

function readTokens(block: string): Map<string, string> {
  const tokens = new Map<string, string>();

  for (const match of block.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    tokens.set(match[1], match[2]);
  }

  return tokens;
}

function luminance(hex: string): number {
  const channels = hex
    .slice(1)
    .match(/\w\w/g)!
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(first: string, second: string): number {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

const palettes = {
  light: readTokens(readBlock(':root,')),
  dark: readTokens(readBlock(':root[data-theme="dark"]')),
};

const checks = [
  { label: 'ink on paper', foreground: 'ink', background: 'paper', minimum: 4.5 },
  { label: 'ink on surface', foreground: 'ink', background: 'surface', minimum: 4.5 },
  { label: 'muted on paper', foreground: 'muted', background: 'paper', minimum: 4.5 },
  { label: 'muted on surface', foreground: 'muted', background: 'surface', minimum: 4.5 },
  { label: 'signal text on paper', foreground: 'signal', background: 'paper', minimum: 4.5 },
  { label: 'signal text on surface', foreground: 'signal', background: 'surface', minimum: 4.5 },
  {
    label: 'signal-ink on signal',
    foreground: 'signal-ink',
    background: 'signal',
    minimum: 4.5,
  },
  { label: 'live dot on surface', foreground: 'live', background: 'surface', minimum: 3 },
  { label: 'wip dot on surface', foreground: 'wip', background: 'surface', minimum: 3 },
  { label: 'archived dot on surface', foreground: 'archived', background: 'surface', minimum: 3 },
  { label: 'focus ring on paper', foreground: 'signal', background: 'paper', minimum: 3 },
  { label: 'focus ring on surface', foreground: 'signal', background: 'surface', minimum: 3 },
] as const;

const failures: string[] = [];

for (const [theme, palette] of Object.entries(palettes)) {
  for (const check of checks) {
    const foreground = palette.get(check.foreground);
    const background = palette.get(check.background);

    if (!foreground || !background) {
      failures.push(`${theme}: missing tokens for ${check.label}`);
      continue;
    }

    const ratio = contrast(foreground, background);
    if (ratio < check.minimum) {
      failures.push(
        `${theme}: ${check.label} is ${ratio.toFixed(2)}:1, expected at least ${check.minimum}:1`,
      );
    }
  }
}

const themeDoc = readFileSync(new URL('../docs/diseno.md', import.meta.url), 'utf8');
const documentedValues = [
  THEME_STORAGE_KEY,
  THEME_ATTRIBUTE,
  THEME_PREFERENCE_ATTRIBUTE,
  ...THEME_MODES,
];

for (const value of documentedValues) {
  if (!themeDoc.includes(value)) {
    failures.push(`docs/diseno.md does not document: ${value}`);
  }
}

if (failures.length > 0) {
  throw new Error(`Theme validation failed:\n- ${failures.join('\n- ')}`);
}

console.log(
  `Theme validation passed: ${checks.length} contrast pairs in light and dark; ` +
    `docs/diseno.md matches ${THEME_STORAGE_KEY} and ${THEME_MODES.length} theme modes.`,
);
