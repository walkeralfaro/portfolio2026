import { expect, test } from '@playwright/test';

const shellRoutes = [
  '/',
  '/en/',
  '/work/',
  '/en/work/',
  '/work/todo-mcp/',
  '/en/work/todo-mcp/',
  '/about/',
  '/en/about/',
  '/colophon/',
  '/en/colophon/',
  '/404',
  '/en/404',
];

test('the skip link moves keyboard focus to the main landmark', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.skip-link')).toHaveCount(1);

  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator('#main')).toBeFocused();
});

test('the desktop header exposes navigation, theme, and language controls', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  const header = page.locator('header');
  await expect(header.getByRole('navigation', { name: 'Navegación principal' })).toBeVisible();
  await expect(header.getByRole('link', { name: 'Trabajo' })).toHaveAttribute('href', '/work/');
  await expect(header.getByRole('link', { name: 'Sobre mí' })).toHaveAttribute('href', '/about/');
  await expect(header.getByRole('link', { name: 'CV' })).toHaveAttribute(
    'href',
    'https://resume.walkeralfaro.com/',
  );
  await expect(header.getByRole('group', { name: 'Tema' })).toBeVisible();
  await expect(header.getByRole('link', { name: /English — Cambiar idioma a inglés/ })).toBeVisible();
  await expect(header.locator('.site-menu__toggle')).toBeHidden();
});

test('clicking outside the desktop header keeps the navigation visible', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');

  const header = page.locator('header');
  const navigation = header.getByRole('navigation', { name: 'Navegación principal' });

  await expect(navigation).toBeVisible();

  await page.locator('#main h1').click();

  await expect(navigation).toBeVisible();
  await expect(header.getByRole('group', { name: 'Tema' })).toBeVisible();
  await expect(header.locator('.language-switcher')).toBeVisible();

  await header.getByRole('link', { name: 'Trabajo' }).focus();
  await page.keyboard.press('Escape');

  await expect(navigation).toBeVisible();
  await expect(header.locator('.site-menu__toggle')).toBeHidden();
});

test('the mobile menu is keyboard operable and fits at 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/');

  const toggle = page.locator('.site-menu__toggle');
  const navigation = page.getByRole('navigation', { name: 'Navegación principal' });

  const openIcon = toggle.locator('.site-menu__icon--open');
  const closeIcon = toggle.locator('.site-menu__icon--close');

  await expect(toggle).toBeVisible();
  await expect(navigation).toBeHidden();
  await expect(openIcon).toBeVisible();
  await expect(closeIcon).toBeHidden();

  await toggle.focus();
  await page.keyboard.press('Enter');

  await expect(navigation).toBeVisible();
  await expect(openIcon).toBeHidden();
  await expect(closeIcon).toBeVisible();
  await expect(page.getByRole('group', { name: 'Tema' })).toBeVisible();
  await expect(page.getByRole('link', { name: /English — Cambiar idioma a inglés/ })).toBeVisible();

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);

  await page.keyboard.press('Escape');
  await expect(navigation).toBeHidden();
  await expect(openIcon).toBeVisible();
  await expect(closeIcon).toBeHidden();
  await expect(toggle).toBeFocused();
});

test('the shell switches theme and language from the header', async ({ page }) => {
  await page.goto('/about/');

  await page.getByText('Oscuro', { exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.locator('header .language-switcher').click();
  await expect(page).toHaveURL('/en/about/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('the footer exposes contact and CV links without the phone number', async ({
  page,
  request,
}) => {
  await page.goto('/');

  const footer = page.locator('footer');
  const links = footer.locator('a');
  const hrefs = await links.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute('href') ?? ''),
  );

  expect(hrefs).toContain('mailto:walkeralfarotrelles@gmail.com');
  expect(hrefs).toContain('https://www.linkedin.com/in/walkeralfaro/');
  expect(hrefs).toContain('https://github.com/walkeralfaro');
  expect(hrefs).toContain('https://resume.walkeralfaro.com/');
  expect(hrefs).toContain('/colophon/');
  expect(hrefs).not.toContain('#');
  await expect(footer).not.toContainText('+51');
  await expect(footer).not.toContainText('986');

  for (const href of hrefs.filter((value) => value.startsWith('/'))) {
    const response = await request.get(href);
    expect(response.status(), `${href} should resolve`).toBeLessThan(400);
  }
});

test('the home page exposes one parseable Person record in both locales', async ({ page }) => {
  for (const [path, jobTitle] of [
    ['/', 'Desarrollador Full-Stack'],
    ['/en/', 'Full-Stack Developer'],
  ]) {
    await page.goto(path);

    const scripts = page.locator('script[type="application/ld+json"]');
    await expect(scripts).toHaveCount(1);

    const data = JSON.parse((await scripts.textContent()) ?? '{}') as {
      '@type': string;
      name: string;
      jobTitle: string;
      address: { addressLocality: string };
      sameAs: string[];
    };

    expect(data['@type']).toBe('Person');
    expect(data.name).toBe('Walker Rómulo Alfaro Trelles');
    expect(data.jobTitle).toBe(jobTitle);
    expect(data.address.addressLocality.length).toBeGreaterThan(0);
    expect(data.sameAs).toHaveLength(2);
  }
});

test('every page has one complete set of localized social metadata tags', async ({ page }) => {
  const singletonTags = [
    'title',
    'meta[name="description"]',
    'link[rel="canonical"]',
    'link[rel="alternate"][hreflang="es"]',
    'link[rel="alternate"][hreflang="en"]',
    'link[rel="alternate"][hreflang="x-default"]',
    'meta[property="og:type"]',
    'meta[property="og:site_name"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:url"]',
    'meta[property="og:locale"]',
    'meta[property="og:locale:alternate"]',
    'meta[name="twitter:card"]',
    'meta[property="og:image"]',
    'meta[property="og:image:alt"]',
    'meta[name="twitter:image"]',
    'meta[name="twitter:image:alt"]',
    'meta[name="twitter:title"]',
    'meta[name="twitter:description"]',
  ];

  for (const path of shellRoutes) {
    await page.goto(path);

    for (const selector of singletonTags) {
      await expect(page.locator(selector), `${path} ${selector}`).toHaveCount(1);
    }

    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('main h1'), `${path} should render one H1`).toHaveCount(1);

    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://walkeralfaro.com/og/default.png',
    );
    expect((await page.locator('title').textContent())?.trim().length).toBeGreaterThan(0);
    expect(
      (await page.locator('meta[name="description"]').getAttribute('content'))?.trim().length,
    ).toBeGreaterThan(0);
  }
});

test('unknown routes return the localized not-found page with recovery actions', async ({
  page,
}) => {
  const spanishResponse = await page.goto('/ruta-inexistente');
  expect(spanishResponse?.status()).toBe(404);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('main h1')).toHaveText('Página no encontrada');
  await expect(page.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute(
    'href',
    '/',
  );

  const englishResponse = await page.goto('/en/missing-route');
  expect(englishResponse?.status()).toBe(404);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('main h1')).toHaveText('Page not found');
  await expect(page.getByRole('link', { name: 'Back home' })).toHaveAttribute('href', '/en/');
});

test('the shell has no horizontal overflow at 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });

  for (const path of shellRoutes) {
    await page.goto(path);

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
      `${path} should fit at 320 px`,
    ).toBe(true);
  }
});
