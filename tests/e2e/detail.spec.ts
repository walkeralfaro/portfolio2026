import { expect, test, type Page } from '@playwright/test';
import {
  baselineProjects,
  galleryProjects,
  hasCover,
  hasProjects,
  narrativeProjects,
  projectPath,
  projects,
} from './projects';

const caseHeadings = {
  es: ['Problema', 'Rol', 'Decisiones', 'Resultado'],
  en: ['Problem', 'Role', 'Decisions', 'Result'],
} as const;

const baselineHeadings = {
  es: ['Qué es', 'Rol', 'Resultado'],
  en: ['What it is', 'Role', 'Result'],
} as const;

async function openProject(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await expect(page.locator('main h1')).toHaveCount(1);
}

test('every project has localized details and its declared stack in both locales', async ({
  page,
}) => {
  test.skip(!hasProjects, 'No project content.yaml files have been authored yet.');

  for (const locale of ['es', 'en'] as const) {
    for (const project of projects) {
      const path = projectPath(project.slug, locale);
      const response = await page.goto(path);

      expect(response?.status(), path).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('main h1')).toHaveText(
        locale === 'es' ? project.title : project.englishTitle,
      );
      await expect(page.locator('[data-case-header]')).toBeVisible();
      await expect(page.locator('[data-project-detail]')).toHaveAttribute(
        'data-project-detail',
        project.slug,
      );

      if (projects.length > 1) {
        await expect(page.locator('[data-case-pager]')).toBeVisible();
      }

      const stackItems = page.locator('[data-case-stack] .stack-list__item');
      await expect(page.locator('[data-case-stack]'), path).toBeVisible();
      await expect(stackItems, path).toHaveText(project.stack);
      await expect(stackItems, path).toHaveCount(project.stack.length);
      expect(project.stack.length).toBeGreaterThanOrEqual(3);
      expect(project.stack.length).toBeLessThanOrEqual(5);

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://walkeralfaro.com${path}`,
      );
      await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
        'href',
        `https://walkeralfaro.com${projectPath(project.slug, 'es')}`,
      );
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
        'href',
        `https://walkeralfaro.com${projectPath(project.slug, 'en')}`,
      );
    }
  }
});

test('projects with a narrative render the fixed narrative sections in both locales', async ({
  page,
}) => {
  test.skip(!hasProjects, 'No project content.yaml files have been authored yet.');

  for (const project of narrativeProjects) {
    for (const locale of ['es', 'en'] as const) {
      await openProject(page, projectPath(project.slug, locale));
      const headings = await page
        .locator('[data-case-body] h2.case-section')
        .allTextContents();

      expect(headings.map((heading) => heading.trim())).toEqual(caseHeadings[locale]);
      expect(headings.map((heading) => heading.trim())).not.toContain(
        locale === 'es' ? 'Galería' : 'Gallery',
      );
      await expect(page.locator('[data-case-body] .decision-list')).toHaveCount(1);

      const decisions = await page.locator('[data-case-body] .decision-list li').count();
      expect(decisions).toBeGreaterThanOrEqual(3);
      expect(decisions).toBeLessThanOrEqual(4);
    }
  }
});

test('projects without a narrative render the common localized sections', async ({ page }) => {
  test.skip(!hasProjects, 'No project content.yaml files have been authored yet.');

  for (const project of baselineProjects) {
    for (const locale of ['es', 'en'] as const) {
      await openProject(page, projectPath(project.slug, locale));
      const headings = await page
        .locator('[data-case-body] h2.case-section')
        .allTextContents();

      expect(headings.map((heading) => heading.trim())).toEqual(baselineHeadings[locale]);
      await expect(page.locator('[data-case-body] .decision-list')).toHaveCount(0);
    }
  }
});

test('projects without gallery entries omit the section and dialogs', async ({ page }) => {
  test.skip(!hasProjects, 'No project content.yaml files have been authored yet.');

  for (const project of projects.filter(
    (entry) => entry.gallery.es.length === 0 && entry.gallery.en.length === 0,
  )) {
    for (const locale of ['es', 'en'] as const) {
      await openProject(page, projectPath(project.slug, locale));
      await expect(page.locator('[data-gallery]')).toHaveCount(0);
      await expect(page.locator('.screenshot-gallery__caption')).toHaveCount(0);
      await expect(page.locator('dialog[data-lightbox]')).toHaveCount(0);
    }
  }
});

test('declared galleries use the locale-specific alternative text', async ({ page }) => {
  test.skip(galleryProjects.length === 0, 'No project galleries have been authored yet.');

  const project = galleryProjects[0];
  for (const locale of ['es', 'en'] as const) {
    await openProject(page, projectPath(project.slug, locale));
    const images = page.locator('[data-gallery] .screenshot-gallery__thumb img');
    const alts = project.gallery[locale];

    if (alts.length === 0) {
      await expect(page.locator('[data-gallery]')).toHaveCount(0);
      continue;
    }

    await expect(images).toHaveCount(alts.length);
    for (const [index, alt] of alts.entries()) {
      await expect(images.nth(index)).toHaveAttribute('alt', alt);
    }
  }
});

