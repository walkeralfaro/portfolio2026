# work-catalog Specification

## Purpose

Presents Walker's 14 documented projects as a curated, filterable catalog with a master–detail preview, honest project metadata, and three depths of detail so breadth and proof can coexist.

## Requirements

### Requirement: Project row horizontal inset

Every project row SHALL inset its content from both horizontal edges while the row divider and interactive surface remain full width. The inset SHALL apply on desktop and mobile and SHALL NOT introduce horizontal overflow.

#### Scenario: Desktop row inset

- **WHEN** the catalog is viewed at 1280 pixels wide
- **THEN** each row's title, summary, and metadata start inside the row's left edge and end inside its right edge, while the divider and link surface still span the full row width

#### Scenario: Mobile row inset

- **WHEN** the catalog is viewed at 375 pixels wide
- **THEN** each row's thumbnail starts inside the row's left edge and the page has no horizontal scroll


### Requirement: Catalog inventory

The catalog SHALL contain exactly 14 projects: TODO-mcp, Image Prompt, Cheatsheet Editor, URL Shortener, Multi-step Form, Pokedex, Todo App, Tic Tac Toe, Tip Calculator, Weather App, REST Countries Explorer, Tetris, Portfolio Profesional, and Portfolio 2026. Puja Inmobiliaria SHALL NOT appear in the catalog, navigation, sitemap, metadata, or search results.

#### Scenario: All documented projects are present

- **WHEN** a visitor opens the work catalog
- **THEN** the catalog lists the 14 named projects and the displayed count is 14

#### Scenario: Excluded client work is absent

- **WHEN** any public page, sitemap, or metadata file is inspected
- **THEN** Puja Inmobiliaria does not appear

### Requirement: Master–detail index

On viewports 900 pixels and wider, the work page SHALL show a project list and a sticky cover preview. The preview SHALL update on pointer entry after a short intentional delay and immediately on keyboard focus. The project row SHALL remain the navigation target; the preview SHALL NOT contain required actions.

#### Scenario: Pointer preview

- **WHEN** the pointer enters a project row and rests briefly
- **THEN** the preview pane shows that project's cover, title, and one-line summary without navigating

#### Scenario: Keyboard preview

- **WHEN** a project row receives keyboard focus
- **THEN** the preview updates immediately and the row remains visibly focused

#### Scenario: Row navigation

- **WHEN** a visitor activates a project row
- **THEN** the browser navigates to that project's detail page or external destination

### Requirement: Mobile catalog

Below 900 pixels, the work page SHALL render a single-column list where each entry includes a thumbnail, title, year, primary category, and one-line summary. The sticky preview pane SHALL NOT render on these viewports.

#### Scenario: Mobile list

- **WHEN** the catalog is viewed at 375 pixels wide
- **THEN** each project appears as a full-width row with a thumbnail and no sticky preview pane

### Requirement: Category filtering

The work page SHALL offer filters for all projects and the four primary categories: IA y agentes, Producto, Frontend, and Juegos. Each filter SHALL show its real project count, update the visible results without a full page reload, and persist in the URL so the filtered view can be shared and restored.

#### Scenario: Filter by category

- **WHEN** a visitor selects "IA y agentes"
- **THEN** only the projects in that category remain visible and the count matches the visible entries

#### Scenario: Shareable filter state

- **WHEN** a visitor reloads or shares a filtered URL
- **THEN** the same filter is active and the same projects are visible

#### Scenario: Empty result

- **WHEN** a filter has no matching projects
- **THEN** the page shows a clear empty state with an action to clear the filter

### Requirement: Project metadata

Each catalog entry SHALL display the project title, a one-line summary, the year, the primary category, three to five stack items, and a status of live, in development, or archived.

#### Scenario: Entry anatomy

- **WHEN** a catalog row is rendered
- **THEN** title, summary, year, category, stack, and status are all present

### Requirement: Three project depths

The catalog SHALL support three depths: a full case study with problem, role, decisions, result, stack, gallery, and actions; a short case study with what it is, role, result, and actions; and an archive entry with no detail page. Tier 3 projects SHALL link to their external destinations.

#### Scenario: Full case study

- **WHEN** a visitor opens a tier 1 project
- **THEN** the page includes problem, role, decisions, result, stack, gallery, and available actions

#### Scenario: Short case study

- **WHEN** a visitor opens a tier 2 project
- **THEN** the page includes what it is, role, result, and available actions without a full gallery

#### Scenario: Archive entry

- **WHEN** a visitor selects a tier 3 project
- **THEN** the browser opens its external destination and no empty internal detail page is created

### Requirement: Conditional live and code actions

A project SHALL show a live action only when a real live URL exists and a code action only when a real repository URL exists. When an action is unavailable, the interface SHALL omit it and show an honest availability label instead of a disabled control or a `#` link.

#### Scenario: Only one action exists

- **WHEN** a project has a repository but no deployment
- **THEN** only the code action appears and a label states that no demo is available

#### Scenario: No actions exist

- **WHEN** a project has neither a live URL nor a repository URL
- **THEN** no action buttons render and the page states that links are pending

### Requirement: Placeholder covers

A project without a screenshot SHALL use a local placeholder cover that includes the project name and category, preserves the catalog aspect ratio, and provides descriptive alternative text. A broken image SHALL NOT appear.

#### Scenario: Missing screenshot

- **WHEN** a project's cover asset is absent
- **THEN** the placeholder cover renders at the same dimensions as a real cover with descriptive alternative text

### Requirement: Screenshot lightbox

Project screenshots MAY open in a modal dialog for enlargement. The dialog SHALL be keyboard operable, close with Escape, return focus to the trigger, and prevent background scrolling while open.

#### Scenario: Open and close a screenshot

- **WHEN** a visitor opens a screenshot and presses Escape
- **THEN** the dialog closes, focus returns to the thumbnail, and the page scroll position is preserved

### Requirement: Details are pages, not modals

Project details SHALL be dedicated pages with stable, shareable URLs. A project detail SHALL NOT be rendered only inside a dialog or overlay.

#### Scenario: Share a project

- **WHEN** a visitor copies the URL of a project detail page and opens it elsewhere
- **THEN** the same project detail page loads directly

### Requirement: Bilingual catalog

Every catalog entry and project detail page SHALL exist in Spanish and English with equivalent metadata and content. A page SHALL NOT mix languages within the same view.

#### Scenario: English catalog

- **WHEN** a visitor opens the English work catalog
- **THEN** navigation, filters, summaries, statuses, and actions are in English and the project set matches the Spanish catalog

### Requirement: Computed project count

The displayed project count SHALL be computed from the catalog data and SHALL match the number of entries in the current filtered view.

#### Scenario: Count reflects filter

- **WHEN** a visitor filters the catalog
- **THEN** the visible count equals the number of rendered project entries
