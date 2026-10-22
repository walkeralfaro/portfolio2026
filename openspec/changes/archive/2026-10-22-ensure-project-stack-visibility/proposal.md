# Proposal

## Why

The stack is the strongest cross-project comparison signal, but the detail-page test suite does not assert that every project renders it. All 14 records currently define a 3–5 item stack and the shared header displays it, so a regression that hides or empties the stack could pass the existing tests.

## What Changes

- Make stack visibility an explicit, testable invariant for every project detail page in both locales.
- Add a stable stack hook to the shared case header.
- Add an end-to-end check that reads each project record's stack and verifies the rendered order and item count on its Spanish and English detail page.
- Add a baseline-project scenario to the existing single-source stack requirement so the spec covers projects with and without a narrative.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `work-catalog`: extend the single-source stack requirement so every detail page, including projects without a narrative, must expose the project record's stack in the shared header.

## Impact

- `src/components/case/CaseHeader.astro`: add a stable stack hook.
- `tests/e2e/detail.spec.ts`: assert the stack for all 14 projects in both locales.
- `docs/cases.md`: document the stack invariant in the test coverage notes.
- No content migration, dependency, or schema change.