test('project actions reflect the real links in each record', async ({ page }) => {
  test.skip(!hasProjects, 'No project content.yaml files have been authored yet.');

  for (const project of projects) {
    await openProject(page, projectPath(project.slug));
    const actions = page.locator('[data-case-header] [data-project-actions]');

    await expect(actions).toHaveAttribute('data-has-live', String(Boolean(project.links.live)));
    await expect(actions).toHaveAttribute('data-has-code', String(Boolean(project.links.code)));
    await expect(actions.locator('a')).toHaveCount(
      Number(Boolean(project.links.live)) + Number(Boolean(project.links.code)),
    );
    await expect(page.locator('a[href="#"]')).toHaveCount(0);
    await expect(page.locator('button:disabled')).toHaveCount(0);
  }
});

test('previous and next navigation follows catalog order and wraps', async ({ page }) => {
  test.skip(projects.length < 2, 'At least two projects are needed to test the pager.');

  for (const locale of ['es', 'en'] as const) {
    for (const [index, project] of projects.entries()) {
      await openProject(page, projectPath(project.slug, locale));
      const previous = projects[(index - 1 + projects.length) % projects.length];
      const next = projects[(index + 1) % projects.length];
      const previousLink = page.locator('[data-pager-direction="previous"]');
      const nextLink = page.locator('[data-pager-direction="next"]');

      await expect(previousLink).toHaveAttribute('href', projectPath(previous.slug, locale));
      await expect(previousLink.locator('.project-pager__title')).toHaveText(
        locale === 'es' ? previous.title : previous.englishTitle,
      );
      await expect(previousLink).toHaveAttribute('rel', 'prev');
      await expect(nextLink).toHaveAttribute('href', projectPath(next.slug, locale));
      await expect(nextLink.locator('.project-pager__title')).toHaveText(
        locale === 'es' ? next.title : next.englishTitle,
      );
      await expect(nextLink).toHaveAttribute('rel', 'next');
    }
  }
});

test('covers are autodetected and projects without covers show the placeholder', async ({
  page,
}) => {
  test.skip(!hasProjects, 'No project content.yaml files have been authored yet.');

  const withCover = projects.find((project) => hasCover(project.slug));
  const withoutCover = projects.find((project) => !hasCover(project.slug));

  if (withCover) {
    await openProject(page, projectPath(withCover.slug));
    await expect(page.locator('[data-case-header] .case-header__cover img')).toHaveCount(1);
    await expect(
      page.locator('[data-case-header] .case-header__cover .placeholder-cover'),
    ).toHaveCount(0);
  }

  if (withoutCover) {
    await openProject(page, projectPath(withoutCover.slug));
    await expect(
      page.locator('[data-case-header] .case-header__cover .placeholder-cover'),
    ).toHaveCount(1);
    await expect(page.locator('[data-case-header] .case-header__cover img')).toHaveCount(0);
  }
});

test('a gallery screenshot opens in the lightbox and closes with Escape', async ({ page }) => {
  test.skip(galleryProjects.length === 0, 'No project galleries have been authored yet.');
  const project = galleryProjects.find((entry) => entry.gallery.es.length > 0) ?? galleryProjects[0];

  await openProject(page, projectPath(project.slug));
  const trigger = page.locator('[data-gallery] [data-lightbox-open]').first();
  const dialog = page.locator('dialog[data-lightbox]').first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();

  await expect(dialog).toBeVisible();
  await expect(dialog.locator('img')).toHaveAttribute('alt', project.gallery.es[0]);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('the lightbox returns focus to its trigger and preserves scroll', async ({ page }) => {
  test.skip(galleryProjects.length === 0, 'No project galleries have been authored yet.');
  const project = galleryProjects.find((entry) => entry.gallery.es.length > 0) ?? galleryProjects[0];

  await openProject(page, projectPath(project.slug));
  const trigger = page.locator('[data-gallery] [data-lightbox-open]').first();
  const dialog = page.locator('dialog[data-lightbox]').first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.focus();
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.keyboard.press('Enter');

  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.lightbox__close')).toBeFocused();
  expect(
    await page.evaluate(() => document.documentElement.classList.contains('lightbox-open')),
  ).toBe(true);
  await page.keyboard.press('Escape');

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(
    await page.evaluate(() => document.documentElement.classList.contains('lightbox-open')),
  ).toBe(false);
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - scrollBefore)).toBeLessThanOrEqual(2);
});
