import { expect, test } from '@playwright/test';

const locales = [
  { path: '/', locale: 'es', role: 'Desarrollador Full-Stack', workHref: '/work/' },
  { path: '/en/', locale: 'en', role: 'Full-Stack Developer', workHref: '/en/work/' },
] as const;

test('the home first screen presents the complete profile in both locales', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  for (const entry of locales) {
    await page.goto(entry.path);
    const intro = page.locator('.profile-intro');
    await expect(page.locator('main h1')).toHaveText('Walker Rómulo Alfaro Trelles');
    await expect(intro.getByText(entry.role, { exact: true })).toBeVisible();
    await expect(intro.locator('.profile-intro__value')).toBeVisible();
    await expect(intro.getByText(/React/)).toBeVisible();
    await expect(intro.getByText(/Lima/)).toBeVisible();
    await expect(intro.locator('.profile-intro__availability')).toBeVisible();
    await expect(intro.getByRole('link', { name: /work|trabajo/i })).toHaveAttribute('href', entry.workHref);
    await expect(intro.getByRole('link', { name: /view cv|ver cv/i })).toHaveAttribute(
      'href',
      'https://resume.walkeralfaro.com/',
    );

    const bottom = await intro.evaluate((element) => element.getBoundingClientRect().bottom);
    expect(bottom, `${entry.path} intro should fit in the first desktop viewport`).toBeLessThanOrEqual(900);
  }
});

test('the featured set contains exactly the four required projects with working details', async ({ page, request }) => {
  const expected = ['todo-mcp', 'image-prompt', 'url-shortener', 'tetris'];

  for (const entry of locales) {
    await page.goto(entry.path);
    const featured = page.locator('[data-featured-work]');
    const projects = featured.locator('[data-featured-project]');
    await expect(projects).toHaveCount(4);
    expect(await projects.evaluateAll((elements) => elements.map((element) => element.getAttribute('data-featured-project')))).toEqual(expected);

    for (const slug of expected) {
      const link = featured.locator(`[data-featured-project="${slug}"] a`);
      const href = entry.locale === 'es' ? `/work/${slug}/` : `/en/work/${slug}/`;
      await expect(link).toHaveAttribute('href', href);
      expect((await request.get(href)).status()).toBe(200);
    }
  }
});

test('the home excerpt count matches its eight rows and links to the catalog', async ({ page }) => {
  for (const entry of locales) {
    await page.goto(entry.path);
    const excerpt = page.locator('[data-home-index-excerpt]');
    const rows = excerpt.locator('[data-project-row]');
    await expect(rows).toHaveCount(8);
    await expect(excerpt).toHaveAttribute('data-excerpt-count', '8');
    await expect(excerpt.getByRole('link', { name: /explore all 14 projects|explorar los 14 proyectos/i })).toHaveAttribute('href', entry.workHref);
  }
});

test('each home capability links to project evidence', async ({ page, request }) => {
  const expected = ['todo-mcp', 'image-prompt', 'url-shortener', 'todo-mcp'];

  for (const entry of locales) {
    await page.goto(entry.path);
    const links = page.locator('[data-capability-grid] [data-capability-project]');
    await expect(links).toHaveCount(4);
    expect(await links.evaluateAll((elements) => elements.map((element) => element.getAttribute('data-capability-project')))).toEqual(expected);

    for (const link of await links.all()) {
      const href = await link.getAttribute('href');
      expect(href).not.toBeNull();
      expect((await request.get(href!)).status()).toBe(200);
    }
  }
});

test('the home trajectory has the three required eras in order', async ({ page }) => {
  for (const entry of locales) {
    await page.goto(entry.path);
    const eras = page.locator('[data-trajectory] li');
    await expect(eras).toHaveCount(3);
    expect(await eras.locator('.trajectory__dates').allTextContents()).toEqual([
      '2006–2019',
      '2023–2024',
      entry.locale === 'es' ? '2025–actualidad' : '2025–present',
    ]);
  }
});

test('about groups every skill in one tier and preserves the full role history', async ({ page }) => {
  for (const entry of locales) {
    await page.goto(entry.locale === 'es' ? '/about/' : '/en/about/');
    await expect(page.locator('main h1')).toBeVisible();

    const tiers = page.locator('[data-skill-tier]');
    await expect(tiers).toHaveCount(3);
    expect(await tiers.evaluateAll((elements) => elements.map((element) => element.getAttribute('data-skill-tier')))).toEqual([
      'daily',
      'production',
      'prior',
    ]);
    await expect(page.locator('[data-skill-tiers] img')).toHaveCount(0);

    const skills = await page.locator('[data-skill]').evaluateAll((elements) => elements.map((element) => element.getAttribute('data-skill')));
    expect(skills.length).toBeGreaterThan(0);
    expect(new Set(skills).size).toBe(skills.length);

    const experience = page.locator('[data-experience-count]');
    const expectedCount = Number(await experience.getAttribute('data-experience-count'));
    await expect(experience.locator('[data-experience-role]')).toHaveCount(expectedCount);
    expect(expectedCount).toBeGreaterThan(0);
  }
});

test('about exposes email, LinkedIn, GitHub, and CV without the phone number', async ({ page }) => {
  for (const entry of locales) {
    await page.goto(entry.locale === 'es' ? '/about/' : '/en/about/');
    const contact = page.locator('[data-contact-links]');
    const links = contact.locator('a');
    const hrefs = await links.evaluateAll((elements) => elements.map((element) => element.getAttribute('href')));

    expect(hrefs).toContain('mailto:walkeralfarotrelles@gmail.com');
    expect(hrefs).toContain('https://www.linkedin.com/in/walkeralfaro/');
    expect(hrefs).toContain('https://github.com/walkeralfaro');
    expect(hrefs).toContain('https://resume.walkeralfaro.com/');
    await expect(contact.locator('a[target="_blank"]')).toHaveCount(3);
    for (const link of await contact.locator('a[target="_blank"]').all()) {
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    await expect(contact).not.toContainText('+51');
    await expect(contact).not.toContainText('986');
  }
});
