# Tasks

## 1. Scaffold and baseline

- [x] 1.1 Create the Astro project with `npm create astro@latest`, choosing the minimal template and strict TypeScript. Verify: `npm run dev` serves the starter page.
- [x] 1.2 Install `tailwindcss` and `@tailwindcss/vite`, register the Vite plugin, and add `@import "tailwindcss";` to the global stylesheet. Verify: a production build succeeds and a test utility class renders.
- [x] 1.3 Configure `astro.config.mjs` with a placeholder `site` URL, Spanish default locale with no prefix, English under `/en`, and prefetch enabled. Verify: `npm run build` succeeds and the config is documented in the README.
- [x] 1.4 Add `@astrojs/check`, TypeScript, `@playwright/test`, and scripts for `check` and `test:e2e`. Verify: `npm run check` passes and the sample Playwright test runs.
- [x] 1.5 Self-host subset WOFF2 files for Archivo variable and Source Serif 4; add `@font-face`, preload the display face, and set metric-compatible fallbacks. Verify: no external font requests and no visible layout shift on load.
- [x] 1.6 Create `src/styles/tokens.css` and `src/styles/global.css` with the light and dark token sets, reset, type scale, spacing scale, and focus styles from `design.md`. Verify: tokens resolve in the browser and the build has no missing-variable warnings.
- [x] 1.7 Add `src/lib/site.ts` with name, role, location, email, social URLs, and the site URL placeholder. Verify: the values are imported by at least one page and no personal data is duplicated.

## 2. Content model and source data

- [x] 2.1 Define the `projects` content collection in `src/content.config.ts` with `slug`, `year`, `category`, `tags`, `tier`, `status`, `featured`, `order`, `stack` (3–5), optional `links`, optional `cover`, and required `locales.es` / `locales.en`. Verify: `npm run check` accepts a valid fixture and rejects a missing locale.
- [x] 2.2 Author the 14 project YAML records: TODO-mcp, Image Prompt, Cheatsheet Editor, URL Shortener, Multi-step Form, Pokedex, Todo App, Tic Tac Toe, Tip Calculator, Weather App, REST Countries Explorer, Tetris, Portfolio Profesional, Portfolio 2026. Verify: the count is 14 and Puja Inmobiliaria does not appear.
- [x] 2.3 Add `scripts/validate-content.ts` to enforce 14 unique slugs, both locales, 3–5 stack items, valid categories, tier rules, and the exclusion of Puja. Verify: `npm run validate:content` passes and fails on a deliberately broken fixture.
- [x] 2.4 Define the `cases` collection for tier 1 MDX bodies with `project`, `locale`, `order`, and optional `updated` fields. Verify: `npm run check` accepts a valid entry and rejects an unknown project slug.
- [x] 2.5 Write the Spanish tier 1 case bodies for TODO-mcp, Image Prompt, URL Shortener, Tetris, Multi-step Form, and Cheatsheet Editor using the fixed sequence: problem, role, decisions, result, stack, gallery notes. Verify: all six files render through a temporary route without missing sections.
- [x] 2.6 Write the English tier 1 case bodies for the same six projects with equivalent meaning and no untranslated fragments. Verify: both locales pass the content completeness check.
- [x] 2.7 Complete the tier 2 localized fields for Pokedex, Todo App, Tic Tac Toe, and Portfolio 2026, and the tier 3 archive metadata for Tip Calculator, Weather App, REST Countries Explorer, and Portfolio Profesional. Verify: each tier has the expected number of entries (6 / 4 / 4).
- [x] 2.8 Audit every project record against `data.js` and `projects/*.md`; replace invented or missing facts with an explicit pending state. Verify: a source map lists the origin of every metric and claim.
- [x] 2.9 Document the content model, the 14-project inventory, tier rules, and the read-only nature of `data.js` in `docs/content.md`. Verify: the documented commands run as written.

## 3. Design tokens and shared primitives

- [x] 3.1 Build `Container.astro`, `Section.astro`, and `Prose.astro` with the 12-column grid, max width, responsive gutters, and reading measure from `design.md`. Verify: a demo page has no horizontal scroll at 320 px and prose stays within 70 characters.
- [x] 3.2 Build `ButtonLink.astro`, `MetaLabel.astro`, `StatusBadge.astro`, and `StackList.astro` with keyboard focus, contrast, and semantic markup. Verify: each primitive passes a keyboard and contrast check in both themes.
- [x] 3.3 Build `PlaceholderCover.astro` as a 16:10 typographic cover with project name, category, and a deterministic slug-based mark. Verify: missing covers render at the correct ratio with a descriptive `aria-label`.
- [x] 3.4 Build `ProjectCover.astro` using responsive image sources, explicit dimensions, and lazy loading. Verify: the first cover loads eagerly, the rest lazily, and no layout shift occurs.
- [x] 3.5 Add the inline SVG icon set for external links, code, theme options, and menu controls, with accessible labels. Verify: icons are not the only label for any control.
- [x] 3.6 Document the token names, type scale, and primitive usage in `docs/design-system.md`. Verify: a new component can be built using only the documented tokens.

