# work-catalog Specification

## Purpose

Presents the project folders as a curated, bilingual, filterable catalog with honest metadata, a master-detail preview, and a dedicated detail page for every published project.

## Requirements

### Requirement: Folder-discovered catalog

The catalog SHALL discover projects from `projects/<slug>/content.yaml` without a central slug inventory. The folder name SHALL be the project slug and SHALL match the record's `slug`. The displayed count and category totals SHALL be computed from valid project content. Existing project folder names SHALL remain stable.

#### Scenario: Add a project without central registration

- **WHEN** a valid `content.yaml` is added under a kebab-case project folder
- **THEN** the catalog, localized detail routes, count, and filters discover it without editing a central inventory or route list

#### Scenario: Folder and record disagree

- **WHEN** a record's slug differs from its containing folder
- **THEN** content validation fails and reports both values

#### Scenario: No project content has been authored

- **WHEN** project folders exist without `content.yaml` files
- **THEN** the site can build with an empty catalog and the content-status command reports those folders as pending

### Requirement: Project row horizontal inset

Every project row SHALL inset its content from both horizontal edges while the row divider and interactive surface remain full width. The inset SHALL apply on desktop and mobile and SHALL NOT introduce horizontal overflow.

#### Scenario: Desktop row inset

- **WHEN** the catalog is viewed at 1280 pixels wide
- **THEN** row content is inset while its divider and interactive surface remain full width

#### Scenario: Mobile row inset

- **WHEN** the catalog is viewed at 375 pixels wide
- **THEN** each row's content is inset and the page has no horizontal scroll

### Requirement: Master-detail index

At 900 pixels and wider, the work page SHALL show a project list and sticky cover preview. The preview SHALL update after a short pointer delay and immediately on keyboard focus. The project row SHALL remain the navigation target.

#### Scenario: Pointer preview

- **WHEN** the pointer enters a project row and rests briefly
- **THEN** the preview shows that project's cover, title, and summary without navigating

#### Scenario: Keyboard preview

- **WHEN** a project row receives keyboard focus
- **THEN** the preview updates immediately and the row remains visibly focused

#### Scenario: Row navigation

- **WHEN** a visitor activates a project row
- **THEN** the browser navigates to that project's internal detail page

### Requirement: Mobile catalog

Below 900 pixels, the work page SHALL render a single-column list with a thumbnail, title, year, category, and summary per entry. The sticky preview SHALL be hidden.

#### Scenario: Mobile list

- **WHEN** the catalog is viewed at 375 pixels wide
- **THEN** each published project appears as a row with a thumbnail and there is no sticky preview pane

### Requirement: Category filtering

The work page SHALL offer filters for all projects and the categories `ia`, `producto`, `frontend`, and `juegos`. Counts SHALL be computed from project records, and a selected filter SHALL update visible results and persist in the `c` query parameter.

#### Scenario: Filter by category

- **WHEN** a visitor selects a category
- **THEN** only matching projects remain visible and the count equals the visible entries

#### Scenario: Shareable filter state

- **WHEN** a visitor reloads or shares a filtered URL
- **THEN** the same filter is active and the same projects are visible

#### Scenario: Empty result

- **WHEN** a filter has no matching projects
- **THEN** the page shows an explicit empty state and an action to clear the filter

### Requirement: Project metadata

Each project SHALL declare localized title, summary, role, and result; year or `pending`; one category; at least one tag; a status; three to five stack items; real optional live/code URLs; and the editorial `featured` and `order` values. The project content schema SHALL reject unknown fields.

#### Scenario: Catalog entry anatomy

- **WHEN** a project is rendered in the catalog
- **THEN** title, summary, year, category, stack, and status are present

#### Scenario: Honest missing destinations

- **WHEN** both live and code links are absent
- **THEN** each locale provides an availability note instead of a fake destination

### Requirement: Bilingual detail pages

Every project with valid content SHALL have dedicated Spanish and English detail pages at its slug route. Page availability SHALL NOT depend on external links, images, or an optional narrative.

#### Scenario: Direct project route

- **WHEN** a visitor opens a project's localized slug URL
- **THEN** the project detail loads directly with localized metadata

#### Scenario: Unknown project route

- **WHEN** a visitor opens a slug that has no project content
- **THEN** the localized not-found route is returned

### Requirement: Single-source project facts

The catalog and detail page SHALL read shared metadata from the same project record. The stack SHALL appear once in the detail header. A narrative SHALL be optional and SHALL exist in both locales or neither.

#### Scenario: Project without narrative

- **WHEN** a project has no narrative
- **THEN** the body renders its localized summary, role, and result

#### Scenario: Project with narrative

- **WHEN** a project has a narrative
- **THEN** the body renders Problem, Role, Decisions, and Result; Decisions has three or four structured items

### Requirement: Self-contained project images

Project assets SHALL live within their project folder: `projects/<slug>/cover.<ext>` and `projects/<slug>/screenshots/<key>.<ext>`. The cover SHALL be autodetected and SHALL NOT be declared as a content field. Gallery references SHALL use screenshot keys with localized alternative text.

#### Scenario: Cover exists

- **WHEN** an accepted cover image exists in the project folder
- **THEN** catalog and detail cover surfaces render that image responsively

#### Scenario: Cover is absent

- **WHEN** no cover image exists
- **THEN** every cover surface renders the designed placeholder with the same aspect ratio

#### Scenario: Gallery reference is invalid

- **WHEN** a locale references a screenshot key with no matching file
- **THEN** content validation fails with the project and missing key identified

#### Scenario: Locale has no gallery

- **WHEN** a locale has an empty gallery list
- **THEN** no gallery section, caption, pending text, or dialog is rendered

#### Scenario: Unused screenshot

- **WHEN** a screenshot file is not referenced by either locale
- **THEN** validation reports it as unused without failing

### Requirement: Efficient preview image delivery

The catalog SHALL NOT request cover images for inactive preview panels on initial load. The active preview cover SHALL load eagerly; other preview covers SHALL be deferred until activation. All rows SHALL remain navigable without JavaScript.

#### Scenario: Change preview

- **WHEN** a visitor activates a different project row
- **THEN** its cover is loaded and displayed in the preview

#### Scenario: No JavaScript

- **WHEN** JavaScript is unavailable
- **THEN** every authored project row remains visible and navigable

### Requirement: Conditional actions

A live action SHALL render only for a real live URL, and a code action only for a real repository URL. Missing actions SHALL be omitted and described with localized availability text. Placeholder `#` links and disabled action buttons SHALL NOT be used.

### Requirement: Screenshot lightbox

Project screenshots MAY open in a native modal dialog. The full image SHALL fit in the viewport without cropping or internal scrolling. The dialog SHALL be keyboard operable, close with Escape, return focus to its trigger, and prevent background scrolling while open.

#### Scenario: Close screenshot dialog

- **WHEN** a visitor closes a screenshot dialog with Escape
- **THEN** the dialog closes, focus returns to the trigger, and page scroll position is preserved

### Requirement: Computed project count

The displayed project count SHALL be derived from loaded project content and SHALL match the visible entries for the active filter.

#### Scenario: Count reflects filter

- **WHEN** a visitor filters the catalog
- **THEN** the displayed count equals the number of matching rows
