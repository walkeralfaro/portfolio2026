# Proposal

## Why

The `cover` field is declared in the project schema but never read: every cover surface renders the designed placeholder, so the published site shows no real product imagery even though the source notes reference real screenshots (Tetris start/play/game-over, Tip Calculator, Todo App). `ProjectCover.astro`, the responsive `astro:assets` renderer, exists but is imported by nothing, and `ScreenshotGallery.astro` accepts an `images` prop that `ProjectDetail.astro` never passes. Because no asset location or resolver is defined, adding a single screenshot would mean editing four components. This change fixes where images live and wires the whole path from content to pixels.

## What Changes

- Define the asset location: covers at `src/assets/covers/<project-slug>.<ext>` and gallery screenshots at `src/assets/gallery/<project-slug>/<shot>.<ext>`, both processed by the build's `astro:assets` pipeline.
- Reference assets from content by **asset key**, not by file path: a project record carries `cover: <key>` and a case body carries a per-locale `gallery: [{ src: <key>, alt }]` list.
- Add one resolver module that turns an asset key into image metadata, raises a build-time error for an unknown key, and guarantees that no broken image is ever published.
- Render the real cover through `ProjectCover.astro` in the four cover surfaces — the case header, the catalog row thumbnail, the sticky preview, and the tier 1 gallery — and fall back to `PlaceholderCover` when a project has no cover.
- Request the preview cover only for the active panel, so `/work/` does not download fourteen images on load, and serve row thumbnails at the size they are rendered.
- Support real screenshots in tier 1 galleries through the existing `ScreenshotGallery` lightbox, with localized alternative text.
- Extend `scripts/validate-content.ts` to verify that every cover and gallery reference resolves to a file, and to report unused assets.
- Document the asset contract in `docs/content.md` and `docs/catalog.md`, and update `docs/content-sources.md` where its "no local cover asset" claim changes.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `work-catalog`: real project covers and tier 1 screenshot galleries become first-class content; the placeholder cover becomes the fallback instead of the default.

## Impact

- **New**: `src/assets/covers/`, `src/assets/gallery/`, `src/lib/project-assets.ts`.
- **Changed components**: `src/components/catalog/ProjectCover.astro`, `src/components/catalog/ProjectRow.astro`, `src/components/catalog/ProjectPreview.astro`, `src/components/case/CaseHeader.astro`, `src/components/case/ScreenshotGallery.astro`, `src/components/case/ProjectDetail.astro`, `src/scripts/catalog.ts`.
- **Changed content contract**: `src/content.config.ts` gains an optional `gallery` list on the `cases` collection; `src/content/projects/*.yaml` uses the existing `cover` string field; `src/content/cases/*.mdx` gains `gallery` frontmatter.
- **Changed validation**: `scripts/validate-content.ts`.
- **Docs**: `docs/content.md`, `docs/catalog.md`, `docs/content-sources.md`.
- **Tests**: `tests/e2e/catalog.spec.ts`, `tests/e2e/detail.spec.ts`.
- No route, API, or dependency change. No new npm package. The site keeps building and passing with zero uploaded assets; every project falls back to the placeholder until a file is added.
