# Spec Delta

## MODIFIED Requirements

### Requirement: Mobile catalog

Below 900 pixels, the work page SHALL render a single-column list. Each entry SHALL stack its cover above its content: the cover SHALL span the row's content width, and the title, month and year, category, summary, stack, and status SHALL follow below it. The sticky preview SHALL be hidden. The whole row SHALL remain one navigation target.

#### Scenario: Mobile list

- **WHEN** the catalog is viewed at 375 pixels wide
- **THEN** each published project appears as a row with its cover above its content and there is no sticky preview pane

#### Scenario: Mobile row anatomy

- **WHEN** a project row is rendered below 900 pixels
- **THEN** the cover, title, month and year, category, summary, stack, and status are all visible within the row

#### Scenario: Just below the desktop breakpoint

- **WHEN** the catalog is viewed at 899 pixels wide
- **THEN** project rows use the stacked layout with the cover above the content

#### Scenario: Mobile row navigation

- **WHEN** a visitor activates any part of a stacked mobile row, including its cover
- **THEN** the browser navigates to that project's internal detail page
