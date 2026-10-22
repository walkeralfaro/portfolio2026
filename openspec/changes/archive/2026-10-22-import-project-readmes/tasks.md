# Tasks

## 1. Shared content schemas

- [x] 1.1 Create `src/content/schemas.ts` with the shared project, localized, case, and intake schemas; use `zod` so Astro and Node scripts share one validator, and verify `npm run check` still passes.
- [x] 1.2 Point `src/content.config.ts` at the shared schemas and remove its duplicate definitions; verify `npm run check` and `npm run build` accept the external schema module.
- [x] 1.3 Point `scripts/validate-content.ts` at the shared schemas and remove its duplicate project/case definitions; verify `npm run validate:content` still passes.
- [x] 1.4 Add `tests/unit/content-schema.test.ts` covering missing locale fields, unknown intake fields, 3–5 stack items, and mixed narrative presence; verify `npm run test:unit` passes.

## 2. Rendering and provenance

- [x] 2.1 Implement pure YAML rendering in `scripts/content-import/render.ts` with stable field order, a generated-file header, and no narrative body; add a unit test asserting the stack remains and narrative data is absent.
- [x] 2.2 Implement pure MDX rendering in the same module for the four localized headings and numbered decisions; add a unit test asserting no Stack or Gallery heading is emitted.
- [x] 2.3 Implement manifest helpers that hash text with SHA-256, read/write `projects/.import-manifest.json`, and compare recorded hashes; add unit tests for fresh, stale, and manually edited states.
- [x] 2.4 Implement intake cross-checks for folder/slug match, unique order, gallery key presence, and both-locale narrative symmetry; add unit tests for each failure with a field-level message.

## 3. Import command

- [x] 3.1 Add `scripts/content-import/cli.ts` with argument parsing and `--help`; verify `node scripts/content-import/cli.ts --help` prints check, write, force, and status usage.
- [x] 3.2 Implement `--check` to validate an intake and report every error without writing; add an integration test against a complete and an invalid fixture.
- [x] 3.3 Implement `--write` to validate fully before writing YAML/MDX and update the manifest only after success; add a test proving an invalid intake writes no project files.
- [x] 3.4 Implement safe overwrite checks using the manifest and `--force`; add tests for refusing a manually edited generated file and allowing the explicit override.
- [x] 3.5 Implement `content:status` scanning of nested `projects/*/README.md` folders and report missing, stale, and ready projects; add a fixture test for all three states.
- [x] 3.6 Add `content:import` and `content:status` scripts to `package.json`; verify both commands run from the repository root.

## 4. AI contract and project intake directory

- [x] 4.1 Remove `projects/` from `.gitignore`; verify `git status` shows new files under `projects/` as trackable.
- [x] 4.2 Add `projects/README.md` with the short workflow: raw README, AI-authored `content.yaml`, check, review, write, and do not edit generated files.
- [x] 4.3 Add `docs/project-readme-import.md` with the complete intake schema example, field rules, extraction guidance, uncertainty handling, gallery asset steps, and command reference; verify every command and field in the document matches the CLI and schema.
- [x] 4.4 Link the new guide from the root `README.md`; verify the link target exists and describes the README workflow.
- [x] 4.5 Add a pilot `projects/pokedex/README.md` and `content.yaml` derived only from the existing note and record; run check mode and verify it reports no errors without writing files.
- [x] 4.6 Run write mode for the pilot and verify the generated YAML preserves the Pokedex fields, the manifest records hashes, and no case body is created because there is no narrative.

## 5. Case body migration

- [x] 5.1 Remove the `Stack` and `Galería`/`Gallery` sections from all 12 files in `src/content/cases/` without changing the remaining narrative text; verify `rg '^## (Stack|Galería|Gallery)$' src/content/cases` returns no matches.
- [x] 5.2 Change `CASE_HEADINGS` in `scripts/validate-content.ts` to the four-heading sequence and keep the existing section and decision checks; verify `npm run validate:content` passes.
- [x] 5.3 Update `tests/e2e/detail.spec.ts` to expect four headings for narrative projects and add an assertion that no Stack or Gallery heading appears; verify `npm run test:e2e -- tests/e2e/detail.spec.ts` passes.
- [x] 5.4 Update `docs/content.md` so the case heading table, authoring rules, and validation notes describe four headings and record-owned stack/gallery; verify no six-heading instruction remains.
- [x] 5.5 Update `docs/cases.md` so the page anatomy, authoring steps, and test coverage section describe the four-heading narrative and empty-gallery behavior; verify the documented commands still match `package.json`.
- [x] 5.6 Update `docs/content-sources.md` where it describes case-body provenance or gallery guidance so it points to the intake workflow without changing source claims; verify the referenced paths exist.

## 6. Integration verification

- [x] 6.1 Run `npm run validate:content` and `npm run validate:i18n`; verify both pass with 14 projects and 12 case bodies.
- [x] 6.2 Run `npm run test:unit`; verify all schema, renderer, manifest, and import tests pass.
- [x] 6.3 Run `npm run check` and `npm run build`; verify the build completes and the generated site contains 38 pages.
- [x] 6.4 Run `npm run test:e2e`; verify the full Playwright suite passes, including the four-heading and empty-gallery checks.
- [x] 6.5 Run `npm run content:status`; verify the pilot is ready, no generated file is stale, and legacy flat notes are not treated as imported projects.
