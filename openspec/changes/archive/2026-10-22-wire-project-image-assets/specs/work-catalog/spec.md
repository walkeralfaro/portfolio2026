# Spec Delta

## ADDED Requirements

### Requirement: Project cover assets

A project record MAY reference one cover image. When a cover is referenced, every cover surface — the detail-page case header, the catalog row thumbnail, the sticky preview, and the tier 1 gallery — SHALL render that image at the catalog aspect ratio with descriptive alternative text, and SHALL NOT render the placeholder. When no cover is referenced, those surfaces SHALL render the placeholder cover.

#### Scenario: Real cover on the detail page

- **WHEN** a visitor opens a project detail page whose record references a cover
- **THEN** the case header renders the referenced image at the catalog aspect ratio with descriptive alternative text instead of the placeholder

#### Scenario: Real cover across the catalog

- **WHEN** the work catalog renders a project whose record references a cover
- **THEN** the row thumbnail and the sticky preview show that same image rather than the placeholder

#### Scenario: Cover inside the gallery

- **WHEN** a tier 1 case declares no gallery entries but its project references a cover
- **THEN** the gallery shows the cover image instead of the placeholder and the pending note

### Requirement: Project asset references

Project images SHALL be added under `src/assets/covers/<project-slug>.<ext>` for covers and `src/assets/gallery/<project-slug>/<shot>.<ext>` for screenshots. Content SHALL reference them by asset key and never by file path. A reference to a key with no matching file SHALL fail validation with an error naming the record and the key, and SHALL NOT publish a broken image.

#### Scenario: Reference by asset key

- **WHEN** a cover file is added under the covers directory and the project record references its key
- **THEN** the build succeeds and the image is published with responsive sources

#### Scenario: Unknown key fails the build

- **WHEN** a project record or case body references a key with no matching file
- **THEN** the build fails with an error naming the record and the key

#### Scenario: Unused asset is reported

- **WHEN** an image file exists that no project record or case body references
- **THEN** validation reports it as unused without failing the build

### Requirement: Tier 1 screenshot galleries

A tier 1 case body MAY declare a gallery of screenshots in its own frontmatter, with one entry per locale file. Each entry SHALL reference a screenshot asset and carry alternative text written in that file's language. When a case declares entries, the detail page SHALL render one thumbnail per entry in the declared order, each opening in the existing lightbox, and SHALL NOT render the placeholder gallery. When a case declares no entries, the page SHALL keep the placeholder cover and its pending note.

#### Scenario: Gallery with screenshots

- **WHEN** a tier 1 case declares gallery entries
- **THEN** the detail page renders one thumbnail per entry in the declared order and each opens in the lightbox

#### Scenario: Localized alternative text

- **WHEN** the Spanish and English bodies of the same case both declare a gallery
- **THEN** each page shows its own language's alternative text for the same screenshots

#### Scenario: Case without a gallery

- **WHEN** a tier 1 case declares no gallery entries
- **THEN** the detail page shows the placeholder cover and states that screenshots are pending

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

## MODIFIED Requirements

### Requirement: Placeholder covers

A project without a cover asset SHALL use a local placeholder cover that includes the project name and category, preserves the catalog aspect ratio, and provides descriptive alternative text. The placeholder SHALL occupy the same position and dimensions as a real cover, and a broken image SHALL NOT appear.

#### Scenario: Missing screenshot

- **WHEN** a project's cover asset is absent
- **THEN** the placeholder cover renders at the same dimensions as a real cover with descriptive alternative text

#### Scenario: Placeholder in every cover surface

- **WHEN** a project without a cover asset appears in the catalog, in the sticky preview, or on its detail page
- **THEN** every one of those surfaces renders the placeholder at the catalog aspect ratio
