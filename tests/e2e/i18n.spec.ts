import { expect, test } from '@playwright/test';

const routePairs = [
  { es: '/', en: '/en/', status: 200 },
  { es: '/work/', en: '/en/work/', status: 200 },
  { es: '/work/todo-mcp/', en: '/en/work/todo-mcp/', status: 200 },
  { es: '/about/', en: '/en/about/', status: 200 },
  { es: '/cv/', en: '/en/cv/', status: 200 },
  { es: '/colophon/', en: '/en/colophon/', status: 200 },
  { es: '/404', en: '/en/404', status: 404 },
];

test('every Spanish route has an English counterpart', async ({ page }) => {
  for (const pair of routePairs) {
    const spanishResponse = await page.goto(pair.es);
    expect(spanishResponse?.status()).toBe(pair.status);
    await expect(page.locator('.language-switcher')).toHaveAttribute('href', pair.en);

    const englishResponse = await page.goto(pair.en);
    expect(englishResponse?.status()).toBe(pair.status);
    await expect(page.locator('.language-switcher')).toHaveAttribute('href', pair.es);
  }
});

test('switching language on a project page preserves the project', async ({ page }) => {
  await page.goto('/work/todo-mcp/');

  await expect(page.locator('h1')).toHaveText('TODO-mcp');
  await page.getByRole('link', { name: 'Cambiar idioma a inglés' }).click();

  await expect(page).toHaveURL('/en/work/todo-mcp/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('main h1')).toHaveText('TODO-mcp');
});

test('language switching preserves the work category query', async ({ page }) => {
  await page.goto('/work/?category=ia');

  await expect(page.locator('.language-switcher')).toHaveAttribute(
    'href',
    '/en/work/?category=ia',
  );

  await page.locator('.language-switcher').click();
  await expect(page).toHaveURL('/en/work/?category=ia');
});

test('both locales expose reciprocal metadata and localized social fields', async ({ page }) => {
  for (const pair of routePairs) {
    await page.goto(pair.es);

    const spanishDescription = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    const spanishCanonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute('href');

    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
      'href',
      `https://example.com${pair.es}`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      `https://example.com${pair.en}`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      `https://example.com${pair.es}`,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      'content',
      'es_PE',
    );
    expect(spanishCanonical).toBe(`https://example.com${pair.es}`);
    expect(spanishDescription?.length).toBeGreaterThan(0);

    await page.goto(pair.en);

    const englishDescription = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    const englishCanonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute('href');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
      'href',
      `https://example.com${pair.es}`,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      `https://example.com${pair.en}`,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      'content',
      'en_US',
    );
    expect(englishCanonical).toBe(`https://example.com${pair.en}`);
    expect(englishDescription?.length).toBeGreaterThan(0);
    expect(englishDescription).not.toBe(spanishDescription);
  }
});

test('the English not-found page is localized and offers recovery links', async ({ page }) => {
  const response = await page.goto('/en/404');

  expect(response?.status()).toBe(404);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('main h1')).toHaveText('Page not found');
  await expect(page.getByRole('link', { name: 'Back home' })).toHaveAttribute('href', '/en/');
  await expect(page.getByRole('link', { name: 'View all work' })).toHaveAttribute(
    'href',
    '/en/work/',
  );
});
