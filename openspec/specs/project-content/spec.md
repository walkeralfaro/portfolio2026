# project-content Specification

## Purpose

Defines the self-contained, bilingual content contract used to discover, validate, and publish portfolio projects.

## Requirements

### Requirement: Self-contained project source

Each published project SHALL live under `projects/<slug>/` with one `content.yaml`. The folder name SHALL be the slug and SHALL match the record. `README.md` MAY hold source provenance. No generated project copy or central slug inventory SHALL be required.

#### Scenario: Discover a project

- **WHEN** a valid `content.yaml` is added to a project folder
- **THEN** Astro loads it directly and generates the project's catalog entry and localized pages

#### Scenario: Folder without content

- **WHEN** a project folder has no `content.yaml`
- **THEN** it is reported as pending by `npm run content:status` and is not published

### Requirement: Strict bilingual schema

Every record SHALL contain `slug`, `year`, `category`, `tags`, `status`, `featured`, `order`, `stack`, `links`, and both `locales.es` and `locales.en`. Each locale SHALL contain `title`, `summary`, `role`, `result`, and a gallery list. Unknown fields SHALL fail validation.

#### Scenario: Complete record

- **WHEN** a record provides the required shared and localized fields
- **THEN** the project schema accepts it

#### Scenario: Missing translation or unknown field

- **WHEN** a locale or schema field is missing, or an unknown field is present
- **THEN** schema validation fails and identifies the field path

### Requirement: Valid project metadata

Slugs SHALL use lowercase kebab-case and match the folder. Categories SHALL be `ia`, `producto`, `frontend`, or `juegos`. Status SHALL be `live`, `in-development`, or `archived`. Order SHALL be a unique positive integer. Stack SHALL contain three to five non-empty items. Year SHALL be an integer or `pending`.

### Requirement: Honest links and availability

Live and code links SHALL be real URLs or `null`. When both links are `null`, both locales SHALL provide an availability note. Availability SHALL be present in both locales or neither.

#### Scenario: No external destinations

- **WHEN** a record has null live and code links
- **THEN** its Spanish and English locales each describe the unavailable destinations truthfully

### Requirement: Optional structured narrative

A narrative MAY be authored under each locale. It SHALL contain `problem`, `role`, three or four structured `decisions` with `title` and `body`, and `result`. It SHALL be present in both locales or neither.

#### Scenario: Narrative in one locale only

- **WHEN** only one locale defines a narrative
- **THEN** validation fails before the project is published

### Requirement: Project-local images

The cover SHALL be autodetected from `projects/<slug>/cover.<ext>` and SHALL NOT be a content field. Gallery images SHALL be stored under `projects/<slug>/screenshots/`, referenced by extensionless key, and include localized non-empty alternative text. Supported image extensions SHALL be webp, png, jpg, jpeg, and avif.

#### Scenario: Missing gallery file

- **WHEN** a gallery key does not match a local screenshot
- **THEN** content validation reports the project, locale, and key

#### Scenario: Unused gallery file

- **WHEN** a local screenshot is not referenced
- **THEN** validation emits a notice without failing

### Requirement: Content validation

`npm run validate:content` SHALL validate every authored record, folder/slug agreement, unique ordering, featured count (one to four when content exists), placeholders, availability, gallery references, and excluded client content. It SHALL allow zero authored records.

#### Scenario: Empty repository content

- **WHEN** project folders exist but none contains a record
- **THEN** validation succeeds with a notice so the site can build before content authoring

### Requirement: Generated status inventory

`npm run content:status` SHALL discover folders and read their `content.yaml` files to display order, slug, category, status, and featured state. The inventory SHALL NOT be duplicated as a hardcoded project table in runtime source or current documentation.

#### Scenario: Pending and invalid entries

- **WHEN** a folder is missing content or contains invalid YAML/schema data
- **THEN** the status report lists it as pending or invalid without hiding other entries
