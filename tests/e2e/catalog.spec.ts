import { expect, test, type Page } from '@playwright/test';
import {
  categoryCounts,
  firstProjectWithCover,
  firstProjectWithoutCover,
  hasProjects,
  projects,
} from './projects';

async function waitForCatalog(page: Page): Promise<void> {
  await page.waitForSelector('[data-catalog-ready="true"]');
}

async function activePreview(page: Page) {
  return page.locator('[data-preview-panel][data-active="true"]');
}

test('the catalog renders the project folders and computed category counts', async ({ page }) => {
  test.skip(!hasProjects, 'No project content.yaml files have been authored yet.');
  await page.goto('/work/');
  await waitForCatalog(page);

  await expect(page.locator('[data-project-row]')).toHaveCount(projects.length);
  await expect(page.locator('[data-catalog-count]')).toHaveText(String(projects.length));
  await expect(page.locator('[data-project-row] .project-row__title')).toHaveText(
    projects.map((project) => project.title),
  );
  await expect(page.locator('main')).not.toContainText('Puja Inmobiliaria');
  expect(await page.locator('[data-filter="all"]').getAttribute('data-filter-count')).toBe(
    String(categoryCounts.all),
  );
  for (const category of ['ia', 'producto', 'frontend', 'juegos'] as const) {
    await expect(page.locator(`[data-filter="${category}"]`)).toHaveAttribute(
      'data-filter-count',
      String(categoryCounts[category]),
    );
  }
});

test('an empty catalog remains usable before project content is authored', async ({ page }) => {
  test.skip(hasProjects, 'This test only applies while project content is empty.');
  await page.goto('/work/');
  await expect(page.locator('[data-project-row]')).toHaveCount(0);
  await expect(page.locator('[data-catalog-count]')).toHaveText('0');
});

