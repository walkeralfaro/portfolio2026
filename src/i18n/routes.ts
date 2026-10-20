import {
  PROJECT_CATEGORIES,
  PROJECT_SLUGS,
  type ProjectCategory,
  type ProjectSlug,
} from '../content/project-slugs.ts';
import type { Locale } from './locales.ts';

export type LocalizedRoute =
  | { name: 'home' }
  | { name: 'work'; category?: ProjectCategory }
  | { name: 'project'; slug: ProjectSlug }
  | { name: 'about' }
  | { name: 'cv' }
  | { name: 'colophon' }
  | { name: 'not-found' };

function localePrefix(locale: Locale): string {
  return locale === 'en' ? '/en' : '';
}

function isProjectSlug(value: string): value is ProjectSlug {
  return (PROJECT_SLUGS as readonly string[]).includes(value);
}

function isProjectCategory(value: string | null): value is ProjectCategory {
  return value !== null && (PROJECT_CATEGORIES as readonly string[]).includes(value);
}

function categoryFromSearch(search: string): ProjectCategory | undefined {
  const value = new URLSearchParams(search).get('c');
  return isProjectCategory(value) ? value : undefined;
}

export function routeHref(locale: Locale, route: LocalizedRoute): string {
  const prefix = localePrefix(locale);

  switch (route.name) {
    case 'home':
      return `${prefix}/`;
    case 'work': {
      const category = route.category ? `?c=${route.category}` : '';
      return `${prefix}/work/${category}`;
    }
    case 'project':
      return `${prefix}/work/${route.slug}/`;
    case 'about':
      return `${prefix}/about/`;
    case 'cv':
      return `${prefix}/cv/`;
    case 'colophon':
      return `${prefix}/colophon/`;
    case 'not-found':
      return `${prefix}/404`;
  }
}

export function parseLocalizedUrl(pathname: string, search = ''): LocalizedRoute | null {
  const hasEnglishPrefix = pathname === '/en' || pathname.startsWith('/en/');
  const withoutLocale = hasEnglishPrefix ? pathname.slice(3) || '/' : pathname;
  const normalized = withoutLocale.replace(/\/+$/, '') || '/';

  if (normalized === '/') return { name: 'home' };
  if (normalized === '/work') {
    return { name: 'work', category: categoryFromSearch(search) };
  }
  if (normalized.startsWith('/work/')) {
    const slug = normalized.slice('/work/'.length);
    return isProjectSlug(slug) ? { name: 'project', slug } : null;
  }
  if (normalized === '/about') return { name: 'about' };
  if (normalized === '/cv') return { name: 'cv' };
  if (normalized === '/colophon') return { name: 'colophon' };
  if (normalized === '/404') return { name: 'not-found' };

  return null;
}

/**
 * Resolves the equivalent route in the other locale. Project slugs and the
 * work category filter are preserved; unknown routes fall back to home.
 */
export function switchLocaleHref(
  targetLocale: Locale,
  pathname: string,
  search = '',
): string {
  const route = parseLocalizedUrl(pathname, search);
  return routeHref(targetLocale, route ?? { name: 'home' });
}
