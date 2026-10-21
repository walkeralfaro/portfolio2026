# Proposal

## Why

Project rows currently begin flush against the left edge of the catalog column, so titles, summaries, and mobile thumbnails look cramped even though the row dividers and hover surface already span the full width. The content needs breathing room without losing the full-row navigation target.

## What Changes

- Add horizontal inset to the project row content in `ProjectRow.astro` using the existing `--space-4` spacing token, applied on both sides and at every breakpoint.
- Keep the row dividers and the hover/focus surface at full width; only the inner content moves inward.
- Cover the inset in the catalog end-to-end test and note it in the catalog documentation.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `work-catalog`: project rows now inset their content horizontally while remaining full-width navigation targets.

## Impact

- `src/components/catalog/ProjectRow.astro` (row styling).
- Both consumers inherit the change: the work catalog and the home index excerpt.
- `tests/e2e/catalog.spec.ts` and `docs/catalog.md`.
- No data, routing, or API changes.
