import { expect, test, type Page } from '@playwright/test';

const tierOne = [
  { slug: 'todo-mcp', title: 'TODO-mcp' },
  { slug: 'image-prompt', title: 'Image Prompt' },
  { slug: 'cheatsheet-editor', title: 'Cheatsheet Editor' },
  { slug: 'url-shortener', title: 'URL Shortener' },
  { slug: 'multi-step-form', title: 'Multi-step Form' },
  { slug: 'tetris', title: 'Tetris' },
] as const;

const tierTwo = [
  { slug: 'pokedex', title: 'Pokedex' },
  { slug: 'todo-app', title: 'Todo App' },
  { slug: 'tic-tac-toe', title: 'Tic Tac Toe' },
  { slug: 'portfolio-2026', title: 'Portfolio 2026' },
] as const;

const tierThreeSlugs = [
  'tip-calculator',
  'weather-app',
  'rest-countries-explorer',
  'portfolio-profesional',
] as const;

const caseHeadings = {
  es: ['Problema', 'Rol', 'Decisiones', 'Resultado', 'Stack', 'Galería'],
  en: ['Problem', 'Role', 'Decisions', 'Result', 'Stack', 'Gallery'],
} as const;

const shortCaseHeadings = {
  es: ['Qué es', 'Rol', 'Resultado'],
  en: ['What it is', 'Role', 'Result'],
} as const;

async function openCase(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await expect(page.locator('main h1')).toHaveCount(1);
}

test('tier 1 case pages render the fixed sequence in both locales', async ({ page }) => {
  for (const project of tierOne) {
    await openCase(page, `/work/${project.slug}/`);

    await expect(page.locator('main h1')).toHaveText(project.title);
    await expect(page.locator('[data-case-header]')).toBeVisible();
    await expect(page.locator('[data-case-body] .case-body')).toBeVisible();

    const headings = await page
      .locator('[data-case-body] h2.case-section')
      .allTextContents();
    expect(headings.map((heading) => heading.trim())).toEqual(caseHeadings.es);

    await expect(page.locator('[data-case-body] .decision-list')).toHaveCount(1);
    const decisions = await page.locator('[data-case-body] .decision-list li').count();
    expect(decisions).toBeGreaterThanOrEqual(3);
    expect(decisions).toBeLessThanOrEqual(4);
    await expect(page.locator('[data-gallery]')).toBeVisible();
    await expect(page.locator('[data-gallery] [data-lightbox-open]')).toHaveCount(1);
  }

  for (const project of tierOne) {
    await openCase(page, `/en/work/${project.slug}/`);

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main h1')).toHaveText(project.title);

    const headings = await page
      .locator('[data-case-body] h2.case-section')
      .allTextContents();
    expect(headings.map((heading) => heading.trim())).toEqual(caseHeadings.en);

    await expect(page.locator('[data-case-body] .decision-list')).toHaveCount(1);
    await expect(page.locator('[data-gallery]')).toBeVisible();
  }
});

test('tier 2 case pages use localized project fields without a gallery or decisions', async ({
  page,
}) => {
  for (const project of tierTwo) {
    await openCase(page, `/work/${project.slug}/`);

    await expect(page.locator('main h1')).toHaveText(project.title);

    const headings = await page
      .locator('[data-case-body] h2.case-section')
      .allTextContents();
    expect(headings.map((heading) => heading.trim())).toEqual(shortCaseHeadings.es);

    await expect(page.locator('[data-case-body] .decision-list')).toHaveCount(0);
    await expect(page.locator('[data-gallery]')).toHaveCount(0);
    await expect(page.locator('[data-case-header] [data-project-actions]')).toHaveCount(1);
  }

  for (const project of tierTwo) {
    await openCase(page, `/en/work/${project.slug}/`);

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main h1')).toHaveText(project.title);

    const headings = await page
      .locator('[data-case-body] h2.case-section')
      .allTextContents();
    expect(headings.map((heading) => heading.trim())).toEqual(shortCaseHeadings.en);
  }
});

test('tier 3 slugs return the localized 404 and never generate a detail page', async ({
  page,
}) => {
  for (const slug of tierThreeSlugs) {
    const spanish = await page.goto(`/work/${slug}/`);
    expect(spanish?.status()).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('main h1')).toHaveText('Página no encontrada');
    await expect(page.locator('[data-project-detail]')).toHaveCount(0);

    const english = await page.goto(`/en/work/${slug}/`);
    expect(english?.status()).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main h1')).toHaveText('Page not found');
    await expect(page.locator('[data-project-detail]')).toHaveCount(0);
  }

  await page.goto('/work/');
  await expect(page.locator('[data-project="tip-calculator"] a.project-row__inner')).toHaveAttribute(
    'href',
    'https://walker-alfaro-tip-calculator.netlify.app',
  );
  await expect(page.locator('[data-project="weather-app"] a')).toHaveCount(0);
  await expect(page.locator('[data-project-row][data-project="weather-app"]')).toContainText(
    'Demo y código pendientes',
  );
});

