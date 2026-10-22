# Design

## Context

See `proposal.md` for motivation. The current Astro build reads two collections: `projects` from `src/content/projects/*.yaml` and optional `cases` from `src/content/cases/*.mdx`. Pages, the catalog, image resolution, and E2E tests depend on those paths and shapes. The content validator and `src/content.config.ts` independently re-declare overlapping schemas, and the 12 existing case bodies still require six headings, including Stack and Gallery.

The raw source notes already live under `projects/`, which is listed in `.gitignore` even though several files are tracked. Project READMEs have no shared structure, so extracting facts mechanically would be unreliable. The site should keep its current rendering path while changing how content is authored and validated.

## Goals / Non-Goals

**Goals:**

- Make one normalized intake file the only file an AI assistant authors from a project README.
- Keep the published collections and page components unchanged.
- Generate canonical YAML and optional MDX deterministically.
- Make the project record the only source for stack and gallery.
- Detect stale or manually edited generated files.
- Preserve raw source provenance and avoid invented facts.

**Non-Goals:**

- Replacing Astro content collections with a custom loader.
- Fetching remote images or calling an AI service during `astro build`.
- Publishing every project with a narrative; baseline projects keep the YAML-only rendering path.
- Translating a missing locale automatically.

## Decisions

### Keep YAML and MDX as generated outputs

The importer will write `src/content/projects/<slug>.yaml` and, when a narrative exists, `src/content/cases/<slug>.<locale>.mdx`. This preserves the existing content collections, page components, image resolution, and test selectors. A custom loader that reads intake files directly would remove one generation step but would require rewriting the content model, validator, and several accessors.

### Use one AI-authored intake YAML per project

Each project folder will contain:

```text
projects/<slug>/
  README.md       raw source, arbitrary structure
  content.yaml    normalized editorial intake, one documented schema
```

`content.yaml` contains the shared project fields plus `locales.es` and `locales.en`. Each locale has title, summary, role, result, optional availability, a gallery list, and an optional `narrative` with problem, role, decisions, and result. YAML is chosen over JSON because it supports multi-line prose cleanly and is already a project dependency.

The importer never interprets the README. The AI reads it and writes the intake; the script validates and renders. This keeps non-deterministic work outside the build and makes every format decision reviewable.

### Separate check and write modes

The command shape is:

```bash
npm run content:status
npm run content:import -- projects/<slug> --check
npm run content:import -- projects/<slug> --write
```

`content:status` scans nested READMEs and reports missing intake, stale output, or ready projects. Check mode validates without touching files. Write mode validates the whole project before writing, so a validation failure produces no partial output.

### Record provenance in a manifest

`projects/.import-manifest.json` will map each slug to the README hash and the hashes of its generated files. The importer uses SHA-256 from `node:crypto`; it makes no network calls.

Generated YAML and MDX also carry a comment header pointing to the intake. The manifest is authoritative for safe writes: if a generated file's hash no longer matches, write mode refuses unless `--force` is passed. This avoids silently destroying a manual edit and makes README changes visible as stale output.

### Make stack and gallery record-owned

Generated case bodies will contain only Problem, Role, Decisions, and Result. Stack remains in the project YAML and is rendered once by the shared header. Gallery images remain in the locale's YAML gallery list and are rendered by `ScreenshotGallery.astro` only when the list is non-empty. Existing MDX Stack and Gallery sections will be removed; their stack facts are already in YAML and their gallery-pending prose is obsolete. This changes the case heading contract from six headings to four and requires updating the validator, E2E expectations, and docs.

### Share schemas instead of duplicating them

A shared module under `src/content/` will export the project field schema, the localized schema, and the intake schema. `src/content.config.ts`, the content validator, and the importer will import it. The shared module will use the `zod` package so Node scripts and Astro use the same validator implementation. If Astro's content config rejects the external schema during the first build, the fallback is to keep the Astro schema wrapper local and re-export only the field objects; that decision is verified in the first implementation task.

### Fail closed on incomplete content

The intake schema is strict and requires both locales, 3–5 stack items, a link or availability note per locale, unique order, and a known slug/category/status. Missing facts become `null`, `pending`, or an empty gallery, never guessed text. A narrative is optional; if present, both locales must have all four parts and three or four decisions, so a page never mixes a narrative with baseline sections. Untranslated locales fail validation.

### Repository layout and migration

New imports use the nested `projects/<slug>/README.md` layout. Flat legacy notes under `projects/*.md` remain untouched and outside the importer scan. `projects/` will be removed from `.gitignore` so new READMEs and intakes are versioned. Existing YAML and MDX are migrated in place; the importer can regenerate only projects that have an intake.

## Risks / Trade-offs

- **AI mapping errors** → the intake is human-readable and check mode reports field-level problems before write; the user reviews the intake.
- **Two authored layers (README and intake)** → the README is raw provenance and `content.yaml` is the curated contract; generated files are never edited. The manifest reports when the raw source changes.
- **Manual edits to generated files** → hash checks block overwrite and name the changed file; `--force` is explicit.
- **Migration loses narrative detail** → only Stack and Gallery headings are removed; stack facts stay in YAML and gallery-pending prose was not renderable content. Review the diff for the 12 case bodies.
- **Schema sharing breaks Astro content config** → verify early with a build; keep the local wrapper if needed without changing the importer contract.
- **Remote screenshots in READMEs** → the importer performs no network access. Images must be downloaded into `src/assets/gallery/<slug>/` before their keys are referenced; otherwise the gallery stays empty.

## Migration Plan

1. Add the shared schemas, intake contract, importer, manifest, and tests.
2. Remove Stack and Gallery sections from the 12 existing case bodies; update the content validator, E2E heading expectations, and documentation.
3. Unignore `projects/` and add the AI-facing import guide.
4. Pilot the importer on one project, compare generated output with the current record, then leave the remaining projects to be migrated as their READMEs arrive.
5. Rollback is file-based: generated outputs and migrated MDX are committed, so any step can be reverted without data loss.

## Open Questions

None that block implementation. Remote image downloading and bulk migration of all 14 legacy notes can be handled as follow-up changes.
