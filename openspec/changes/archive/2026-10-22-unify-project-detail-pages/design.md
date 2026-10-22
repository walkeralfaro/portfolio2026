# Design

## Context

See `proposal.md` — Why, and the two delta specs for the observable contract. The relevant current structure is:

- The project YAML schema requires a numeric `tier`; `getVisibleProjects()` filters out tier 3; the Spanish and English `[slug].astro` routes use that filtered collection.
- `ProjectRow.astro` links tiers 1 and 2 internally, but sends tier 3 rows directly to a live or code URL (or renders a non-link row).
- `ProjectDetail.astro` selects between an MDX body for tier 1 and YAML `summary`/`role`/`result` for tier 2. Tier 3 has no generated page. The shared header already reads localized metadata, stack, links, and cover for both existing page depths.
- Gallery entries currently live in case-MDX frontmatter. That collection has only the 12 bodies for the six current tier 1 projects. `ScreenshotGallery.astro` also renders a cover and pending caption when the list is empty, which conflicts with the requested omission behavior.
- All project YAML records already have Spanish and English `title`, `summary`, `role`, and `result`; cover is nullable. The home featured set is independently fixed at four.
- The lightbox dialog is capped at `90vh`, but has `overflow: auto` and its image uses width 100% with automatic height. A portrait original can therefore exceed the dialog's available height.
- The catalog inventory is currently fixed at 14 and `PROJECT_SLUGS` is an explicit registry. This change preserves that inventory contract; a later addition still enters the same project schema and route generation after its slug is registered.

## Goals / Non-Goals

**Goals:**

- Make the project record the common source for routes, baseline localized detail content, optional cover, and locale-specific optional gallery.
- Remove tier as a data property and as a condition for routes, row destinations, detail composition, pagination, or validation.
- Keep richer existing MDX narratives available as supplemental project content without making their presence a prerequisite for any common detail feature.
- Keep the four curated home featured projects and the existing catalog order.
- Bound dialog image layout by the dialog's actual available space, accounting for padding, close control, and optional caption.

**Non-Goals:**

- Changing which four projects are featured or how the home excerpt is selected.
- Expanding the current 14-project inventory or changing project facts, links, status, stack, or category.
- Requiring every project to have a real cover or at least one gallery screenshot.
- Inventing detailed case-study claims for projects whose source material does not support them.
- Removing useful project MDX narratives or adding an image-processing dependency.

## Decisions

### 1. Put gallery references beside each project's localized fields

Add a default-empty `gallery` array to each locale under `projects/*.yaml`, with `{ src, alt }` entries. `src` remains an asset key resolved under `src/assets/gallery/<slug>/`; `alt` is authored separately in Spanish and English. Move the current Tetris lists out of MDX frontmatter into both locale records. This gives every project the same gallery capability without requiring a case-body file. The alternative—creating empty case MDX files for every project—would couple asset configuration to narrative content and require meaningless files for projects without case prose.

The case collection remains available for the existing supplemental MDX content. Its schema and validator no longer own gallery references or use project tier as a membership rule.

### 2. Generate detail routes from the complete project collection

Both localized `[slug]` routes use the complete order-sorted project collection. The shared detail component always renders the common header, localized baseline information, cover, actions/availability, and project navigation. Existing MDX narratives can add authored detail, but route existence and shared fields never branch on an MDX entry or tier. Keep `PROJECT_SLUGS` as the explicit slug registry and retain the current 14-record inventory check; adding a future project means registering its slug and record, after which the same page and image behavior applies.

Do not retain a numeric replacement for tier or infer a tier from MDX presence. That would recreate hidden levels of project access. The difference between projects is only the amount of verified authored narrative, not whether the page or its image features exist.

### 3. Make every catalog row an internal project link

Rows always use the localized project route. Live and repository URLs stay conditional actions in the detail header; if neither exists, preserve the honest availability message. This keeps project discovery internal while preserving the real external destinations. Previous/next navigation iterates every project in catalog order and wraps across the full list.

