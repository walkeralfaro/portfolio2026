# Tasks

## 1. About pages

- [x] 1.1 Remove the unused `ContactLinks` import from `src/pages/about.astro` and `src/pages/en/about.astro`, leaving the rest of both pages untouched, and verify with `npm run check` that the `ts(6133)` hints for those two files are gone
- [x] 1.2 Confirm that `/about/` and `/en/about/` render no `[data-contact-links]` block while the footer still renders email, LinkedIn, GitHub, and the CV link, and verify in the built HTML for both locales that the contact destinations appear once per page inside the footer

## 2. End-to-end coverage

- [x] 2.1 Rewrite the home excerpt test in `tests/e2e/profile.spec.ts` to assert four rendered rows, `data-excerpt-count="4"`, and the four slugs in catalog order, and verify with `npx playwright test tests/e2e/profile.spec.ts -g "home excerpt"`
- [x] 2.2 Rewrite the contact test in `tests/e2e/profile.spec.ts` to assert the four destinations through the footer in both locales, keep the no-phone and `rel="noopener noreferrer"` checks, and assert that the about page exposes no contact block, and verify with `npx playwright test tests/e2e/profile.spec.ts -g "contact"`

## 3. Integration checks

- [x] 3.1 Run `npm run validate:content`, `npm run validate:i18n`, `npm run check`, and `npm run build`, and verify that all four succeed with no errors and the build still emits 30 pages
- [x] 3.2 Run `npm run test:e2e` and verify that the suite reports no failures, including the two tests this change rewrites
