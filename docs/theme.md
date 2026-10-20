# Theme contract

The site has three theme preferences: `system`, `light`, and `dark`. The selected preference is stored in one `localStorage` key and applied to the document before the first paint.

## Storage and DOM contract

| Item | Value |
| --- | --- |
| Storage key | `portfolio-theme` |
| Stored values | `system`, `light`, `dark` |
| Resolved theme attribute | `data-theme="light"` or `data-theme="dark"` |
| Preference attribute | `data-theme-preference="system"`, `"light"`, or `"dark"` |
| System media query | `(prefers-color-scheme: dark)` |
| Native color scheme | `color-scheme: light` or `color-scheme: dark` |

A missing or invalid stored value resolves to `system`. In system mode, `data-theme` follows `prefers-color-scheme`; it is never set to `system`.

The contract constants live in `src/lib/theme-contract.ts`. The pre-paint script is generated from those constants by `src/components/shell/ThemeScript.astro` and must remain inline, dependency-free, and inside `<head>` before the stylesheet. The control behavior lives in `src/scripts/theme.ts`.

## First paint

`ThemeScript.astro` runs synchronously while the document head is parsed:

1. Read `portfolio-theme` from `localStorage`, falling back to `system` if the key is absent, invalid, or storage is unavailable.
2. Resolve `system` against `(prefers-color-scheme: dark)`.
3. Set `data-theme`, `data-theme-preference`, and the inline `color-scheme` on `<html>`.

This makes the first paint use the correct palette. The Astro module script that wires the control loads later and repeats the same resolution idempotently.

If JavaScript is disabled, the document has no `data-theme` attribute and the base light tokens in `tokens.css` apply. JavaScript is required for manual theme selection and live system changes.

## Theme control

`src/components/shell/ThemeControl.astro` renders a native `fieldset` with three radio inputs named `theme`. Each option has a visible text label and a decorative icon:

- `system`: follows the operating system.
- `light`: always uses the light palette.
- `dark`: always uses the dark palette.

The native radio group supplies the keyboard behavior, the accessible group name, and the checked state. Arrow keys move between options and select them; focus stays within the group. The selected option is announced through the checked radio state and is not communicated by color alone.

On change, `theme.ts`:

- updates the DOM attributes immediately;
- stores the new mode under `portfolio-theme`;
- keeps the radio group in sync after reloads and storage events.

When the preference is `system`, a `matchMedia` change listener re-resolves `data-theme` without a reload. Manual preferences ignore operating-system changes.

## Token rules

- `src/styles/tokens.css` is the only color source. `data-theme="light"` and `data-theme="dark"` select independent palettes; dark is not an inversion.
- `color-scheme` is set per theme so native controls and scrollbars match.
- `--paper`, `--surface`, `--ink`, and `--muted` are the text and background tokens.
- `--signal` is the action, link, focus, and cover-mark token. `--signal-ink` is the only text color placed on `--signal`.
- `--live`, `--wip`, and `--archived` describe status dots. A status must also have a text label; color is never the only signal.
- The global `:focus-visible` outline uses `--signal` with a 3 px width and 3 px offset.

## Contrast checks

`npm run validate:theme` parses both token blocks and checks the following minimum ratios:

| Pair | Minimum |
| --- | --- |
| `--ink` on `--paper` and `--surface` | 4.5:1 |
| `--muted` on `--paper` and `--surface` | 4.5:1 |
| `--signal` on `--paper` and `--surface` | 4.5:1 |
| `--signal-ink` on `--signal` | 4.5:1 |
| `--live`, `--wip`, `--archived` on `--surface` | 3:1 |
| `--signal` focus ring on `--paper` and `--surface` | 3:1 |

The command also verifies that this document contains the implemented storage key, DOM attributes, and theme mode names. It runs during `prebuild`, so a contrast or contract regression fails `npm run build`.

`tests/e2e/theme.spec.ts` covers the browser behavior: dark first visit without a flash, manual persistence across reloads, live system changes, keyboard selection, and checked-state exposure.
