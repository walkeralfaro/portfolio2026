import { expect, test, type Page } from '@playwright/test';

const projectOrder = [
  'TODO-mcp',
  'Image Prompt',
  'Cheatsheet Editor',
  'URL Shortener',
  'Multi-step Form',
  'Pokedex',
  'Todo App',
  'Tic Tac Toe',
  'Tip Calculator',
  'Weather App',
  'REST Countries Explorer',
  'Tetris',
  'Portfolio Profesional',
  'Portfolio 2026',
];

async function waitForCatalog(page: Page): Promise<void> {
  await page.waitForSelector('[data-catalog-ready="true"]');
}

async function activePreview(page: Page) {
  return page.locator('[data-preview-panel][data-active="true"]');
}

test('the catalog contains all 14 documented projects and no excluded work', async ({ page }) => {
  await page.goto('/work/');
  await waitForCatalog(page);

  await expect(page.locator('[data-project-row]')).toHaveCount(14);
  await expect(page.locator('[data-catalog-count]')).toHaveText('14');
  await expect(page.locator('[data-project-row] .project-row__title')).toHaveText(projectOrder);
  await expect(page.locator('main')).not.toContainText('Puja Inmobiliaria');

  const filterCounts = await page.locator('[data-filter]').evaluateAll((links) =>
    Object.fromEntries(
      links.map((link) => [
        link.getAttribute('data-filter'),
        Number(link.getAttribute('data-filter-count')),
      ]),
    ),
  );

  expect(filterCounts).toEqual({
    all: 14,
    ia: 2,
    producto: 4,
    frontend: 6,
    juegos: 2,
  });
});

test('every row exposes its metadata and the whole row is the navigation target', async ({
  page,
}) => {
  await page.goto('/work/');
  await waitForCatalog(page);

  const anatomy = await page.locator('[data-project-row]').evaluateAll((rows) =>
    rows.map((row) => {
      const link = row.querySelector<HTMLAnchorElement>('a.project-row__inner');
      const rowBox = row.getBoundingClientRect();

      return {
        title: row.querySelector('.project-row__title')?.textContent?.trim() ?? '',
        summary: row.querySelector('.project-row__summary')?.textContent?.trim() ?? '',
        year: row.querySelector('.project-row__meta .meta-label')?.textContent?.trim() ?? '',
        category: row.querySelector('.project-row__category')?.textContent?.trim() ?? '',
        status: row.querySelector('.status-badge')?.textContent?.trim() ?? '',
        stackItems: row.querySelectorAll('.stack-list__item').length,
        destination: row
          .querySelector('[data-row-destination]')
          ?.getAttribute('data-row-destination'),
        href: link?.getAttribute('href') ?? null,
        rowWidth: rowBox.width,
        linkWidth: link?.getBoundingClientRect().width ?? 0,
      };
    }),
  );

  for (const entry of anatomy) {
    expect(entry.title.length).toBeGreaterThan(0);
    expect(entry.summary.length).toBeGreaterThan(0);
    expect(entry.year.length).toBeGreaterThan(0);
    expect(entry.category.length).toBeGreaterThan(0);
    expect(entry.status.length).toBeGreaterThan(0);
    expect(entry.stackItems).toBeGreaterThanOrEqual(3);
    expect(entry.stackItems).toBeLessThanOrEqual(5);

    if (entry.destination === 'pending') {
      expect(entry.href).toBeNull();
    } else {
      expect(entry.href).not.toBeNull();
      expect(entry.href).not.toBe('#');
      expect(entry.linkWidth).toBeCloseTo(entry.rowWidth, 0);
    }
  }

  await expect(
    page.locator('[data-project="todo-mcp"] a.project-row__inner'),
  ).toHaveAttribute('href', '/work/todo-mcp/');
  await expect(
    page.locator('[data-project="portfolio-profesional"] a.project-row__inner'),
  ).toHaveAttribute('href', 'https://walkeralfaro.com/');
  await expect(page.locator('[data-project="weather-app"] a')).toHaveCount(0);
  await expect(page.locator('[data-project="rest-countries-explorer"] a')).toHaveCount(0);
});

