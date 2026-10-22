# Design

## Context

See `proposal.md` — Why. The current state that shapes the approach:

- `src/components/profile/IndexExcerpt.astro` renders `projects.slice(0, 4)`, and `src/pages/index.astro` and `src/pages/en/index.astro` pass `getProjects()`, which is sorted by `order`. The four rendered rows are therefore the first four catalog entries, not the featured set.
- The excerpt header already derives its count from `excerpt.length`, and the section sets `data-excerpt-count` from the same value, so the label cannot drift from the rows.
- `/about/` and `/en/about/` still import `ContactLinks.astro` but no longer render it. `ContactLinks.astro` is imported by nothing else, and its `[data-contact-links]` block is what the end-to-end test looks for.
- `SiteFooter.astro` already renders the email, the social links from `site.socials`, and the external CV link, on every page and in both locales.
- `tests/e2e/profile.spec.ts` asserts eight excerpt rows and a contact block on the about page, so it fails against the intended site.

## Goals / Non-Goals

**Goals:**

- Make the specification, the tests, and the rendered site agree on four excerpt rows and a footer-only contact surface.
- Leave one obvious owner for the contact surface, so a future change does not reintroduce a second copy.

**Non-Goals:**

- Redesigning the about page or its content.
- Changing the featured set, the catalog order, or the number of projects.
- Removing `ContactLinks.astro` from the tree.

## Decisions

**1. The excerpt stays a slice of catalog order, not of the featured set.**
`slice(0, 4)` over `getProjects()` yields the first four by `order`. Wiring the excerpt to the featured set would change which projects appear and create a second source of truth for the featured curation. The spec names the behavior as "the first four projects in catalog order" so the slice is a contract, not an incidental constant.

**2. The footer is the contact surface, and the about page does not repeat it.**
Two contact blocks with the same links would be redundant for the reader and a second place to keep in sync. The footer already appears on every page, so it satisfies "email, LinkedIn, GitHub, and CV access" without a page-specific block. The alternative, keeping the block on the about page and dropping it from the footer, would leave the home and the catalog pages without contact access.

**3. Keep `ContactLinks.astro`, remove only the imports.**
The component is no longer rendered, but deleting it is a separate editorial decision and the file costs nothing at build time because Astro only bundles rendered components. Removing the two unused imports clears the compiler hint without discarding a component the author may reuse. If the file is still unreferenced after this change, deleting it is a one-line follow-up.

**4. Move the contact assertion to the footer instead of dropping it.**
The behavior the test protects — four contact destinations, no phone number, `rel="noopener noreferrer"` on external links — still matters. Asserting it through `[data-contact-links]` was tied to the about page; the footer exposes the same links inside its own container. Keeping the assertions preserves the coverage of the requirement while removing the assumption about where the block lives.

**5. The excerpt test asserts order, not only count.**
A count of four would still pass if the slice picked the wrong projects. The test asserts the four slugs in order, so a change to catalog order or to the slice fails loudly.

## Risks / Trade-offs

- [The footer's contact links are not in a single `[data-contact-links]` container] → the test scopes to `footer` and filters by `href`, so it does not depend on a wrapper element that the footer does not have.
- [Keeping an unreferenced component] → it stays invisible to visitors and is reported by no check; the removal remains an explicit follow-up rather than an accidental deletion.
- [The excerpt count changes with the slice] → the label and `data-excerpt-count` both derive from `excerpt.length`, so the test reads the rendered truth rather than a hardcoded number in the component.

## Open Questions

None.
