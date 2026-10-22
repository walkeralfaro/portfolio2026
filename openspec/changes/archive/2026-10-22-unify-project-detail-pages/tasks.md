# Tasks

## 1. Shared project record and tier removal

- [x] 1.1 Remove `tier` from the Astro project collection schema and its inferred project type; verify with `npm run check` that project consumers now compile against the tier-free record
- [x] 1.2 Remove `tier` from `src/content/projects/todo-mcp.yaml` without changing its other fields; verify the record has no `tier` key
- [x] 1.3 Remove `tier` from `src/content/projects/image-prompt.yaml` without changing its other fields; verify the record has no `tier` key
- [x] 1.4 Remove `tier` from `src/content/projects/cheatsheet-editor.yaml` without changing its other fields; verify the record has no `tier` key
- [x] 1.5 Remove `tier` from `src/content/projects/url-shortener.yaml` without changing its other fields; verify the record has no `tier` key
- [x] 1.6 Remove `tier` from `src/content/projects/multi-step-form.yaml` without changing its other fields; verify the record has no `tier` key
- [x] 1.7 Remove `tier` from `src/content/projects/pokedex.yaml` without changing its other fields; verify the record has no `tier` key
- [x] 1.8 Remove `tier` from `src/content/projects/todo-app.yaml` without changing its other fields; verify the record has no `tier` key
- [x] 1.9 Remove `tier` from `src/content/projects/tic-tac-toe.yaml` without changing its other fields; verify the record has no `tier` key
- [x] 1.10 Remove `tier` from `src/content/projects/tip-calculator.yaml` without changing its other fields; verify the record has no `tier` key
- [x] 1.11 Remove `tier` from `src/content/projects/weather-app.yaml` without changing its other fields; verify the record has no `tier` key
- [x] 1.12 Remove `tier` from `src/content/projects/rest-countries-explorer.yaml` without changing its other fields; verify the record has no `tier` key
- [x] 1.13 Remove `tier` from `src/content/projects/tetris.yaml` without changing its other fields; verify the record has no `tier` key
- [x] 1.14 Remove `tier` from `src/content/projects/portfolio-profesional.yaml` without changing its other fields; verify the record has no `tier` key
- [x] 1.15 Remove `tier` from `src/content/projects/portfolio-2026.yaml` without changing its other fields; verify the record has no `tier` key
- [x] 1.16 Remove tier counts, tier membership, and tier-dependent validation from `scripts/validate-content.ts`; preserve the 14-record inventory and four-project featured invariant, then verify with `npm run validate:content`
- [x] 1.17 Update `docs/content.md` to remove tier authoring rules and explain the common project record, optional cover, locale-specific optional gallery, and preserved 14-project inventory; verify the documented field names match the schema

## 2. Project-owned gallery data and asset validation

- [x] 2.1 Add a default-empty gallery array to each project's Spanish and English localized schema, with required asset key and non-empty localized `alt`; verify empty and populated locale records pass the Astro content schema
- [x] 2.2 Move the Spanish Tetris gallery entries from MDX frontmatter to `src/content/projects/tetris.yaml` without changing their order or alt text; verify the Spanish validator resolves all three keys
- [x] 2.3 Move the English Tetris gallery entries from MDX frontmatter to `src/content/projects/tetris.yaml` without changing their order or alt text; verify the English validator resolves all three keys
- [x] 2.4 Remove gallery fields from `src/content/cases/tetris.es.mdx` and `src/content/cases/tetris.en.mdx`, and remove gallery from the case collection schema; verify both MDX files still parse and retain their narrative
- [x] 2.5 Update `src/lib/project-images.ts` to resolve gallery references from the project record and requested locale, while preserving cover resolution; verify it resolves Tetris's three screenshots in each locale
- [x] 2.6 Update `scripts/validate-content.ts` to validate gallery asset keys by project slug and locale and to allow supplemental MDX cases without tier membership; verify `npm run validate:content` passes
- [x] 2.7 Exercise a missing cover key and a missing gallery key in temporary content fixtures, verify each error names its project/key, restore the fixtures, and verify the production build still rejects unresolved references
- [x] 2.8 Update `src/assets/covers/README.md` and `src/assets/gallery/README.md` to remove tier-only gallery restrictions and document the common optional cover/gallery contract; verify their examples use project YAML locale data for gallery references

## 3. Localized detail routes and project navigation

- [x] 3.1 Remove the tier filter from project accessors and adjacent-project calculation; verify the returned sequence contains all 14 projects in catalog order
- [x] 3.2 Generate Spanish static detail paths from all project records in `src/pages/work/[slug].astro`; verify the build emits all 14 Spanish project URLs
- [x] 3.3 Generate English static detail paths from all project records in `src/pages/en/work/[slug].astro`; verify the build emits all 14 English project URLs
- [x] 3.4 Keep unknown slugs on the localized 404 path while making the 8 formerly un-routed project slugs resolve; verify direct requests for valid and invalid slugs in both locales
- [x] 3.5 Update detail-route E2E coverage to open every one of the 14 project slugs in Spanish and English and verify localized title, canonical URL, and reciprocal language alternate; verify with the focused detail test
- [x] 3.6 Update `docs/cases.md` route and navigation documentation to describe all-project bilingual routes and remove tier-based route rules; verify no tier-gated route instructions remain

## 4. Catalog row destinations and pagination

