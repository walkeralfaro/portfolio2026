# Proposal

## Why

`docs/project-readme-import.md` is meant to be the reusable intake contract for any project README, but its schema example is a concrete Pokedex record and several rules state portfolio-specific curation values. That makes the document read as documentation for one project instead of a template, and it invites future imports to copy sample values.

## What Changes

- Rewrite the intake schema example with neutral placeholders instead of a named project, its technology, and its content.
- Replace project-specific curation statements, such as the featured-project count and the enumerated category list, with instructions to use the values defined by the catalog and content schema.
- Keep the operational contract unchanged: folder layout, extraction rules, narrative shape, gallery handling, commands, generated outputs, and validation steps.
- Make the document's opening and section wording project-agnostic so it reads as a template rather than a case study.

## Capabilities

### New Capabilities

None. This is a documentation-only change; no system behavior or spec-level requirement changes.

### Modified Capabilities

None.

## Impact

- `docs/project-readme-import.md` only.
- No changes to the importer, schemas, generated content, tests, or build.
