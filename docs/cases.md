# Project detail pages

Every project in the catalog has a stable, shareable detail page. The page uses one shared treatment: the same header, localized baseline information, conditional actions, optional cover, optional gallery, and previous/next navigation. Richer case narratives remain available as optional supplemental content.

## Routes

| Locale | Route | Source |
| --- | --- | --- |
| Spanish | `/work/<slug>/` | `src/pages/work/[slug].astro` |
| English | `/en/work/<slug>/` | `src/pages/en/work/[slug].astro` |

Both routes use `getProjects()` from `src/lib/projects.ts`, which returns all 14 projects in catalog order. Every slug produces a page in both locales. An unknown slug returns the localized 404 page.

Detail pages are ordinary pages, not dialogs. Every page has one `h1`, one `main`, a canonical URL, reciprocal `hreflang` alternates, and a localized title and description.

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
    real cover or designed placeholder
  body
    supplemental MDX narrative with Problem, Role, Decisions, and Result, when the project has one
    or the localized what / role / result sections
  gallery
    only when the active locale declares at least one screenshot
  previous / next project
```

The header is built once in `src/components/case/CaseHeader.astro` and used by every project. It reads the same project record as the catalog, so the title, summary, year, category, status, stack, links, and cover cannot drift between the index and the detail page.

Actions follow `src/components/case/ProjectActions.astro`:

- Render **Ver sitio / View site** only when `links.live` is a real URL.
- Render **Ver código / View code** only when `links.code` is a real URL.
- When an action is missing, show the localized availability note from the project record.
- Never render `href="#"`, a disabled button, or a fake destination.

External URLs are actions on the internal detail page. They never replace the page itself.

## Authoring a supplemental narrative

A case body is optional and may belong to any project. Create `src/content/cases/<slug>.es.mdx` and `src/content/cases/<slug>.en.mdx` when the source material supports a full narrative.

1. Use this frontmatter in both files:

   ```yaml
   ---
   project: <slug>
   locale: es
   order: <project order>
   ---
   ```

   Use `locale: en` in the English file. The filename must be `<slug>.<locale>.mdx`. `order` matches the project's `order` value.

2. Write the body with this exact `##` sequence. The validator compares the heading text and order.

   | Spanish | English |
   | --- | --- |
   | `## Problema` | `## Problem` |
   | `## Rol` | `## Role` |
   | `## Decisiones` | `## Decisions` |
   | `## Resultado` | `## Result` |

3. The Decisions section must contain three or four numbered items. Keep each decision specific and traceable to `projects/*.md` or `data.js`.
4. Every section must contain text. The validator rejects an empty or very short section.
5. Do not add an English body with untranslated Spanish headings or phrases. The validator rejects common Spanish fragments.
6. Do not add `Stack` or `Gallery` sections. The stack is rendered once from the project record in the shared header.
7. Add gallery screenshots to the project YAML locale data, not to the MDX frontmatter. A locale with no screenshots keeps an empty gallery and renders no gallery section or pending message.
8. Run the content and build checks:

   ```bash
   npm run validate:content
   npm run check
   npm run build
   ```

The validator enforces 14 project records, the four-project featured set, both locales, the fixed heading sequence for every case body that exists, and the exclusion of Puja Inmobiliaria. A project without a case body is valid and renders the baseline localized sections.

## Rendering

`src/components/case/ProjectDetail.astro` owns the page body.

When the project has a localized `cases` entry, the page renders it with Astro's `render()`. MDX headings map to `CaseSection.astro`; ordered lists map to `DecisionList.astro`. The rendered document keeps the fixed four-part sequence from the MDX file:

```astro
<CaseBody components={{ h2: CaseSection, ol: DecisionList }} />
```

When there is no case entry, the page renders the localized `summary`, `role`, and `result` directly as the what/role/result sections. The header already contains the title, summary, stack, links, availability, and cover. The stack is rendered once there, never repeated inside the narrative.

