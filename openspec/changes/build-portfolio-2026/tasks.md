# Tasks

## 1. Scaffold and baseline

- [x] 1.1 Create the Astro project with `npm create astro@latest`, choosing the minimal template and strict TypeScript. Verify: `npm run dev` serves the starter page.
- [x] 1.2 Install `tailwindcss` and `@tailwindcss/vite`, register the Vite plugin, and add `@import "tailwindcss";` to the global stylesheet. Verify: a production build succeeds and a test utility class renders.
- [x] 1.3 Configure `astro.config.mjs` with a placeholder `site` URL, Spanish default locale with no prefix, English under `/en`, and prefetch enabled. Verify: `npm run build` succeeds and the config is documented in the README.
- [x] 1.4 Add `@astrojs/check`, TypeScript, `@playwright/test`, and scripts for `check`, `test:e2e`, and `cv:pdf`. Verify: `npm run check` passes and the sample Playwright test runs.
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
- [x] 2.9 Create `src/data/cv.schema.ts` and `src/data/cv.es.ts`, importing the read-only `data.js`, validating it with Zod, and stripping the mobile phone. Verify: `npm run build` fails on an invalid CV object and the phone is absent from the adapted output.
- [x] 2.10 Create `src/data/cv.en.ts` with a complete English translation of the same structure. Verify: both CV objects satisfy the same schema and contain the same section counts.
- [x] 2.11 Document the content model, the 14-project inventory, tier rules, and the read-only nature of `data.js` in `docs/content.md`. Verify: the documented commands run as written.

## 3. Design tokens and shared primitives

- [ ] 3.1 Build `Container.astro`, `Section.astro`, and `Prose.astro` with the 12-column grid, max width, responsive gutters, and reading measure from `design.md`. Verify: a demo page has no horizontal scroll at 320 px and prose stays within 70 characters.
- [ ] 3.2 Build `ButtonLink.astro`, `MetaLabel.astro`, `StatusBadge.astro`, and `StackList.astro` with keyboard focus, contrast, and semantic markup. Verify: each primitive passes a keyboard and contrast check in both themes.
- [ ] 3.3 Build `PlaceholderCover.astro` as a 16:10 typographic cover with project name, category, and a deterministic slug-based mark. Verify: missing covers render at the correct ratio with a descriptive `aria-label`.
- [ ] 3.4 Build `ProjectCover.astro` using responsive image sources, explicit dimensions, and lazy loading. Verify: the first cover loads eagerly, the rest lazily, and no layout shift occurs.
- [ ] 3.5 Add the inline SVG icon set for external links, code, theme options, and menu controls, with accessible labels. Verify: icons are not the only label for any control.
- [ ] 3.6 Document the token names, type scale, and primitive usage in `docs/design-system.md`. Verify: a new component can be built using only the documented tokens.

## 4. Theme system

- [ ] 4.1 Add the pre-paint inline script that reads the stored preference and applies `data-theme` before the stylesheet paints. Verify: a dark system preference shows no light flash on first load.
- [ ] 4.2 Build `ThemeControl.astro` and `src/scripts/theme.ts` with three explicit options: system, light, dark. Verify: the control is keyboard operable, names every option, and exposes the selected state.
- [ ] 4.3 Add a `matchMedia` listener so system mode updates when the operating-system theme changes. Verify: switching the OS theme updates the site without a reload.
- [ ] 4.4 Verify both palettes meet WCAG AA for text and essential UI, and adjust token values where needed. Verify: an automated contrast check reports no failures in either theme.
- [ ] 4.5 Add Playwright theme tests for first visit, manual persistence, and system changes. Verify: all theme scenarios pass.
- [ ] 4.6 Document the theme contract, storage key, and token rules in `docs/theme.md`. Verify: the document matches the implemented keys and attributes.

## 5. Localization system

- [ ] 5.1 Implement the Spanish root routes and the English `/en` routes for home, work, project detail, about, CV, and 404. Verify: every Spanish route has an English counterpart.
- [ ] 5.2 Create `src/i18n/ui.es.ts` and `src/i18n/ui.en.ts` for navigation, filters, statuses, actions, empty states, and form labels. Verify: a grep finds no hardcoded UI string in page or component markup.
- [ ] 5.3 Create typed route helpers that map a Spanish route to its English counterpart and preserve project slug and filter query. Verify: unit tests cover home, work, filtered work, project detail, about, and CV.
- [ ] 5.4 Build `LanguageSwitcher.astro` using the route helpers. Verify: switching language on a project page opens the same project in the other locale.
- [ ] 5.5 Add canonical URLs, `hreflang` alternates, localized titles and descriptions, and localized Open Graph metadata. Verify: both locales expose reciprocal alternates and no page points to the wrong language.
- [ ] 5.6 Add a locale completeness check that fails when a project or UI key is missing in either language. Verify: removing one English summary fails the check.
- [ ] 5.7 Document the translation workflow in `docs/i18n.md`. Verify: a new key requires one entry per locale and the check enforces it.

