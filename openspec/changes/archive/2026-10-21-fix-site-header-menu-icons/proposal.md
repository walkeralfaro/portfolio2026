# Proposal

## Why

On viewports below 900 pixels the site header renders the hamburger and the close icon at the same time. The intended single-icon state (hamburger when the menu is closed, close when it is open) never applies because the visibility rules in `SiteHeader.astro` are scoped to that component while the icons are rendered by the child `Icon.astro` component, which only carries its own scope attribute. The result is a confusing control that contradicts the menu state.

## What Changes

- Make the toggle render exactly one icon: `menu` while closed, `close` while open, at every width where the toggle is visible.
- Target the icon SVGs from `SiteHeader.astro` with selectors that actually match child component roots, while keeping specificity above `Icon.astro`'s base `.icon { display: inline-block }` rule.
- Add end-to-end assertions at 320 pixels that verify icon state before and after opening the menu.
- Keep the existing markup, inline script, keyboard behavior, desktop layout, and accessibility attributes unchanged.
- No new capability is introduced: this is a correction to behavior already intended by the responsive shell, so the change declares `skip_specs: true` rather than inventing a duplicate requirement.

## Capabilities

### New Capabilities

None. The mobile navigation behavior belongs to the `site-experience` capability that is still in flight in the `build-portfolio-2026` change; duplicating or pre-empting that path here would create two competing capabilities. This change is a pure implementation correction with no new requirement, so it opts out of specs via `skip_specs: true`.

### Modified Capabilities

None.

## Impact

- `src/components/shell/SiteHeader.astro`: the style block that hides and shows the two icons.
- `tests/e2e/shell.spec.ts`: mobile menu test gains icon-state assertions.
- `openspec/changes/fix-site-header-menu-icons/.openspec.yaml`: sets `skip_specs: true`.
- No changes to components, scripts, routes, dependencies, or design tokens. No breaking changes.
