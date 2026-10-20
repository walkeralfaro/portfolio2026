# Spec Delta

## Purpose

Presents Walker as a full-stack web developer through a focused home narrative, evidence-backed capabilities, a tiered skills view, a concise trajectory, and a downloadable CV, while using the industrial and project-management background as a credibility signal.

## ADDED Requirements

### Requirement: Home identity

The home page SHALL state Walker's name, full-stack role, a one-sentence value proposition, his core stack, his location, his availability, and a primary action leading to the work catalog.

#### Scenario: First screen

- **WHEN** a visitor opens the home page
- **THEN** name, full-stack role, value proposition, core stack, location, availability, and a work action are visible without scrolling on a standard desktop viewport

### Requirement: Featured work

The home page SHALL feature exactly four projects: TODO-mcp, Image Prompt, URL Shortener, and Tetris. Each featured project SHALL link to its detail page or archive destination.

#### Scenario: Featured set

- **WHEN** the home page renders its featured section
- **THEN** the four named projects appear and no other project is featured there

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

The profile SHALL present three career eras: industrial automation and electronics from 2006 to 2019, the transition to web development from 2023 to 2024, and independent full-stack work from 2025 to the present. The full role history SHALL be available on the about page or CV.

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

### Requirement: CV page

The site SHALL provide a CV page in both locales with summary, experience, education, projects, skills, courses, and languages derived from the read-only generated `data.js`. The public CV page SHALL omit the mobile phone number.

#### Scenario: CV content

- **WHEN** a visitor opens the CV page
- **THEN** all documented sections render and the mobile phone number is absent

#### Scenario: Generated source is preserved

- **WHEN** the CV data is loaded
- **THEN** `data.js` remains unmodified and is treated as a read-only input

### Requirement: Downloadable CV

The CV SHALL be downloadable as a PDF in each locale, and the PDF content SHALL match the corresponding CV page.

#### Scenario: Download Spanish CV

- **WHEN** a visitor selects the Spanish PDF download
- **THEN** a Spanish PDF with the same sections and content as the Spanish CV page is delivered

### Requirement: Contact surface

The site SHALL provide email, LinkedIn, GitHub, and CV access. The public contact surface SHALL NOT expose the mobile phone number.

#### Scenario: Contact links

- **WHEN** a visitor opens the contact section
- **THEN** email, LinkedIn, GitHub, and CV are available and the phone number is not shown

### Requirement: Bilingual profile

The home, about, and CV content SHALL exist in Spanish and English with equivalent meaning, claims, and dates.

#### Scenario: English profile

- **WHEN** a visitor opens the English home and about pages
- **THEN** the narrative, capabilities, skills, trajectory, and CV match the Spanish content in meaning

### Requirement: Content integrity

Every number, employer, date, technology, and project claim published on the profile SHALL be traceable to `data.js` or the project documentation in `projects/`. The profile SHALL NOT invent metrics, clients, testimonials, or outcomes.

#### Scenario: Traceable claim

- **WHEN** a published metric such as a team size or deployment count is reviewed
- **THEN** the same fact can be found in the provided source material

#### Scenario: Excluded client work

- **WHEN** the profile renders experience or projects
- **THEN** Puja Inmobiliaria is not referenced
