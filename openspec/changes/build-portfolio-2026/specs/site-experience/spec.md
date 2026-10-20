# Spec Delta

## Purpose

Defines the cross-cutting experience of the portfolio: bilingual routing, light/dark/system theme selection, responsive and accessible navigation, purposeful motion, static performance, and search metadata.

## ADDED Requirements

### Requirement: Locale routing

Spanish SHALL be the default locale at the root, and English SHALL be available under `/en`. Every site-owned public page SHALL have an equivalent route in both locales, the language switcher SHALL preserve the current site page, and an unknown locale prefix SHALL return a not-found response. External destinations, including the CV site, are not localized site routes.

#### Scenario: Switch language on a project page

- **WHEN** a visitor switches language while viewing a site-owned project detail page
- **THEN** the equivalent project page opens in the other locale

#### Scenario: Unknown locale

- **WHEN** a visitor requests an unsupported locale prefix
- **THEN** the site returns a not-found page rather than a broken or mixed-language page

### Requirement: Localized metadata

Every page SHALL declare the correct document language and SHALL provide a localized title, description, canonical URL, alternate-language links, and social preview metadata.

#### Scenario: English page metadata

- **WHEN** an English page is inspected
- **THEN** its `lang`, title, description, canonical, alternates, and social metadata are English and point to the English route

### Requirement: Theme modes

The site SHALL support three theme modes: system, light, and dark. The system mode SHALL follow the operating-system preference, manual selection SHALL persist across visits, and the selected theme SHALL apply before first paint so no incorrect-theme flash occurs.

#### Scenario: First visit with a dark system preference

- **WHEN** a first-time visitor has a dark system preference
- **THEN** the site renders in dark mode without a light flash

#### Scenario: Manual override persists

- **WHEN** a visitor selects light mode and returns in a later session
- **THEN** the site opens in light mode regardless of the system preference

#### Scenario: System follows the operating system

- **WHEN** the visitor keeps system mode and changes the operating-system theme
- **THEN** the site updates to the new theme without a reload

### Requirement: Theme control

The theme control SHALL be keyboard operable, SHALL name each option, and SHALL expose which option is currently selected. The control SHALL NOT rely on color alone to communicate state.

#### Scenario: Keyboard theme change

- **WHEN** a keyboard user focuses the theme control and selects dark mode
- **THEN** the theme changes, the selected state is announced, and focus remains usable

### Requirement: Responsive shell

The site SHALL remain usable from 320 pixels to 1920 pixels wide without horizontal scrolling. Navigation SHALL remain reachable and readable at every supported width.

#### Scenario: Narrow viewport

- **WHEN** the site is viewed at 320 pixels wide
- **THEN** content fits without horizontal scrolling and navigation opens in a usable mobile form

### Requirement: Keyboard access

Every interactive element SHALL be reachable and operable by keyboard. The site SHALL provide a skip link, a visible focus indicator, and logical focus order. Focus SHALL NOT be trapped except inside an open modal dialog.

#### Scenario: Navigate without a pointer

- **WHEN** a visitor uses only the keyboard
- **THEN** they can reach the skip link, navigation, filters, project rows, theme control, language switcher, and footer links

### Requirement: Reduced motion

The site SHALL honor the reduced-motion preference by removing or reducing non-essential movement while keeping content and state changes understandable.

#### Scenario: Reduced motion enabled

- **WHEN** the operating system requests reduced motion
- **THEN** preview crossfades and decorative transitions are removed or shortened and no content depends on motion to be understood

### Requirement: Contrast and readability

Text and essential interface elements SHALL meet WCAG AA contrast in both light and dark themes. Body text SHALL use a readable measure and line height.

#### Scenario: Both themes pass contrast

- **WHEN** text and controls are measured in either theme
- **THEN** normal text meets at least 4.5:1 and essential non-text UI meets at least 3:1

### Requirement: Responsive images

Content images SHALL provide descriptive alternative text, explicit dimensions, and responsive sources. Images below the first viewport SHALL load lazily. The layout SHALL NOT shift when images load.

#### Scenario: Image loading

- **WHEN** a page with several covers loads
- **THEN** space is reserved, alternative text is present, and off-screen images load lazily

### Requirement: Static performance

The site SHALL be served as static HTML. Initial JavaScript SHALL remain at or below 30 KB compressed, excluding any explicitly loaded interactive demo. The largest contentful paint SHALL be 2.0 seconds or less on a mid-tier mobile connection.

#### Scenario: Performance budget

- **WHEN** a production build is measured
- **THEN** initial JavaScript is within budget and the largest contentful paint meets the target

### Requirement: Search metadata

The site SHALL provide a sitemap, robots directives, canonical URLs, a localized not-found page, and per-page social preview images. Excluded client work SHALL NOT appear in any generated metadata.

#### Scenario: Sitemap contents

- **WHEN** the generated sitemap is inspected
- **THEN** it lists the public Spanish and English routes and excludes Puja Inmobiliaria

### Requirement: Clear empty and error states

Empty filters and unknown routes SHALL show a clear message and a useful next action rather than a blank screen or a dead end.

#### Scenario: Unknown route

- **WHEN** a visitor opens an unknown URL
- **THEN** a localized not-found page offers a route back to the work catalog and home

### Requirement: No dead links

Every rendered link SHALL resolve to a real destination. Placeholder `#` links and disabled controls that look interactive SHALL NOT be used.

#### Scenario: Missing destination

- **WHEN** a project lacks a live or code URL
- **THEN** the interface omits the link and communicates availability in text

### Requirement: Designed dark theme

The dark theme SHALL be a deliberately designed palette with its own surface, text, border, and accent values, not an automatic inversion of the light theme.

#### Scenario: Dark theme review

- **WHEN** the dark theme is compared with the light theme
- **THEN** both use intentional token values and preserve hierarchy, contrast, and semantic status colors