The case entry only selects the narrative variant. It does not control whether the page, cover, gallery, or actions exist.

## Gallery and lightbox

Covers live in the project record. Gallery screenshots also live in the project record, under each locale, because the alternative text is written in the page language. Both use asset keys resolved against `src/assets/`. The published assets and their provenance are recorded in `docs/content-sources.md`; the authoring contract is in `docs/content.md`.

`src/components/case/ScreenshotGallery.astro` renders only when the active locale declares at least one screenshot:

- Each entry renders a responsive thumbnail and its own dialog, in the declared order, with the localized alternative text.
- The dialog opens the original file.
- A locale with no entries renders no gallery section, no caption, no cover substitute, and no gallery dialog. The project cover still appears in the header.

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

The dialog itself does not scroll. It is capped to 90% of the viewport height, reserves space for the close control and optional caption, and constrains the image to the remaining width and height with its intrinsic ratio preserved. Portrait screenshots such as the 9:16 Tetris captures and landscape screenshots both fit fully, uncropped. The background page remains locked while the dialog is open.

To publish screenshots, add the files under `src/assets/gallery/<project-slug>/` and declare them under `locales.es.gallery` and/or `locales.en.gallery` in the project YAML. The full contract is in `docs/content.md`.

## Previous and next

`src/components/case/ProjectPager.astro` uses all 14 projects in catalog order. The sequence wraps: the first detail page points back to the last one and the last page points forward to the first.

Every project participates, including entries that previously had no internal page. The pager uses `rel="prev"` and `rel="next"` and includes the destination title in the link text.

## Files

| File | Responsibility |
| --- | --- |
| `src/pages/work/[slug].astro` | Spanish static paths for all projects, page metadata, and layout. |
| `src/pages/en/work/[slug].astro` | English static paths for all projects, page metadata, and layout. |
| `src/components/case/ProjectDetail.astro` | Optional narrative or baseline body, optional gallery, and pager composition. |
| `src/components/case/CaseHeader.astro` | Back link, title, summary, metadata, stack, actions, and cover. |
| `src/components/case/CaseSection.astro` | Case-section heading and rule, also used as the MDX `h2` mapping. |
| `src/components/case/DecisionList.astro` | Ordered decision list styling, also used as the MDX `ol` mapping. |
| `src/components/case/ScreenshotGallery.astro` | Screenshot thumbnails and dialogs for locales that declare a gallery. |
| `src/components/case/Lightbox.astro` | Native dialog, close control, caption, and fit-to-viewport styling. |
| `src/components/case/ProjectPager.astro` | Wrapping previous/next navigation over all 14 projects. |
| `src/scripts/lightbox.ts` | Open, close, focus return, and scroll lock. |
| `src/lib/projects.ts` | Project accessors, case lookup, localized copy, and adjacent projects. |
| `src/lib/project-images.ts` | Cover and locale-specific gallery resolution. |

## Test coverage

`tests/e2e/detail.spec.ts` covers:

- All 14 detail pages in both locales, with localized title, canonical URL, and reciprocal language alternates.
- The project record's stack in the shared header for every project, narrative or baseline, in both locales, with the exact items and order and 3–5 items.
- The fixed four-heading sequence and 3–4 decisions for projects with a supplemental narrative, with no Stack or Gallery heading.
- The what/role/result sections for projects without a narrative.
- Gallery omission for locales with no screenshots, with no section, caption, or dialog.
- The three Tetris screenshots with their localized alternative text in both locales.
- Conditional live and code actions, and the absence of `#` links and disabled buttons.
- Previous and next order over all 14 projects, wrapping, and locale-aware hrefs.
- Covers and the designed placeholder in the case header.
- Lightbox open with the keyboard, Escape close, focus return, scroll lock, and scroll-position preservation.
- Portrait and landscape screenshots fitting the dialog without internal scroll at mobile, mobile landscape, and desktop sizes.
