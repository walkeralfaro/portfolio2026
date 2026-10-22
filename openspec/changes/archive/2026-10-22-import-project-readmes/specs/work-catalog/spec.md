# Spec Delta

## ADDED Requirements

### Requirement: Single-source project facts

Every project detail page SHALL render its stack once, from the project record in the shared header. A case narrative SHALL NOT declare a Stack section or a Gallery section. Gallery images SHALL come only from the active locale's project-record gallery list; when that list is empty, no gallery heading, caption, pending message, cover substitute, or dialog SHALL be rendered.

#### Scenario: Narrative keeps the shared stack

- **WHEN** a visitor opens a project with a case narrative
- **THEN** the stack appears in the shared header and the narrative contains only Problem, Role, Decisions, and Result headings

#### Scenario: Locale has no screenshots

- **WHEN** the active locale has an empty gallery list
- **THEN** the detail page renders no gallery element, caption, pending text, or dialog

#### Scenario: Locale has screenshots

- **WHEN** the active locale declares at least one valid screenshot
- **THEN** the gallery renders those images in the declared order below the narrative