test('the desktop catalog uses a stable 7/5 master-detail layout', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/work/');
  await waitForCatalog(page);

  const list = page.locator('.work-catalog__list-column');
  const preview = page.locator('[data-work-preview]');
  const initialList = await list.boundingBox();
  const initialPreview = await preview.boundingBox();

  expect(initialList).not.toBeNull();
  expect(initialPreview).not.toBeNull();
  expect(initialList!.x + initialList!.width).toBeLessThan(initialPreview!.x);
  expect(initialList!.width / initialPreview!.width).toBeGreaterThan(1.3);
  expect(initialList!.width / initialPreview!.width).toBeLessThan(1.5);
  expect(await preview.evaluate((element) => getComputedStyle(element).position)).toBe(
    'sticky',
  );

  await page.evaluate(() => window.scrollTo(0, 900));
  await expect
    .poll(async () => Math.round((await preview.boundingBox())!.y))
    .toBe(32);

  const scrolledList = await list.boundingBox();
  const scrolledPreview = await preview.boundingBox();

  expect(scrolledList).not.toBeNull();
  expect(scrolledPreview).not.toBeNull();
  expect(scrolledList!.x).toBeCloseTo(initialList!.x, 0);
  expect(scrolledList!.width).toBeCloseTo(initialList!.width, 0);
  expect(scrolledPreview!.x).toBeCloseTo(initialPreview!.x, 0);
});

test('pointer preview waits 90 ms and focus preview is immediate', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/work/');
  await waitForCatalog(page);

  const active = await activePreview(page);
  await expect(active).toHaveAttribute('data-project', 'todo-mcp');

  await page.evaluate(() => {
    const target = window as typeof window & {
      __catalogPreviewTimer?: { callback: () => void; delay: number };
    };
    const originalSetTimeout = window.setTimeout.bind(window);

    target.__catalogPreviewTimer = undefined;
    window.setTimeout = ((handler: TimerHandler, delay?: number, ...args: unknown[]) => {
      if (delay === 90 && typeof handler === 'function') {
        target.__catalogPreviewTimer = {
          callback: () => handler(...args),
          delay,
        };
        return 0;
      }

      return originalSetTimeout(handler, delay, ...args);
    }) as typeof window.setTimeout;
  });

  await page.locator('[data-project-row][data-project="image-prompt"]').hover();
  await expect(active).toHaveAttribute('data-project', 'todo-mcp');

  const captured = await page.evaluate(() => {
    const target = window as typeof window & {
      __catalogPreviewTimer?: { callback: () => void; delay: number };
    };

    return target.__catalogPreviewTimer
      ? { delay: target.__catalogPreviewTimer.delay }
      : null;
  });

  expect(captured?.delay).toBe(90);

  await page.evaluate(() => {
    const target = window as typeof window & {
      __catalogPreviewTimer?: { callback: () => void; delay: number };
    };

    target.__catalogPreviewTimer?.callback();
  });

  await expect(active).toHaveAttribute('data-project', 'image-prompt');
  await expect(active.locator('.work-preview__title')).toHaveText('Image Prompt');

  const tetrisLink = page.locator('[data-project-row][data-project="tetris"] a');
  await tetrisLink.focus();

  await expect(active).toHaveAttribute('data-project', 'tetris');
  await expect(tetrisLink).toBeFocused();
  expect(
    await tetrisLink.evaluate((element) => getComputedStyle(element).outlineWidth),
  ).toBe('3px');
});

test('filters use real counts, update ?c=, and restore from a shared URL', async ({ page }) => {
  await page.goto('/work/');
  await waitForCatalog(page);

  const cases = [
    { value: 'ia', count: 2 },
    { value: 'producto', count: 4 },
    { value: 'frontend', count: 6 },
    { value: 'juegos', count: 2 },
  ];

  for (const entry of cases) {
    await page.locator(`[data-filter="${entry.value}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/work/\\?c=${entry.value}$`));
    await expect(page.locator('.project-row:visible')).toHaveCount(entry.count);
    await expect(page.locator('[data-catalog-count]')).toHaveText(String(entry.count));
    await expect(page.locator('[data-filter][aria-current="page"]')).toHaveAttribute(
      'data-filter',
      entry.value,
    );

    const categories = await page
      .locator('.project-row:visible')
      .evaluateAll((rows) => rows.map((row) => row.getAttribute('data-category')));

    expect(categories).toEqual(Array(entry.count).fill(entry.value));

    await page.reload();
    await waitForCatalog(page);
    await expect(page.locator('.project-row:visible')).toHaveCount(entry.count);
    await expect(page.locator('[data-filter][aria-current="page"]')).toHaveAttribute(
      'data-filter',
      entry.value,
    );
  }

  await page.locator('[data-filter="all"]').click();
  await expect(page).toHaveURL(/\/work\/$/);
  await expect(page.locator('.project-row:visible')).toHaveCount(14);
  await expect(page.locator('[data-catalog-count]')).toHaveText('14');
  await expect(page.locator('[data-filter][aria-current="page"]')).toHaveAttribute(
    'data-filter',
    'all',
  );
});

