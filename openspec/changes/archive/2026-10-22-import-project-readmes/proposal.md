# Proposal

## Why

Project READMEs do not share a structure, but the site currently expects hand-authored YAML metadata and MDX case bodies that repeat the stack and occasionally include gallery-pending prose. This creates multiple sources of truth: the stack appears in both the YAML and the MDX, a gallery message can appear when there are no images, and projects without a case body use a different rendering path. A repeatable, AI-assisted import step is needed so every README becomes the same validated content shape without losing source material.

## What Changes

- Treat `projects/<slug>/README.md` as the raw source note for each project, kept in the repository instead of ignored.
- Add one normalized intake file per project, `projects/<slug>/content.yaml`, as the only file an AI assistant authors from the README.
- Add a deterministic importer that validates the intake and generates `src/content/projects/<slug>.yaml` plus optional `src/content/cases/<slug>.<locale>.mdx`.
- Record the source README hash and generated file hashes so the importer can report stale content and refuse to overwrite manually edited files.
- Make the project record the single source for the stack and gallery. Case narratives keep only Problem, Role, Decisions, and Result; they no longer declare Stack or Gallery sections.
- Omit the gallery entirely when the active locale has no images, with no heading, caption, placeholder message, or dialog.
- Migrate the existing case bodies to the reduced narrative sequence, update the content validator, documentation, and tests to the new contract.
- Add a documented AI contract with the exact intake schema, extraction rules, and uncertainty handling.

## Capabilities

### New Capabilities

- `project-content-import`: README ingestion contract, AI-normalized intake, deterministic generation, provenance, and consistency checks.

### Modified Capabilities

- `work-catalog`: stack and gallery become single-sourced from the project record; case narratives no longer repeat them and empty galleries render no section.

## Impact

- Content: `projects/`, `src/content/projects/`, `src/content/cases/`, `.gitignore`.
- Tooling: new importer under `scripts/`, shared content schemas, `package.json` scripts.
- Validation: `scripts/validate-content.ts`, `scripts/validate-i18n.ts`, and unit tests.
- Rendering/tests: case heading expectations in `tests/e2e/detail.spec.ts`; no page component rewrite is expected.
- Documentation: `docs/content.md`, `docs/cases.md`, `docs/content-sources.md`, and a new import guide.
