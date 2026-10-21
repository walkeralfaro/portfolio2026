# Tasks

## 1. Fix toggle icon visibility

- [x] 1.1 In `src/components/shell/SiteHeader.astro`, replace the scoped `.site-menu__icon--*` rules with `:global(.site-menu__icon--*)` selectors anchored to the scoped `.site-menu__toggle` ancestor, so exactly one icon is displayed per menu state; verify with `npm run build` and confirm the generated CSS selectors no longer require the header's `data-astro-cid` attribute on the icon `<svg>` elements
- [x] 1.2 Extend the 320 px mobile test in `tests/e2e/shell.spec.ts` to assert the hamburger icon is visible and the close icon is hidden while the menu is closed; verify with `npx playwright test tests/e2e/shell.spec.ts -g "mobile menu"`
- [x] 1.3 Add open-state assertions to the same test so the close icon is visible and the hamburger is hidden after pressing Enter, and restore the closed-state assertions after Escape; verify the same targeted Playwright test passes
- [x] 1.4 Run `npx playwright test tests/e2e/shell.spec.ts` and confirm the desktop header tests still pass, proving the toggle stays hidden and the navigation remains visible at 1280 px

## 2. Verification

- [x] 2.1 Run `npm run check` and confirm Astro reports no type or template errors in `SiteHeader.astro` or `shell.spec.ts`
- [x] 2.2 Manually inspect the header at 320 px, 375 px, and 899 px with the menu closed and open to confirm one icon at a time, no layout shift, and no horizontal overflow