test('an empty filter state explains the result and reset restores all projects', async ({
  page,
}) => {
  await page.goto('/work/?c=');
  await waitForCatalog(page);

  const emptyState = page.locator('[data-catalog-empty]');

  await expect(emptyState).toBeVisible();
  await expect(emptyState).toContainText('No hay proyectos en esta categoría.');
  await expect(page.locator('.project-row:visible')).toHaveCount(0);
  await expect(page.locator('[data-catalog-count]')).toHaveText('0');
  await expect(page.locator('[data-filter][aria-current="page"]')).toHaveCount(0);
  await expect(page.locator('[data-work-preview]')).toBeHidden();

  await emptyState.getByRole('link', { name: 'Limpiar filtro' }).click();

  await expect(page).toHaveURL(/\/work\/$/);
  await waitForCatalog(page);
  await expect(page.locator('.project-row:visible')).toHaveCount(14);
  await expect(page.locator('[data-catalog-count]')).toHaveText('14');
  await expect(emptyState).toBeHidden();

  await page.goto('/work/?c=desconocida');
  await waitForCatalog(page);
  await expect(emptyState).toBeVisible();
  await expect(page.locator('.project-row:visible')).toHaveCount(0);
});

test('the mobile catalog is a single-column thumbnail list without a preview pane', async ({
  page,
}) => {
  for (const width of [375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/');
    await waitForCatalog(page);

    await expect(page.locator('[data-work-preview]')).toBeHidden();
    await expect(page.locator('.project-row:visible')).toHaveCount(14);
    await expect(page.locator('.project-row__thumb')).toHaveCount(14);
    await expect(page.locator('.project-row__thumb').first()).toBeVisible();

    const boxes = await page.locator('.project-row:visible').evaluateAll((rows) =>
      rows.map((row) => {
        const box = row.getBoundingClientRect();
        return { x: Math.round(box.x), width: Math.round(box.width), y: box.y };
      }),
    );

    expect(new Set(boxes.map((box) => box.x)).size).toBe(1);
    expect(new Set(boxes.map((box) => box.width)).size).toBe(1);
    expect(boxes.at(-1)!.y).toBeGreaterThan(boxes[0].y);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
});

test('project rows inset their content on a full-width navigation surface', async ({ page }) => {
  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/');
    await waitForCatalog(page);

    const rows = await page.locator('[data-project-row]').evaluateAll((elements) =>
      elements.map((row) => {
        const inner = row.querySelector<HTMLElement>('.project-row__inner');
        const title = row.querySelector<HTMLElement>('.project-row__title');
        const thumb = row.querySelector<HTMLElement>('.project-row__thumb');

        if (!inner || !title) {
          throw new Error('Project row is missing its inner surface or title');
        }

        const rowBox = row.getBoundingClientRect();
        const innerBox = inner.getBoundingClientRect();
        const lead = thumb && getComputedStyle(thumb).display !== 'none' ? thumb : title;
        const leadBox = lead.getBoundingClientRect();
        const innerStyle = getComputedStyle(inner);

        return {
          rowX: rowBox.x,
          rowWidth: rowBox.width,
          innerX: innerBox.x,
          innerWidth: innerBox.width,
          contentInset: leadBox.x - rowBox.x,
          paddingStart: Number.parseFloat(innerStyle.paddingInlineStart),
          paddingEnd: Number.parseFloat(innerStyle.paddingInlineEnd),
        };
      }),
    );

    expect(rows).toHaveLength(14);

    for (const entry of rows) {
      expect(entry.innerX).toBeCloseTo(entry.rowX, 0);
      expect(entry.innerWidth).toBeCloseTo(entry.rowWidth, 0);
      expect(entry.contentInset).toBeGreaterThanOrEqual(12);
      expect(entry.paddingStart).toBeGreaterThanOrEqual(12);
      expect(entry.paddingEnd).toBeGreaterThanOrEqual(12);
    }

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
});

test('without JavaScript all 14 projects remain visible and navigable', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: 'http://localhost:4321',
  });
  const page = await context.newPage();

  await page.goto('/work/');

  await expect(page.locator('.project-row')).toHaveCount(14);
  await expect(page.locator('.project-row:visible')).toHaveCount(14);

  const hrefs = await page.locator('.project-row a.project-row__inner').evaluateAll((links) =>
    links.map((link) => link.getAttribute('href') ?? ''),
  );

  expect(hrefs).toContain('/work/todo-mcp/');
  expect(hrefs).toContain('https://walkeralfaro.com/');
  expect(hrefs).not.toContain('#');

  await page.locator('[data-project-row][data-project="todo-mcp"] a.project-row__inner').click();
  await expect(page).toHaveURL(/\/work\/todo-mcp\/$/);

  await context.close();
});

