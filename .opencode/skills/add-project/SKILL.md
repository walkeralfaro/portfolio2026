---
name: add-project
description: Add a self-contained project to the portfolio catalog. Use when the user wants to add, import, or publish a new project, or when they ask to complete or review a projects/<slug>/content.yaml file.
license: MIT
---

# Add a project

Every project lives in one folder and owns all of its content:

```text
projects/<slug>/
  README.md              raw source note (provenance, never rendered)
  content.yaml           the single source of published project content
  cover.webp             optional cover, detected automatically
  screenshots/<key>.webp optional gallery images referenced by key
```

The folder name is the slug. There is no central project list to edit.

## Rules

- Never invent a fact, translation, link, year, screenshot, or outcome. If the source does not support a field, ask the user or use `pending` / `null` with an honest `availability` note.
- Spanish and English are both required. English is a translation of the Spanish editorial content, not a new source of claims.
- Do not edit `src/content.config.ts`, `src/lib/projects.ts`, or any route to add a project. The catalog discovers every `projects/*/content.yaml` automatically.
- Do not hotlink images. Copy local files into the project folder.
- `README.md` is provenance. Read it; do not rewrite it.
- The cover is not a field. If `projects/<slug>/cover.webp` exists, it is used; otherwise the designed placeholder renders.

## Workflow

1. **Confirm the slug.** It must be lowercase kebab-case and match the folder, for example `rest-countries-explorer`. If the folder already has content, this is an update, not a new project.

2. **Scaffold the project** (skip if `content.yaml` already exists):

   ```bash
   npm run project:new -- <slug>
   ```

   This copies `.opencode/skills/add-project/assets/content.template.yaml` to `projects/<slug>/content.yaml` and assigns the next catalog order.

3. **Read the source.** Read `projects/<slug>/README.md` completely. If there is no README, ask the user for the source material before writing content.

4. **Fill every field** in `content.yaml`:

   | Field | Rule |
   | --- | --- |
   | `slug` | Same value as the folder. |
   | `year` | Integer, or `pending` when no date is documented. Never guess. |
   | `month` | Integer 1-12. Required when `year` is numeric; omit it when `year` is `pending`. |
   | `category` | `ia`, `producto`, `frontend`, or `juegos`. Ask if the source is ambiguous. |
   | `tags` | One or more short retrieval labels drawn from the source. |
   | `status` | `live`, `in-development`, or `archived`. Existing projects are all in production and use `live`; for a new project, follow the documented deployment state. |
   | `featured` | `true` for at most four projects overall. Ask before changing the set. |
   | `order` | Positive unique integer used as a date tiebreaker. `project:new` already assigned the next one. |
   | `stack` | Three to five normalized technologies. |
   | `links.live` | Real deployment URL or `null`. |
   | `links.code` | Real repository URL or `null`. |
   | `locales.<locale>.title` | Project title in that language. |
   | `locales.<locale>.summary` | One clear sentence. |
   | `locales.<locale>.role` | Short role statement. |
   | `locales.<locale>.result` | Short outcome statement. |
   | `locales.<locale>.availability` | Required when both links are `null`; must exist in both locales or neither. |
   | `locales.<locale>.gallery` | Ordered list of `{ src, alt }` using screenshot keys. |
   | `locales.<locale>.narrative` | Optional Problem / Role / Decisions / Result block; must exist in both locales or neither. |

5. **Write the optional narrative.** Use `narrative` when the source supports all four parts in both languages. `decisions` takes three or four objects:

   ```yaml
   narrative:
     problem: |
       ...
     role: |
       ...
     decisions:
       - title: Short decision name
         body: |
           Why it was made and what it changed.
       - title: ...
         body: |
           ...
       - title: ...
         body: |
           ...
     result: |
       ...
   ```

   If either language cannot support the narrative, omit it from both. Without a narrative, the detail page renders the localized summary, role, and result.

6. **Add images only when the user supplies local files.**

   - Cover: `projects/<slug>/cover.webp`. Preferred 16:10, at least 1600 px wide.
   - Screenshots: `projects/<slug>/screenshots/<key>.webp`. The key is the file name without the extension.
   - Reference a screenshot with `src: <key>` and write a localized `alt` that describes the image, not the project title.
   - Leave `gallery: []` when there are no screenshots. Never write "gallery pending" prose.

7. **Validate.**

   ```bash
   npm run validate:content
   npm run content:status
   npm run check
   npm run build
   ```

   `validate:content` checks the schema, slug/folder match, placeholders, unique order, featured count, link/availability rules, and every gallery key. `content:status` prints the catalog inventory generated from the folders.

8. **Review the result.** Open the project in both locales:

   - `/work/<slug>/`
   - `/en/work/<slug>/`

   Confirm the header, actions, body, gallery, and previous/next links. Then report what changed and which fields remain pending.

## Template and example

- `assets/content.template.yaml` is the canonical scaffold used by `npm run project:new`.
- `assets/content.example.yaml` is a complete, valid reference. Read it before authoring a narrative; do not copy its claims.

## Update an existing project

Edit `projects/<slug>/content.yaml` directly, keep the slug equal to the folder, and rerun `npm run validate:content`. Do not regenerate the file: there is no importer and no generated copy to synchronize.
