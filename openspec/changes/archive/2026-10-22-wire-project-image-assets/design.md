# Design

## Context

See `proposal.md` — Why, for the motivation. The current state that shapes the approach:

- `src/content.config.ts` declares `cover: z.string().min(1).nullable().default(null)` on the projects collection, but no component reads it. `src/components/catalog/ProjectCover.astro` renders a responsive `<Image>` from `astro:assets` and is imported by nothing. The only cover actually rendered is `PlaceholderCover.astro`, from four call sites: `CaseHeader.astro:70`, `ProjectRow.astro:53`, `ProjectPreview.astro:48`, and `ScreenshotGallery.astro:84,116`.
- `ScreenshotGallery.astro` already accepts `images?: GalleryImage[]`, but `ProjectDetail.astro:62` calls it without that prop, so the gallery always falls back to the placeholder cover.
- The `cases` collection frontmatter carries `project`, `locale`, `order`, and `updated`. There is no field for a gallery list, and the twelve tier 1 bodies describe their screenshots in prose under the "Galería" heading.
- `scripts/validate-content.ts` re-declares the content schema with plain Zod and validates the 14 records and the 12 case bodies outside of Astro.
- Constraints already fixed by the site: static output, ≤30 KB compressed initial JavaScript, LCP ≤2.0 s on mid-tier mobile, no layout shift, WCAG AA in both themes, Spanish/English parity, no new runtime dependency, no route change. `data.js` is generated and read-only, and `projects/*.md` are source notes rather than runtime content.

## Goals / Non-Goals

**Goals:**

- One place to drop an image file and one key to write in a content record.
- Real covers on every surface that shows a cover, with the placeholder as the fallback rather than the default.
- Tier 1 galleries that show real screenshots, with alternative text written in each locale.
- No broken image ever published: a wrong reference fails the build instead of shipping.
- Keep `/work/` inside the performance budget with 14 covers in the catalog.

**Non-Goals:**

- Runtime uploads, an admin interface, or a CMS. Assets are committed to the repository.
- Per-project Open Graph images. `SeoHead.astro` keeps `public/og/default.png`; the `image` prop it already accepts is left alone.
- Hotlinking remote images. Every image is vendored, so the site stays static and does not leak visitors to a third-party host.
- Capturing new screenshots. The change makes the pipeline real; producing the artwork stays with the author.
- Changing how status and links work. Those are already content-driven and are out of this change's scope.

## Decisions

### 1. Images live under `src/assets/`, not `public/`

**Decision:** Covers are added at `src/assets/covers/<project-slug>.<ext>` and gallery screenshots at `src/assets/gallery/<project-slug>/<shot>.<ext>`. Both are processed by the installed `astro:assets` pipeline.

**Why:** Files under `src/assets/` are transformed at build time into optimized, hashed, responsive derivatives, which is exactly what `ProjectCover.astro` already expects with its `widths` of 480/720/960/1320 and its `src.width` guard. Files under `public/` are copied byte for byte: no `srcset`, no cache-busting hash, and the author would have to hand-maintain every size.

**Alternatives considered:**

- `public/images/covers/`: simplest possible pipeline, but every image ships at full size and the HTML has to hardcode the sizes by hand.
- Remote URLs (the source notes already point at `raw.githubusercontent.com`): no repository growth, but the site stops being self-contained, breaks when a repository is renamed or made private, and sends visitor traffic to a third party.

### 2. Content references images by asset key, not by file path

**Decision:** A project record writes `cover: tetris`, the key being the file name without extension inside the covers directory. A case body writes `gallery: [{ src: start-screen, alt: '…' }]`, the key being the file name without extension inside that project's gallery directory. One module, `src/lib/project-assets.ts`, maps keys to image metadata using `import.meta.glob` over the two directories and raises a build-time error naming the record and the key when a key is unknown.

**Why:** The record stays portable and diff-friendly — no `../../..` path that breaks when a file moves — and the key reads like the project's own vocabulary. It also keeps the reference checkable by the standalone validator script, which has no access to Astro's image helpers.

