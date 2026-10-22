# Spec Delta

## MODIFIED Requirements

### Requirement: Single-source project facts

Every project detail page, including a project without a narrative, SHALL render its stack once from the project record in the shared header, in the declared order. A case narrative SHALL NOT declare a Stack section or a Gallery section. Gallery images SHALL come only from the active locale's project-record gallery list; when that list is empty, no gallery heading, caption, pending message, cover substitute, or dialog SHALL be rendered.

#### Scenario: Narrative keeps the shared stack

- **WHEN** a visitor opens a project with a case narrative
- **THEN** the stack appears in the shared header and the narrative contains only Problem, Role, Decisions, and Result headings

#### Scenario: Baseline project keeps the shared stack

- **WHEN** a visitor opens a project without a case narrative
- **THEN** the shared header shows the project record's stack in its declared order and the body contains no stack heading

#### Scenario: Stack survives locale switching

- **WHEN** the same project detail page is opened in Spanish and English
- **THEN** both pages render the project record's stack with the same items and order

#### Scenario: Locale has no screenshots

- **WHEN** the active locale has an empty gallery list
- **THEN** the detail page renders no gallery element, caption, pending text, or dialog

#### Scenario: Locale has screenshots

- **WHEN** the active locale declares at least one valid screenshot
- **THEN** the gallery renders those images in the declared order below the narrative
