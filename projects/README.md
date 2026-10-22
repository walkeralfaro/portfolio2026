# Project README intake

Each imported project lives in its own folder:

```text
projects/<slug>/
  README.md       raw source note, any structure
  content.yaml    normalized intake authored by the AI assistant
```

`README.md` is the original source and keeps its own format. `content.yaml` is the only file that must follow the import schema. The assistant reads the README and writes the intake; it must not invent missing facts, translations, links, or screenshots.

## Workflow

1. Add or update `projects/<slug>/README.md`.
2. Ask the AI assistant to create or update `projects/<slug>/content.yaml` using `docs/project-readme-import.md`.
3. Review the intake, especially category, status, order, featured, links, and translations.
4. Run the check:

   ```bash
   npm run content:import -- projects/<slug> --check
   ```

5. When the check passes, write the generated files:

   ```bash
   npm run content:import -- projects/<slug> --write
   ```

6. Run the site checks:

   ```bash
   npm run validate:content
   npm run check
   npm run build
   ```

Use `npm run content:status` to see whether each project README has a missing intake, stale output, a manual edit, or is ready.

## Generated files

The importer writes `src/content/projects/<slug>.yaml` and, when both locales have a narrative, `src/content/cases/<slug>.es.mdx` and `<slug>.en.mdx`.

Do not edit those generated files by hand. If the README changes, update `content.yaml` first. The importer records hashes in `projects/.import-manifest.json` and refuses to overwrite files that were edited manually unless `--force` is passed.

Stack and gallery data belong only in `content.yaml`. Case narratives contain Problem, Role, Decisions, and Result; they never repeat the stack or add gallery-pending prose.
