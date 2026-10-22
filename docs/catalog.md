# Work catalog

The work catalog is the primary browsing surface of the portfolio. It renders the full project inventory as static HTML, then adds a small master-detail preview and category filtering on the client. The catalog is not a card grid and does not use modals for project details.

## Inventory

The catalog reads `src/content/projects/*.yaml` and renders projects in ascending `order`. The inventory is fixed at 14 projects:

| Order | Project | Tier | Category |
| ---: | --- | ---: | --- |
| 1 | TODO-mcp | 1 | `ia` |
| 2 | Image Prompt | 1 | `ia` |
| 3 | Cheatsheet Editor | 1 | `producto` |
| 4 | URL Shortener | 1 | `producto` |
| 5 | Multi-step Form | 1 | `frontend` |
| 6 | Pokedex | 2 | `frontend` |
| 7 | Todo App | 2 | `frontend` |
| 8 | Tic Tac Toe | 2 | `juegos` |
| 9 | Tip Calculator | 3 | `frontend` |
| 10 | Weather App | 3 | `frontend` |
| 11 | REST Countries Explorer | 3 | `frontend` |
| 12 | Tetris | 1 | `juegos` |
| 13 | Portfolio Profesional | 3 | `producto` |
| 14 | Portfolio 2026 | 2 | `producto` |

Category counts are computed from the same array used to render the rows:

| Filter | Value | Count |
| --- | --- | ---: |
| Todos / All | no query | 14 |
| IA y agentes / AI & agents | `ia` | 2 |
| Producto / Product | `producto` | 4 |
| Frontend | `frontend` | 6 |
| Juegos / Games | `juegos` | 2 |

Puja Inmobiliaria is excluded from the catalog, navigation, metadata, sitemap, and search surface. Do not add it to the project inventory.

## Covers

Every surface that shows a cover goes through `ProjectCover.astro`, which renders the project's real cover when the record references one and the designed placeholder when it does not. Both branches keep the same 16:10 box, the same border, and the same descriptive alternative text, so the grid never shifts when a cover arrives.

| Surface | Size | Loading |
| --- | --- | --- |
| Case header on a detail page | 4 of 12 columns | Eager, it is the largest element above the fold |
| Sticky preview pane | 5 of 12 columns | The active panel only, see below |
| Row thumbnail, mobile | 104 px | Lazy |

A project without a cover asset keeps `cover: null` in its record and renders `PlaceholderCover`. The asset contract, the file locations, and the authoring rules live in `docs/content.md`.

### The preview loads one cover, not fourteen

The preview stacks all 14 panels in the same grid area. A hidden panel still has a layout box, so a lazy image inside it is still requested: rendering every cover would download fourteen images of about 960 px on the catalog page.

Instead, the panel that is active at build time renders its cover in the document, and every other panel keeps its cover inside an inert `<template>`. `src/scripts/catalog.ts` clones the template into the panel the first time that panel becomes active, and the image fades in over the placeholder backdrop. Each panel is cloned at most once.

Without JavaScript the preview behaves as before: the first project shows its cover, the rest show placeholders.

## Layout

| Viewport | Behavior |
| --- | --- |
| 900 px and wider | A 12-column master-detail body. The project list spans 7 columns and the preview spans 5 columns. |
| Below 900 px | A single-column list. Each row shows a thumbnail, year, category, title, summary, stack, and status. The preview pane is hidden. |

The desktop preview is `position: sticky` with a `2rem` top offset. It sits in its own grid column, so changing previews does not move or resize the list. The list remains the scrolling element the visitor reads.

Every project row is one navigation target:

- Tier 1 and 2 rows link to the localized detail route, such as `/work/todo-mcp/` or `/en/work/todo-mcp/`.
- Tier 3 rows link to their real external destination when one exists.
- A tier 3 row with no live or code URL is not a link. It shows a pending state and the localized availability note instead.

Rows expose the year (or the localized pending label), title, one-line summary, primary category, 3–5 stack items, and status. Row content is inset by `1rem` on both sides at every breakpoint, while the dividers, hover background, and link surface remain full width. The mobile thumbnail is decorative because the row already names the project; the placeholder cover still carries a descriptive label for assistive technology when the full cover is shown.

## Preview behavior

The preview is a stack of pre-rendered panels, one per project. Only one panel is active at a time.

| Interaction | Behavior |
| --- | --- |
| Pointer enters a row | After 90 ms, the preview switches to that project. Leaving before the delay cancels the switch. |
| Keyboard focus enters a row link | The preview switches immediately. |
| Preview changes | Opacity crossfades for 140 ms. |
| Reduced motion | The crossfade is disabled; the preview changes immediately. |
| No JavaScript | The first project remains in the preview. All rows remain visible and navigable. |

Inactive panels are `inert` and `aria-hidden="true"`, so their links cannot receive focus or be read as part of the current preview. The preview contains optional live/code actions; it is never the only way to open a project. The row remains the navigation target.

