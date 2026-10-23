---
description: "Add a self-contained project to the portfolio catalog"
---

Use the `add-project` skill to add or update a project under `projects/<slug>/`.

**Provided arguments**: $ARGUMENTS

If the argument is empty, ask for the project slug and its source folder or README. The slug must be lowercase kebab-case.

Follow `.opencode/skills/add-project/SKILL.md`:

1. Confirm the slug and whether the project is new or an update.
2. For a new project, run `npm run project:new -- <slug>`.
3. Read `projects/<slug>/README.md` and fill `projects/<slug>/content.yaml` in Spanish and English without inventing facts.
4. Add local images only if the user supplied them: `cover.webp` and `screenshots/<key>.webp`.
5. Run `npm run validate:content`, `npm run content:status`, `npm run check`, and `npm run build`.
6. Review `/work/<slug>/` and `/en/work/<slug>/`, then report pending fields.

Never edit a central inventory: the folder name is the slug and `content.yaml` is the only published record.
