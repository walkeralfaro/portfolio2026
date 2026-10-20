# Design system

The design system is defined in `src/styles/tokens.css` and `src/styles/global.css`. Components consume semantic tokens instead of raw colors, font stacks, spacing values, or layout widths. The visual decisions behind the scale are documented in `openspec/changes/build-portfolio-2026/design.md`.

## Rules

- Use the semantic color tokens (`--paper`, `--surface`, `--ink`, `--muted`, `--line`, `--signal`, `--live`, `--wip`, `--archived`) for all component colors.
- Use the type, spacing, and layout tokens in component styles. Do not introduce a second spacing scale or a one-off font size.
- Light and dark palettes are independent. Both are defined in `tokens.css`; never derive dark colors by filtering or inverting the light palette.
- The global `:focus-visible` rule provides a 3 px `--signal` outline with 3 px offset. Do not remove it without providing an equally visible replacement.
- Icons are decorative by default. Interactive controls must have a visible text label; an icon alone is never the accessible name.
- Motion is optional. When a transition is added, disable it under `prefers-reduced-motion: reduce`.

## Color tokens

| Token | Light | Dark | Intended use |
| --- | --- | --- | --- |
| `--paper` | `#f2f4f1` | `#0e1110` | Page background |
| `--surface` | `#fafbf8` | `#151918` | Cards, covers, badges, raised surfaces |
| `--ink` | `#101314` | `#e8ebe6` | Primary text and strong marks |
| `--muted` | `#666e69` | `#9aa39d` | Secondary metadata text |
| `--line` | `#d8dcd6` | `#2a302d` | Hairlines and borders |
| `--signal` | `#2447e8` | `#8b9bff` | Actions, links, focus, cover marks |
| `--signal-ink` | `#ffffff` | `#0e1110` | Text on `--signal` |
| `--live` | `#16794f` | `#5bd39a` | Live-status dot |
| `--wip` | `#8a5300` | `#f0b35a` | In-development-status dot |
| `--archived` | `#6c746f` | `#9aa39d` | Archived-status dot |

The light `--muted` value is slightly darker than the design sample (`#6c746f`) so small metadata text reaches 4.75:1 against `--paper`. The status colors are used for dots, not as the only status label; badge text uses `--ink` on `--surface`.

## Typography

| Token | Value | Role |
| --- | --- | --- |
| `--font-family-sans` | Archivo, fallback Arial | Index, navigation, headings, labels |
| `--font-family-serif` | Source Serif 4, fallback Georgia | Case-study prose, about narrative |
| `--type-display-size` | `clamp(2.75rem, 6vw, 5.5rem)` | Display statement |
| `--type-display-leading` | `0.95` | Display line height |
| `--type-display-tracking` | `-0.03em` | Display tracking |
| `--type-h2-size` | `2rem` | Section and page headings |
| `--type-h2-leading` | `1.1` | H2 line height |
| `--type-h3-size` | `1.375rem` | Subheadings |
| `--type-h3-leading` | `1.25` | H3 line height |
| `--type-row-size` | `1.25rem` | Project-row titles |
| `--type-row-leading` | `1.3` | Project-row line height |
| `--type-body-size` | `1.125rem` | Body copy |
| `--type-body-leading` | `1.65` | Body line height |
| `--type-meta-size` | `0.8125rem` | Metadata and labels |
| `--type-meta-leading` | `1.3` | Metadata line height |

Use tabular numerals (`font-variant-numeric: tabular-nums`) for years, counts, and metadata. Use the sans family for browsing and structure, and the serif family for reading. `Prose` is the only component that sets the serif reading voice by default.

## Spacing

| Token | Value |
| --- | --- |
| `--space-1` | `0.25rem` |
| `--space-2` | `0.5rem` |
| `--space-3` | `0.75rem` |
| `--space-4` | `1rem` |
| `--space-6` | `1.5rem` |
| `--space-8` | `2rem` |
| `--space-12` | `3rem` |
| `--space-16` | `4rem` |
| `--space-24` | `6rem` |
| `--space-32` | `8rem` |

Use small spacing for internal component rhythm, `--space-8` to `--space-12` for block separation, and `--space-16` to `--space-32` for section-level space.

## Layout tokens

| Token | Value | Role |
| --- | --- | --- |
| `--page-margin` | `clamp(20px, 5vw, 64px)` | Inline page gutters |
| `--content-max` | `82.5rem` (1320 px) | Maximum content width |
| `--grid-columns` | `12` | Container track count |
| `--grid-gutter` | `1rem`, `1.5rem` at 640 px, `2rem` at 1200 px | Column gap |
| `--measure-prose` | `65ch` | Reading measure |
| `--cover-aspect` | `16 / 10` | Project cover ratio |
| `--control-min-size` | `2.75rem` (44 px) | Minimum interactive target |

The shared breakpoints are `640px`, `900px`, and `1200px`. Use `900px` for the catalog's single-column to master–detail switch and `1200px` for the wider desktop gutter.

## Primitives

### `Container.astro`

A 12-column CSS grid with the page margin, content maximum, and responsive gutter. It spans the full page and starts every layout.

```astro
<Container as="main">
  <Section id="work" title="Trabajo">...</Section>
</Container>
```

| Prop | Type | Notes |
| --- | --- | --- |
| `as` | `div`, `section`, `main`, `article`, `header`, `footer` | Defaults to `div`. |
| `id` | string | Optional DOM id. |
| `class` | string | Optional additional class. |

### `Section.astro`

A semantic `<section>` with vertical rhythm, an optional eyebrow, and an optional H2. It spans all 12 columns and is intended to be a direct child of `Container`.

```astro
<Section id="featured" eyebrow="Selección" title="Trabajo destacado">
  <slot name="intro">...</slot>
  ...
</Section>
```