test('actions reflect the real links in each project record', async ({ page }) => {
  await openCase(page, '/work/todo-mcp/');
  const todo = page.locator('[data-case-header] [data-project-actions]');
  await expect(todo).toHaveAttribute('data-has-live', 'false');
  await expect(todo).toHaveAttribute('data-has-code', 'true');
  await expect(todo.locator('a')).toHaveCount(1);
  await expect(todo.locator('a')).toHaveAttribute(
    'href',
    'https://github.com/walkeralfaro/todo-mcp-dual',
  );
  await expect(todo).toContainText('Demo pública pendiente');

  await openCase(page, '/work/url-shortener/');
  const shortener = page.locator('[data-case-header] [data-project-actions]');
  await expect(shortener).toHaveAttribute('data-has-live', 'true');
  await expect(shortener).toHaveAttribute('data-has-code', 'true');
  await expect(shortener.locator('a')).toHaveCount(2);

  await openCase(page, '/work/portfolio-2026/');
  const portfolio = page.locator('[data-case-header] [data-project-actions]');
  await expect(portfolio).toHaveAttribute('data-has-live', 'false');
  await expect(portfolio).toHaveAttribute('data-has-code', 'false');
  await expect(portfolio.locator('a, button')).toHaveCount(0);
  await expect(portfolio).toContainText('Sitio en construcción');

  for (const path of ['/work/todo-mcp/', '/work/pokedex/', '/work/portfolio-2026/']) {
    await page.goto(path);
    await expect(page.locator('a[href="#"]')).toHaveCount(0);
    await expect(page.locator('button:disabled')).toHaveCount(0);
  }
});

test('previous and next navigation follows catalog order and wraps without dead links', async ({
  page,
}) => {
  await openCase(page, '/work/todo-mcp/');

  const previous = page.locator('[data-pager-direction="previous"]');
  const next = page.locator('[data-pager-direction="next"]');

  await expect(previous).toHaveAttribute('href', '/work/portfolio-2026/');
  await expect(previous.locator('.project-pager__title')).toHaveText('Portfolio 2026');
  await expect(previous).toHaveAttribute('rel', 'prev');
  await expect(next).toHaveAttribute('href', '/work/image-prompt/');
  await expect(next.locator('.project-pager__title')).toHaveText('Image Prompt');
  await expect(next).toHaveAttribute('rel', 'next');

  await openCase(page, '/work/portfolio-2026/');
  await expect(page.locator('[data-pager-direction="previous"]')).toHaveAttribute(
    'href',
    '/work/tetris/',
  );
  await expect(page.locator('[data-pager-direction="next"]')).toHaveAttribute(
    'href',
    '/work/todo-mcp/',
  );

  const hrefs = await page
    .locator('[data-case-pager] a')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));

  for (const slug of tierThreeSlugs) {
    expect(hrefs.some((href) => href.includes(slug))).toBe(false);
  }

  await openCase(page, '/en/work/todo-mcp/');
  await expect(page.locator('[data-pager-direction="previous"]')).toHaveAttribute(
    'href',
    '/en/work/portfolio-2026/',
  );
  await expect(page.locator('[data-pager-direction="next"]')).toHaveAttribute(
    'href',
    '/en/work/image-prompt/',
  );
});

test('detail pages expose canonical and reciprocal language alternates', async ({ page }) => {
  await openCase(page, '/work/todo-mcp/');

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://example.com/work/todo-mcp/',
  );
  await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
    'href',
    'https://example.com/work/todo-mcp/',
  );
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
    'href',
    'https://example.com/en/work/todo-mcp/',
  );

  await page.reload();
  await expect(page.locator('main h1')).toHaveText('TODO-mcp');
  await expect(page.locator('[data-case-body] h2.case-section')).toHaveCount(6);

  await openCase(page, '/en/work/todo-mcp/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://example.com/en/work/todo-mcp/',
  );
  await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
    'href',
    'https://example.com/work/todo-mcp/',
  );
});

test('the gallery lightbox traps focus, closes with Escape, and preserves scroll', async ({
  page,
}) => {
  await openCase(page, '/work/todo-mcp/');

  const trigger = page.locator('[data-gallery] [data-lightbox-open]');
  const dialog = page.locator('dialog[data-lightbox]');

  await expect(dialog).toBeHidden();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.focus();
  await expect(trigger).toBeFocused();
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.keyboard.press('Enter');

  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('open', '');
  await expect(page.locator('.lightbox__close')).toBeFocused();
  expect(
    await page.evaluate(() => document.documentElement.classList.contains('lightbox-open')),
  ).toBe(true);
  expect(
    await page.evaluate(() => getComputedStyle(document.documentElement).overflow),
  ).toBe('hidden');

  await page.keyboard.press('Escape');

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(
    await page.evaluate(() => document.documentElement.classList.contains('lightbox-open')),
  ).toBe(false);

  const scrollAfter = await page.evaluate(() => window.scrollY);
  expect(Math.abs(scrollAfter - scrollBefore)).toBeLessThanOrEqual(2);
});

test('the lightbox close control returns focus to its trigger', async ({ page }) => {
  await openCase(page, '/en/work/todo-mcp/');

  const trigger = page.locator('[data-gallery] [data-lightbox-open]');
  const dialog = page.locator('dialog[data-lightbox]');

  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();

  await page.locator('.lightbox__close').click();

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
