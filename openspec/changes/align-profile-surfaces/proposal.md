# Proposal

## Why

Two profile surfaces were trimmed by hand after the first build, and the specification and the end-to-end suite still describe the previous shape. The home catalog excerpt renders the first four entries instead of eight, and `/about/` no longer carries a contact block because the site footer already owns that surface on every page. As a result `npm run test:e2e` reports two failures on an otherwise clean checkout, and the spec claims a contact section the about page does not render. The repository should describe the site the author actually wants.

## What Changes

- Keep the home catalog excerpt at the first four projects in catalog order, and record that shape as behavior: the rendered rows, the count label, and the link to the full catalog stay consistent with the number of rows shown.
- Keep the contact surface in the site footer, which already exposes email, LinkedIn, GitHub, and the external CV link on every page. The about pages do not repeat it.
- Remove the leftover `ContactLinks` import from `/about/` and `/en/about/`. The manual edit removed the rendered block, so the import is dead and is the only remaining reference to the component.
- Align `tests/e2e/profile.spec.ts` with both decisions: assert four excerpt rows and their order, and assert the contact links through the footer instead of the about page.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `professional-profile`: the contact surface is named as the site footer instead of an unspecified contact section, and the home catalog excerpt gains a requirement fixing it at the first four catalog entries.

## Impact

- `openspec/specs/professional-profile/spec.md`, through the delta in this change.
- `src/pages/about.astro` and `src/pages/en/about.astro`: remove the unused import.
- `src/components/profile/IndexExcerpt.astro`: behavior unchanged, now covered by a requirement.
- `src/components/profile/ContactLinks.astro`: no longer referenced by any page. It stays in the tree but is not rendered.
- `tests/e2e/profile.spec.ts`: the excerpt assertions and the contact assertions move to the intended shape.