## 4. Theme system

- [x] 4.1 Add the pre-paint inline script that reads the stored preference and applies `data-theme` before the stylesheet paints. Verify: a dark system preference shows no light flash on first load.
- [x] 4.2 Build `ThemeControl.astro` and `src/scripts/theme.ts` with three explicit options: system, light, dark. Verify: the control is keyboard operable, names every option, and exposes the selected state.
- [x] 4.3 Add a `matchMedia` listener so system mode updates when the operating-system theme changes. Verify: switching the OS theme updates the site without a reload.
- [x] 4.4 Verify both palettes meet WCAG AA for text and essential UI, and adjust token values where needed. Verify: an automated contrast check reports no failures in either theme.
- [x] 4.5 Add Playwright theme tests for first visit, manual persistence, and system changes. Verify: all theme scenarios pass.
- [x] 4.6 Document the theme contract, storage key, and token rules in `docs/theme.md`. Verify: the document matches the implemented keys and attributes.

## 5. Localization system

- [x] 5.1 Implement the Spanish root routes and the English `/en` routes for home, work, project detail, about, and 404. Verify: every Spanish site route has an English counterpart; CV links lead to the external resume site.
- [x] 5.2 Create `src/i18n/ui.es.ts` and `src/i18n/ui.en.ts` for navigation, filters, statuses, actions, empty states, and form labels. Verify: a grep finds no hardcoded UI string in page or component markup.
- [x] 5.3 Create typed route helpers that map a Spanish route to its English counterpart and preserve project slug and filter query. Verify: unit tests cover home, work, filtered work, project detail, and about; the external CV link is not treated as a localized site route.
- [x] 5.4 Build `LanguageSwitcher.astro` using the route helpers. Verify: switching language on a project page opens the same project in the other locale.
- [x] 5.5 Add canonical URLs, `hreflang` alternates, localized titles and descriptions, and localized Open Graph metadata. Verify: both locales expose reciprocal alternates and no page points to the wrong language.
- [x] 5.6 Add a locale completeness check that fails when a project or UI key is missing in either language. Verify: removing one English summary fails the check.
- [x] 5.7 Document the translation workflow in `docs/i18n.md`. Verify: a new key requires one entry per locale and the check enforces it.

## 6. Site shell

- [x] 6.1 Build `BaseLayout.astro` with the document language, head slot, skip link, header, main landmark, footer, and theme pre-paint script. Verify: every page renders one `h1` and one `main`.
- [x] 6.2 Build `SiteHeader.astro` with the name, work/about navigation, a CV link to `https://resume.walkeralfaro.com/`, theme control, and language switcher. Verify: it remains usable at 320 px, all controls are keyboard reachable, and the CV link opens the external resume site.
- [x] 6.3 Build `SiteFooter.astro` with email, LinkedIn, GitHub, a CV link to `https://resume.walkeralfaro.com/`, location, and a colophon link. Verify: the phone number is absent and every link resolves.
- [x] 6.4 Build `SeoHead.astro` with title, description, canonical, alternates, Open Graph, and Twitter metadata. Verify: a page audit shows no missing or duplicated tags.
- [x] 6.5 Build localized 404 pages with links back to home and work. Verify: unknown routes return the localized page with a working recovery action.
- [x] 6.6 Add `Person` JSON-LD to the home page with name, role, location, and social profiles. Verify: the structured data parses without errors.
- [x] 6.7 Add shell E2E tests for skip link, navigation, language switch, theme switch, and 320 px overflow. Verify: all shell scenarios pass.

## 7. Work catalog

- [x] 7.1 Build `WorkIndex.astro` to server-render all 14 projects, the computed total, and the category counts. Verify: the page contains 14 entries and no Puja reference.
- [x] 7.2 Build `ProjectRow.astro` with year, title, one-line summary, category, 3–5 stack items, and status. Verify: every row exposes the required metadata and the whole row is the link target.
- [x] 7.3 Build `ProjectPreview.astro` as the sticky 5-column pane with cover, title, summary, and stack. Verify: the desktop layout uses the 7/5 split and the preview does not shift the list.
- [x] 7.4 Build `CategoryFilter.astro` with all four categories and real counts, updating `?c=` in the URL. Verify: filter state survives reload and a shared URL restores the same view.
- [x] 7.5 Implement the mobile catalog below 900 px as a single-column list with thumbnails and no preview pane. Verify: 375 px and 768 px layouts show the list only.
- [x] 7.6 Implement `src/scripts/catalog.ts` for the 90 ms pointer preview, immediate focus preview, 140 ms crossfade, and progressive filtering. Verify: with JavaScript disabled all 14 projects remain visible and navigable.
- [x] 7.7 Build `ProjectActions.astro` to render live and code links only when real URLs exist, with an availability label otherwise. Verify: null links produce no `#` href and no disabled button.
- [x] 7.8 Build the empty filter state with a clear message and a reset action. Verify: an empty query shows the state and the reset returns to all projects.
- [x] 7.9 Add catalog E2E tests for hover delay, focus preview, filters, counts, reload, empty state, and mobile layout. Verify: all catalog scenarios pass.
- [x] 7.10 Document the catalog interaction and filter URL contract in `docs/catalog.md`. Verify: the documented behavior matches the E2E tests.