- [x] 4.1 Make every `ProjectRow` link to its localized internal project page, including projects with live/code links and projects whose external links are pending; verify every row destination is internal in both locales
- [x] 4.2 Keep real live/repository URLs and availability copy as project detail actions, not row destinations; verify the weather-app row opens internally and its detail page honestly reports unavailable links
- [x] 4.3 Update catalog E2E assertions for all rows to require internal slug destinations and retain category/filter/mobile behavior; verify with `npx playwright test tests/e2e/catalog.spec.ts`
- [x] 4.4 Make previous/next navigation span all 14 projects in catalog order and wrap at both ends; verify former tier 3 entries participate in both locale sequences
- [x] 4.5 Update project pager E2E coverage to assert the full 14-project sequence, wrapping, and locale-aware URLs; verify with the focused detail navigation test
- [x] 4.6 Update `docs/catalog.md` to state that rows always navigate internally and external destinations are actions on project pages; verify docs no longer describe tier 3 external row navigation

## 5. One shared detail-page treatment

- [x] 5.1 Refactor `ProjectDetail.astro` to render the common localized project fields and page composition without checking tier; verify a project with no MDX narrative renders the same shared header/body structure
- [x] 5.2 Keep existing MDX narratives as optional supplemental content and remove any code path where MDX presence gates page, cover, gallery, or action availability; verify both an MDX project and a project without MDX use the same shared template
- [x] 5.3 Preserve authored narrative facts while reconciling any repeated role/result/stack information with the canonical project record; verify all migrated claims remain in Spanish and English and pass content validation
- [x] 5.4 Remove tier attributes and tier-based selectors from the detail DOM and shared components; verify no project detail output exposes a tier value
- [x] 5.5 Update detail E2E coverage to assert the shared page structure for former tier 1, tier 2, and tier 3 projects, with or without supplemental narrative; verify focused detail tests pass
- [x] 5.6 Update `docs/cases.md` to describe common detail anatomy and optional supplemental MDX narratives without tier terminology; verify its route, authoring, rendering, and test sections agree

## 6. Optional gallery rendering and independent covers

- [x] 6.1 Render the gallery only when the active locale resolves at least one screenshot and remove the empty-gallery cover/caption/dialog fallback; verify an empty list emits no gallery root, caption, trigger, or dialog
- [x] 6.2 Keep the project cover in the shared header and catalog surfaces independently of gallery presence; verify a project with a cover and empty gallery shows the cover but no gallery section
- [x] 6.3 Render gallery items in locale-defined order with the correct localized alt text and original-file lightbox source; verify Tetris renders three correctly described screenshots in both locales
- [x] 6.4 Add E2E cases for populated and empty gallery behavior, and verify one-locale-only behavior with a temporary one-locale fixture that is restored afterward; verify absence checks include section wrapper, caption, and dialogs
- [x] 6.5 Update `docs/cases.md` and `docs/content.md` to state that empty galleries are omitted and never replaced with covers; verify no docs describe a cover as the gallery fallback

## 7. Lightbox image fitting without internal scroll

- [x] 7.1 Restructure lightbox dialog/frame sizing to reserve space for controls and caption while constraining the dialog to the viewport; verify the dialog has no scrollable overflow at mobile and desktop sizes
- [x] 7.2 Constrain lightbox images to the remaining inline/block space with `object-fit: contain` and intrinsic ratio; verify portrait and landscape originals remain uncropped and fully visible
- [x] 7.3 Preserve native dialog keyboard behavior, Escape close, page scroll lock, focus return, and saved page scroll position; verify existing keyboard lightbox tests still pass
- [x] 7.4 Add E2E assertions for the 9:16 Tetris portrait and a test-only landscape image fixture at narrow mobile, mobile landscape, and desktop viewports, including image bounds and `scrollHeight <= clientHeight`; verify each dialog opens without internal scroll and no test fixture becomes production content
- [x] 7.5 Update gallery/lightbox documentation to distinguish the locked background page from the non-scrollable dialog and explain fit-within-viewport behavior; verify the documented behavior matches the E2E assertions

## 8. Home featured projects

- [x] 8.1 Keep TODO-mcp, Image Prompt, URL Shortener, and Tetris as the exact four featured projects; verify featured selection and ordering are unchanged
- [x] 8.2 Ensure all four featured entries link to their internal localized detail pages; verify both home locales resolve each destination
- [x] 8.3 Update the professional-profile E2E assertion and spec-linked documentation if needed to require detail-page destinations without changing the featured set; verify `npx playwright test tests/e2e/profile.spec.ts`

## 9. Integrated verification

- [x] 9.1 Run `npm run validate:content`, `npm run validate:i18n`, and `npm run check`; verify all pass with no errors and no tier-related project diagnostics
- [x] 9.2 Run `npm run build`; verify it emits 38 pages total including 14 project detail pages per locale, and resolves all valid project asset references
- [x] 9.3 Run `npm run test:unit` and `npm run test:e2e`; verify project schema, all localized routes, catalog destinations, optional galleries, featured links, and lightbox behavior pass
- [x] 9.4 Run `npm run audit:site` and `npm run audit:performance`; verify there are no broken internal links and the existing JavaScript/LCP budgets remain satisfied
- [x] 9.5 Search source code, tests, and maintained docs for project-tier branches and terminology; verify remaining occurrences of “tier” refer only to unrelated concepts such as skill grouping
