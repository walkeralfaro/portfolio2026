# project-content-import Specification

## Purpose

Defines how varied project READMEs become one validated, reproducible content shape for the portfolio without duplicating project facts or losing source provenance.

## Requirements

### Requirement: Per-project README intake

Every imported project SHALL have one raw source note at `projects/<slug>/README.md`, where `<slug>` is the catalog slug. The README MAY use any internal structure, and it SHALL remain the provenance for the project's generated content.

#### Scenario: README without an intake is reported

- **WHEN** a project folder contains a README but no normalized intake file
- **THEN** the import check reports that project as pending and names the missing intake

#### Scenario: Folder slug identifies the project

- **WHEN** a README folder name does not match the slug in its normalized intake
- **THEN** validation fails and names both values

### Requirement: Normalized intake contract

Each imported project SHALL have one AI-authored `projects/<slug>/content.yaml` that follows the documented schema. It SHALL contain the shared project fields and a `locales.es` and `locales.en` object with title, summary, role, result, optional availability, gallery references, and an optional four-part narrative. Missing required fields and unknown fields SHALL fail validation.

#### Scenario: Complete intake passes

- **WHEN** an intake contains every required shared and localized field
- **THEN** validation succeeds and the project is eligible for generation

#### Scenario: Missing localized field fails

- **WHEN** either locale omits title, summary, role, or result
- **THEN** validation fails and identifies the locale and field

#### Scenario: Unknown field fails

- **WHEN** an intake contains a field outside the documented schema
- **THEN** validation fails instead of silently dropping the value

### Requirement: Deterministic generation from intake

The importer SHALL generate `src/content/projects/<slug>.yaml` and, when a narrative exists, `src/content/cases/<slug>.<locale>.mdx` from the normalized intake without calling an AI or a network service. Generated YAML SHALL NOT contain narrative bodies. Generated case bodies SHALL use only the Problem, Role, Decisions, and Result sections, with locale-appropriate headings, and SHALL NOT contain Stack or Gallery sections.

#### Scenario: Intake without narrative

- **WHEN** both locales have no narrative
- **THEN** the importer writes only the project YAML record

#### Scenario: Intake with narrative

- **WHEN** both locales provide all four narrative parts
- **THEN** the importer writes two case bodies with exactly those four headings and three or four numbered decisions each

#### Scenario: Only one locale has a narrative

- **WHEN** one locale defines a narrative and the other does not
- **THEN** validation fails before any case body is written

#### Scenario: Stack is written once

- **WHEN** the importer generates a project with a narrative
- **THEN** the stack appears in the project YAML and no Stack heading appears in either case body

### Requirement: Provenance and safe writes

The importer SHALL record the source README hash and the hashes of generated files. It SHALL report stale content when a README changes and SHALL refuse to overwrite a file that it did not generate unless an explicit force option is provided.

#### Scenario: README changed after import

- **WHEN** a README hash differs from the hash recorded at the last import
- **THEN** the import check reports the project as stale

#### Scenario: Manually edited generated file

- **WHEN** a generated file no longer matches its recorded hash
- **THEN** the importer refuses to overwrite it and reports the file

#### Scenario: Successful write records provenance

- **WHEN** the importer writes or updates project content
- **THEN** it records the new README and output hashes

### Requirement: Honest incomplete content

The importer SHALL NOT invent missing facts, translations, screenshots, or links. An unknown value SHALL be represented as pending or null with an availability note, and a locale without screenshots SHALL use an empty gallery list with no placeholder prose.

#### Scenario: Missing live URL

- **WHEN** the README documents no live deployment
- **THEN** the intake uses a null live link and a truthful availability note

#### Scenario: No screenshots

- **WHEN** a locale has no imported image files
- **THEN** its gallery is empty and the generated content contains no gallery-pending text

#### Scenario: Untranslated locale

- **WHEN** either required locale is absent or incomplete
- **THEN** generation stops instead of publishing a guessed translation

### Requirement: Import reporting

The importer SHALL provide a non-writing check mode and a write mode. Both modes SHALL report the project slug, file, and field for every validation failure, and write mode SHALL avoid partial project output when validation fails.

#### Scenario: Check mode is read-only

- **WHEN** a project is checked for import
- **THEN** no YAML, MDX, or provenance file is changed

#### Scenario: Invalid project produces no partial output

- **WHEN** any intake validation fails in write mode
- **THEN** no generated files for that project are written
