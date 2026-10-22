# Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Master–detail index

On viewports 900 pixels and wider, the work page SHALL show a project list and a sticky cover preview. The preview SHALL update on pointer entry after a short intentional delay and immediately on keyboard focus. The project row SHALL remain the navigation target; the preview SHALL NOT contain required actions.

#### Scenario: Pointer preview

- **WHEN** the pointer enters a project row and rests briefly
- **THEN** the preview pane shows that project's cover, title, and one-line summary without navigating

#### Scenario: Keyboard preview

- **WHEN** a project row receives keyboard focus
- **THEN** the preview updates immediately and the row remains visibly focused

#### Scenario: Row navigation

- **WHEN** a visitor activates any project row
- **THEN** the browser navigates to that project's internal detail page

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

## REMOVED Requirements

### Requirement: Three project depths

**Reason**: Project tiers create different page access and content paths, contrary to the requirement that all projects have equal standing and their own detail page.

**Migration**: Remove the `tier` field and tier-gated routes, catalog destinations, validation, and content rules. Keep each project's localized metadata and supplemental case narrative; route every project to the common detail page and retain external URLs as actions on that page.
