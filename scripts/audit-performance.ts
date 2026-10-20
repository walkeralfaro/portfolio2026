import { readFileSync } from 'node:fs';
import type { Server } from 'node:http';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';
import { startStaticServer } from './lib/static-server.ts';

const PORT = 4322;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const JS_BUDGET_BYTES = 30 * 1024;
const LCP_BUDGET_MS = 2000;

function compressedInitialJavaScript(html: string): {
  bytes: number;
  files: Array<{ name: string; raw: number; gzip: number }>;
} {
  const files: Array<{ name: string; raw: number; gzip: number }> = [];
  const scriptSources = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(
    (match) => match[1],
  );

  for (const source of scriptSources) {
    const path = `dist/${source.replace(/^\//, '')}`;
    const raw = readFileSync(path);
    files.push({ name: source, raw: raw.byteLength, gzip: gzipSync(raw).byteLength });
  }

  const inline = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1])
    .join('\n');

  if (inline.trim()) {
    files.push({
      name: 'inline',
      raw: Buffer.byteLength(inline),
      gzip: gzipSync(inline).byteLength,
    });
  }

  return {
    bytes: files.reduce((total, file) => total + file.gzip, 0),
    files,
  };
}

let server: Server | undefined;

try {
  server = await startStaticServer('dist', PORT);

  const html = readFileSync('dist/index.html', 'utf8');
  const js = compressedInitialJavaScript(html);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: 200_000,
    uploadThroughput: 93_750,
    connectionType: 'cellular3g',
  });
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.addInitScript(() => {
    (window as Window & { __lcp?: number }).__lcp = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        (window as Window & { __lcp?: number }).__lcp = entry.startTime;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });

  const started = Date.now();
  await page.goto(`${ORIGIN}/`, { waitUntil: 'load' });
  await page.waitForFunction(() => document.fonts.status === 'loaded');
  await page.waitForTimeout(500);

  const metrics = await page.evaluate(() => {
    const target = window as Window & { __lcp?: number };
    const navigation = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;

    return {
      lcp: target.__lcp ?? 0,
      domContentLoaded: navigation?.domContentLoadedEventEnd ?? 0,
      load: navigation?.loadEventEnd ?? 0,
    };
  });

  const wallClockLoad = Date.now() - started;

  const report = {
    capturedAt: new Date().toISOString(),
    throttling: 'Fast 3G network (150 ms RTT, ~1.6 Mbps) with 4x CPU slowdown',
    viewport: '390x844, mobile',
    initialJavaScript: {
      gzipBytes: js.bytes,
      budgetBytes: JS_BUDGET_BYTES,
      withinBudget: js.bytes <= JS_BUDGET_BYTES,
      files: js.files,
    },
    largestContentfulPaintMs: Math.round(metrics.lcp),
    lcpBudgetMs: LCP_BUDGET_MS,
    lcpWithinBudget: metrics.lcp <= LCP_BUDGET_MS,
    domContentLoadedMs: Math.round(metrics.domContentLoaded),
    loadEventMs: Math.round(metrics.load),
    wallClockLoadMs: wallClockLoad,
  };

  console.log(JSON.stringify(report, null, 2));

  await browser.close();

  if (js.bytes > JS_BUDGET_BYTES || metrics.lcp > LCP_BUDGET_MS) {
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
