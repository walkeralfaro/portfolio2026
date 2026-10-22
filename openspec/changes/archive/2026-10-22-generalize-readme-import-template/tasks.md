# Tasks

## 1. Rewrite the intake template

- [x] 1.1 Rewrite the opening, assistant rules, and extraction guidance in `docs/project-readme-import.md` so they describe any project and defer curation limits to the catalog and content schema; verify the section no longer names a specific project, technology stack, featured count, or category list.
- [x] 1.2 Replace the concrete intake schema example with neutral placeholders that keep every field required by `src/content/schemas.ts`; verify each shared, link, cover, locale, gallery, and narrative field still appears in the example.
- [x] 1.3 Replace the narrative example with localized placeholders and keep the both-locales rule and the three-or-four decision constraint; verify the prose and sample agree.
- [x] 1.4 Leave the gallery, commands, generated-output, and validation sections behaviorally unchanged, and update their wording only where it refers to a specific project; verify the commands still match `package.json` and the output paths still match `scripts/content-import`.

## 2. Verify the template

- [x] 2.1 Search `docs/project-readme-import.md` for concrete project names, project-specific technologies, and hard-coded curation values; verify no named project remains and the file reads as a reusable template.
- [x] 2.2 Run `openspec validate generalize-readme-import-template --strict` and verify the change passes with specs marked skipped.
- [x] 2.3 Review the diff and verify only `docs/project-readme-import.md` and the change artifacts changed, with no importer, schema, generated content, or test edits.
