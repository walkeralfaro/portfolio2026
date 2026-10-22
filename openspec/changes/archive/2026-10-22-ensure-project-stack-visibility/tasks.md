# Tasks

## 1. Stack hook and detail-page coverage

- [x] 1.1 Add `data-case-stack` to the shared stack container in `src/components/case/CaseHeader.astro`; verify `npm run check` passes with no diagnostics.
- [x] 1.2 Extend `tests/e2e/detail.spec.ts` to read each project record's `stack`, assert the header renders the exact items in order, and assert the count is 3–5 for every project in both locales; verify `npm run test:e2e -- tests/e2e/detail.spec.ts` passes.
- [x] 1.3 Add a `docs/cases.md` test-coverage note stating that every project, narrative or baseline, renders its record stack in the shared header in both locales; verify the note is present with `grep`.

## 2. Integration checks

- [x] 2.1 Run `npm run validate:content` and `npm run build`; verify 14 projects and 12 case bodies validate and the build completes with 38 pages.
- [x] 2.2 Run `npm run test:e2e`; verify the full Playwright suite passes.
