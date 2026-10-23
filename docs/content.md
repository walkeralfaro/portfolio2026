# Content model

The site has one project metadata record per project and optional long-form case bodies. Shared metadata lives once per project; Spanish and English fields are required on every record.

## Collections

### `projects`

Defined in `src/content.config.ts` and loaded from `src/content/projects/*.yaml`.

Required fields:

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | string | Must be one of the 14 catalog slugs. Must match the filename. |
| `year` | integer or `pending` | Use `pending` when the source note has no date. |
| `category` | `ia` \| `producto` \| `frontend` \| `juegos` | Primary catalog category. |
| `tags` | string[] | At least one editorial retrieval label. |
| `status` | `live` \| `in-development` \| `archived` | Availability label, not a business outcome. |
| `featured` | boolean | Exactly four projects are featured. |
| `order` | positive integer | Unique catalog order. |
| `stack` | string[] | Three to five items. |
| `links` | `{ live, code }` | URLs or `null`. Omitted actions use an availability note. |
| `cover` | string or `null` | `null` uses the local placeholder cover. |
| `locales.es` | object | Required Spanish title, summary, role, result, optional availability, optional gallery. |
| `locales.en` | object | Required English title, summary, role, result, optional availability, optional gallery. |

`slug`, `year`, `category`, `tags`, `status`, `featured`, `order`, `stack`, `links`, `cover`, and both locales are validated by the content schema. The shared slug/category/status lists live in `src/content/project-slugs.ts`.

### `cases`

Defined in `src/content.config.ts` and loaded from `src/content/cases/*.mdx`.

Frontmatter:

| Field | Type | Notes |
| --- | --- | --- |
| `project` | catalog slug | Must be one of the 14 slugs. Cases are optional supplemental narratives available to any project. |
| `locale` | `es` \| `en` | One body per locale. |
| `order` | positive integer | Uses the project order. |
| `updated` | date | Optional. |

Files use `<slug>.<locale>.mdx`, for example `todo-mcp.es.mdx` and `todo-mcp.en.mdx`.

Every case body must use this exact section sequence:

| Spanish | English |
| --- | --- |
| Problema | Problem |
| Rol | Role |
| Decisiones | Decisions |
| Resultado | Result |

The Decisions section must contain three or four numbered decisions. Every section must contain text. The validator also rejects Spanish fragments in English bodies.

Case bodies are narrative only. They must not declare `Stack` or `Gallery` sections: the stack is rendered once from the project record in the shared header, and the gallery is rendered from the active locale's `gallery` list only when it has at least one image.

## Image assets

Project images live inside the repository and are processed by the build. They are never hotlinked.

| Kind | Location | Scope |
| --- | --- | --- |
| Cover | `src/assets/covers/<slug>.<ext>` | One per project |
| Gallery screenshot | `src/assets/gallery/<slug>/<key>.<ext>` | Many per project, per locale |

The file name without its extension is the **asset key**. Content references keys, never paths. Both assets are optional and independent: a project can have a cover, a gallery, both, or neither.

```yaml
# src/content/projects/<slug>.yaml
cover: <key>

locales:
  es:
    gallery:
      - src: <key>
        alt: <texto alternativo>
```

`alt` is required for every gallery entry and is the only description assistive technology receives. The list order is the display order.

| Rule | Cover | Gallery |
| --- | --- | --- |
| Formats | `.webp` (preferred), `.png`, `.jpg`, `.jpeg`, `.avif` | Same |
| Frame | 16:10, matching `--cover-aspect` | Native ratio |
| Recommended width | 1600 px or more | 1200 px or more |
| Colour | sRGB | sRGB |

Only the cover is cropped: it fills the fixed 16:10 box with `object-fit: cover`, so keep the subject centred. Gallery thumbnails preserve the image ratio and show the whole frame. Dimensions are recommendations, not validation rules; a smaller source still renders without upscaling beyond its own width.

A project without a cover keeps `cover: null` and renders `PlaceholderCover`, which occupies the same 16:10 box. A locale with no gallery renders no section, caption, or dialog; it does not substitute the cover or stock images.

### Validation

- A key with no matching file fails `npm run validate:content`. `npm run build` does not run that validator, but the image resolver throws on a missing key, so a broken reference fails the build too.
- A file that no record references is reported as a notice and does not fail the run, so a file can be added before it is referenced.

## Inventory

The catalog contains exactly 14 projects, in this order:

| # | Project | Slug | Category | Year | Status |
| ---: | --- | --- | --- | --- | --- |
| 1 | TODO-mcp | `todo-mcp` | ia | 2026 | in-development |
| 2 | Image Prompt | `image-prompt` | ia | 2026 | in-development |
| 3 | Cheatsheet Editor | `cheatsheet-editor` | producto | 2026 | in-development |
| 4 | URL Shortener | `url-shortener` | producto | pending | live |
| 5 | Multi-step Form | `multi-step-form` | frontend | pending | live |
| 6 | Pokedex | `pokedex` | frontend | pending | in-development |
| 7 | Todo App | `todo-app` | frontend | pending | live |
| 8 | Tic Tac Toe | `tic-tac-toe` | juegos | pending | in-development |
| 9 | Tip Calculator | `tip-calculator` | frontend | pending | live |
| 10 | Weather App | `weather-app` | frontend | pending | archived |
| 11 | REST Countries Explorer | `rest-countries-explorer` | frontend | 2023 | archived |
| 12 | Tetris | `tetris` | juegos | pending | live |
| 13 | Portfolio Profesional | `portfolio-profesional` | producto | 2023 | live |
| 14 | Portfolio 2026 | `portfolio-2026` | producto | 2026 | in-development |

Portfolio 2026 is this site, so it is the 14th project. Excluded client work is intentionally absent from all records and case bodies.

Category counts: `ia` 2, `producto` 4, `frontend` 6, `juegos` 2. Featured projects: TODO-mcp, Image Prompt, URL Shortener, and Tetris.

## Project rules

Every project has the same standing and the same page treatment:

- Each project gets a Spanish and English detail page at `/work/<slug>/` and `/en/work/<slug>/`.
- The shared header always renders the localized title, summary, year, category, status, stack, conditional live/code actions, and the optional cover.
- The body renders the richer MDX narrative when the project has one; otherwise it renders the localized `summary`, `role`, and `result` as what/role/result sections.
- The stack appears once, from the project record in the shared header. Case narratives never repeat it.
- A cover is optional. A missing cover keeps `cover: null` and renders the designed placeholder.
- A gallery is optional and locale-specific. A locale with no entries renders no gallery section, caption, pending message, cover substitute, or dialog.
- Gallery images come only from the active locale's `gallery` list, never from the narrative.
- Existing supplemental MDX narratives are optional. Their presence does not decide whether a project has a page, cover, gallery, or actions.

The validator enforces the 14-project inventory, the four-project featured set, unique slugs and order values, both locales, 3–5 stack items, valid categories and statuses, a link or availability note in each locale, the four-heading case sequence, and every cover and gallery reference.

## Read-only generated data

`data.js` is generated and read-only:

- Do not edit `data.js` by hand.
- Do not copy `data.js` into a page. Import it through the adapters in `src/data/`.
- `projects/*.md` are source notes, not runtime content.
- `src/data/cv.schema.ts` validates the generated shape with Zod.
- `src/data/cv.es.ts` imports `data.js` and parses it through the schema for the about-page history.
- `src/data/cv.en.ts` is a complete English translation with the same structure.
- The schema omits the `mobile` field, so the phone number is stripped from the adapted output.
- The adapters describe the excluded client project generically; it is never published.
- The site does not render a CV page or produce a PDF; CV controls link to `https://resume.walkeralfaro.com/`.
- `npm run build` runs the profile data validation before Astro builds.

When the generated source changes upstream, regenerate `data.js`, then run the commands below before committing.

## Source map and pending fields

`docs/content-sources.md` records the origin of every project metric and claim, plus all pending years, missing links, and missing covers. Do not replace a pending value with a guessed one.

## Commands

Run these from the repository root after changing content:

```bash
npm run validate:content
npm run validate:cv
npm run check
npm run build
```

`validate:content` checks the 14 YAML records, the optional case bodies, and that every cover and gallery reference resolves to an image file. `validate:cv` checks both profile data adapters, the section counts, the schema, and the absence of the mobile phone and excluded client data. `check` runs Astro's TypeScript and content diagnostics. `build` runs the CV validation again through `prebuild` and produces the static site.

Expected validation summaries:

```text
Content validation passed: 14 projects, 12 case bodies.
CV validation passed for es/en: 6 experience, 2 education, 5 projects, 8 skills, 8 courses, 2 languages.
```