## 6. Site shell

- [ ] 6.1 Build `BaseLayout.astro` with the document language, head slot, skip link, header, main landmark, footer, and theme pre-paint script. Verify: every page renders one `h1` and one `main`.
- [ ] 6.2 Build `SiteHeader.astro` with the name, work/about/CV navigation, theme control, and language switcher. Verify: it remains usable at 320 px and all controls are keyboard reachable.
- [ ] 6.3 Build `SiteFooter.astro` with email, LinkedIn, GitHub, CV, location, and a colophon link. Verify: the phone number is absent and every link resolves.
- [ ] 6.4 Build `SeoHead.astro` with title, description, canonical, alternates, Open Graph, and Twitter metadata. Verify: a page audit shows no missing or duplicated tags.
- [ ] 6.5 Build localized 404 pages with links back to home and work. Verify: unknown routes return the localized page with a working recovery action.
- [ ] 6.6 Add `Person` JSON-LD to the home page with name, role, location, and social profiles. Verify: the structured data parses without errors.
- [ ] 6.7 Add shell E2E tests for skip link, navigation, language switch, theme switch, and 320 px overflow. Verify: all shell scenarios pass.

## 7. Work catalog

- [ ] 7.1 Build `WorkIndex.astro` to server-render all 14 projects, the computed total, and the category counts. Verify: the page contains 14 entries and no Puja reference.
- [ ] 7.2 Build `ProjectRow.astro` with year, title, one-line summary, category, 3–5 stack items, and status. Verify: every row exposes the required metadata and the whole row is the link target.
- [ ] 7.3 Build `ProjectPreview.astro` as the sticky 5-column pane with cover, title, summary, and stack. Verify: the desktop layout uses the 7/5 split and the preview does not shift the list.
- [ ] 7.4 Build `CategoryFilter.astro` with all four categories and real counts, updating `?c=` in the URL. Verify: filter state survives reload and a shared URL restores the same view.
- [ ] 7.5 Implement the mobile catalog below 900 px as a single-column list with thumbnails and no preview pane. Verify: 375 px and 768 px layouts show the list only.
- [ ] 7.6 Implement `src/scripts/catalog.ts` for the 90 ms pointer preview, immediate focus preview, 140 ms crossfade, and progressive filtering. Verify: with JavaScript disabled all 14 projects remain visible and navigable.
- [ ] 7.7 Build `ProjectActions.astro` to render live and code links only when real URLs exist, with an availability label otherwise. Verify: null links produce no `#` href and no disabled button.
- [ ] 7.8 Build the empty filter state with a clear message and a reset action. Verify: an empty query shows the state and the reset returns to all projects.
- [ ] 7.9 Add catalog E2E tests for hover delay, focus preview, filters, counts, reload, empty state, and mobile layout. Verify: all catalog scenarios pass.
- [ ] 7.10 Document the catalog interaction and filter URL contract in `docs/catalog.md`. Verify: the documented behavior matches the E2E tests.

## 8. Project detail pages

- [ ] 8.1 Create `/work/[slug]` and `/en/work/[slug]` with static paths for tier 1 and tier 2 only. Verify: tier 3 slugs return the localized 404 and do not generate empty pages.
- [ ] 8.2 Build `CaseHeader.astro` with back link, title, summary, year, category, status, stack, and conditional actions. Verify: metadata matches the project record and actions respect null links.
- [ ] 8.3 Render tier 1 case bodies with `CaseSection.astro` and `DecisionList.astro` in the fixed sequence. Verify: all six tier 1 pages render problem, role, decisions, result, stack, and gallery in both locales.
- [ ] 8.4 Render tier 2 pages from the localized project fields without requiring MDX. Verify: all four tier 2 pages render what, role, result, and actions.
- [ ] 8.5 Add previous and next project navigation using the catalog order. Verify: first and last projects wrap or disable correctly without dead links.
- [ ] 8.6 Integrate `ScreenshotGallery.astro` and `Lightbox.astro` with Escape, focus return, and scroll lock. Verify: keyboard open/close works and the page scroll position is preserved.
- [ ] 8.7 Ensure tier 3 archive entries link externally and never create internal detail pages. Verify: each tier 3 row opens its real destination or shows a pending state.
- [ ] 8.8 Add detail-page E2E tests for shareable URLs, action conditions, tier rules, and lightbox behavior. Verify: all detail scenarios pass.
- [ ] 8.9 Document the case-study authoring sequence and tier rules in `docs/cases.md`. Verify: a new tier 1 case can be added by following the document.

