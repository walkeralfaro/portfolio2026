# Spec Delta

## MODIFIED Requirements

### Requirement: Featured work

The home page SHALL feature exactly four projects: TODO-mcp, Image Prompt, URL Shortener, and Tetris. Each featured project SHALL link to its internal project detail page.

#### Scenario: Featured set

- **WHEN** the home page renders its featured section
- **THEN** the four named projects appear and no other project is featured there

#### Scenario: Featured projects open their detail pages

- **WHEN** a visitor activates any featured project
- **THEN** the browser opens that project's internal detail page in the current locale
