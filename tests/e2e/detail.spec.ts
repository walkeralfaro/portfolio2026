import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import { parse } from 'yaml';

const projects = [
  { slug: 'todo-mcp', title: 'TODO-mcp', narrative: true },
  { slug: 'image-prompt', title: 'Image Prompt', narrative: true },
  { slug: 'cheatsheet-editor', title: 'Cheatsheet Editor', narrative: true },
  { slug: 'url-shortener', title: 'URL Shortener', narrative: true },
  { slug: 'multi-step-form', title: 'Multi-step Form', narrative: true },
  { slug: 'pokedex', title: 'Pokedex', narrative: false },
  { slug: 'todo-app', title: 'Todo App', narrative: false },
  { slug: 'tic-tac-toe', title: 'Tic Tac Toe', narrative: false },
  { slug: 'tip-calculator', title: 'Tip Calculator', narrative: false },
  { slug: 'weather-app', title: 'Weather App', narrative: false },
  { slug: 'rest-countries-explorer', title: 'REST Countries Explorer', narrative: false },
  { slug: 'tetris', title: 'Tetris', narrative: true },
  { slug: 'portfolio-profesional', title: 'Portfolio Profesional', narrative: false },
  { slug: 'portfolio-2026', title: 'Portfolio 2026', narrative: false },
] as const;

const narrativeProjects = projects.filter((project) => project.narrative);
const baselineProjects = projects.filter((project) => !project.narrative);

function readProjectStack(slug: string): string[] {
  const record = parse(
    readFileSync(join(process.cwd(), 'src/content/projects', `${slug}.yaml`), 'utf8'),
  ) as { stack?: unknown };

  if (
    !Array.isArray(record.stack) ||
    !record.stack.every((item) => typeof item === 'string')
  ) {
    throw new Error(`Project ${slug} does not define a string stack`);
  }

  return record.stack;
}

const projectStacks = new Map(
  projects.map((project) => [project.slug, readProjectStack(project.slug)]),
);

const caseHeadings = {
  es: ['Problema', 'Rol', 'Decisiones', 'Resultado'],
  en: ['Problem', 'Role', 'Decisions', 'Result'],
} as const;

const baselineHeadings = {
  es: ['Qué es', 'Rol', 'Resultado'],
  en: ['What it is', 'Role', 'Result'],
} as const;

async function openCase(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await expect(page.locator('main h1')).toHaveCount(1);
}

test('every project has a detail page with localized metadata and its record stack in both locales', async ({
  page,
}) => {
  for (const entry of [
    { locale: 'es' as const, prefix: '' },
    { locale: 'en' as const, prefix: '/en' },
  ]) {
    for (const project of projects) {
      const path = `${entry.prefix}/work/${project.slug}/`;
      const response = await page.goto(path);

      expect(response?.status(), path).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', entry.locale);
      await expect(page.locator('main h1')).toHaveText(project.title);
      await expect(page.locator('[data-case-header]')).toBeVisible();
      await expect(page.locator('[data-project-detail]')).toHaveAttribute(
        'data-project-detail',
        project.slug,
      );
      await expect(page.locator('[data-case-pager]')).toBeVisible();

      const stack = projectStacks.get(project.slug);

      if (!stack) {
        throw new Error(`Missing expected stack for ${project.slug}`);
      }

      const stackItems = page
        .locator('[data-case-stack]')
        .locator('.stack-list__item');

      await expect(page.locator('[data-case-stack]'), path).toBeVisible();
      await expect(stackItems, path).toHaveText(stack);
      await expect(stackItems, path).toHaveCount(stack.length);
      expect(stack.length, path).toBeGreaterThanOrEqual(3);
      expect(stack.length, path).toBeLessThanOrEqual(5);

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://walkeralfaro.com${path}`,
      );
      await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
        'href',
        `https://walkeralfaro.com/work/${project.slug}/`,
      );
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
        'href',
        `https://walkeralfaro.com/en/work/${project.slug}/`,
      );
    }
  }
});

