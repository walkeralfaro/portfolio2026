# Proposal

## Why

The cover and gallery authoring rules are duplicated across `docs/content.md` and two asset-folder READMEs. The duplicates already disagree with the implementation and with each other: they list an incomplete set of accepted formats, call a recommended width a minimum, pin project-specific examples, and record image dimensions that no longer match the files. One source reduces maintenance and prevents future drift.

## What Changes

- Make `docs/content.md` the single source of truth for project image assets.
- Rewrite its *Image assets* section so it covers covers and galleries together: locations and key resolution, optional and independent assets, locale-specific `alt`, accepted formats, recommended dimensions, crop versus native-ratio behavior, fallbacks, and validation.
- Remove project-specific examples and volatile facts (catalog size, panel counts, published image widths) from that section.
- Delete `src/assets/covers/README.md` and `src/assets/gallery/README.md`.
- Update the source-map reference in `docs/content-sources.md` that points to the deleted gallery README.
- No runtime, schema, validation, content-record, or build changes.

## Capabilities

### New Capabilities

None. This is a documentation-only change; behavior does not change.

### Modified Capabilities

None. Existing image asset requirements already describe the behavior; only their documentation location changes.

## Impact

- `docs/content.md`: rewritten *Image assets* section.
- `docs/content-sources.md`: one citation updated.
- `src/assets/covers/README.md`, `src/assets/gallery/README.md`: removed.
- No code, tests, dependencies, content records, or published behavior affected.