**Alternatives considered:**

- The `image()` schema helper: it validates at build time and returns image metadata directly, but it resolves paths relative to each entry file, so the YAML would hold `../../assets/covers/tetris.webp`. It couples the record to the directory layout and cannot be expressed in `scripts/validate-content.ts`, which would then need a second, hand-written resolution rule.
- Storing the full path as a string: the same coupling, with none of the validation.

**Trade-off:** `import.meta.glob` is eager, so every asset's metadata is read at build time. With roughly 14 covers and a handful of screenshots that is negligible.

### 3. One cover component, with the placeholder as its fallback

**Decision:** `ProjectCover.astro` becomes the single entry point for every cover surface. It receives the project and the locale, resolves the cover, and renders either the responsive `<Image>` or `PlaceholderCover`. The four call sites stop importing `PlaceholderCover` directly.

**Why:** The "real image or placeholder" rule is then applied in exactly one place. A new surface cannot accidentally mix a real cover with a placeholder, and the aspect ratio, the border, and the alternative text stay identical between the two branches — which is what the placeholder requirement already promises.

**Alternatives considered:**

- Branching at each call site: four copies of the same rule and four places to keep the geometry in sync.
- Keeping `ProjectCover.astro` low-level and adding a wrapper: two components for one concept, and the low-level one keeps its misleading name.

### 4. The sticky preview downloads one cover, not fourteen

**Decision:** The active preview panel renders its cover inline. Every inactive panel keeps the real cover inside an inert `<template>`, and `src/scripts/catalog.ts` clones it into the panel the first time that panel becomes active. The placeholder stays behind as the backdrop and the real image fades in over it once it loads. Row thumbnails are served at the size they are rendered (about 160 px) and stay lazy.

**Why:** The preview stacks all 14 panels in the same grid area. `loading="lazy"` does not help there, because a hidden panel still has a layout box and still intersects the viewport, so the browser would fetch all 14 covers at roughly 960 px wide — close to a megabyte on the catalog page, against a 2.0 s LCP budget. `<template>` content is inert, so an image inside it is not fetched until the node is cloned into the document, which defers each cover to the moment it is actually shown.

**Alternatives considered:**

- Accept the fourteen requests and cap the preview size at 480 px: about 350 KB on the catalog page and visibly soft covers on retina screens.
- Render real covers only on the detail page and in the gallery: contradicts the master–detail preview, whose whole value is showing the project before it is opened.
- Store `src`/`srcset` in data attributes and build the `<img>` in JavaScript: same amount of client code, but it throws away the responsive `srcset` that `astro:assets` generates.

**Without JavaScript** the preview behaves exactly as it does today: the first project shows its cover, the rest show placeholders.

### 5. Gallery entries live in the case frontmatter, one list per locale

**Decision:** `src/content/cases/<slug>.<locale>.mdx` gains an optional `gallery: [{ src, alt }]` list. The `cases` schema gains the matching optional array, `ProjectDetail.astro` resolves the entries into images, and passes them to `ScreenshotGallery`, which renders the thumbnails through the image pipeline and keeps the original file URL for the lightbox. The thumbnail box follows the ratio of the screenshot instead of cropping it to 16:10, because the published screenshots are portrait captures and a crop, or a 16:10 letterbox, would leave the product unreadably small.

**Why:** Alternative text is an accessibility requirement and must be localized, and each locale already has its own body file, so the list belongs there rather than in the shared project record. Keeping `src` and `alt` in the same object means an image cannot be published without text.

**Alternatives considered:**

- A shared gallery list in the project YAML plus a separate per-locale alt-text map: two structures to keep in sync, and mismatches are silent.
- Images embedded in the MDX body: the "Galería" section would mix prose and assets and lose the ordered thumbnail list that the lightbox works on.
- One gallery list per project with English-only alt text: breaks the Spanish/English parity the site already guarantees.

### 6. A wrong key fails the build; an unreferenced file is only reported

