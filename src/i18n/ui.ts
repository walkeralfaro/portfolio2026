import type { Locale } from './locales.ts';
import { uiEn } from './ui.en.ts';
import { uiEs, type UiStrings } from './ui.es.ts';

export type { UiStrings };

export const uiByLocale: Record<Locale, UiStrings> = {
  es: uiEs,
  en: uiEn,
};

export function getUi(locale: Locale): UiStrings {
  return uiByLocale[locale];
}
