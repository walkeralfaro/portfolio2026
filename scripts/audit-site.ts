import { readdirSync, statSync } from 'node:fs';
import type { Server } from 'node:http';
import { join, relative } from 'node:path';
import { chromium } from 'playwright';
import { startStaticServer } from './lib/static-server.ts';

const PORT = 4323;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const DIST = 'dist';

type Finding = { kind: string; message: string };

function walk(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function routeForFile(file: string): string {
  const path = relative(DIST, file).replaceAll('\\', '/');
  if (path === 'index.html') return '/';
  if (path === '404.html') return '/404';
  if (path.endsWith('/index.html')) return `/${path.slice(0, -'index.html'.length)}`;
  return `/${path}`;
}

function pageRoutes(): string[] {
  return walk(DIST)
    .filter((file) => file.endsWith('.html'))
    .map(routeForFile)
    .sort();
}

function tags(html: string, name: string): string[] {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...html.matchAll(new RegExp(`<${escaped}\\b[^>]*>`, 'gi'))].map(
    (match) => match[0],
  );
}

function attribute(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`, 'i'));
  return match?.[1] ?? null;
}

function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const findings: Finding[] = [];
const routes = pageRoutes();
const internalLinks = new Set<string>();

let server: Server | undefined;

try {
  server = await startStaticServer('dist', PORT);

  const pages = new Map<string, string>();

  for (const route of routes) {
    const response = await fetch(`${ORIGIN}${route}`);
    const html = await response.text();
    pages.set(route, html);

    if (response.status >= 400 && route !== '/404') {
      findings.push({ kind: 'page-status', message: `${route} returned ${response.status}` });
    }

    for (const tag of tags(html, 'a')) {
      const href = attribute(tag, 'href');
      if (!href || href.startsWith('#') || /^(mailto|tel):/.test(href)) continue;
      const url = new URL(href, `${ORIGIN}${route}`);
      if (url.origin === ORIGIN) internalLinks.add(`${url.pathname}${url.search}`);
    }

    for (const tag of ['img', 'script', 'link']) {
      for (const element of tags(html, tag)) {
        const source = attribute(element, 'src') ?? attribute(element, 'href');
        if (!source) continue;
        if (/^(https?:|data:|mailto:)/.test(source)) continue;
        internalLinks.add(source);
      }
    }
  }

  for (const link of [...internalLinks].sort()) {
    const response = await fetch(`${ORIGIN}${link}`);
    if (response.status >= 400) {
      findings.push({ kind: 'broken-link', message: `${link} returned ${response.status}` });
    }
  }

  const metadataSelectors = [
    'link[rel="canonical"]',
    'link[rel="alternate"][hreflang="es"]',
    'link[rel="alternate"][hreflang="en"]',
    'link[rel="alternate"][hreflang="x-default"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:url"]',
    'meta[property="og:locale"]',
    'meta[property="og:image"]',
    'meta[property="og:image:alt"]',
    'meta[name="twitter:card"]',
    'meta[name="twitter:image"]',
  ];

  for (const [route, html] of pages) {
    for (const selector of metadataSelectors) {
      const [, tagName, attrs] = selector.match(/^(\w+)\[(.+)\]$/) ?? [];
      if (!tagName || !attrs) continue;
      const pairs = [...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map((match) => [
        match[1],
        match[2],
      ]);
      const count = tags(html, tagName).filter((tag) =>
        pairs.every(([name, value]) => attribute(tag, name) === value),
      ).length;

      if (count !== 1) {
        findings.push({
          kind: 'metadata',
          message: `${route} has ${count} occurrences of ${selector}`,
        });
      }
    }

    for (const tag of tags(html, 'meta')) {
      if (attribute(tag, 'property') === 'og:image') {
        const source = attribute(tag, 'content');
        if (source?.startsWith(ORIGIN)) {
          internalLinks.add(new URL(source).pathname);
        }
      }
    }

    const text = visibleText(html).toLowerCase();

    if (text.includes('puja')) {
      findings.push({ kind: 'copy', message: `${route} mentions excluded client work` });
    }

    if (/\+51|\b986[\s-]?640[\s-]?912\b/.test(text)) {
      findings.push({ kind: 'copy', message: `${route} exposes the mobile phone number` });
    }

    for (const marker of ['lorem ipsum', 'undefined', 'tbd']) {
      if (text.includes(marker)) {
        findings.push({ kind: 'copy', message: `${route} contains placeholder text "${marker}"` });
      }
    }

    if (/\bnan\b/.test(text)) {
      findings.push({ kind: 'copy', message: `${route} contains placeholder text "nan"` });
    }

    const isEnglish = route.startsWith('/en/') || route === '/en';
    const mixedMarkers = isEnglish
      ? ['sobre mí', 'volver al inicio', 'ver todo el trabajo', 'trabajo']
      : ['view all work', 'back home', 'about me'];

    for (const marker of mixedMarkers) {
      if (text.includes(marker)) {
        findings.push({ kind: 'copy', message: `${route} mixes languages: "${marker}"` });
      }
    }
  }

  const sitemapIndexResponse = await fetch(`${ORIGIN}/sitemap-index.xml`);
  const sitemapIndex = await sitemapIndexResponse.text();

  if (!sitemapIndexResponse.ok) {
    findings.push({ kind: 'seo', message: `/sitemap-index.xml returned ${sitemapIndexResponse.status}` });
  }

  const sitemapLocations = [...sitemapIndex.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  const sitemapUrls = new Set<string>();

  for (const location of sitemapLocations) {
    const response = await fetch(`${ORIGIN}${new URL(location).pathname}`);
    if (!response.ok) {
      findings.push({ kind: 'seo', message: `${location} returned ${response.status}` });
      continue;
    }
    const xml = await response.text();
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      sitemapUrls.add(match[1]);
    }
  }

  for (const required of ['/', '/en/', '/work/', '/en/work/', '/about/', '/en/about/']) {
    if (![...sitemapUrls].some((url) => new URL(url).pathname === required)) {
      findings.push({ kind: 'seo', message: `sitemap is missing ${required}` });
    }
  }

  for (const url of sitemapUrls) {
    const path = new URL(url).pathname;
    if (/puja/i.test(url)) {
      findings.push({ kind: 'seo', message: `sitemap contains excluded work: ${url}` });
    }
    if (path === '/cv/' || path === '/en/cv/') {
      findings.push({ kind: 'seo', message: `sitemap contains an internal CV page: ${url}` });
    }
  }

  const robots = await (await fetch(`${ORIGIN}/robots.txt`)).text();
  if (!robots.toLowerCase().includes('sitemap:')) {
    findings.push({ kind: 'seo', message: 'robots.txt does not declare a sitemap' });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const consoleErrors: string[] = [];

  for (const route of routes) {
    const page = await context.newPage();

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(`${route}: ${message.text()}`);
      }
    });
    page.on('requestfailed', (request) => {
      consoleErrors.push(`${route}: request failed ${request.url()}`);
    });
    page.on('response', (response) => {
      if (response.status() >= 400 && response.request().resourceType() !== 'document') {
        consoleErrors.push(`${route}: ${response.status()} ${response.url()}`);
      }
    });

    await page.goto(`${ORIGIN}${route}`, { waitUntil: 'networkidle' });
    await page.close();
  }

  await browser.close();

  for (const error of consoleErrors) {
    findings.push({ kind: 'console', message: error });
  }

  const report = {
    capturedAt: new Date().toISOString(),
    pages: routes.length,
    internalLinks: internalLinks.size,
    sitemapUrls: sitemapUrls.size,
    findings,
    passed: findings.length === 0,
  };

  console.log(JSON.stringify(report, null, 2));

  if (findings.length > 0) {
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await new Promise<void>((resolve) => {
    if (!server) return resolve();
    server.close(() => resolve());
  });
}