## Filter URL contract

Use the `c` query parameter on the work route:

| View | Spanish URL | English URL |
| --- | --- | --- |
| All projects | `/work/` | `/en/work/` |
| AI | `/work/?c=ia` | `/en/work/?c=ia` |
| Product | `/work/?c=producto` | `/en/work/?c=producto` |
| Frontend | `/work/?c=frontend` | `/en/work/?c=frontend` |
| Games | `/work/?c=juegos` | `/en/work/?c=juegos` |

Filter links are real anchors. With JavaScript, selecting a filter calls `history.replaceState`, updates the visible rows and computed count without a reload, and marks the active link with `aria-current="page"`. Reloading the page or opening a shared URL restores the same filter.

The empty states are explicit:

- `?c=` (an empty value) shows the empty result state.
- An unknown value such as `?c=desconocida` also shows the empty result state.
- The empty state sets the visible count to `0`, hides the preview, and offers a reset link to `/work/` or `/en/work/`.
- Resetting restores all 14 projects and removes `c` from the URL.

The language switcher preserves a valid `c` query, so `/work/?c=ia` switches to `/en/work/?c=ia`.

## Gallery

A tier 1 project page ends with a gallery. The screenshots come from the `gallery` frontmatter of the case body, one list per locale, so the alternative text is written in the language of the page.

- A case that declares screenshots renders one thumbnail per entry, in the declared order, and each one opens the lightbox with the full frame.
- A case that declares none renders the cover of its project, or the designed placeholder when the project has no cover either, plus the note that there are no verified screenshots.
- The thumbnail keeps the whole frame: the box follows the ratio of the screenshot, and the lightbox shows the original file at its own size.

The asset contract for the gallery files is in `docs/content.md`.

## Progressive enhancement

`WorkIndex.astro` server-renders all 14 rows and all 14 preview panels. JavaScript only hides rows that do not match the current filter. It does not fetch project data or create rows.

With JavaScript disabled:

- All 14 rows remain in the document and visible.
- Every internal and external row link still works.
- Filter links still resolve to their query URLs, but the browser reloads the page; no rows are hidden.
- The first preview panel is still displayed on desktop.

This is intentional. Filtering is an enhancement, not a requirement for reading or navigating the catalog.

## Actions

`ProjectActions.astro` is the single source for live and code actions. It follows the project record:

- Render **Ver sitio / View site** only when `links.live` is a real URL.
- Render **Ver código / View code** only when `links.code` is a real URL.
- Never render `href="#"`, a disabled button, or a fake destination.
- When one action is missing, render the remaining action and the localized project availability note.
- When both are missing, render no controls and show the availability note.

The catalog preview uses the component for the selected project. Project detail pages use the same component in the case header.

## Files

| File | Responsibility |
| --- | --- |
| `src/components/catalog/WorkIndex.astro` | Server-rendered inventory, computed total, category counts, list, empty state, and preview composition. |
| `src/components/catalog/ProjectRow.astro` | Row metadata, whole-row link, mobile thumbnail, and pending state. |
| `src/components/catalog/ProjectPreview.astro` | Sticky preview panels with cover, metadata, title, summary, stack, status, and actions. |
| `src/components/catalog/CategoryFilter.astro` | Four category links plus All, real counts, and active state. |
| `src/components/catalog/ProjectCover.astro` | The single cover entry point: the real responsive cover, or the placeholder when the project has none. |
| `src/components/catalog/PlaceholderCover.astro` | Deterministic 16:10 cover for projects without screenshots. |
| `src/components/case/ProjectActions.astro` | Conditional live/code actions and availability notes. |
| `src/lib/project-assets.ts` | Pure asset key rules shared by the build and the content validator. |
| `src/lib/project-images.ts` | Resolves cover and gallery references into image metadata. |
| `src/scripts/catalog.ts` | 90 ms pointer preview, immediate focus preview, 140 ms crossfade, deferred cover activation, filtering, URL state, count updates, and empty state. |

## Test coverage

`tests/e2e/catalog.spec.ts` covers:

- The 14-project inventory and the absence of Puja Inmobiliaria.
- Row metadata and whole-row navigation targets.
- The desktop 7/5 split, sticky preview, and stable list geometry while scrolling.
- The 90 ms pointer delay and immediate focus preview.
- Filter counts, `?c=` URL updates, reload restoration, and the All reset.
- Empty and unknown filter states and the reset action.
- Single-column thumbnails at 375 px and 768 px with no preview pane.
- No-JavaScript visibility and navigation.
- Conditional live/code actions and pending availability.
- The English catalog, filters, and localized summaries.
- The deferred preview cover: no request for an inactive panel's cover on load, and the cover appears when its panel is shown.
- The placeholder cover for a project without a cover asset, and the real cover in the mobile row thumbnail.

`tests/e2e/i18n.spec.ts` additionally verifies that switching locales preserves `/work/?c=ia`.