### 4. Omit the gallery component when the locale has no screenshots

Resolve gallery keys from the project record for the active locale. Render `ScreenshotGallery` only for a non-empty resolved list. Remove the current empty-gallery branch that substitutes the cover, caption, and a cover dialog; the cover remains visible in the shared header and catalog surfaces. If only one locale has entries, only that locale gets the gallery section. This is preferable to an empty placeholder section because the user explicitly requested no gallery section when no screenshots exist.

### 5. Keep cover support optional and independent of galleries

Retain nullable `cover` on every project record. `ProjectCover` remains the single rendering entry point: it resolves a real cover when present and otherwise renders the designed placeholder. A cover never populates the gallery automatically. Keep asset-key validation shared between content validation and the build resolver.

### 6. Fit lightbox content to the dialog instead of scrolling the dialog

Keep the native modal dialog, page scroll lock, Escape behavior, focus restoration, and saved page scroll position. Constrain the dialog to the viewport with fixed maximum inline/block dimensions and hidden overflow. Lay out the frame so the close control and optional caption have reserved space; constrain the image to the remaining width and height with `object-fit: contain` and automatic intrinsic sizing. Do not solve portrait overflow by cropping or by placing a scroll container inside the dialog. The alternative, retaining `overflow: auto`, preserves access to an oversized image but violates the explicit no-scroll behavior.

### 7. Preserve home featured curation

Keep exactly TODO-mcp, Image Prompt, URL Shortener, and Tetris in the home featured section. Their links become internal project detail links like every other catalog row; featured status affects prominence only, not page depth.

## Risks / Trade-offs

- [Moving Tetris gallery data can lose localized alternative text or ordering] → migrate each locale list verbatim and test the rendered order and `alt` values in both locales.
- [The 8 newly addressable tier 3 detail routes alter row behavior and add static pages] → keep real links as detail-page actions, test both locales for all 14 slugs, and assert missing URLs remain omitted with availability copy.
- [Existing MDX case prose can duplicate the common YAML fields] → retain the narratives as supplemental content, compare the localized sources during migration, and avoid deleting or weakening claims without checking their project source.
- [A zero-gallery locale could accidentally retain a wrapper or pending note] → test that the gallery root, caption, and dialog are all absent for empty lists while the cover still appears in the shared header.
- [Dialog content may be clipped if padding/caption space is not included in the height constraint] → test portrait and landscape sources at narrow mobile and desktop viewports, asserting the image fits and dialog scroll dimensions do not exceed its client dimensions.
- [Fixed 14-project validation can still require deliberate curation to add a future project] → preserve it as an existing inventory contract; ensure the new page/image logic itself has no tier or project-specific branching.

## Migration Plan

1. Extend the project schema with default-empty localized gallery arrays; move both Tetris gallery lists from MDX frontmatter into the project YAML records.
2. Remove the project tier field from the schema and all 14 records. Replace tier-count, tier-membership, and tier-specific link validation with project-wide invariants, while preserving the 14-project inventory and four featured projects.
3. Update project accessors and both localized static route generators to include every project; change row and pager navigation to use the complete collection.
4. Refactor the common detail page to always render shared localized data and optional supplemental MDX narrative; render galleries only for a non-empty locale list. Retain cover fallback and conditional external actions.
5. Bound dialog image dimensions and remove dialog scrolling without changing keyboard, focus, or background scroll-lock behavior.
6. Update content/catalog/case documentation and E2E assertions; run content validation, Astro checks, build, unit tests, all E2E tests, site audit, and performance audit.

Rollback is a code/content rollback before deployment. No external data migration or URL format change is needed: existing `/work/<slug>/` and `/en/work/<slug>/` routes remain stable, and the newly generated routes add URLs without replacing existing ones.

## Open Questions

None. The page template is common; existing authored narratives remain optional content rather than a hidden tier. The catalog stays at the current 14 projects, and the four home featured entries remain unchanged.
