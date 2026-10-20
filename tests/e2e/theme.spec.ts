import { expect, test } from '@playwright/test';
import {
  THEME_ATTRIBUTE,
  THEME_PREFERENCE_ATTRIBUTE,
  THEME_STORAGE_KEY,
} from '../../src/lib/theme-contract.ts';

test('a first visit follows a dark system preference before the first frame', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => {
    const target = window as Window & { __themeAtFirstFrame?: string | null };
    target.__themeAtFirstFrame = null;

    requestAnimationFrame(() => {
      target.__themeAtFirstFrame = document.documentElement.getAttribute('data-theme');
    });
  });

  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute(THEME_ATTRIBUTE, 'dark');
  await expect(page.locator('html')).toHaveAttribute(THEME_PREFERENCE_ATTRIBUTE, 'system');
  await expect(page.getByRole('group', { name: 'Tema' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Sistema' })).toBeChecked();

  const firstVisit = await page.evaluate((key) => {
    const target = window as Window & { __themeAtFirstFrame?: string | null };

    return {
      firstFrameTheme: target.__themeAtFirstFrame,
      storedPreference: localStorage.getItem(key),
      background: getComputedStyle(document.body).backgroundColor,
    };
  }, THEME_STORAGE_KEY);

  expect(firstVisit.firstFrameTheme).toBe('dark');
  expect(firstVisit.storedPreference).toBeNull();
  expect(firstVisit.background).toBe('rgb(14, 17, 16)');
});

test('a manual theme selection persists across reloads', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');

  await page.getByText('Claro', { exact: true }).click();

  await expect(page.locator('html')).toHaveAttribute(THEME_ATTRIBUTE, 'light');
  await expect(page.locator('html')).toHaveAttribute(THEME_PREFERENCE_ATTRIBUTE, 'light');
  await expect(page.getByRole('radio', { name: 'Claro' })).toBeChecked();
  expect(await page.evaluate((key) => localStorage.getItem(key), THEME_STORAGE_KEY)).toBe('light');

  await page.reload();

  await expect(page.locator('html')).toHaveAttribute(THEME_ATTRIBUTE, 'light');
  await expect(page.locator('html')).toHaveAttribute(THEME_PREFERENCE_ATTRIBUTE, 'light');
  await expect(page.getByRole('radio', { name: 'Claro' })).toBeChecked();

  await page.getByText('Sistema', { exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute(THEME_ATTRIBUTE, 'dark');
  await expect(page.locator('html')).toHaveAttribute(THEME_PREFERENCE_ATTRIBUTE, 'system');
  await expect(page.getByRole('radio', { name: 'Sistema' })).toBeChecked();
});

test('system mode follows operating-system changes without a reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute(THEME_ATTRIBUTE, 'light');
  await expect(page.locator('html')).toHaveAttribute(THEME_PREFERENCE_ATTRIBUTE, 'system');

  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute(THEME_ATTRIBUTE, 'dark');
  await expect(page.locator('html')).toHaveAttribute(THEME_PREFERENCE_ATTRIBUTE, 'system');
  await expect(page.getByRole('radio', { name: 'Sistema' })).toBeChecked();

  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute(THEME_ATTRIBUTE, 'light');
  await expect(page.locator('html')).toHaveAttribute(THEME_PREFERENCE_ATTRIBUTE, 'system');
});

test('the theme control is keyboard operable and exposes the selected option', async ({ page }) => {
  await page.goto('/');

  const system = page.getByRole('radio', { name: 'Sistema' });
  await system.focus();

  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Claro' })).toBeChecked();
  await expect(page.locator('html')).toHaveAttribute(THEME_ATTRIBUTE, 'light');

  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Oscuro' })).toBeChecked();
  await expect(page.locator('html')).toHaveAttribute(THEME_ATTRIBUTE, 'dark');

  expect(
    await page.evaluate(() => document.activeElement?.getAttribute('value')),
  ).toBe('dark');
});