test('every row exposes its metadata and the whole row is the navigation target', async ({
  page,
}) => {
  test.skip(!hasProjects, 'No project content.yaml files have been authored yet.');
  await page.goto('/work/');
  await waitForCatalog(page);

  const anatomy = await page.locator('[data-project-row]').evaluateAll((rows) =>
    rows.map((row) => {
      const link = row.querySelector<HTMLAnchorElement>('a.project-row__inner');
      const rowBox = row.getBoundingClientRect();

      return {
        title: row.querySelector('.project-row__title')?.textContent?.trim() ?? '',
        summary: row.querySelector('.project-row__summary')?.textContent?.trim() ?? '',
        date: row.querySelector('.project-row__meta .meta-label')?.textContent?.trim() ?? '',
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
    expect(entry.date.length).toBeGreaterThan(0);
    expect(entry.category.length).toBeGreaterThan(0);
    expect(entry.status.length).toBeGreaterThan(0);
    expect(entry.stackItems).toBeGreaterThanOrEqual(3);
    expect(entry.stackItems).toBeLessThanOrEqual(5);

    expect(entry.destination).toBe('internal');
    expect(entry.href).toMatch(/^\/work\/[a-z0-9-]+\/$/);
    expect(entry.href).not.toBe('#');
    expect(entry.linkWidth).toBeCloseTo(entry.rowWidth, 0);
  }

  for (const project of projects) {
    await expect(page.locator(`[data-project="${project.slug}"] a.project-row__inner`)).toHaveAttribute(
      'href',
      `/work/${project.slug}/`,
    );
  }
});

test('the desktop catalog uses a stable 7/5 master-detail layout', async ({ page }) => {
  test.skip(!hasProjects, 'No project content.yaml files have been authored yet.');
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
  test.skip(projects.length < 2, 'At least two projects are needed for preview switching.');
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/work/');
  await waitForCatalog(page);

  const active = await activePreview(page);
  await expect(active).toHaveAttribute('data-project', projects[0].slug);

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

  await page.locator(`[data-project-row][data-project="${projects[1].slug}"]`).hover();
  await expect(active).toHaveAttribute('data-project', projects[0].slug);

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

  await expect(active).toHaveAttribute('data-project', projects[1].slug);
  await expect(active.locator('.work-preview__title')).toHaveText(projects[1].title);

  const lastProjectLink = page.locator(`[data-project-row][data-project="${projects.at(-1)!.slug}"] a`);
  await lastProjectLink.focus();

  await expect(active).toHaveAttribute('data-project', projects.at(-1)!.slug);
  await expect(lastProjectLink).toBeFocused();
  expect(
    await lastProjectLink.evaluate((element) => getComputedStyle(element).outlineWidth),
  ).toBe('3px');
});

test('filters use real counts, update ?c=, and restore from a shared URL', async ({ page }) => {
  test.skip(!hasProjects, 'No project content.yaml files have been authored yet.');
  await page.goto('/work/');
  await waitForCatalog(page);

  const cases = (['ia', 'producto', 'frontend', 'juegos'] as const)
    .map((value) => ({ value, count: categoryCounts[value] }))
    .filter((entry) => entry.count > 0);

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
  await expect(page.locator('.project-row:visible')).toHaveCount(projects.length);
  await expect(page.locator('[data-catalog-count]')).toHaveText(String(projects.length));
  await expect(page.locator('[data-filter][aria-current="page"]')).toHaveAttribute(
    'data-filter',
    'all',
  );
});

test('an empty filter state explains the result and reset restores all projects', async ({
  page,
}) => {
  test.skip(!hasProjects, 'No project content.yaml files have been authored yet.');
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
  await expect(page.locator('.project-row:visible')).toHaveCount(projects.length);
  await expect(page.locator('[data-catalog-count]')).toHaveText(String(projects.length));
  await expect(emptyState).toBeHidden();

  await page.goto('/work/?c=desconocida');
  await waitForCatalog(page);
  await expect(emptyState).toBeVisible();
  await expect(page.locator('.project-row:visible')).toHaveCount(0);
});

test('the mobile catalog stacks each cover above its content without a preview pane', async ({
  page,
}) => {
  test.skip(!hasProjects, 'No project content.yaml files have been authored yet.');
  for (const width of [375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/');
    await waitForCatalog(page);

    await expect(page.locator('[data-work-preview]')).toBeHidden();
    await expect(page.locator('.project-row:visible')).toHaveCount(projects.length);
    await expect(page.locator('.project-row__thumb')).toHaveCount(projects.length);
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

    const stacking = await page.locator('.project-row:visible').evaluateAll((rows) =>
      rows.map((row) => {
        const inner = row.querySelector<HTMLElement>('.project-row__inner');
        const thumb = row.querySelector<HTMLElement>('.project-row__thumb');
        const content = row.querySelector<HTMLElement>('.project-row__content');

        if (!inner || !thumb || !content) {
          throw new Error('Project row is missing its inner surface, thumb, or content');
        }

        const innerBox = inner.getBoundingClientRect();
        const innerStyle = getComputedStyle(inner);

        return {
          thumbBottom: thumb.getBoundingClientRect().bottom,
          contentTop: content.getBoundingClientRect().top,
          thumbWidth: thumb.getBoundingClientRect().width,
          contentWidth:
            innerBox.width -
            Number.parseFloat(innerStyle.paddingInlineStart) -
            Number.parseFloat(innerStyle.paddingInlineEnd),
        };
      }),
    );

    for (const entry of stacking) {
      expect(entry.thumbBottom).toBeLessThanOrEqual(entry.contentTop);
      expect(entry.thumbWidth).toBeCloseTo(entry.contentWidth, 0);
    }

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
});

test('project rows inset their content on a full-width navigation surface', async ({ page }) => {
  test.skip(!hasProjects, 'No project content.yaml files have been authored yet.');
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

    expect(rows).toHaveLength(projects.length);

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

test('without JavaScript all authored projects remain visible and navigable', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: 'http://localhost:4321',
  });
  const page = await context.newPage();

  await page.goto('/work/');

  await expect(page.locator('.project-row')).toHaveCount(projects.length);
  await expect(page.locator('.project-row:visible')).toHaveCount(projects.length);

  const hrefs = await page.locator('.project-row a.project-row__inner').evaluateAll((links) =>
    links.map((link) => link.getAttribute('href') ?? ''),
  );

  expect(hrefs).toEqual(projects.map((project) => `/work/${project.slug}/`));
  expect(hrefs.every((href) => href.startsWith('/work/'))).toBe(true);
  expect(hrefs).not.toContain('#');

  if (projects.length > 0) {
    await page.locator(`[data-project-row][data-project="${projects[0].slug}"] a.project-row__inner`).click();
    await expect(page).toHaveURL(new RegExp(`/work/${projects[0].slug}/$`));
  }

  await context.close();
});

test('project actions only render real destinations and state pending availability', async ({
  page,
}) => {
  test.skip(!hasProjects, 'No project content.yaml files have been authored yet.');
  await page.goto('/work/');
  await waitForCatalog(page);

  for (const project of projects) {
    const actions = page.locator(`[data-preview-panel][data-project="${project.slug}"] [data-project-actions]`);
    await expect(actions).toHaveAttribute('data-has-live', String(Boolean(project.links.live)));
    await expect(actions).toHaveAttribute('data-has-code', String(Boolean(project.links.code)));
    await expect(actions.locator('a')).toHaveCount(
      Number(Boolean(project.links.live)) + Number(Boolean(project.links.code)),
    );
  }

  await expect(page.locator('a[href="#"]')).toHaveCount(0);
  await expect(page.locator('button:disabled')).toHaveCount(0);
});

test('the preview defers the cover of an inactive panel until the panel is shown', async ({
  page,
}) => {
  test.skip(!firstProjectWithCover(), 'No project cover has been authored yet.');
  await page.setViewportSize({ width: 1280, height: 900 });

  const requested: string[] = [];

  page.on('request', (request) => {
    if (request.url().includes(firstProjectWithCover()!.slug)) {
      requested.push(request.url());
    }
  });

  await page.goto('/work/');
  await waitForCatalog(page);

  const project = firstProjectWithCover()!;
  const panel = page.locator(`[data-preview-panel][data-project="${project.slug}"]`);

  await expect(panel).toHaveAttribute('data-active', 'false');
  await expect(panel.locator('img')).toHaveCount(0);
  expect(
    await panel
      .locator('template[data-cover-template]')
      .evaluate((template) => (template as HTMLTemplateElement).content.querySelectorAll('img').length),
  ).toBe(1);
  expect(requested).toHaveLength(0);

  await page.locator(`[data-project-row][data-project="${project.slug}"]`).hover();

  const active = page.locator('[data-preview-panel][data-active="true"]');
  await expect(active).toHaveAttribute('data-project', project.slug);
  await expect(active.locator('[data-cover-target] img')).toHaveCount(1);
  await expect(active.locator('[data-cover-target]')).toHaveAttribute(
    'data-cover-loaded',
    'true',
  );
  await expect.poll(() => requested.length).toBeGreaterThan(0);
});

test('a project without a cover keeps the designed placeholder', async ({ page }) => {
  test.skip(!firstProjectWithoutCover(), 'All authored projects have covers.');
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/work/');
  await waitForCatalog(page);

  const project = firstProjectWithoutCover()!;
  const panel = page.locator(`[data-preview-panel][data-project="${project.slug}"]`);

  await expect(panel.locator('.placeholder-cover')).toHaveCount(1);
  await expect(panel.locator('img')).toHaveCount(0);
});

test('the mobile catalog renders the cover of a project that has one', async ({ page }) => {
  test.skip(!firstProjectWithCover(), 'No project cover has been authored yet.');
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/work/');
  await waitForCatalog(page);

  const project = firstProjectWithCover()!;
  const thumb = page.locator(`[data-project-row][data-project="${project.slug}"] .project-row__thumb`);

  await expect(thumb).toBeVisible();
  await expect(thumb.locator('img')).toHaveCount(1);
  await expect(thumb.locator('img')).toHaveAttribute('src', new RegExp(project.slug));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

test('the English catalog mirrors the inventory, filters, and metadata', async ({ page }) => {
  test.skip(!hasProjects, 'No project content.yaml files have been authored yet.');
  await page.goto('/en/work/');
  await waitForCatalog(page);

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('[data-project-row]')).toHaveCount(projects.length);
  await expect(page.locator('[data-catalog-count]')).toHaveText(String(projects.length));
  await expect(page.locator('[data-catalog-count-wrap]')).toContainText('projects');
  await expect(page.locator('[data-filter="all"]')).toContainText('All');
  await expect(page.locator('[data-filter="ia"]')).toContainText('AI & agents');
  await expect(page.locator(`[data-project="${projects[0].slug}"] .project-row__summary`)).toHaveText(
    projects[0].summary.en,
  );

  const category = (['ia', 'producto', 'frontend', 'juegos'] as const).find(
    (value) => categoryCounts[value] > 0,
  );
  if (!category) return;
  await page.locator(`[data-filter="${category}"]`).click();
  await expect(page).toHaveURL(new RegExp(`/en/work/\\?c=${category}$`));
  await expect(page.locator('.project-row:visible')).toHaveCount(categoryCounts[category]);
  await expect(page.locator('[data-catalog-count]')).toHaveText(String(categoryCounts[category]));
  await expect(page.locator('main')).not.toContainText('Puja Inmobiliaria');
});
