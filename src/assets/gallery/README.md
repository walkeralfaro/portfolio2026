# Project galleries

One folder per project, holding its screenshots:

```text
src/assets/gallery/<project-slug>/<shot>.<ext>
```

The file name without its extension is the **asset key**. The case body
references that key in its own frontmatter, because the alternative text is
written per locale.

A gallery is the set of product screenshots of a **tier 1 case** and belongs to
the case body. A cover is the single representative image of a project and
belongs to the project record. They are independent: a project can have a cover
without a gallery, and a tier 1 case can have a gallery without a cover. See
[`src/assets/covers/README.md`](../covers/README.md).

## Who can have a gallery

Only **tier 1** projects, the six with a full case study:

TODO-mcp, Image Prompt, Cheatsheet Editor, URL Shortener, Multi-step Form,
Tetris.

| Tier | Projects | Detail page | Gallery |
| --- | --- | --- | --- |
| 1 | 6 | Full MDX case study: problem, role, decisions, result, stack, gallery | Yes, declared in the case body |
| 2 | 4 | Short case built from the localized `summary`, `role`, and `result` fields | No, there is no case body |
| 3 | 4 | No internal page; the entry opens the external destination | No |

Tier 2 and tier 3 projects can still have a **cover**; they only cannot have a
gallery, because a gallery is declared by a case body and only tier 1 has one.

## Declaring the screenshots

```yaml
# src/content/cases/tetris.es.mdx
gallery:
  - src: start-screen
    alt: Pantalla de inicio del juego, con el logotipo y el botón de inicio.
  - src: play-screen
    alt: Partida en curso, con las piezas apiladas en el tablero y el marcador.
```

Repeat the same list in `<slug>.en.mdx` with the `alt` written in English. The
order of the list is the order on the page, and `alt` is required for every
entry: it is the only description a screen reader gets.

## Where a screenshot appears

| Surface | Behavior |
| --- | --- |
| Gallery thumbnail | The whole frame, inside a box that follows the ratio of the image |
| Lightbox | The original file, at its own size |
| Case header, catalog preview, row thumbnail | Never; those surfaces use the project cover |

Portrait and landscape screenshots both work. The thumbnail box follows the
image ratio instead of cropping to 16:10, because the published captures are
portrait and a crop would hide most of the product.

## Authoring rules

| Rule | Value |
| --- | --- |
| Formats | `.webp` (preferred) or `.png` |
| Recommended width | 1200 px or more |
| Colour | sRGB |

The three published Tetris captures are 432 px wide: they are the only material
available for that project, so they are below the recommendation. New material
should be captured at 1200 px or more.

## Step by step

1. Capture each screen at 1200 px wide or more.
2. Save or convert each one as `.webp`.
3. Put them in `src/assets/gallery/<project-slug>/` with short kebab-case names.
4. Declare them under `gallery` in `src/content/cases/<project-slug>.es.mdx` and
   `<project-slug>.en.mdx`.
5. Run `npm run validate:content`.

```bash
convert source.png -quality 82 -define webp:method=6 \
  src/assets/gallery/todo-mcp/start-screen.webp
```

## When a case declares no gallery

A tier 1 case with no `gallery` renders one cover item plus the note that there
are no verified screenshots. The item is the project's real cover when the
record references one, and the designed placeholder when it does not. Do not add
generic or stock images to fill the space.

## Validation

- A key with no matching file in `src/assets/gallery/<project-slug>/` fails
  `npm run validate:content` and the build, naming the case and the key.
- A file that no case body references is reported as a notice and does not fail
  the run, so a set can be committed before it is declared.
