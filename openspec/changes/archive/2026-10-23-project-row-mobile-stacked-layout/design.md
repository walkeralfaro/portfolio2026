# Design

## Context

See `proposal.md` for motivation and `specs/work-catalog/spec.md` for the behavior contract.

`ProjectRow.astro` already renders the cover before the content in DOM order, which is the order the stacked mobile layout needs. The only thing forcing the horizontal composition is the mobile media query: it sets `.project-row__inner` to `grid-template-columns: minmax(5.25rem, 6.5rem) minmax(0, 1fr)`. Because the cover is a grid child with `min-inline-size: 0`, it shrinks to that narrow track and the content takes the rest.

On desktop the cover is `display: none`; the row's image is a mobile-only surface. The home excerpt uses the same component, so one CSS change covers both surfaces.

Relevant existing behavior that must not regress:

- Row inset test measures `.project-row__thumb`'s left edge against the row edge and expects ≥12px padding.
- The mobile catalog test expects one visible row column, no horizontal overflow, and a visible thumbnail with an image.
- The whole `<a>` remains the navigation target.

## Goals / Non-Goals

**Goals:**

- Stack cover above content below 900px, with the cover using the row's full content width.
- Keep desktop row layout, sticky preview, divider, inset, hover/focus, and no-JS navigation unchanged.
- Serve a reasonably sized mobile cover instead of the 120–240px candidates tuned for a 104px thumbnail.
- Keep placeholder covers legible at the larger size.

**Non-Goals:**

- Changing the 900px breakpoint, the desktop row, typography scale, or the preview.
- Restructuring the component's markup or the catalog grid.
- Changing project content, schemas, or routes.

## Decisions

### Stack with the existing single-column grid instead of `flex-direction: column`

In the `<900px` block, set `.project-row__inner` to `grid-template-columns: minmax(0, 1fr)` and keep `gap`/padding. Both children then occupy the same full-width column, in DOM order: cover first, content second.

- **Why:** the base rule already uses a one-column grid (cover hidden on desktop), so mobile becomes the same composition with the cover revealed. Minimal diff and no new wrapper.
- **Alternative:** switch the inner to flex column on mobile. Rejected — it duplicates layout logic and would need resetting for desktop.

### Size the cover from the row width, not a fixed thumbnail track

Remove the fixed track and the `min-inline-size` squeeze. The cover keeps `aspect-ratio: var(--cover-aspect)` (16/10), with `border` already provided by `ProjectCover`/`PlaceholderCover`.

- **Why:** at 375px the content width is ~343px, so a 16/10 cover is ~214px tall — readable and proportionate. No extra height clamp needed.
- **Alternative:** cap the cover with `max-inline-size` or a shorter aspect ratio. Rejected as premature; the token keeps the catalog's visual language consistent.

### Update the image candidates and `sizes`

Pass mobile-oriented widths (`[240, 360, 480, 720]`) and `sizes="(min-width: 900px) 104px, 100vw"` from `ProjectRow`.

- **Why:** the old `[120, 180, 240]` / `104px` choices were tuned for the tiny side thumbnail and would upscale blurry on a full-width mobile cover. The `min-width: 900px` branch only describes the hidden desktop surface, so it costs nothing.
- **Alternative:** rely on the component's default `100vw`, which would over-fetch on wide mobile screens. Rejected.

### Let the placeholder render its full content

Drop the mobile-only overrides that hid `.placeholder-cover__content` and shrank the mark to 42%. At full width the placeholder's intended category/name/mark composition fits.

- **Why:** those overrides existed solely to keep a 104px thumbnail from turning into visual noise.
- **Alternative:** keep the simplifications. Rejected — a full-width cover with a lone tiny mark would look broken.

### Keep the existing mobile type scale

Leave the `1.125rem` title and `0.9375rem` summary overrides in place.

- **Why:** the request is a layout fix; the type scale was chosen for mobile and still reads correctly once the content has the full width.
- **Alternative:** restore desktop `--type-row-size`. Deferred as unrelated visual change.

## Risks / Trade-offs

- **Taller rows** → Mobile rows grow by the cover height (~215px at 375px), so fewer entries fit per viewport. Accepted: that is the requested trade-off; no extra scroll-jacking or sticky behavior is added.
- **Image weight** → Larger candidates increase bytes on mobile. Mitigated by responsive `srcset`; 375px viewports typically pick the 360–480px candidate. Desktop keeps loading the same hidden image as before.
- **Test assumptions** → The current mobile test only checks that the thumb is visible; it will still pass. Add an explicit stacking assertion so the new behavior is locked in.
- **Home excerpt** → The same component change alters the home page on mobile. Accepted and called out in the proposal; no separate styling is needed.
- **Placeholder bulk** → Full placeholder content at mobile width may compete with the title below. Mitigated by the existing `MetaLabel`/name type scaling inside the cover; verify at 375px.

## Migration Plan

CSS-only, single component. Deploy normally; rollback is reverting the component file. No data migration or feature flag.