**Decision:** `scripts/validate-content.ts` resolves every `cover` value and every gallery `src` against the asset directories and reports an error naming the record and the key, listing the keys that do exist in that directory. The resolver raises the same error at build time, so a wrong key cannot ship even when the validator is not run. Files present in the asset directories that nothing references are reported as a notice and do not fail the build.

**Why:** A broken image is exactly the failure the site promises never to ship. An unreferenced file, on the other hand, is a normal authoring intermediate — the author drops the file in and references it in the next edit — and failing the build on it would block that order.

**Alternatives considered:**

- Silently falling back to the placeholder: hides authoring mistakes behind a plausible-looking page.
- Failing on unreferenced files too: blocks the natural authoring order for no user-visible benefit.

### 7. Covers are authored at 16:10 and at least 1600 px wide

**Decision:** The build neither crops nor pads. The file is rendered with `object-fit: cover` inside the 16:10 `--cover-aspect` box, so an off-ratio source is cropped rather than letterboxed. The authoring contract is: webp or png, at least 1600 px wide, 16:10 preferred.

**Why:** `object-fit: cover` keeps the geometry stable for any input and matches the placeholder's shape, which is what the placeholder requirement asks for — the same dimensions as a real cover. A minimum width keeps the 1320 px candidate sharp on high-density displays.

**Alternatives considered:**

- Letterboxing to show the whole image: empty bars break the grid rhythm the catalog depends on.
- Server-side cropping at build time: adds a build step and silently overrides the author's framing.

### 8. No new dependency, and one runtime source of truth

**Decision:** Reuse the installed `astro:assets` pipeline and Vite's `import.meta.glob`; add no package. The catalog YAML remains the only runtime source for covers, alongside the case frontmatter for gallery screenshots.

**Why:** The site ships with a strict JavaScript budget and a deliberately small dependency list; an image pipeline is unnecessary when the framework already provides one. A single runtime source means a cover is updated in one place.

## Risks / Trade-offs

- [The preview swap adds client code and a loading state] → The placeholder stays as the backdrop, the real image fades in over it, and each panel is cloned at most once. Without JavaScript the behavior is identical to today's.
- [A wrong asset key stops the build] → Intentional. The error names the record and the key and lists the keys that do exist in that directory.
- [Assets under `src/assets/` grow the repository] → Screenshots are stored as compressed webp and the 16:10 cover is authored once per project. Very large PNG originals are discouraged by the authoring contract.
- [The Tetris screenshots referenced in the source note are 350 px wide] → Usable as gallery material, not as a 1600 px cover. The first real cover still has to be captured or re-exported by the author.
- [The lightbox loads the original file] → The full-resolution asset is fetched only when a visitor opens a screenshot, never on page load.

## Migration Plan

No data migration. The change is additive: with no files under `src/assets/`, every record keeps `cover: null`, every project keeps rendering the placeholder, and the published output is unchanged.

1. Merge the mechanism with every `cover` still `null`. The site behaves exactly as today.
2. Add assets and references one project at a time. Each project flips from placeholder to real cover independently, in either locale.
3. Rollback: set the references back to `null` and remove the `gallery` frontmatter. The asset files stay in the repository and are simply unused.

## Open Questions

- Which project gets the first real cover, and whether the cover set is captured in one sitting or gradually. The mechanism does not depend on the answer.
- Whether the four Todo App screenshots referenced by `projects/todoappdrag.md` still exist in the `FrontendMentor_Todo_App` repository. The note points at paths relative to itself, so their presence decides whether that gallery can be imported rather than recaptured.

## Notes from the implementation

- The four Todo App screenshots exist in the author's repository. Todo App is tier 2 and has no case body, so only the desktop dark screenshot is published, as its cover.
- The Tetris screenshots are portrait captures of about 432 px wide. They are published as the gallery of a tier 1 case, and they are below the 1600 px a cover needs, so Tetris keeps the designed placeholder.
- The gallery thumbnail shows the whole frame instead of cropping it to 16:10, because the published screenshots are portrait. Decision 5 is updated above.