## 8. Project detail pages

- [x] 8.1 Create `/work/[slug]` and `/en/work/[slug]` with static paths for tier 1 and tier 2 only. Verify: tier 3 slugs return the localized 404 and do not generate empty pages.
- [x] 8.2 Build `CaseHeader.astro` with back link, title, summary, year, category, status, stack, and conditional actions. Verify: metadata matches the project record and actions respect null links.
- [x] 8.3 Render tier 1 case bodies with `CaseSection.astro` and `DecisionList.astro` in the fixed sequence. Verify: all six tier 1 pages render problem, role, decisions, result, stack, and gallery in both locales.
- [x] 8.4 Render tier 2 pages from the localized project fields without requiring MDX. Verify: all four tier 2 pages render what, role, result, and actions.
- [x] 8.5 Add previous and next project navigation using the catalog order. Verify: first and last projects wrap or disable correctly without dead links.
- [x] 8.6 Integrate `ScreenshotGallery.astro` and `Lightbox.astro` with Escape, focus return, and scroll lock. Verify: keyboard open/close works and the page scroll position is preserved.
- [x] 8.7 Ensure tier 3 archive entries link externally and never create internal detail pages. Verify: each tier 3 row opens its real destination or shows a pending state.
- [x] 8.8 Add detail-page E2E tests for shareable URLs, action conditions, tier rules, and lightbox behavior. Verify: all detail scenarios pass.
- [x] 8.9 Document the case-study authoring sequence and tier rules in `docs/cases.md`. Verify: a new tier 1 case can be added by following the document.

## 9. Home and profile

- [x] 9.1 Build `ProfileIntro.astro` with name, full-stack role, one-sentence value proposition, core stack, location, availability, work CTA, and CV link to `https://resume.walkeralfaro.com/`. Verify: all elements are visible in the first desktop viewport and the CV CTA opens the external resume site.
- [x] 9.2 Build `FeaturedWork.astro` with exactly TODO-mcp, Image Prompt, URL Shortener, and Tetris. Verify: the section contains four entries and each links to its detail or archive destination.
- [x] 9.3 Add the home index excerpt with six to eight rows and a link to the full catalog. Verify: the excerpt count matches the rendered rows and the link opens `/work`.
- [x] 9.4 Build `CapabilityGrid.astro` with end-to-end product, frontend craft, backend/data, and quality/documentation, each linked to evidence. Verify: all four blocks have a working project link.
- [x] 9.5 Build `Trajectory.astro` with the three eras and their dates. Verify: the order and dates match `design.md`.
- [x] 9.6 Build the about page with the web-first narrative, the background-as-plus section, and the full role history from `data.js`. Verify: the hero remains web-first and every role is present.
- [x] 9.7 Build `SkillTiers.astro` with daily, production, and prior-context groups and no logo wall. Verify: every skill appears in exactly one tier.
- [x] 9.8 Build `ContactLinks.astro` with email, LinkedIn, GitHub, and a CV link to `https://resume.walkeralfaro.com/`. Verify: the phone number is absent and external links use `rel="noopener noreferrer"`.
- [x] 9.9 Add home and about E2E tests for the first screen, featured set, capability links, skills tiers, trajectory, and contact. Verify: all scenarios pass.

## 10. Integration quality

- [x] 10.1 Run an automated accessibility audit on home, work, a tier 1 case, and about in both locales and both themes. Verify: no critical or serious violations remain.
- [x] 10.2 Complete a keyboard-only pass through navigation, theme, language, filters, project rows, lightbox, and CV links. Verify: every action is reachable, focus is always visible, and CV links open `https://resume.walkeralfaro.com/`.
- [x] 10.3 Verify reduced-motion behavior and remove any motion that is not user-triggered or explanatory. Verify: the site remains fully understandable with motion disabled.
- [x] 10.4 Measure the production build against the performance budget: ≤30 KB compressed initial JS and LCP ≤2.0 s on mid-tier mobile. Verify: the report is recorded and any regression is fixed.
- [x] 10.5 Audit the sitemap, robots, canonical URLs, `hreflang`, Open Graph images, and 404 pages. Verify: the sitemap lists both locales and excludes Puja Inmobiliaria.
- [x] 10.6 Audit all copy for invented claims, mixed languages, unlabeled placeholders, and missing project actions. Verify: every claim maps to a source and every placeholder is explicit.
- [x] 10.7 Run the full production build and preview locally. Verify: no broken internal links, no console errors, and no missing assets.
- [ ] 10.8 Deploy a preview build to the chosen static host and verify the production URL, canonical host, and redirects. Verify: the preview is reachable and the old site remains live until cutover.
- [x] 10.9 Complete the final QA checklist across 320, 768, 1024, and 1440 px in both themes and locales. Verify: all checks pass and the change is ready for review.
