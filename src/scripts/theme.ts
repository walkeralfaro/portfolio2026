import {
  THEME_ATTRIBUTE,
  THEME_PREFERENCE_ATTRIBUTE,
  THEME_STORAGE_KEY,
  THEME_SYSTEM_QUERY,
  isThemeMode,
  type ResolvedTheme,
  type ThemeMode,
} from '../lib/theme-contract';

let initialized = false;
let preference: ThemeMode = 'system';
let systemQuery: MediaQueryList | null = null;
let controls: HTMLElement[] = [];

function readPreference(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode !== 'system') return mode;
  return window.matchMedia(THEME_SYSTEM_QUERY).matches ? 'dark' : 'light';
}

function applyTheme(): void {
  const resolved = resolveTheme(preference);
  const root = document.documentElement;

  root.setAttribute(THEME_ATTRIBUTE, resolved);
  root.setAttribute(THEME_PREFERENCE_ATTRIBUTE, preference);
  root.style.colorScheme = resolved;
}

function syncControls(): void {
  for (const control of controls) {
    const inputs = control.querySelectorAll<HTMLInputElement>('input[name="theme"]');

    for (const input of inputs) {
      input.checked = input.value === preference;
    }
  }
}

function persistPreference(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Storage can be unavailable in private or restricted contexts.
  }
}

function setPreference(mode: ThemeMode, persist: boolean): void {
  preference = mode;
  applyTheme();
  syncControls();

  if (persist) persistPreference(mode);
}

function handleSystemChange(): void {
  if (preference === 'system') applyTheme();
}

function handleStorage(event: StorageEvent): void {
  if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;

  preference = readPreference();
  applyTheme();
  syncControls();
}

export function initThemeControl(): void {
  if (initialized) return;
  initialized = true;

  controls = Array.from(document.querySelectorAll<HTMLElement>('[data-theme-control]'));
  preference = readPreference();
  applyTheme();
  syncControls();

  systemQuery = window.matchMedia(THEME_SYSTEM_QUERY);
  systemQuery.addEventListener('change', handleSystemChange);
  window.addEventListener('storage', handleStorage);

  for (const control of controls) {
    control.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.name !== 'theme') return;
      if (!isThemeMode(target.value)) return;

      setPreference(target.value, true);
    });
  }
}
