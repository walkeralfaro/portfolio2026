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
| `tier` | 1 \| 2 \| 3 | Controls the depth of the project page. |
| `status` | `live` \| `in-development` \| `archived` | Availability label, not a business outcome. |
| `featured` | boolean | Exactly four projects are featured. |
| `order` | positive integer | Unique catalog order. |
| `stack` | string[] | Three to five items. |
| `links` | `{ live, code }` | URLs or `null`. Omitted actions use an availability note. |
| `cover` | string or `null` | `null` uses the local placeholder cover. |
| `locales.es` | object | Required Spanish title, summary, role, result, optional availability. |
| `locales.en` | object | Required English title, summary, role, result, optional availability. |

`slug`, `year`, `category`, `tags`, `tier`, `status`, `featured`, `order`, `stack`, `links`, `cover`, and both locales are validated by the content schema. The shared slug/category/status lists live in `src/content/project-slugs.ts`.

### `cases`

Defined in `src/content.config.ts` and loaded from `src/content/cases/*.mdx`.

Frontmatter:

| Field | Type | Notes |
| --- | --- | --- |
| `project` | catalog slug | Must be one of the 14 slugs. Only tier 1 projects may have cases. |
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
| Stack | Stack |
| Galería | Gallery |

The Decisions section must contain three or four numbered decisions. Every section must contain text. The validator also rejects Spanish fragments in English bodies.

## Inventory

The catalog contains exactly 14 projects, in this order:

| # | Project | Slug | Tier | Category | Year | Status |
| ---: | --- | --- | ---: | --- | --- | --- |
| 1 | TODO-mcp | `todo-mcp` | 1 | ia | 2026 | in-development |
| 2 | Image Prompt | `image-prompt` | 1 | ia | 2026 | in-development |
| 3 | Cheatsheet Editor | `cheatsheet-editor` | 1 | producto | 2026 | in-development |
| 4 | URL Shortener | `url-shortener` | 1 | producto | pending | live |
| 5 | Multi-step Form | `multi-step-form` | 1 | frontend | pending | live |
| 6 | Pokedex | `pokedex` | 2 | frontend | pending | in-development |
| 7 | Todo App | `todo-app` | 2 | frontend | pending | live |
| 8 | Tic Tac Toe | `tic-tac-toe` | 2 | juegos | pending | in-development |
| 9 | Tip Calculator | `tip-calculator` | 3 | frontend | pending | live |
| 10 | Weather App | `weather-app` | 3 | frontend | pending | archived |
| 11 | REST Countries Explorer | `rest-countries-explorer` | 3 | frontend | 2023 | archived |
| 12 | Tetris | `tetris` | 1 | juegos | pending | live |
| 13 | Portfolio Profesional | `portfolio-profesional` | 3 | producto | 2023 | live |
| 14 | Portfolio 2026 | `portfolio-2026` | 2 | producto | 2026 | in-development |

Portfolio 2026 is this site, so it is the 14th project. Excluded client work is intentionally absent from all records and case bodies.

Category counts: `ia` 2, `producto` 4, `frontend` 6, `juegos` 2. Featured projects: TODO-mcp, Image Prompt, URL Shortener, and Tetris.

## Tier rules

| Tier | Count | Content |
| --- | ---: | --- |
| 1 | 6 | Full case study: problem, role, decisions, result, stack, gallery notes, actions. Both MDX locales required. |
| 2 | 4 | Short case study rendered from `locales.es` / `locales.en`: what, role, result, actions. No MDX body. |
| 3 | 4 | Archive metadata only, with no internal detail page. The entry opens a real external destination or states that links are pending. |

Tier 1: TODO-mcp, Image Prompt, Cheatsheet Editor, URL Shortener, Multi-step Form, Tetris.

Tier 2: Pokedex, Todo App, Tic Tac Toe, Portfolio 2026.

Tier 3: Tip Calculator, Weather App, REST Countries Explorer, Portfolio Profesional.

The validator enforces 6 / 4 / 4, the featured set, unique slugs and order values, both locales, 3–5 stack items, valid categories and statuses, tier-specific action/availability metadata, and the 12 tier 1 case bodies.

## Read-only generated data

`data.js` is generated and read-only:

- Do not edit `data.js` by hand.
- Do not copy `data.js` into a page. Import it through the adapters in `src/data/`.
- `projects/*.md` are source notes, not runtime content.
- `src/data/cv.schema.ts` validates the generated shape with Zod.
- `src/data/cv.es.ts` imports `data.js` and parses it through the schema.
- `src/data/cv.en.ts` is a complete English translation with the same structure.
- The CV schema omits the `mobile` field, so the phone number is stripped from the adapted output.
- The adapters describe the excluded client project generically; it is never published.
- `npm run build` runs the CV validation before Astro builds.

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

`validate:content` checks the 14 YAML records and the 12 tier 1 case bodies. `validate:cv` checks both CV adapters, the section counts, the schema, and the absence of the mobile phone and excluded client data. `check` runs Astro's TypeScript and content diagnostics. `build` runs the CV validation again through `prebuild` and produces the static site.

Expected validation summaries:

```text
Content validation passed: 14 projects (tier 1: 6, tier 2: 4, tier 3: 4), 12 tier 1 case bodies.
CV validation passed for es/en: 6 experience, 2 education, 5 projects, 8 skills, 8 courses, 2 languages.
```
