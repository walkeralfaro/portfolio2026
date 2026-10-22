import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import {
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
} from '../../src/lib/theme-contract.ts';

const auditPages = [
  { path: '/', name: 'home-es' },
  { path: '/en/', name: 'home-en' },
  { path: '/work/', name: 'work-es' },
  { path: '/en/work/', name: 'work-en' },
  { path: '/work/todo-mcp/', name: 'case-es' },
  { path: '/en/work/todo-mcp/', name: 'case-en' },
  { path: '/about/', name: 'about-es' },
  { path: '/en/about/', name: 'about-en' },
] as const;

const themes = ['light', 'dark'] as const;

async function setTheme(page: Page, theme: (typeof themes)[number]): Promise<void> {
  await page.addInitScript(
    ([key, value]) => localStorage.setItem(key, value),
    [THEME_STORAGE_KEY, theme] as const,
  );
}

for (const theme of themes) {
  test(`automated accessibility audit passes in the ${theme} theme`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });

    for (const entry of auditPages) {
      await setTheme(page, theme);
      await page.goto(entry.path);
      await expect(page.locator('html')).toHaveAttribute(THEME_ATTRIBUTE, theme);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const blocking = results.violations.filter(
        (violation) => violation.impact === 'critical' || violation.impact === 'serious',
      );

      expect(
        blocking,
        `${entry.name} (${theme}) has critical or serious axe violations:\n${JSON.stringify(
          blocking.map((violation) => ({
            id: violation.id,
            help: violation.help,
            nodes: violation.nodes.map((node) => node.target),
          })),
          null,
          2,
        )}`,
      ).toEqual([]);
    }
  });
}

test('keyboard-only navigation reaches every shell control with a visible focus ring', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  const reached: string[] = [];

  for (let index = 0; index < 18; index += 1) {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const element = document.activeElement;
      if (!(element instanceof HTMLElement)) return null;

      const style = getComputedStyle(element);
      const focusVisible = element.matches(':focus-visible');

      const labelText =
        element instanceof HTMLInputElement
          ? element.closest('label')?.textContent
          : element.textContent;

      return {
        label:
          element.getAttribute('aria-label') ??
          labelText?.trim().replace(/\s+/g, ' ').slice(0, 80) ??
          element.tagName,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        focusVisible,
      };
    });

    expect(focused).not.toBeNull();
    reached.push(focused!.label);

    if (focused!.focusVisible) {
      expect(focused!.outlineStyle, `${focused!.label} should show a focus ring`).not.toBe(
        'none',
      );
      expect(parseFloat(focused!.outlineWidth)).toBeGreaterThan(0);
    }
  }

  expect(reached[0]).toContain('Saltar al contenido');
  expect(reached.join(' | ')).toContain('Trabajo');
  expect(reached.join(' | ')).toContain('Sobre mí');
  expect(reached.join(' | ')).toContain('Sistema');
});

test('keyboard operation covers filters, catalog rows, lightbox, and CV links', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/work/');
  await page.waitForSelector('[data-catalog-ready="true"]');

  const firstFilter = page.locator('[data-filter="ia"]');
  await firstFilter.focus();
  await page.keyboard.press('Enter');
  await expect(firstFilter).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('[data-catalog-count]')).toHaveText('2');

  await page.locator('[data-filter="all"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-catalog-count]')).toHaveText('14');

  const firstRow = page.locator('[data-project-row] a.project-row__inner').first();
  await firstRow.focus();
  await expect(page.locator('[data-preview-panel][data-active="true"]')).toHaveCount(1);

  await page.goto('/work/tetris/');
  const trigger = page.locator('[data-lightbox-open]').first();
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('dialog[open]');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await page.goto('/');
  const cvLinks = page.locator('a[href="https://resume.walkeralfaro.com/"]');
  expect(await cvLinks.count()).toBeGreaterThan(0);
  for (const link of await cvLinks.all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
});

test('reduced motion removes non-essential transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/');
  await page.waitForSelector('[data-catalog-ready="true"]');

  const durations = await page.evaluate(() => {
    const selectors = [
      '.category-filter__link',
      '.work-preview__panel',
      '.button-link',
    ];

    return selectors.map((selector) => {
      const element = document.querySelector(selector);
      if (!element) return { selector, duration: null };

      const style = getComputedStyle(element);
      return {
        selector,
        duration: Number.parseFloat(style.transitionDuration.split(',')[0] ?? '0'),
      };
    });
  });

  for (const entry of durations) {
    expect(entry.duration, `${entry.selector} transition`).not.toBeNull();
    expect(entry.duration!, `${entry.selector} should have no measurable transition`).toBeLessThanOrEqual(0.01);
  }

  await expect(page.locator('[data-project-row]').first()).toBeVisible();
});

test('the review matrix has no overflow and keeps one heading per page', async ({ page }) => {
  const widths = [320, 768, 1024, 1440];
  const routes = ['/', '/en/', '/work/', '/en/work/', '/work/todo-mcp/', '/en/work/todo-mcp/', '/about/', '/en/about/'];

  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });

    for (const theme of themes) {
      await setTheme(page, theme);

      for (const path of routes) {
        await page.goto(path);
        await expect(page.locator('html')).toHaveAttribute(THEME_ATTRIBUTE, theme);

        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
          ),
          `${path} should not overflow at ${width}px`,
        ).toBe(true);
        await expect(page.locator('main h1'), `${path} should have one H1`).toHaveCount(1);
      }
    }
  }
});