## 9. Home and profile

- [ ] 9.1 Build `ProfileIntro.astro` with name, full-stack role, one-sentence value proposition, core stack, location, availability, work CTA, and CV CTA. Verify: all elements are visible in the first desktop viewport.
- [ ] 9.2 Build `FeaturedWork.astro` with exactly TODO-mcp, Image Prompt, URL Shortener, and Tetris. Verify: the section contains four entries and each links to its detail or archive destination.
- [ ] 9.3 Add the home index excerpt with six to eight rows and a link to the full catalog. Verify: the excerpt count matches the rendered rows and the link opens `/work`.
- [ ] 9.4 Build `CapabilityGrid.astro` with end-to-end product, frontend craft, backend/data, and quality/documentation, each linked to evidence. Verify: all four blocks have a working project link.
- [ ] 9.5 Build `Trajectory.astro` with the three eras and their dates. Verify: the order and dates match `design.md`.
- [ ] 9.6 Build the about page with the web-first narrative, the background-as-plus section, and the full role history from `data.js`. Verify: the hero remains web-first and every role is present.
- [ ] 9.7 Build `SkillTiers.astro` with daily, production, and prior-context groups and no logo wall. Verify: every skill appears in exactly one tier.
- [ ] 9.8 Build `ContactLinks.astro` with email, LinkedIn, GitHub, and CV. Verify: the phone number is absent and external links use `rel="noopener noreferrer"`.
- [ ] 9.9 Add home and about E2E tests for the first screen, featured set, capability links, skills tiers, trajectory, and contact. Verify: all scenarios pass.

## 10. CV and PDF

- [ ] 10.1 Build `/cv` and `/en/cv` with summary, experience, education, projects, skills, courses, and languages from the adapted CV data. Verify: both pages render all sections and omit the phone.
- [ ] 10.2 Add a print stylesheet with A4 page size, readable type, page-break control, and visible link URLs. Verify: browser print preview produces a clean multi-page CV.
- [ ] 10.3 Add `scripts/generate-cv-pdf.ts` using Playwright to render both CV pages to `public/cv/walker-alfaro-es.pdf` and `walker-alfaro-en.pdf`. Verify: both files exist, open, and contain the expected sections.
- [ ] 10.4 Link the PDFs from the CV pages and footer with localized labels. Verify: each download returns the correct language and no 404.
- [ ] 10.5 Add CV E2E tests for section parity between locales, phone absence, and PDF availability. Verify: all CV scenarios pass.
- [ ] 10.6 Document the CV update workflow, including the read-only `data.js` and the English translation source, in `docs/cv.md`. Verify: the documented regeneration command runs as written.

## 11. Integration quality

- [ ] 11.1 Run an automated accessibility audit on home, work, a tier 1 case, about, and CV in both locales and both themes. Verify: no critical or serious violations remain.
- [ ] 11.2 Complete a keyboard-only pass through navigation, theme, language, filters, project rows, lightbox, and CV downloads. Verify: every action is reachable and focus is always visible.
- [ ] 11.3 Verify reduced-motion behavior and remove any motion that is not user-triggered or explanatory. Verify: the site remains fully understandable with motion disabled.
- [ ] 11.4 Measure the production build against the performance budget: ≤30 KB compressed initial JS and LCP ≤2.0 s on mid-tier mobile. Verify: the report is recorded and any regression is fixed.
- [ ] 11.5 Audit the sitemap, robots, canonical URLs, `hreflang`, Open Graph images, and 404 pages. Verify: the sitemap lists both locales and excludes Puja Inmobiliaria.
- [ ] 11.6 Audit all copy for invented claims, mixed languages, unlabeled placeholders, and missing project actions. Verify: every claim maps to a source and every placeholder is explicit.
- [ ] 11.7 Run the full production build and preview locally. Verify: no broken internal links, no console errors, and no missing assets.
- [ ] 11.8 Deploy a preview build to the chosen static host and verify the production URL, canonical host, and redirects. Verify: the preview is reachable and the old site remains live until cutover.
- [ ] 11.9 Complete the final QA checklist across 320, 768, 1024, and 1440 px in both themes and locales. Verify: all checks pass and the change is ready for review.
