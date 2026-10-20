import { expect, test } from '@playwright/test';

test('the home page renders the configured profile name', async ({ page }) => {
  await page.goto('/');

  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText(/\S+/);
});

test('local fonts load without external requests or a visible layout shift', async ({ page }) => {
  const fontRequests: string[] = [];

  page.on('request', (request) => {
    if (request.resourceType() === 'font') fontRequests.push(request.url());
  });
  await page.route('**/fonts/*.woff2', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    await route.continue();
  });
  await page.addInitScript(() => {
    let totalLayoutShift = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!shift.hadRecentInput) totalLayoutShift += shift.value;
      }
      document.documentElement.dataset.layoutShift = String(totalLayoutShift);
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto('/');
  await page.evaluate(async () => {
    await Promise.all([
      document.fonts.load('400 16px Archivo'),
      document.fonts.load('400 16px "Source Serif 4"'),
    ]);
  });

  expect(fontRequests.length).toBeGreaterThan(0);
  expect(fontRequests.every((url) => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
  expect(Number(await page.locator('html').getAttribute('data-layout-shift') ?? 0)).toBeLessThanOrEqual(0.01);
});

test('light and dark design tokens resolve in the browser', async ({ page }) => {
  await page.goto('/');

  const lightPaper = await page.locator('body').evaluate((body) => getComputedStyle(body).backgroundColor);
  await page.locator('html').evaluate((html) => html.setAttribute('data-theme', 'dark'));
  const darkPaper = await page.locator('body').evaluate((body) => getComputedStyle(body).backgroundColor);

  expect(lightPaper).toBe('rgb(242, 244, 241)');
  expect(darkPaper).toBe('rgb(14, 17, 16)');
});
