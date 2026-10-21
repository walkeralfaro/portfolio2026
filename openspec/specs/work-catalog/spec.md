# work-catalog Specification

## Purpose

TBD - created by archiving change add-project-row-inline-padding. Update Purpose after archive.

## Requirements

### Requirement: Project row horizontal inset

Every project row SHALL inset its content from both horizontal edges while the row divider and interactive surface remain full width. The inset SHALL apply on desktop and mobile and SHALL NOT introduce horizontal overflow.

#### Scenario: Desktop row inset

- **WHEN** the catalog is viewed at 1280 pixels wide
- **THEN** each row's title, summary, and metadata start inside the row's left edge and end inside its right edge, while the divider and link surface still span the full row width

#### Scenario: Mobile row inset

- **WHEN** the catalog is viewed at 375 pixels wide
- **THEN** each row's thumbnail starts inside the row's left edge and the page has no horizontal scroll