test('projects with a narrative render the fixed case sequence in both locales', async ({
  page,
}) => {
  for (const project of narrativeProjects) {
    await openCase(page, `/work/${project.slug}/`);

    await expect(page.locator('[data-case-body] .case-body')).toBeVisible();

    const headings = await page
      .locator('[data-case-body] h2.case-section')
      .allTextContents();
    expect(headings.map((heading) => heading.trim())).toEqual(caseHeadings.es);
    expect(headings.map((heading) => heading.trim())).not.toContain('Stack');
    expect(headings.map((heading) => heading.trim())).not.toContain('Galería');

    await expect(page.locator('[data-case-body] .decision-list')).toHaveCount(1);
    const decisions = await page.locator('[data-case-body] .decision-list li').count();
    expect(decisions).toBeGreaterThanOrEqual(3);
    expect(decisions).toBeLessThanOrEqual(4);
  }

  for (const project of narrativeProjects) {
    await openCase(page, `/en/work/${project.slug}/`);

    const headings = await page
      .locator('[data-case-body] h2.case-section')
      .allTextContents();
    expect(headings.map((heading) => heading.trim())).toEqual(caseHeadings.en);
    expect(headings.map((heading) => heading.trim())).not.toContain('Stack');
    expect(headings.map((heading) => heading.trim())).not.toContain('Gallery');

    await expect(page.locator('[data-case-body] .decision-list')).toHaveCount(1);
  }
});

test('projects without a narrative render the common localized sections', async ({ page }) => {
  for (const project of baselineProjects) {
    await openCase(page, `/work/${project.slug}/`);

    const headings = await page
      .locator('[data-case-body] h2.case-section')
      .allTextContents();
    expect(headings.map((heading) => heading.trim())).toEqual(baselineHeadings.es);

    await expect(page.locator('[data-case-body] .decision-list')).toHaveCount(0);
    await expect(page.locator('[data-gallery]')).toHaveCount(0);
  }

  for (const project of baselineProjects) {
    await openCase(page, `/en/work/${project.slug}/`);

    const headings = await page
      .locator('[data-case-body] h2.case-section')
      .allTextContents();
    expect(headings.map((heading) => heading.trim())).toEqual(baselineHeadings.en);
  }
});

test('a project without a gallery omits the section, caption, and dialogs', async ({
  page,
}) => {
  for (const project of projects.filter((entry) => entry.slug !== 'tetris')) {
    await openCase(page, `/work/${project.slug}/`);

    await expect(page.locator('[data-gallery]')).toHaveCount(0);
    await expect(page.locator('.screenshot-gallery__caption')).toHaveCount(0);
    await expect(page.locator('dialog[data-lightbox]')).toHaveCount(0);
  }
});

