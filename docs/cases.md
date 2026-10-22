# Project detail pages

Project detail pages turn the catalog into a set of stable, shareable case studies. The depth of each page follows the project's `tier`; the page never publishes an empty shell or a placeholder destination.

## Routes

| Locale | Route | Source |
| --- | --- | --- |
| Spanish | `/work/<slug>/` | `src/pages/work/[slug].astro` |
| English | `/en/work/<slug>/` | `src/pages/en/work/[slug].astro` |

Both routes use `getVisibleProjects()` from `src/lib/projects.ts`, which returns the ten tier 1 and tier 2 projects in catalog order. Tier 3 projects are excluded from `getStaticPaths()`, so no page is generated for them and their URLs return the localized 404 page.

Detail pages are ordinary pages, not dialogs. Every page has one `h1`, one `main`, a canonical URL, reciprocal `hreflang` alternates, and a localized title and description.

## Depth rules

| Tier | Count | Page content |
| --- | ---: | --- |
| 1 | 6 | Full case study from MDX: problem, role, decisions, result, stack, gallery. |
| 2 | 4 | Short case study from `locales.es` / `locales.en`: what it is, role, result. |
| 3 | 4 | No detail page. The catalog row opens a real external destination or shows a pending state. |

Tier 1: TODO-mcp, Image Prompt, Cheatsheet Editor, URL Shortener, Multi-step Form, Tetris.

Tier 2: Pokedex, Todo App, Tic Tac Toe, Portfolio 2026.

Tier 3: Tip Calculator, Weather App, REST Countries Explorer, Portfolio Profesional.

The tier 1 and tier 2 sets are fixed by `scripts/validate-content.ts` and `docs/content.md`. Do not add a tier 3 slug to `getStaticPaths()`, and do not add an internal link to a tier 3 project.

## Page anatomy

```text
Project detail
  header
    back to work
    title
    one-line summary
    year / category / status
    stack (3–5 items)
    live and code actions, or an availability note
    placeholder cover
  tier 1 body
    problem
    role
    decisions (3–4)
    result
    stack
    gallery notes
    cover lightbox
  tier 2 body
    what it is
    role
    result
  previous / next project
```

The header is built once in `src/components/case/CaseHeader.astro` and used by both tiers. It reads the same project record as the catalog, so the title, summary, year, category, status, stack, and links cannot drift between the index and the detail page.

Actions follow `src/components/case/ProjectActions.astro`:

- Render **Ver sitio / View site** only when `links.live` is a real URL.
- Render **Ver código / View code** only when `links.code` is a real URL.
- When an action is missing, show the localized availability note from the project record.
- Never render `href="#"`, a disabled button, or a fake destination.

## Authoring a tier 1 case

1. Confirm the project is tier 1 in `src/content/projects/<slug>.yaml`. A project must not be tier 1 without a case body in both locales.
2. Create `src/content/cases/<slug>.es.mdx` and `src/content/cases/<slug>.en.mdx`.
3. Use this frontmatter in both files:

   ```yaml
   ---
   project: <slug>
   locale: es
   order: <project order>
   ---
   ```

   Use `locale: en` in the English file. The filename must be `<slug>.<locale>.mdx`. `order` matches the project's `order` value.
4. Write the body with this exact `##` sequence. The validator compares the heading text and order.

   | Spanish | English |
   | --- | --- |
   | `## Problema` | `## Problem` |
   | `## Rol` | `## Role` |
   | `## Decisiones` | `## Decisions` |
   | `## Resultado` | `## Result` |
   | `## Stack` | `## Stack` |
   | `## Galería` | `## Gallery` |

5. The Decisions section must contain three or four numbered items. Keep each decision specific and traceable to `projects/*.md` or `data.js`.
6. Every section must contain text. The validator rejects an empty or very short section.
7. Do not add an English body with untranslated Spanish headings or phrases. The validator rejects common Spanish fragments.
8. Run the content and build checks:

   ```bash
   npm run validate:content
   npm run check
   npm run build
   ```

The validator enforces 14 project records, the 6 / 4 / 4 tier split, the 12 tier 1 bodies, both locales, the fixed heading sequence, and the exclusion of Puja Inmobiliaria.

### Changing the tier 1 set

The inventory is fixed at 14 projects, so promoting a tier 2 project to tier 1 is a content decision, not a free addition. It requires all of the following in the same change:

- Set `tier: 1` in the project YAML and add both MDX bodies.
- Update `TIER_COUNTS` and `TIER_1_PROJECTS` in `scripts/validate-content.ts`.
- Update the tier tables and counts in `docs/content.md` and this document.
- Re-run `npm run validate:content` and the detail-page E2E tests.

## Rendering

`src/components/case/ProjectDetail.astro` owns the page body.

