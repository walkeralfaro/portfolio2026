# Tasks

## 1. Row inset

- [x] 1.1 Add `padding-inline: var(--space-4)` to `.project-row__inner` in `src/components/catalog/ProjectRow.astro` and verify the row content is inset on both sides while dividers and the link surface stay full width
- [x] 1.2 Extend `tests/e2e/catalog.spec.ts` to assert the row content is inset consistently at 375, 768, and 1280 pixels and that no horizontal overflow appears; verify with `npm run test:e2e -- tests/e2e/catalog.spec.ts`
- [x] 1.3 Document the horizontal inset in the row anatomy of `docs/catalog.md` and verify the description matches the rendered behavior
- [x] 1.4 Run `npm run check` and confirm the Astro/TypeScript checks pass
