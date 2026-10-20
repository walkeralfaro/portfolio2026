export const THEME_STORAGE_KEY = 'portfolio-theme';
export const THEME_ATTRIBUTE = 'data-theme';
export const THEME_PREFERENCE_ATTRIBUTE = 'data-theme-preference';
export const THEME_SYSTEM_QUERY = '(prefers-color-scheme: dark)';

export const THEME_MODES = ['system', 'light', 'dark'] as const;

export type ThemeMode = (typeof THEME_MODES)[number];
export type ResolvedTheme = Exclude<ThemeMode, 'system'>;

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark';
}

/**
 * This script is embedded inline in <head>. It must stay dependency-free and
 * run before the first paint so the resolved theme is available immediately.
 */
export function createThemeInitScript(): string {
  return `(() => {
  const key = ${JSON.stringify(THEME_STORAGE_KEY)};
  const root = document.documentElement;
  let preference = 'system';

  try {
    const stored = localStorage.getItem(key);
    if (stored === 'system' || stored === 'light' || stored === 'dark') {
      preference = stored;
    }
  } catch {}

  const systemDark = window.matchMedia(${JSON.stringify(THEME_SYSTEM_QUERY)}).matches;
  const theme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  root.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)}, theme);
  root.setAttribute(${JSON.stringify(THEME_PREFERENCE_ATTRIBUTE)}, preference);
  root.style.colorScheme = theme;
})();`;
}