test('project actions only render real destinations and state pending availability', async ({
  page,
}) => {
  await page.goto('/work/');
  await waitForCatalog(page);

  const actionsFor = (slug: string) =>
    page.locator(`[data-preview-panel][data-project="${slug}"] [data-project-actions]`);

  const todo = actionsFor('todo-mcp');
  await expect(todo).toHaveAttribute('data-has-live', 'false');
  await expect(todo).toHaveAttribute('data-has-code', 'true');
  await expect(todo.locator('a')).toHaveCount(1);
  await expect(todo.locator('a')).toHaveAttribute(
    'href',
    'https://github.com/walkeralfaro/todo-mcp-dual',
  );
  await expect(todo.locator('button, a[href="#"]')).toHaveCount(0);
  await expect(todo).toContainText('Demo pública pendiente');

  const urlShortener = actionsFor('url-shortener');
  await expect(urlShortener).toHaveAttribute('data-has-live', 'true');
  await expect(urlShortener).toHaveAttribute('data-has-code', 'true');
  await expect(urlShortener.locator('a')).toHaveCount(2);

  const portfolio = actionsFor('portfolio-profesional');
  await expect(portfolio).toHaveAttribute('data-has-live', 'true');
  await expect(portfolio).toHaveAttribute('data-has-code', 'false');
  await expect(portfolio.locator('a')).toHaveCount(1);
  await expect(portfolio).toContainText('Código público pendiente');

  const weather = actionsFor('weather-app');
  await expect(weather).toHaveAttribute('data-has-live', 'false');
  await expect(weather).toHaveAttribute('data-has-code', 'false');
  await expect(weather.locator('a, button')).toHaveCount(0);
  await expect(weather).toContainText('Demo y código pendientes');

  await expect(page.locator('a[href="#"]')).toHaveCount(0);
  await expect(page.locator('button:disabled')).toHaveCount(0);
});

test('the preview defers the cover of an inactive panel until the panel is shown', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  const requested: string[] = [];

  page.on('request', (request) => {
    if (request.url().includes('todo-app')) {
      requested.push(request.url());
    }
  });

  await page.goto('/work/');
  await waitForCatalog(page);

  const panel = page.locator('[data-preview-panel][data-project="todo-app"]');

  await expect(panel).toHaveAttribute('data-active', 'false');
  await expect(panel.locator('img')).toHaveCount(0);
  expect(
    await panel
      .locator('template[data-cover-template]')
      .evaluate((template) => (template as HTMLTemplateElement).content.querySelectorAll('img').length),
  ).toBe(1);
  expect(requested).toHaveLength(0);

  await page.locator('[data-project-row][data-project="todo-app"]').hover();

  const active = page.locator('[data-preview-panel][data-active="true"]');
  await expect(active).toHaveAttribute('data-project', 'todo-app');
  await expect(active.locator('[data-cover-target] img')).toHaveCount(1);
  await expect(active.locator('[data-cover-target]')).toHaveAttribute(
    'data-cover-loaded',
    'true',
  );
  await expect.poll(() => requested.length).toBeGreaterThan(0);
});

test('a project without a cover keeps the designed placeholder', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/work/');
  await waitForCatalog(page);

  const panel = page.locator('[data-preview-panel][data-project="todo-mcp"]');

  await expect(panel.locator('.placeholder-cover')).toHaveCount(1);
  await expect(panel.locator('img')).toHaveCount(0);
});

test('the mobile catalog renders the cover of a project that has one', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/work/');
  await waitForCatalog(page);

  const thumb = page.locator('[data-project-row][data-project="todo-app"] .project-row__thumb');

  await expect(thumb).toBeVisible();
  await expect(thumb.locator('img')).toHaveCount(1);
  await expect(thumb.locator('img')).toHaveAttribute('src', /todo-app/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

test('the English catalog mirrors the inventory, filters, and metadata', async ({ page }) => {
  await page.goto('/en/work/');
  await waitForCatalog(page);

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('[data-project-row]')).toHaveCount(14);
  await expect(page.locator('[data-catalog-count]')).toHaveText('14');
  await expect(page.locator('[data-catalog-count-wrap]')).toContainText('projects');
  await expect(page.locator('[data-filter="all"]')).toContainText('All');
  await expect(page.locator('[data-filter="ia"]')).toContainText('AI & agents');
  await expect(page.locator('[data-project="todo-mcp"] .project-row__summary')).toContainText(
    'Task app with a Next.js interface',
  );

  await page.locator('[data-filter="ia"]').click();
  await expect(page).toHaveURL(/\/en\/work\/\?c=ia$/);
  await expect(page.locator('.project-row:visible')).toHaveCount(2);
  await expect(page.locator('[data-catalog-count]')).toHaveText('2');
  await expect(page.locator('main')).not.toContainText('Puja Inmobiliaria');
});
