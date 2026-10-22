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
- **THEN** the browser navigates to that project's internal detail page

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

### Requirement: Unified project detail pages

Every project in the catalog SHALL have a dedicated Spanish and English detail page at its slug route. Page availability SHALL NOT depend on project tier, external links, cover assets, gallery images, or the presence of supplemental case narrative.

#### Scenario: Every catalog project has a detail page

- **WHEN** a visitor opens any project row or its localized slug URL
- **THEN** the project's own detail page loads in Spanish and English, including for projects without external links or images

#### Scenario: Same page structure for every project

- **WHEN** any project detail page is rendered
- **THEN** it uses the shared project header and common localized project information, and any supplemental narrative does not determine whether the page or its shared sections exist

#### Scenario: External destinations remain actions

- **WHEN** a project has a live or repository URL
- **THEN** the URL is offered as a conditional action on its detail page and does not replace the internal page

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

### Requirement: Optional project galleries

Every project SHALL support an ordered gallery list with localized alternative text. A gallery SHALL appear only when the current locale has at least one valid screenshot entry.

#### Scenario: Project has gallery screenshots

- **WHEN** a project's localized content declares one or more gallery screenshots
- **THEN** the detail page renders those screenshots in the declared order with their localized alternative text

#### Scenario: Project has no gallery screenshots

- **WHEN** a project's localized gallery list is empty or absent
- **THEN** no gallery section, gallery caption, cover substitute, or gallery dialog is rendered

#### Scenario: Gallery differs by locale

- **WHEN** the same project detail is opened in Spanish and English
- **THEN** each page uses its own gallery list and alternative text

### Requirement: Project image references

Project records SHALL support an optional cover and locale-specific gallery references by asset key. A reference without a matching local image SHALL fail validation and the production build with the project and key identified.

#### Scenario: Cover is absent

- **WHEN** a project has no cover asset reference
- **THEN** all cover surfaces render the designed placeholder with the same cover dimensions and descriptive alternative text

#### Scenario: Cover is present

- **WHEN** a project references an existing cover asset
- **THEN** all cover surfaces render that asset responsively instead of the placeholder

#### Scenario: Image key is invalid

- **WHEN** a cover or gallery entry names an asset key with no matching file
- **THEN** content validation and the production build fail with the project and missing key in the error

### Requirement: Project asset references

Project images SHALL be added under `src/assets/covers/<project-slug>.<ext>` for covers and `src/assets/gallery/<project-slug>/<shot>.<ext>` for screenshots. Content SHALL reference them by asset key, never by file path. An image file that no project record references SHALL be reported as unused without failing the build.

#### Scenario: Reference by asset key

- **WHEN** a cover file is added under the covers directory and the project record references its key
- **THEN** the build succeeds and the image is published with responsive sources

#### Scenario: Unused asset is reported

- **WHEN** an image file exists that no project record references
- **THEN** validation reports it as unused without failing the build

### Requirement: Project cover assets

A project record MAY reference one cover image. When a cover is referenced, every cover surface — the detail-page case header, the catalog row thumbnail, and the sticky preview — SHALL render that image at the catalog aspect ratio with descriptive alternative text, and SHALL NOT render the placeholder. When no cover is referenced, those surfaces SHALL render the placeholder cover.

#### Scenario: Real cover on the detail page

- **WHEN** a visitor opens a project detail page whose record references a cover
- **THEN** the case header renders the referenced image at the catalog aspect ratio with descriptive alternative text instead of the placeholder

#### Scenario: Real cover across the catalog

- **WHEN** the work catalog renders a project whose record references a cover
- **THEN** the row thumbnail and the sticky preview show that same image rather than the placeholder

### Requirement: Conditional live and code actions

A project SHALL show a live action only when a real live URL exists and a code action only when a real repository URL exists. When an action is unavailable, the interface SHALL omit it and show an honest availability label instead of a disabled control or a `#` link.

#### Scenario: Only one action exists

- **WHEN** a project has a repository but no deployment
- **THEN** only the code action appears and a label states that no demo is available

#### Scenario: No actions exist

- **WHEN** a project has neither a live URL nor a repository URL
- **THEN** no action buttons render and the page states that links are pending

### Requirement: Placeholder covers

A project without a cover asset SHALL use a local placeholder cover that includes the project name and category, preserves the catalog aspect ratio, and provides descriptive alternative text. The placeholder SHALL occupy the same position and dimensions as a real cover, and a broken image SHALL NOT appear.

#### Scenario: Missing screenshot

- **WHEN** a project's cover asset is absent
- **THEN** the placeholder cover renders at the same dimensions as a real cover with descriptive alternative text

#### Scenario: Placeholder in every cover surface

- **WHEN** a project without a cover asset appears in the catalog, in the sticky preview, or on its detail page
- **THEN** every one of those surfaces renders the placeholder at the catalog aspect ratio

### Requirement: Catalog image delivery

The work catalog SHALL NOT download a cover image for a preview panel that is not active. Row thumbnails SHALL be requested at the size they are rendered, and the active preview cover SHALL load eagerly. The catalog SHALL remain usable without JavaScript, showing the first project's cover and every project row.

#### Scenario: Single cover on load

- **WHEN** a visitor loads the work catalog
- **THEN** only the active preview cover and the visible row thumbnails are requested

#### Scenario: Cover on preview change

- **WHEN** a visitor activates a different project row
- **THEN** that project's cover is requested and rendered in the preview pane

#### Scenario: No JavaScript

- **WHEN** JavaScript is unavailable
- **THEN** the catalog shows the first project's cover and all 14 project rows remain visible and navigable

### Requirement: Screenshot lightbox

Project screenshots MAY open in a modal dialog for enlargement. The dialog SHALL fit the image within the available viewport while preserving the image's aspect ratio, SHALL NOT require internal scrolling to reveal the full image, SHALL be keyboard operable, SHALL close with Escape, SHALL return focus to the trigger, and SHALL prevent background scrolling while open.

#### Scenario: Open and close a screenshot

- **WHEN** a visitor opens a screenshot and presses Escape
- **THEN** the dialog closes, focus returns to the thumbnail, and the page scroll position is preserved

#### Scenario: Portrait image fits without dialog scroll

- **WHEN** a visitor opens a portrait screenshot such as a 9:16 image
- **THEN** the entire image fits within the dialog's available height and width, the image remains uncropped, and the dialog has no scrollable overflow

#### Scenario: Landscape image fits without dialog scroll

- **WHEN** a visitor opens a landscape screenshot
- **THEN** the entire image fits within the dialog's available height and width, the image remains uncropped, and the dialog has no scrollable overflow

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
