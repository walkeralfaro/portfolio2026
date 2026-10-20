# Proposal

## Why

Walker's current site no longer represents his profile: he is a full-stack web developer with 14 documented projects, a modern React/Next/Astro stack, and a background in industrial automation and technical project management that adds delivery maturity. The new portfolio must make the web work the argument, present the catalog as a curated product rather than a card grid, and support Spanish/English hiring conversations without hiding the engineering background.

## What Changes

- Build a statically generated portfolio on Astro + Tailwind CSS, starting from the requested `npm create astro@latest` and `npm install tailwindcss @tailwindcss/vite` setup.
- Present **14 projects** in a curated work catalog: 13 documented projects plus this 2026 portfolio itself. **Puja Inmobiliaria is explicitly excluded** from every surface, feed, sitemap, and metadata file.
- Replace the card-and-modal pattern with a master–detail index: a scannable project list on the left and a sticky cover preview on the right, with keyboard support and a mobile list with thumbnails.
- Introduce three project depths: full case study, short case study, and archive entry. Only projects with enough evidence receive a detail page.
- Add project filtering by four primary categories (`ia`, `producto`, `frontend`, `juegos`), real counts, status labels, and optional live/code actions.
- Use local placeholder covers for projects without screenshots and omit unavailable actions; never render broken images or dead `#` links.
- Add a bilingual experience: Spanish at the root and English under `/en`, with localized navigation, metadata, project content, and CV.
- Add light, dark, and system theme selection with persistence and no flash of the wrong theme.
- Add a profile surface: home, about/capabilities, trajectory with the industrial/PM background framed as a plus, and a print-optimized CV generated from the read-only `data.js`.
- Establish the quality floor: responsive down to mobile, keyboard navigation, visible focus, reduced-motion support, WCAG AA contrast, static-first performance, and per-page SEO metadata.

## Capabilities

### New Capabilities

- `work-catalog`: the 14-project catalog, category filters, master–detail preview, project detail pages, archive entries, status, optional live/code actions, and placeholder handling.
- `professional-profile`: the home narrative, capabilities, skills, trajectory, contact surface, and CV page/PDF sourced from `data.js`.
- `site-experience`: Spanish/English routing and switcher, light/dark/system theme, responsive shell, accessibility behavior, motion policy, performance, and SEO.

### Modified Capabilities

- None. This is a greenfield project; no existing specs exist.

## Assumptions

- The 14th project is **Portfolio 2026** (this site), not Puja Inmobiliaria. The documented inventory is 13 unique projects; adding this site makes 14 while honoring the exclusion.
- Missing screenshots use a designed local placeholder cover. Missing live/code links remove the action and show an honest status instead of a dead link.
- `data.js` is generated and read-only. The CV is derived from it; project case studies live in a separate content collection.
- Spanish is the default locale; English is a first-class translation, not a partial fallback.
- The industrial automation and project-management years appear in the profile as evidence of rigor and delivery, not as the visual theme.

## Impact

- **New code**: Astro project, Tailwind v4 theme, layouts, components, pages, content collections, small vanilla-TS islands, placeholder assets, CV/PDF output.
- **Read-only inputs**: `data.js` and `projects/*.md`.
- **Routes**: `/`, `/work`, `/work/[slug]`, `/about`, `/cv`, `/en`, `/en/work`, `/en/work/[slug]`, `/en/about`, `/en/cv`, plus 404.
- **Dependencies**: `astro`, `tailwindcss`, `@tailwindcss/vite`; no client framework required for the catalog.
- **Deployment**: static hosting; no backend, CMS, database, or analytics in this change.
- **Out of scope**: Puja Inmobiliaria, blog, CMS, authentication, contact-form backend, more than 14 projects, and real demos for projects that are not deployed.
