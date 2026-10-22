# Project covers

One image per project, named after the project slug:

```text
src/assets/covers/<project-slug>.<ext>
```

The file name without its extension is the **asset key**. The project record
references that key, never the path:

```yaml
# src/content/projects/tetris.yaml
cover: tetris
```

A cover is the single representative image of a project and belongs to the
**project record**. A gallery is the set of product screenshots of a tier 1 case
and belongs to the **case body**. They are independent: every project can have a
cover, and only a tier 1 case can have a gallery. See
[`src/assets/gallery/README.md`](../gallery/README.md).

## Where a cover appears

| Surface | Size | Loading |
| --- | --- | --- |
| Case header on a project detail page (tiers 1 and 2) | 4 of 12 columns | Eager, with high fetch priority |
| Sticky preview on the catalog page | 5 of 12 columns | Only the active panel; the other 13 keep their cover in an inert `<template>` until their panel is shown |
| Row thumbnail on the catalog page, mobile only | 104 px | Lazy |

Tier 3 has no detail page, so its cover appears in the catalog row and the
preview only.

The catalog page therefore downloads one cover at a time, not fourteen.

## Authoring rules

| Rule | Value |
| --- | --- |
| Formats | `.webp` (preferred) or `.png` |
| Aspect ratio | 16:10, for example 1600 × 1000 px |
| Recommended width | 1600 px or more |
| Colour | sRGB |

The build renders the file with `object-fit: cover` inside a 16:10 box. An
off-ratio source is cropped from the centre, never letterboxed, so the catalog
grid keeps its rhythm. If the source is not 16:10, keep the important content in
the middle third of the height.

A source narrower than 1600 px still renders, but it is not upscaled beyond its
own width and can look soft on a high-density screen. The published Todo App
cover is 1440 px because that is the largest screenshot available.

## Step by step

1. Capture the project at 1600 px wide or more, in a 16:10 frame.
2. Save or convert it as `.webp`.
3. Put it at `src/assets/covers/<project-slug>.webp`.
4. Set `cover: <project-slug>` in `src/content/projects/<project-slug>.yaml`.
5. Run `npm run validate:content`.

```bash
convert source.png -quality 82 -define webp:method=6 src/assets/covers/todo-app.webp
```

## Fallback

A project without a cover keeps `cover: null` and renders `PlaceholderCover`: a
deterministic 16:10 box with the project name, the category, and a mark derived
from the slug. The layout does not shift when a real cover arrives later.

## Validation

- A key with no matching file fails `npm run validate:content` and the build,
  with an error naming the record and the key. A broken image is never published.
- A file that no record references is reported as a notice and does not fail the
  run, so a file can be committed before it is referenced.

The build check exists because `npm run build` does not run `validate:content`:
the resolver in `src/lib/project-images.ts` throws for a dangling key, so a
wrong reference cannot reach production even when only the build runs.
