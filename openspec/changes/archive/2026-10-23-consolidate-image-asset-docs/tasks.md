# Tasks

## 1. Single source of truth

- [x] 1.1 Rewrite the *Image assets* section in `docs/content.md` to cover covers and galleries together: paths and key resolution, optional and independent assets, locale-specific `alt`, accepted formats, recommended dimensions, crop versus native-ratio behavior, fallbacks, and validation. Verify the section no longer names a specific project or states volatile counts or published dimensions.
- [x] 1.2 Remove the inaccurate *Minimum width* wording and list every format the resolver accepts (`.webp`, `.png`, `.jpg`, `.jpeg`, `.avif`). Verify each claim against `src/lib/project-images.ts` and `src/lib/project-assets.ts`.
- [x] 1.3 Update the *Published galleries* citation in `docs/content-sources.md` to point at `src/assets/gallery/tetris/` instead of the deleted README. Verify the row keeps its existing metric and project.

## 2. Remove duplicated docs

- [x] 2.1 Delete `src/assets/covers/README.md` and `src/assets/gallery/README.md`. Verify both paths are gone and that `src/assets/covers/` still contains its image and `src/assets/gallery/` still contains its project directory.
- [x] 2.2 Confirm no tracked file still links to either README. Verify with `grep -rn "assets/covers/README\|assets/gallery/README" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist` returning no matches.

## 3. Integration checks

- [x] 3.1 Run `npm run validate:content` and verify it passes with the expected project and case counts, confirming the README removal does not affect asset resolution.
- [x] 3.2 Run `npm run build` and verify the site builds without dangling image references or broken documentation links.
