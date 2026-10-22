# Project galleries

One folder per project, holding its screenshots:

```text
src/assets/gallery/<project-slug>/<shot>.<ext>
```

The file name without its extension is the **asset key**. The project record
references that key under each locale, because the alternative text is written
per locale.

A gallery is the set of product screenshots of a project. Any project can have
one. A cover is the single representative image of a project. They are
independent: a project can have a cover without a gallery, a gallery without a
cover, or both. See [`src/assets/covers/README.md`](../covers/README.md).

## Declaring the screenshots

```yaml
# src/content/projects/tetris.yaml
locales:
  es:
    gallery:
      - src: start-screen
        alt: Pantalla de inicio del juego, con el logotipo y el botón de inicio.
      - src: play-screen
        alt: Partida en curso, con las piezas apiladas en el tablero y el marcador.
  en:
    gallery:
      - src: start-screen
        alt: Game start screen, with the logo and the start button.
      - src: play-screen
        alt: A game in progress, with the pieces stacked on the board and the score panel.
```

The list is optional and empty by default. Each locale has its own list: a
gallery can exist in one language and be absent in the other. The order of the
list is the order on the page, and `alt` is required for every entry: it is the
only description a screen reader gets.

## Where a screenshot appears

| Surface | Behavior |
| --- | --- |
| Gallery thumbnail | The whole frame, inside a box that follows the ratio of the image |
| Lightbox | The original file, fitted inside the dialog without internal scrolling |
| Case header, catalog preview, row thumbnail | Never; those surfaces use the project cover |

Portrait and landscape screenshots both work. The thumbnail box follows the
image ratio instead of cropping to 16:10, because published captures can be
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
4. Declare them under `locales.es.gallery` and/or `locales.en.gallery` in
   `src/content/projects/<project-slug>.yaml`.
5. Run `npm run validate:content`.

```bash
convert source.png -quality 82 -define webp:method=6 \
  src/assets/gallery/todo-mcp/start-screen.webp
```

## When a locale declares no gallery

No gallery section is rendered at all: no wrapper, no caption, no cover
substitute, and no dialog. The project cover still appears in the detail header
and the catalog. Do not add generic or stock images to fill the space.

## Validation

- A key with no matching file in `src/assets/gallery/<project-slug>/` fails
  `npm run validate:content` and the build, naming the project, the locale, and
  the key.
- A file that no project record references is reported as a notice and does not
  fail the run, so a set can be committed before it is declared.
