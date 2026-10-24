# Proposal

## Why

On screens below 900 pixels each project row splits its width into a narrow cover column (5.25–6.5rem) and a content column, so the cover renders too small to read while the title, summary, and stack are squeezed against it. The mobile catalog should give the cover and the project information usable space instead of forcing both side by side.

## What Changes

- Below 900 pixels, stack the project row vertically: the cover spans the row's content width above, and the meta, title, summary, stack, and status follow below.
- Keep the existing horizontal row layout and sticky preview at 900 pixels and wider unchanged.
- Keep the row's horizontal inset, divider, full-row link target, hover/focus behavior, and no-JavaScript navigation intact.
- Adjust cover image `sizes`/widths so the larger mobile cover is delivered at an appropriate resolution without over-fetching.
- The same stacked treatment applies wherever `ProjectRow` is used, including the work catalog and the home excerpt.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `work-catalog`: The "Mobile catalog" requirement changes from a side-by-side row with a small thumbnail to a stacked row where the cover sits above the project content. The anatomy of each entry remains the same.

## Impact

- `src/components/catalog/ProjectRow.astro` — mobile grid template, cover sizing, and breakpoint styles.
- Consumers of the row: `src/components/catalog/WorkIndex.astro` and `src/components/profile/IndexExcerpt.astro`.
- End-to-end catalog tests may need a mobile layout assertion; no content schema, data, or route changes.
