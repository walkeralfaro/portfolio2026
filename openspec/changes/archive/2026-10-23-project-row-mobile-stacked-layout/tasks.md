# Tasks

## 1. Mobile cover delivery

- [x] 1.1 Update the `ProjectCover` usage in `src/components/catalog/ProjectRow.astro` to mobile-oriented `widths` (`240, 360, 480, 720`) and `sizes="(min-width: 900px) 104px, 100vw"`, then verify `npm run build` completes and emits `srcset` entries for the row cover
- [x] 1.2 Verify the row cover uses the mobile-oriented candidates and `sizes`; no project has a cover asset yet, so the placeholder path is what renders today and the real-cover path picks up the same props when assets are added

## 2. Stacked mobile layout

- [x] 2.1 In the `<900px` media query of `ProjectRow.astro`, change `.project-row__inner` to a single full-width column, keep the cover before the content in DOM order, and verify at 375px that the cover sits above the content at the row's full content width
- [x] 2.2 Remove the mobile thumbnail overrides that hide `.placeholder-cover__content` and shrink `.placeholder-cover__mark`, then verify a project without a cover renders the full placeholder composition at 375px
- [x] 2.3 Extend the mobile catalog e2e test in `tests/e2e/catalog.spec.ts` to assert the cover's bottom edge is above the content's top edge and spans the row's content width at 375px and 768px, then run `npx playwright test tests/e2e/catalog.spec.ts -g "mobile catalog"` and verify it passes

## 3. Integration verification

- [x] 3.1 Verify the desktop row and home excerpt are unaffected: at 1280px the cover stays hidden and the desktop master-detail test passes, and at 375px the home excerpt rows stack by running `npx playwright test tests/e2e/catalog.spec.ts`
- [x] 3.2 Verify the row inset, no-horizontal-overflow, and no-JavaScript navigation scenarios still pass, then run `openspec validate project-row-mobile-stacked-layout` and confirm the change is valid
