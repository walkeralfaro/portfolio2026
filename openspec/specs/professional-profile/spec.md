# professional-profile Specification

## Purpose

Presents Walker as a full-stack web developer through a focused home narrative, evidence-backed capabilities, a tiered skills view, a concise trajectory, and an external CV link, while using the industrial and project-management background as a credibility signal.

## Requirements

### Requirement: Home identity

The home page SHALL state Walker's name, full-stack role, a one-sentence value proposition, his core stack, his location, his availability, and a primary action leading to the work catalog.

#### Scenario: First screen

- **WHEN** a visitor opens the home page
- **THEN** name, full-stack role, value proposition, core stack, location, availability, and a work action are visible without scrolling on a standard desktop viewport

### Requirement: Featured work

The home page SHALL render the projects marked `featured: true` in project content, with a maximum of four. The curated featured set is `todo-mcp-dual`, `image-prompt`, `url-shortener`, and `tetris`. Each SHALL link to its internal project detail page.

#### Scenario: Featured set

- **WHEN** the home page renders its featured section
- **THEN** the four curated projects appear when their content records are authored, and no other project appears there

#### Scenario: Featured projects open their detail pages

- **WHEN** a visitor activates any featured project
- **THEN** the browser opens that project's internal detail page in the current locale

### Requirement: Home catalog excerpt

The home page SHALL render up to the first four available projects in catalog order, below the featured set. The excerpt count SHALL match the number of rows it renders, not the total catalog size, and the excerpt SHALL keep an action that leads to the full catalog.

#### Scenario: Excerpt size and order

- **WHEN** a visitor opens the home page in either locale
- **THEN** the excerpt renders up to four projects in catalog order

#### Scenario: Count matches the excerpt

- **WHEN** the excerpt renders four rows
- **THEN** its count reads four and its action still leads to the full catalog

### Requirement: Capabilities with evidence

The profile SHALL present four capability blocks: end-to-end product delivery, frontend craft, backend and data, and quality and documentation. Each block SHALL link to at least one project that demonstrates the capability.

#### Scenario: Capability proof

- **WHEN** a visitor activates a capability block
- **THEN** the browser opens a project page that demonstrates that capability

### Requirement: Tiered skills

Skills SHALL be grouped into three tiers: used daily, used in production, and prior context. The profile SHALL NOT render an exhaustive logo wall or an unstructured list of every technology in the CV.

#### Scenario: Skills overview

- **WHEN** a visitor reads the skills section
- **THEN** technologies are grouped into the three tiers with no logo wall

### Requirement: Trajectory

The profile SHALL present three career eras: industrial automation and electronics from 2006 to 2019, the transition to web development from 2023 to 2024, and independent full-stack work from 2025 to the present. The full role history SHALL be available on the about page.

#### Scenario: Three-era summary

- **WHEN** a visitor reads the trajectory
- **THEN** the three eras are summarized in order with dates

#### Scenario: Full history

- **WHEN** a visitor requests the full trajectory
- **THEN** every role documented in `data.js` is available with organisation, dates, and a concise description

### Requirement: Background framed as a plus

The industrial automation and project-management background SHALL appear as transferable evidence of rigor, documentation, requirements gathering, and delivery under pressure. It SHALL NOT be the primary hero message, the site's visual theme, or a competing professional identity.

#### Scenario: Background placement

- **WHEN** a visitor reads the home hero
- **THEN** the hero presents a full-stack web developer, and the industrial background appears only as supporting context in the profile

### Requirement: External CV link

The site SHALL provide a CV link to `https://resume.walkeralfaro.com/` from its CV controls. The portfolio SHALL NOT provide an internal CV page or generate or print a CV PDF.

#### Scenario: Open the external CV

- **WHEN** a visitor activates a CV control
- **THEN** the browser navigates to `https://resume.walkeralfaro.com/`

#### Scenario: No portfolio CV output

- **WHEN** the portfolio is built or a visitor uses a CV control
- **THEN** the portfolio serves no internal CV page and produces no CV PDF

### Requirement: Contact surface

The site footer SHALL provide email, LinkedIn, GitHub, and CV access on every page. The public contact surface SHALL NOT expose the mobile phone number and SHALL NOT be repeated on the about pages.

#### Scenario: Contact links

- **WHEN** a visitor reaches the footer of any page
- **THEN** email, LinkedIn, GitHub, and a CV link to `https://resume.walkeralfaro.com/` are available and the phone number is not shown

#### Scenario: About pages do not repeat the contact block

- **WHEN** a visitor opens the about page in either locale
- **THEN** no contact block is rendered there and the footer remains the only contact surface

### Requirement: Bilingual profile

The home and about content SHALL exist in Spanish and English with equivalent meaning, claims, and dates. CV controls SHALL have localized labels in both locales and lead to the same external resume URL.

#### Scenario: English profile

- **WHEN** a visitor opens the English home and about pages
- **THEN** the narrative, capabilities, and trajectory match the Spanish content in meaning, and the CV control opens the external resume site

### Requirement: Content integrity

Every number, employer, date, technology, and project claim published on the profile SHALL be traceable to `data.js` or the project documentation in `projects/`. The profile SHALL NOT invent metrics, clients, testimonials, or outcomes.

#### Scenario: Traceable claim

- **WHEN** a published metric such as a team size or deployment count is reviewed
- **THEN** the same fact can be found in the provided source material

#### Scenario: Excluded client work

- **WHEN** the profile renders experience or projects
- **THEN** Puja Inmobiliaria is not referenced
