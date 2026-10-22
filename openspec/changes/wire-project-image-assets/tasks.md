# Tasks

## 1. Asset key contract and resolver

- [x] 1.1 Create `src/assets/covers/` and `src/assets/gallery/` with a short `README.md` in each that states the authoring contract (16:10 preferred, at least 1600 px wide for covers, webp or png, one file per project for covers, one folder per project for gallery shots) and verify the folders exist and the READMEs describe the contract
- [x] 1.2 Add `src/lib/project-assets.ts` with pure, I/O-free helpers that derive an asset key from a file name, list the keys available in a directory, and resolve a reference against that list, and verify with a new `tests/unit/project-assets.test.ts` run through `npm run test:unit` that a known key resolves, an unknown key reports the available keys, and the helpers contain no filesystem or Vite API
- [x] 1.3 Add `src/lib/project-images.ts` that builds the cover and gallery image maps with `import.meta.glob` over `src/assets/covers/` and `src/assets/gallery/<project-slug>/`, exposes the cover and gallery images for a project, and throws an error naming the record and the key for an unknown reference; verify that `npm run build` succeeds with no assets and that a temporary record with a wrong cover key fails the build with that message before the record is restored

## 2. Content contract and validation

- [x] 2.1 Extend the `cases` collection in `src/content.config.ts` with an optional `gallery` array of `{ src, alt }` entries defaulting to empty, and verify that `npm run check` accepts the change and that the twelve existing case bodies still type-check without a `gallery` field
- [x] 2.2 Mirror the `gallery` field in the case schema of `scripts/validate-content.ts`, resolve every project `cover` value and every gallery `src` against the asset directories, fail with an error naming the record and the key when a file is missing, and report files that nothing references as a notice that does not fail the run; verify with `npm run validate:content` that the run passes with no assets and fails with the expected message when a record points at a missing key
- [x] 2.3 Document the asset contract in `docs/content.md` — the two asset locations, the key format, the authoring rules for covers, the `gallery` case frontmatter, the validation rules, and the commands to run — and verify that the documented commands and field names match `src/content.config.ts` and `scripts/validate-content.ts` exactly

## 3. Cover rendering

- [x] 3.1 Rewrite `src/components/catalog/ProjectCover.astro` as the single entry point for every cover surface: it receives the project and the locale, renders the responsive image when the record references a cover and `PlaceholderCover` otherwise, and keeps the 16:10 box, the border, and the descriptive alternative text identical in both branches; verify with `npm run check` that the component compiles and that no other component imports `PlaceholderCover` directly
- [x] 3.2 Replace the `PlaceholderCover` call in `src/components/case/CaseHeader.astro` with `ProjectCover` and load that cover eagerly, and verify that a project detail page shows the real cover when the record references one and the placeholder otherwise
- [x] 3.3 Replace the `PlaceholderCover` call in `src/components/catalog/ProjectRow.astro` with `ProjectCover` at the size the mobile thumbnail is rendered, keeping the thumbnail decorative as it is today, and verify that the mobile catalog at 375 px shows the thumbnail without horizontal overflow
- [x] 3.4 Replace the `PlaceholderCover` call in `src/components/catalog/ProjectPreview.astro` with `ProjectCover`, rendering the active panel's cover inline and every inactive panel's cover inside an inert `<template>` that the browser does not fetch; verify in the built output that exactly one preview cover is a live image and the other thirteen are inside template elements
- [x] 3.5 Clone the template into a panel the first time that panel becomes active in `src/scripts/catalog.ts`, fading the image in over the placeholder backdrop, and verify that moving the pointer across the rows swaps the preview cover and that the swap happens once per panel
- [x] 3.6 Extend `tests/e2e/catalog.spec.ts` to assert that the active preview shows the referenced cover, that no cover request is issued for an inactive panel on load, and that the mobile thumbnail renders; verify with `npm run test:e2e -- tests/e2e/catalog.spec.ts`
- [x] 3.7 Update the cover and preview behavior in `docs/catalog.md`, including the deferred preview load and the new responsibility of `ProjectCover.astro`, and verify that the description matches the rendered behavior

## 4. Gallery rendering

- [x] 4.1 Change `src/components/case/ScreenshotGallery.astro` to accept resolved gallery images, render the thumbnails through the image pipeline, keep the lightbox on the original file, and fall back to the placeholder cover when the list is empty; verify with `npm run check` that the component compiles and the placeholder branch is unchanged
- [x] 4.2 Resolve the case `gallery` frontmatter in `src/components/case/ProjectDetail.astro` and pass the images to `ScreenshotGallery`, so the tier 1 page shows the declared screenshots in order; verify that a tier 1 page with a declared gallery shows one thumbnail per entry and that each one opens the lightbox
- [x] 4.3 Update the "Galería" prose in the twelve tier 1 case bodies so it matches what the page publishes, keeping the pending note while a case declares no gallery; verify with `npm run validate:content` that every section still has the required content and that the English bodies carry no Spanish fragments
- [x] 4.4 Extend `tests/e2e/detail.spec.ts` to assert that the case header renders the referenced cover and that a declared gallery renders its thumbnails with localized alternative text in both locales; verify with `npm run test:e2e -- tests/e2e/detail.spec.ts`

## 5. First real assets

- [x] 5.1 Import the three Tetris screenshots referenced by `projects/tetris.md` into `src/assets/gallery/tetris/`, declare them in `tetris.es.mdx` and `tetris.en.mdx` with alternative text in each language, and verify that the Spanish and English pages show the three screenshots in order with their own alternative text
- [x] 5.2 Check whether the four Todo App screenshots referenced by `projects/todoappdrag.md` exist in the `FrontendMentor_Todo_App` repository, import them into `src/assets/gallery/todo-app/` and declare them in `todo-app` case bodies when they do, and record the finding either way in `docs/content-sources.md`; verify that `npm run validate:content` reports no missing asset when the screenshots are absent
- [x] 5.3 Add the first 16:10 cover once the author supplies the file: place it at `src/assets/covers/<project-slug>.<ext>`, set `cover:` in that project record, and verify that the catalog row, the sticky preview, and the detail page all show the real cover for that project while the other thirteen keep the placeholder

## 6. Integration verification

- [x] 6.1 Run `npm run validate:content`, `npm run validate:cv`, `npm run validate:i18n`, `npm run validate:theme`, `npm run check`, `npm run build`, `npm run test:unit`, and `npm run test:e2e` and confirm that every command passes
- [x] 6.2 Run `npm run audit:site` and `npm run audit:performance` and confirm that no broken image or internal link is reported and that the page weight and LCP budget still hold with real covers in place