For tier 1, the page loads the localized `cases` entry with `getCaseEntry(slug, locale)` and renders it with Astro's `render()`. MDX headings map to `CaseSection.astro`; ordered lists map to `DecisionList.astro`. The rendered document keeps the fixed sequence from the MDX file:

```astro
<CaseBody components={{ h2: CaseSection, ol: DecisionList }} />
```

`CaseSection.astro` renders the section heading and its top rule. `DecisionList.astro` renders the decisions as an ordered list with a hanging rule, without replacing the list semantics.

For tier 2, the page renders the localized `summary`, `role`, and `result` directly, with no MDX lookup. The header already contains the title, stack, links, and availability.

## Gallery and lightbox

Covers come from the project record and screenshots from the case body, both as asset keys resolved against `src/assets/`. The published assets and their provenance are recorded in `docs/content-sources.md`; the authoring contract is in `docs/content.md`.

`src/components/case/ScreenshotGallery.astro` renders:

- A thumbnail list when the case declares `gallery` entries. Each entry renders a responsive thumbnail and its own dialog, and the dialog opens the original file.
- A single **Portada / Cover** item when the case declares none: the project's real cover when the record references one, or the designed placeholder when it does not.
- A caption stating that there are no verified screenshots of the project.

The gallery's only client behavior is `src/scripts/lightbox.ts`. It uses native `<dialog>` elements from `Lightbox.astro`:

| Interaction | Behavior |
| --- | --- |
| Activate a thumbnail | Opens the matching dialog with `showModal()`. |
| Escape | Closes the dialog. |
| Close control or backdrop | Closes the dialog. |
| Close | Removes the scroll lock, returns focus to the trigger with `preventScroll`, and restores the saved page scroll position. |
| Open | Locks page scroll with `html.lightbox-open` and records the scroll position. |
| Reduced motion | No open/close animation is added. |

The dialog has an accessible label, the close control has a text label for assistive technology, and the close control is the first focusable element inside the dialog. The gallery trigger is a real `<button>` with `aria-haspopup="dialog"`, not a clickable `div`.

To publish screenshots, add the files under `src/assets/gallery/<project-slug>/` and declare them in the case body frontmatter as `gallery: [{ src, alt }]`, one list per locale. Each entry renders as a thumbnail and its own dialog. A case with no gallery renders its project cover, or the placeholder when the project has no cover either. The full contract is in `docs/content.md`.

## Previous and next

`src/components/case/ProjectPager.astro` uses the tier 1 and tier 2 catalog order. The sequence wraps: the first detail page points back to the last one and the last page points forward to the first.

The pager never links to a tier 3 project, because tier 3 has no internal page. It uses `rel="prev"` and `rel="next"` and includes the destination title in the link text.

## Files

| File | Responsibility |
| --- | --- |
| `src/pages/work/[slug].astro` | Spanish static paths for tiers 1–2, page metadata, and layout. |
| `src/pages/en/work/[slug].astro` | English static paths for tiers 1–2, page metadata, and layout. |
| `src/components/case/ProjectDetail.astro` | Tier selection, MDX rendering, tier 2 fields, gallery, and pager composition. |
| `src/components/case/CaseHeader.astro` | Back link, title, summary, metadata, stack, actions, and cover. |
| `src/components/case/CaseSection.astro` | Case-section heading and rule, also used as the MDX `h2` mapping. |
| `src/components/case/DecisionList.astro` | Ordered decision list styling, also used as the MDX `ol` mapping. |
| `src/components/case/ScreenshotGallery.astro` | Screenshot thumbnails, cover fallback, caption, and dialog composition. |
| `src/components/case/Lightbox.astro` | Native dialog, close control, caption, and dialog styling. |
| `src/components/case/ProjectPager.astro` | Wrapping previous/next navigation over tiers 1–2. |
| `src/scripts/lightbox.ts` | Open, close, focus return, and scroll lock. |
| `src/lib/projects.ts` | Visible projects, case lookup, localized copy, and adjacent projects. |

## Test coverage

`tests/e2e/detail.spec.ts` covers:

- All six tier 1 pages in both locales, with the six headings in the fixed sequence and 3–4 decisions.
- All four tier 2 pages in both locales, with what/role/result and no gallery or decisions.
- Tier 3 URLs returning the localized 404 in both locales, with no generated detail page.
- Tier 3 catalog rows linking externally or showing the pending state.
- Conditional live and code actions, and the absence of `#` links and disabled buttons.
- Previous and next order, wrapping, locale-aware hrefs, and the absence of tier 3 destinations.
- Canonical URLs and reciprocal `hreflang` alternates, plus direct loading and reloading of a shared URL.
- Lightbox open with the keyboard, Escape close, focus return, scroll lock, and scroll-position preservation.
- Lightbox close-control behavior.
