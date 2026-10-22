# Importing a project README

This document is the contract for an AI assistant turning `projects/<slug>/README.md` into `projects/<slug>/content.yaml`. The assistant performs the interpretation; the importer performs validation and deterministic rendering.

## Rules for the assistant

- Read the README and the existing project record before writing the intake.
- Never invent a fact, translation, link, screenshot, year, or achievement.
- Ask the user when a required editorial field is not supplied: `slug`, `category`, `featured`, `order`, and `status`.
- Write both locales. English is a translation of the Spanish editorial content, not a new source of claims.
- Keep the README as the raw provenance; do not rewrite it.
- Do not edit `src/content/projects/*.yaml`, `src/content/cases/*.mdx`, or `.import-manifest.json` by hand.
- Put the stack and gallery only in the intake. The case narrative never declares a Stack or Gallery section.
- If a narrative cannot be supported in both languages, omit `narrative` from both locales.

## Extraction guidance

| Intake field | Where it comes from | Rule |
| --- | --- | --- |
| `slug` | Project folder / catalog inventory | Kebab-case folder name; must match `projects/<slug>/`. |
| `year` | README date, repository metadata, or user | Integer or `pending`; never guess. |
| `category` | User or existing catalog | One of `ia`, `producto`, `frontend`, `juegos`. |
| `tags` | README technology and feature notes | One or more editorial retrieval labels. |
| `status` | README links and verified deployment state | `live`, `in-development`, or `archived`. |
| `featured` | User/catalog curation | Boolean; exactly four projects are featured site-wide. |
| `order` | Catalog curation | Positive unique integer. |
| `stack` | “Built with”, “Tech stack”, or equivalent | Three to five normalized items; strip links and descriptions. |
| `links.live` | “Live Site URL” or verified deployment | Real URL or `null`; placeholders are not links. |
| `links.code` | “Solution URL”, repository, or source link | Real URL or `null`. |
| `cover` | Local cover asset key | `null` unless `src/assets/covers/<slug>.<ext>` exists. |
| `locales.<locale>.title` | Main heading | Project title in that language. |
| `locales.<locale>.summary` | Overview / challenge | One clear sentence. |
| `locales.<locale>.role` | Author / contribution notes | Short role statement used when there is no narrative. |
| `locales.<locale>.result` | Implemented features / outcome | Short result statement used when there is no narrative. |
| `locales.<locale>.availability` | Missing links or pending demo | Required when both links are `null`; concise and truthful. |
| `locales.<locale>.gallery` | Local screenshots | Empty list unless files exist under `src/assets/gallery/<slug>/`. |
| `locales.<locale>.narrative` | Problem, role, decisions, result sections | Optional; both locales or neither. |

## Intake schema

```yaml
slug: pokedex
year: pending
category: frontend
tags: [pokeapi, react, zustand]
status: in-development
featured: false
order: 6
stack: [React 19, TypeScript, Vite, Zustand, React Router 7]
links:
  live: null
  code: null
cover: null
locales:
  es:
    title: Pokedex
    summary: Explorador de los primeros 151 Pokémon con tipos, peso, movimientos y cadena de evolución.
    role: Desarrollo individual como proyecto personal, incluyendo el consumo de PokeAPI, el estado global y las vistas.
    result: Lista en cuadrícula, detalle por Pokémon, badges de tipo, cadena de evolución recursiva y estados de carga y error.
    availability: Demo y código pendientes.
    gallery: []
  en:
    title: Pokedex
    summary: Explorer of the first 151 Pokémon with types, weight, moves, and evolution chains.
    role: Individual development as a personal project, covering PokeAPI integration, global state, and views.
    result: A grid list, per-Pokémon detail, type badges, a recursive evolution chain, and loading and error states.
    availability: Demo and code pending.
    gallery: []
```

When the README supports a full narrative, add it to both locales:

```yaml
locales:
  es:
    narrative:
      problem: |
        The problem in Spanish.
      role: |
        The role in Spanish.
      decisions:
        - "**Decision one.** Explanation."
        - "**Decision two.** Explanation."
        - "**Decision three.** Explanation."
      result: |
        The result in Spanish.
  en:
    narrative:
      problem: |
        The problem in English.
      role: |
        The role in English.
      decisions:
        - "**Decision one.** Explanation."
        - "**Decision two.** Explanation."
        - "**Decision three.** Explanation."
      result: |
        The result in English.
```

`narrative.decisions` must contain three or four items. The generated case bodies use exactly Problem, Role, Decisions, and Result headings. The importer adds the locale-appropriate headings and numbering.

## Gallery assets

The importer never downloads remote images. To publish screenshots:

1. Save the images under `src/assets/gallery/<slug>/`.
2. Use a lowercase kebab-case file name; the asset key is the file name without its extension.
3. Add one gallery entry per locale with the same `src` and a localized `alt`.
4. Leave `gallery: []` when there is no local image. Do not write “gallery pending” prose.

A missing gallery key fails validation and the build. An unused image is reported as a notice.

## Commands

```bash
# Report missing, stale, manually edited, or ready projects.
npm run content:status

# Validate without writing.
npm run content:import -- projects/<slug> --check

# Validate and write generated YAML/MDX plus the manifest.
npm run content:import -- projects/<slug> --write

# Replace generated files that were edited by hand.
npm run content:import -- projects/<slug> --write --force
```

## Generated outputs

The importer writes:

- `src/content/projects/<slug>.yaml`
- `src/content/cases/<slug>.es.mdx` and `<slug>.en.mdx` only when both locales have a narrative
- `projects/.import-manifest.json`

The manifest records the README hash and output hashes. A changed README is reported as `stale-source`; an output that no longer matches the manifest is reported as `manual-edit`. Write mode refuses a manual edit unless `--force` is passed.

After writing, run `npm run validate:content`, `npm run check`, and `npm run build`.