When `id` and `title` are provided, the title receives `${id}-heading` and the section uses `aria-labelledby`. Keep the `id` stable because it is also a navigation target.

### `Prose.astro`

The serif reading container. It limits content to `--measure-prose` (65ch), styles paragraphs, lists, links, strong text, H3s, and blockquotes, and should wrap long-form case-study or profile text.

```astro
<Prose>
  <p>...</p>
  <h3>Decisión</h3>
  <p>...</p>
</Prose>
```

### `ButtonLink.astro`

A semantic anchor with a minimum 44 px target and the shared focus ring. Variants are `primary`, `secondary`, and `quiet`.

```astro
<ButtonLink href="/en/work">Ver trabajo</ButtonLink>
<ButtonLink href={cvUrl} variant="secondary">Descargar CV</ButtonLink>
<ButtonLink href="/about" variant="quiet">Sobre mí</ButtonLink>
```

| Prop | Type | Notes |
| --- | --- | --- |
| `href` | string | Required destination. |
| `variant` | `primary`, `secondary`, `quiet` | Defaults to `primary`. |
| `external` | boolean | Adds `target="_blank"` and `rel="noopener noreferrer"`. |
| `download` | boolean or string | Passed to the native attribute. |
| `icon` slot | icon | Decorative icon placed after the visible label. |

### `MetaLabel.astro`

Small, uppercase, tabular metadata using `--muted`. Render it as a `span` by default, or as `p`/`dt` when the surrounding semantics require it.

```astro
<MetaLabel>Año</MetaLabel>
<MetaLabel as="dt">Categoría</MetaLabel>
```

### `StatusBadge.astro`

A textual status label with a colored dot. The dot is decorative; the label remains readable without color.

```astro
<StatusBadge status="in-development" label="En desarrollo" />
```

`status` is `live`, `in-development`, or `archived`. Always pass a localized `label`.

### `StackList.astro`

A semantic `<ul>` of project technologies, with an optional accessible name. Items wrap and use a subtle slash separator.

```astro
<StackList
  label="Tecnologías del proyecto"
  items={['Astro', 'TypeScript', 'Tailwind CSS']}
/>
```

### `PlaceholderCover.astro`

The honest cover for projects with `cover: null`. It is a 16:10 surface with the project name, a localized category label, and a deterministic geometric mark derived from the slug. The root is `role="img"`; the mark is decorative.

```astro
<PlaceholderCover
  slug={project.slug}
  name={project.locales.es.title}
  category={project.category}
  categoryLabel="IA y agentes"
  label={`Portada de ${project.locales.es.title}, categoría IA y agentes`}
/>
```

`label` is required and must be localized. The mark is deterministic: `src/lib/placeholder-mark.ts` hashes the slug with FNV-1a, so the same project always receives the same geometry.

### `ProjectCover.astro`

A real cover rendered through `astro:assets` with a responsive `srcset`, `sizes`, intrinsic `width`/`height`, and lazy loading by default.

```astro
<ProjectCover src={cover} alt="..." priority />
<ProjectCover src={cover} alt="..." />
```

| Prop | Type | Notes |
| --- | --- | --- |
| `src` | `ImageMetadata` | Imported from `src/assets/`. |
| `alt` | string | Required; describe the image rather than repeating the title. |
| `priority` | boolean | Use only for the first above-the-fold cover. Sets eager loading, synchronous decoding, and high fetch priority. |
| `widths` | number[] | Candidate widths; defaults to `480, 720, 960, 1320`. The source width is appended automatically. |
| `sizes` | string | Defaults to `(min-width: 900px) 42vw, 100vw`. |
| `class` | string | Optional additional class. |

The component keeps `--cover-aspect` geometry in CSS and lets Astro emit the intrinsic dimensions, so the image does not shift layout while loading.

### `Icon.astro`

Inline 24×24 stroke icons. Icon names are `external`, `code`, `system`, `light`, `dark`, `menu`, and `close`; paths live in `src/components/icons/icon-paths.ts`.

```astro
<ButtonLink href={project.links.live} external>
  <Icon slot="icon" name="external" />
  Ver sitio
</ButtonLink>

<Icon name="code" label="Código" />
```

Icons are `aria-hidden="true"` when decorative. Pass `label` only when the icon is the standalone meaning; it then receives `role="img"` and that accessible name. Never use that standalone form as the only label of a button or link.

## Composing a page

```astro
<Container as="main">
  <Section id="about" eyebrow="Perfil" title="Sobre mí">
    <Prose>
      <p>...</p>
    </Prose>
    <ButtonLink href="/contact">Hablemos</ButtonLink>
  </Section>
</Container>
```

## Building a new component

A new component can be built from the documented tokens without adding colors, spacing, or type values. This example composes a source note with the existing primitive and tokens:

```astro
---
import MetaLabel from './MetaLabel.astro';

interface Props {
  class?: string;
}

const { class: className } = Astro.props;
---

<aside class:list={['source-note', className]}>
  <MetaLabel>Fuente</MetaLabel>
  <p><slot /></p>
</aside>

<style>
  .source-note {
    grid-column: 1 / -1;
    max-inline-size: var(--measure-prose);
    padding: var(--space-4);
    border-inline-start: 2px solid var(--signal);
    background: var(--surface);
  }

  .source-note p {
    margin: var(--space-2) 0 0;
    font-family: var(--font-family-serif);
    font-size: var(--type-body-size);
    line-height: var(--type-body-leading);
  }
</style>
```

This pattern uses only documented layout, color, spacing, and type tokens. Verify new components with `npm run check`, `npm run build`, and the Playwright keyboard/contrast checks before joining them to a page.