test('a declared gallery renders its screenshots with localized alternative text', async ({
  page,
}) => {
  await openCase(page, '/work/tetris/');

  const spanish = page.locator('[data-gallery] .screenshot-gallery__thumb img');

  await expect(spanish).toHaveCount(3);
  await expect(spanish.nth(0)).toHaveAttribute(
    'alt',
    'Pantalla de inicio del juego, con el logotipo de Tetris y el botón de inicio.',
  );
  await expect(spanish.nth(1)).toHaveAttribute(
    'alt',
    'Partida en curso, con las piezas de colores apiladas en el tablero y el marcador.',
  );
  await expect(spanish.nth(2)).toHaveAttribute(
    'alt',
    'Pantalla de fin de partida, con el mensaje de game over sobre el tablero y la puntuación final.',
  );

  await openCase(page, '/en/work/tetris/');

  const english = page.locator('[data-gallery] .screenshot-gallery__thumb img');

  await expect(english).toHaveCount(3);
  await expect(english.nth(0)).toHaveAttribute(
    'alt',
    'Game start screen, with the Tetris logo and the start button.',
  );
  await expect(english.nth(2)).toHaveAttribute(
    'alt',
    'Game over screen, with the game over message over the board and the final score.',
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

  await openCase(page, '/work/weather-app/');
  const weather = page.locator('[data-case-header] [data-project-actions]');
  await expect(weather).toHaveAttribute('data-has-live', 'false');
  await expect(weather).toHaveAttribute('data-has-code', 'false');
  await expect(weather.locator('a, button')).toHaveCount(0);
  await expect(weather).toContainText('Demo y código pendientes');

  for (const path of ['/work/todo-mcp/', '/work/pokedex/', '/work/portfolio-2026/']) {
    await page.goto(path);
    await expect(page.locator('a[href="#"]')).toHaveCount(0);
    await expect(page.locator('button:disabled')).toHaveCount(0);
  }
});

test('previous and next navigation spans every project in catalog order', async ({ page }) => {
  for (const entry of [
    { locale: 'es' as const, prefix: '' },
    { locale: 'en' as const, prefix: '/en' },
  ]) {
    for (const [index, project] of projects.entries()) {
      await openCase(page, `${entry.prefix}/work/${project.slug}/`);

      const previous = projects[(index - 1 + projects.length) % projects.length];
      const next = projects[(index + 1) % projects.length];

      const previousLink = page.locator('[data-pager-direction="previous"]');
      const nextLink = page.locator('[data-pager-direction="next"]');

      await expect(previousLink).toHaveAttribute(
        'href',
        `${entry.prefix}/work/${previous.slug}/`,
      );
      await expect(previousLink.locator('.project-pager__title')).toHaveText(
        previous.title,
      );
      await expect(previousLink).toHaveAttribute('rel', 'prev');
      await expect(nextLink).toHaveAttribute(
        'href',
        `${entry.prefix}/work/${next.slug}/`,
      );
      await expect(nextLink.locator('.project-pager__title')).toHaveText(next.title);
      await expect(nextLink).toHaveAttribute('rel', 'next');
    }
  }
});

test('a project with a cover shows it in the case header', async ({ page }) => {
  await openCase(page, '/work/todo-app/');

  const cover = page.locator('[data-case-header] .case-header__cover img');

  await expect(cover).toHaveCount(1);
  await expect(cover).toHaveAttribute('alt', 'Portada de Todo App, categoría Frontend');
  await expect(cover).toHaveAttribute('src', /todo-app/);

  await openCase(page, '/en/work/todo-app/');

  await expect(page.locator('[data-case-header] .case-header__cover img')).toHaveAttribute(
    'alt',
    'Cover of Todo App, category Frontend',
  );
});

test('a project without a cover keeps the designed placeholder in the case header', async ({
  page,
}) => {
  await openCase(page, '/work/todo-mcp/');

  await expect(page.locator('[data-case-header] .case-header__cover .placeholder-cover')).toHaveCount(
    1,
  );
  await expect(page.locator('[data-case-header] .case-header__cover img')).toHaveCount(0);
});

test('a gallery screenshot opens in the lightbox', async ({ page }) => {
  await openCase(page, '/work/tetris/');

  const trigger = page.locator('[data-gallery] [data-lightbox-open="gallery-tetris-1"]');
  const dialog = page.locator('dialog#gallery-tetris-1');

  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();

  await expect(dialog).toBeVisible();
  await expect(dialog.locator('img')).toHaveAttribute(
    'alt',
    'Partida en curso, con las piezas de colores apiladas en el tablero y el marcador.',
  );

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('the gallery lightbox traps focus, closes with Escape, and preserves scroll', async ({
  page,
}) => {
  await openCase(page, '/work/tetris/');

  const trigger = page.locator('[data-gallery] [data-lightbox-open]').first();
  const dialog = page.locator('dialog[data-lightbox]').first();

  await expect(dialog).toBeHidden();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.focus();
  await expect(trigger).toBeFocused();
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.keyboard.press('Enter');

  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('open', '');
  await expect(page.locator('.lightbox__close').first()).toBeFocused();
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
  await openCase(page, '/en/work/tetris/');

  const trigger = page.locator('[data-gallery] [data-lightbox-open]').first();
  const dialog = page.locator('dialog[data-lightbox]').first();

  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();

  await dialog.locator('.lightbox__close').click();

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('portrait and landscape screenshots fit the lightbox without internal scroll', async ({
  page,
}) => {
  const landscapeSource = `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#222"/></svg>',
  )}`;

  const viewports = [
    { name: 'narrow mobile', width: 375, height: 667 },
    { name: 'mobile landscape', width: 667, height: 375 },
    { name: 'desktop', width: 1280, height: 900 },
  ] as const;

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await openCase(page, '/work/tetris/');

    const trigger = page.locator('[data-gallery] [data-lightbox-open]').first();
    const dialog = page.locator('dialog[data-lightbox]').first();

    await trigger.click();
    await expect(dialog).toBeVisible();

    const measure = async (label: string) => {
      const metrics = await dialog.evaluate((element) => {
        const image = element.querySelector('img');
        const body = element.querySelector('.lightbox__body');
        const close = element.querySelector('.lightbox__close');

        if (!image || !body || !close) {
          throw new Error('Lightbox is missing its image, body, or close control');
        }

        const dialogBox = element.getBoundingClientRect();
        const imageBox = image.getBoundingClientRect();
        const closeBox = close.getBoundingClientRect();

        return {
          clientWidth: element.clientWidth,
          clientHeight: element.clientHeight,
          scrollWidth: element.scrollWidth,
          scrollHeight: element.scrollHeight,
          dialogTop: dialogBox.top,
          dialogRight: dialogBox.right,
          dialogBottom: dialogBox.bottom,
          dialogLeft: dialogBox.left,
          bodyWidth: body.clientWidth,
          bodyHeight: body.clientHeight,
          imageWidth: imageBox.width,
          imageHeight: imageBox.height,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          closeWidth: closeBox.width,
          closeHeight: closeBox.height,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        };
      });

      expect(metrics.scrollHeight, `${label} dialog scroll height`).toBeLessThanOrEqual(
        metrics.clientHeight + 1,
      );
      expect(metrics.scrollWidth, `${label} dialog scroll width`).toBeLessThanOrEqual(
        metrics.clientWidth + 1,
      );
      expect(metrics.imageWidth).toBeLessThanOrEqual(metrics.bodyWidth + 1);
      expect(metrics.imageHeight).toBeLessThanOrEqual(metrics.bodyHeight + 1);
      expect(metrics.imageWidth).toBeLessThanOrEqual(metrics.viewportWidth);
      expect(metrics.imageHeight).toBeLessThanOrEqual(metrics.viewportHeight);
      expect(metrics.dialogTop).toBeGreaterThanOrEqual(-1);
      expect(metrics.dialogLeft).toBeGreaterThanOrEqual(-1);
      expect(metrics.dialogRight).toBeLessThanOrEqual(metrics.viewportWidth + 1);
      expect(metrics.dialogBottom).toBeLessThanOrEqual(metrics.viewportHeight + 1);
      expect(metrics.closeWidth).toBeGreaterThan(0);
      expect(metrics.closeHeight).toBeGreaterThan(0);

      const renderedRatio = metrics.imageWidth / metrics.imageHeight;
      const naturalRatio = metrics.naturalWidth / metrics.naturalHeight;
      expect(
        Math.abs(renderedRatio - naturalRatio),
        `${label} image ratio should be preserved`,
      ).toBeLessThan(0.02);
    };

    await expect(dialog.locator('img')).toHaveAttribute('alt', /Pantalla de inicio/);
    await measure(`${viewport.name} portrait`);

    await dialog.locator('img').evaluate((image, source) => {
      const element = image as HTMLImageElement;
      element.removeAttribute('srcset');
      element.removeAttribute('sizes');
      element.width = 1600;
      element.height = 900;
      element.src = source;
    }, landscapeSource);
    await dialog.locator('img').evaluate(async (image) => {
      await (image as HTMLImageElement).decode();
    });

    await measure(`${viewport.name} landscape`);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  }
});
