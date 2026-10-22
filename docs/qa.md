# Integration quality report

Recorded on 2026-10-20 for `build-portfolio-2026`, section 10.

## Environment

- Astro static build, 30 pages.
- Chromium through Playwright.
- Local preview of `dist/` served by the audit scripts.

## Accessibility

Command: `npx playwright test tests/e2e/quality.spec.ts`

- Automated axe audit covered home, work, a project detail page, and about in Spanish and English, in both light and dark themes (16 page/theme combinations).
- Result: no critical or serious WCAG 2.1 A/AA violations.
- Fixes made during the audit:
  - The language switcher accessible name now includes its visible text.
  - The screenshot gallery button exposes its action and visible cover text consistently.
  - Decorative gallery thumbnails are no longer announced as a second, conflicting label.

## Keyboard operation

Command: `npx playwright test tests/e2e/quality.spec.ts`

- The skip link is the first tab stop and moves focus to `main`.
- Header navigation, CV links, theme radios, and the language switcher are reachable by keyboard with a visible focus ring.
- Catalog filters change the visible count with Enter; catalog rows update the preview on focus.
- The lightbox opens from the keyboard, closes with Escape, and returns focus to its trigger.
- CV controls open `https://resume.walkeralfaro.com/` in a new tab with `rel="noopener noreferrer"`.

## Reduced motion

- `src/styles/global.css` reduces animation and transition duration when `prefers-reduced-motion: reduce` is active.
- The quality test confirms catalog filters, preview panels, and buttons have no measurable transition in reduced-motion mode.
- No content or state change depends on motion.

## Performance

Command: `npm run audit:performance`

| Metric | Result | Budget |
| --- | ---: | ---: |
| Initial JavaScript, gzip | 2,858 B | ≤30 KB |
| Largest Contentful Paint | 1,288 ms | ≤2,000 ms |
| DOMContentLoaded | 778 ms | — |
| Load event | 1,589 ms | — |

Measured at 390×844 with Fast 3G network emulation (150 ms RTT, ~1.6 Mbps) and 4× CPU slowdown. JavaScript consists of the catalog/theme bundle plus inline theme and shell scripts.

## SEO and link audit

Command: `npm run build && npm run audit:site`

- 30 generated pages, 46 internal links and asset references checked.
- 29 sitemap URLs; both locales are present and the excluded client work is absent.
- `robots.txt` declares the sitemap index.
- Every page has one canonical URL, reciprocal `hreflang` links, `x-default`, Open Graph and Twitter metadata.
- The default social image is `/og/default.png` (1200×630) and resolves from every page.
- Localized 404 pages return the correct status and recovery links.
- No broken links, missing assets, failed requests, or console errors.
- The sitemap contains no internal CV route.

## Content audit

- All 14 projects and 12 case bodies are present; Puja Inmobiliaria and the mobile phone number are absent.
- Product claims remain mapped to `data.js`, `projects/*.md`, or the planning artifacts in `docs/content-sources.md`.
- Pending years, links, and galleries remain explicitly labeled; no invented screenshots or destinations were added.
- The Portfolio 2026 copy was corrected to describe an external CV link instead of a print-ready CV.
- No mixed-language UI markers were found by the built-site audit.

## Final QA matrix

Command: `npx playwright test tests/e2e/quality.spec.ts`

- Viewports: 320, 768, 1024, and 1440 px.
- Locales: Spanish and English.
- Themes: light and dark.
- Routes: home, work, a project detail page, and about in each locale.
- Result: no horizontal overflow and exactly one `h1` per page.

## Deployment

Task 10.8 is intentionally deferred. The canonical origin is set to `https://walkeralfaro.com` in `astro.config.mjs`, `src/lib/site.ts`, and `robots.txt`. The deployment host and credentials are still undecided, so no preview has been published. Before cutover, deploy a preview to the chosen host and verify the live URL, canonical host, and redirects while the current site remains live.

## Commands

```sh
npm run check
npm run test:unit
npx playwright test
npm run build
npm run audit:site
npm run audit:performance
```
