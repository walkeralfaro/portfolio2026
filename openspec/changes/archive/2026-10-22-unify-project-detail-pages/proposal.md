# Proposal

## Why

The catalog currently assigns projects three different levels of access: some get a full case page, some get a short page, and others have no page and send visitors directly to an external destination. This makes project metadata, routes, galleries, validation, and tests depend on a tier instead of treating each project as a first-class portfolio entry.

## What Changes

- **BREAKING** Remove the project `tier` field and all behavior, validation, content rules, and UI that depend on tier membership.
- Generate a Spanish and English detail page for every project slug, using one shared page structure and the project's localized data. Existing MDX case narratives remain supplemental content; their existence no longer decides whether a page or gallery is available.
- Make each catalog row navigate to its internal project detail page. Keep real live and repository URLs as conditional actions on that page; missing actions remain honestly labeled.
- Keep the existing four home-page featured projects unchanged. Featured status affects only the home presentation, not page availability or detail depth.
- Give every project record the same cover and gallery capabilities. Covers remain optional and use the designed placeholder when no asset is referenced. Gallery entries are optional and locale-specific; when there are no entries, the gallery section is omitted entirely rather than replaced by the cover.
- Fit lightbox images inside the available dialog and viewport while preserving their aspect ratio. The dialog must not scroll to reveal a tall image; the page remains scroll-locked behind it and Escape/focus-return behavior stays intact.
- Update content validation, route/link helpers, catalogs, tests, and documentation to remove tier-based rules and cover all project slugs.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `work-catalog`: every project has a bilingual internal detail page; catalog rows no longer route tier 3 entries directly off-site; all project records support optional covers and galleries; an empty gallery is not rendered; lightbox content fits without dialog scrolling.
- `professional-profile`: preserve the existing four featured projects and require their links to resolve to internal project detail pages.

## Impact

- Project model and content validation: `src/content.config.ts`, `src/content/project-slugs.ts`, `scripts/validate-content.ts`, and all `src/content/projects/*.yaml` records.
- Gallery metadata migration from case-only MDX frontmatter into locale-specific project content so every project can declare screenshots independently of supplemental narratives.
- Static route generation, project accessors, catalog row destinations, detail composition, previous/next navigation, cover and gallery rendering, and lightbox sizing.
- Spanish and English project-detail and catalog E2E tests, validators, and documentation including `docs/content.md`, `docs/cases.md`, `docs/catalog.md`, and the asset README files.
- No new dependency. The current four featured home entries and all real project links remain unchanged.
