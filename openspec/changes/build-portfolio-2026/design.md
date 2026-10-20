# Design

## Context

See `proposal.md` for motivation and `specs/` for the behavior contract. This is a greenfield static site: the repository contains only the generated `data.js`, nine project Markdown files under `projects/`, and an empty OpenSpec setup. There is no existing application code to preserve.

Constraints that shape the approach:

- Astro and Tailwind are fixed by the request; the initial commands are `npm create astro@latest` and `npm install tailwindcss @tailwindcss/vite`. Current registry versions verified during exploration: Astro 7.4.1, `create-astro` 5.3.0, Tailwind 4.3.3, `@tailwindcss/vite` 4.3.3.
- `data.js` is generated and read-only. `projects/*.md` are source notes, not runtime content.
- The catalog is exactly 14 projects. Puja Inmobiliaria is excluded. Missing covers and links use honest placeholders.
- Spanish is the default locale; English is a complete translation. Light, dark, and system themes are required.
- The visual direction is the "work index": a master–detail catalog that behaves like a small application, not a card grid with modals.

## Goals / Non-Goals

**Goals:**

- Make the work catalog the primary surface, with a sticky preview on desktop and a thumbnail list on mobile.
- Keep the design distinctive without costume: cool paper, cobalt signal, strong typography, precise metadata, no industrial-themed decoration.
- Establish a component architecture that can be implemented atomically: shell, catalog, case study, profile, CV, localization, theme.
- Keep the site static, fast, accessible, and maintainable by one person.

**Non-Goals:**

- No CMS, database, authentication, contact backend, blog, or analytics in this change.
- No more than 14 projects, no Puja Inmobiliaria, no invented clients or metrics.
- No React runtime for the catalog; the only client code is small vanilla TypeScript for preview, filters, theme, and lightbox.
- No real demos for projects that are not deployed; the interface states availability instead of faking it.
- No pixel-level reproduction of any reference site.

## Decisions

### 1. Static Astro with content collections and small islands

**Decision:** Build a fully static Astro site. Use content collections for project metadata and case bodies. Use vanilla TypeScript islands for the master–detail preview, category filters, theme control, and screenshot lightbox. No client framework for the catalog.

**Why:** A portfolio is read far more than it is interacted with. Static HTML gives the best first paint, SEO, and resilience. The catalog needs only a few stateful behaviors; shipping React for them would contradict the performance claim. Astro's content layer gives typed, validated content and a clean separation between metadata and long-form case studies.

**Alternatives considered:**

- Next.js: familiar to Walker, but unnecessary client/server complexity and a heavier baseline for a content site.
- Astro + React islands: works, but adds runtime weight for interactions that are a few dozen lines of DOM code.
- Client-side rendered catalog: worse SEO and first paint, and no benefit at this scale.

### 2. Content model: one project record, two locales, optional case body

**Decision:** Store one YAML record per project in `src/content/projects/` with shared metadata and required `es`/`en` localized fields. Store tier 1 long-form bodies in a separate `cases` collection as MDX per project and locale. Tier 2 pages render from localized fields; tier 3 entries have no page.

Project record shape:

```text
slug, year, category, tags[], tier, status, featured, order
stack[3..5]
links { live: url|null, code: url|null }
cover: string|null
locales {
  es { title, summary, role, result, availability? }
  en { title, summary, role, result, availability? }
}
```

**Why:** One record per project keeps shared data (year, stack, status) from drifting between languages. Requiring both locales at the schema level prevents partial translations from shipping. A separate `cases` collection keeps long-form MDX out of the metadata file and lets tier 1 pages grow without complicating the index.

**Alternatives considered:**

- One MDX file per locale for all 14 projects: duplicates shared metadata 28 times and makes consistency hard.
- A single `data.js` for everything: it is generated for a CV, not a portfolio; it lacks case-study structure and localization.
- CMS: overkill for 14 records maintained by one person, and adds a runtime dependency.

### 3. Master–detail interaction with a 7/5 split

**Decision:** On viewports ≥900 px, render the project list in roughly 7 of 12 columns and a sticky preview in 5 columns. Rows are the navigation targets. The preview updates after a 90 ms pointer-entry delay and immediately on keyboard focus, with a 140 ms crossfade. Below 900 px, render a single-column list with thumbnails and no preview pane.

**Why:** The preview gives the catalog its identity and makes 14 entries feel curated, while the row remains the accessible, shareable navigation target. The delay avoids flicker when the pointer crosses rows. Focus updates immediately because keyboard users have already made an intentional choice.

**Alternatives considered:**

- Cursor-following image: visually playful but distracting, hard to keep accessible, and unstable on large screens.
- Card grid with modal: hides detail from search and sharing, and is cramped on mobile.
- Static two-column grid without preview: simpler, but loses the signature interaction the user selected.

### 4. Client-side filtering with URL query state

**Decision:** Render all 14 rows in HTML. A small script filters by `?c=<category>` and updates the URL with `history.replaceState`. Counts are computed from the same data. Without JavaScript, all projects remain visible and every row still works.

**Why:** At 14 entries, client-side filtering is instantaneous and avoids generating thin category pages. The query parameter makes filtered views shareable and restorable. Progressive enhancement keeps the catalog usable if the script fails.

**Alternatives considered:**

- Separate static category pages: better for SEO but creates four thin pages and more navigation.
- No filtering: simpler, but the catalog loses the "product" behavior that distinguishes it.
- Server rendering per filter: unnecessary for 14 items and incompatible with a fully static site without duplicate routes.

### 5. Theme: system, light, dark with an inline pre-paint script

**Decision:** Store the preference in `localStorage` under a single key. Apply `data-theme="light|dark"` to `<html>` with a tiny inline script in `<head>` before the stylesheet renders. When the preference is `system`, follow `prefers-color-scheme` and listen for changes. Expose a three-option control with text labels, not a color-only icon.

**Why:** Three modes are honest about the default and avoid trapping users in a manual choice they cannot undo. The inline script prevents the flash of the wrong theme that plagues client-only toggles. Text labels make the control understandable to screen readers and to users who cannot distinguish the icons.

**Alternatives considered:**

- Two-state sun/moon toggle: familiar, but cannot return to "follow system" without clearing storage.
- CSS-only `prefers-color-scheme`: no manual override.
- Class toggled after hydration: visible flash and a dependency on JavaScript.

Light tokens:

```text
paper        #F2F4F1
surface      #FAFBF8
ink          #101314
muted        #6C746F
line         #D8DCD6
signal       #2447E8
signal-ink   #FFFFFF
live         #16794F
wip          #8A5300
archived     #6C746F
```

Dark tokens:

```text
paper        #0E1110
surface      #151918
ink          #E8EBE6
muted        #9AA39D
line         #2A302D
signal       #8B9BFF
signal-ink   #0E1110
live         #5BD39A
wip          #F0B35A
archived     #9AA39D
```

Both palettes are designed independently. Dark is not an inversion. `color-scheme` is set per theme so native controls match.

### 6. Typography and layout system

**Decision:** Use **Archivo variable** for the index, navigation, headings, and metadata, and **Source Serif 4** for case-study prose and the about narrative. Self-host subset WOFF2 files. Use tabular numerals for years and counts. Left-align all content. Reading measure is 60–70 characters.

Type scale:

```text
display   clamp(2.75rem, 6vw, 5.5rem) / 0.95 / -0.03em
h2        2rem / 1.1
h3        1.375rem / 1.25
row       1.25rem / 1.3
body      1.125rem / 1.65  (serif)
meta      0.8125rem / 1.3  (sans, tabular)
```

Grid: 12 columns, max width 1320 px, gutters 24 px (32 px ≥1200), page margins `clamp(20px, 5vw, 64px)`. Breakpoints: 640, 900, 1200.

**Why:** The sans/serif split gives the catalog a precise, data-like voice and the case studies a reading voice. One typeface would blur the difference between browsing and reading. Tabular numerals are a functional choice: years and counts align in columns.

**Alternatives considered:**

- All-sans: clean but flat; case studies read like UI copy.
- All-serif: elegant but slower to scan in the index.
- Monospace metadata: a common developer-portfolio costume; rejected.

### 7. Page anatomy

```text
Home
  header
  intro: name, full-stack role, one sentence, stack, location,
         availability, work CTA, CV CTA
  featured: 4 projects (TODO-mcp, Image Prompt, URL Shortener, Tetris)
  index excerpt: 6–8 rows + "ver los 14"
  capabilities: 4 blocks, each linked to evidence
  trajectory: 3 eras, one line each
  contact + footer

Work
  header
  title + computed count
  filter bar with counts
  master-detail list (desktop) / thumbnail list (mobile)
  empty state when a filter has no results

Project detail (tiers 1–2)
  back to work
  title, one-line summary
  metadata strip: year / category / status / stack
  actions: live, code (only when real)
  cover
  tier 1: problem, role, decisions, result, gallery, stack
  tier 2: what, role, result, actions
  previous / next project

About
  narrative: web developer first, engineering background as plus
  capabilities with evidence
  skills: daily / production / prior context
  trajectory: 3 eras + full timeline
  contact

CV
  print-optimized sections from data.js
  language-specific content
  PDF download
```

The home opens with a compact statement, not a full-viewport hero. The work index begins within the first viewport on desktop so the work is visible immediately.

### 8. Component architecture

The implementation is split into atomic units so tasks can be completed and reviewed independently:

```text
src/
  layouts/
    BaseLayout.astro          html shell, head, skip link, header, footer
  components/
    shell/
      SiteHeader.astro
      SiteFooter.astro
      ThemeControl.astro
      LanguageSwitcher.astro
      SkipLink.astro
      SeoHead.astro
    primitives/
      Container.astro
      Section.astro
      Prose.astro
      ButtonLink.astro
      StatusBadge.astro
      StackList.astro
      MetaLabel.astro
    catalog/
      WorkIndex.astro
      ProjectRow.astro
      ProjectPreview.astro
      CategoryFilter.astro
      ProjectCover.astro
      PlaceholderCover.astro
    case/
      CaseHeader.astro
      CaseSection.astro
      DecisionList.astro
      ProjectActions.astro
      ScreenshotGallery.astro
      Lightbox.astro
    profile/
      ProfileIntro.astro
      FeaturedWork.astro
      CapabilityGrid.astro
      SkillTiers.astro
      Trajectory.astro
      ContactLinks.astro
    cv/
      CvDocument.astro
      CvSection.astro
  scripts/
    catalog.ts                filter + preview
    theme.ts                  theme control (the pre-paint part is inline)
    lightbox.ts
  content/
    projects/*.yaml
    cases/*.mdx
  data/
    cv.es.ts, cv.en.ts, cv.schema.ts
  i18n/
    ui.es.ts, ui.en.ts, routes.ts
  pages/
    index.astro
    work/index.astro
    work/[slug].astro
    about.astro
    cv.astro
    404.astro
    en/index.astro
    en/work/index.astro
    en/work/[slug].astro
    en/about.astro
    en/cv.astro
    en/404.astro
```

Each component owns one visual or behavioral concern. Pages compose; they do not contain catalog logic or theme logic.

### 9. Internationalization

**Decision:** Use Astro's i18n routing with Spanish as `defaultLocale` and no prefix for Spanish. English lives under `/en`. Keep a typed route map for equivalent pages. Store UI strings in `ui.es.ts` / `ui.en.ts`. Project localized fields live in the project record; tier 1 bodies live in per-locale MDX. The language switcher resolves the current route to its counterpart and preserves the current project slug and filter query.

**Why:** Spanish-first reflects the primary market and avoids a redirect on the default entry point. A typed route map prevents the switcher from guessing and producing mixed-language pages. Requiring both locales in the schema makes missing translations a build error, not a silent fallback.

**Alternatives considered:**

- `/es` and `/en` prefixes: symmetrical but adds a redirect or duplicate root.
- Client-side translation: bad for SEO and first paint.
- English-only: discards the Spanish market and the profile's strongest local context.

### 10. Placeholder covers and missing links

**Decision:** Render `PlaceholderCover` when `cover` is null: a 16:10 composition with the project name, category, and a deterministic geometric mark derived from the slug, exposed as `role="img"` with descriptive `aria-label`. Never generate a fake screenshot. When `links.live` or `links.code` is null, omit the action and render a short availability label.

**Why:** A designed placeholder preserves rhythm and honesty. A fake screenshot or a dead `#` link damages trust more than an explicit "demo pendiente". The deterministic mark gives each placeholder a distinct identity without pretending to be product UI.

**Alternatives considered:**

- One generic gray box: visually dead and indistinguishable across projects.
- Stock images: misleading.
- Disabled buttons: look interactive and fail keyboard expectations.

### 11. Case-study depth and content sourcing

**Decision:** Tier 1 uses MDX with a fixed sequence: problem, role, decisions (3–4), result, gallery, stack. Tier 2 renders `what`, `role`, and `result` from the project record. Tier 3 has no page and links out. Content is derived only from `data.js` and `projects/*.md`; missing facts are stated as pending, not invented.

**Why:** A fixed sequence keeps case studies comparable and prevents an endless scroll. The depth tiers match the evidence available: recent projects have architecture notes; older practice projects do not. This avoids 14 thin pages.

**Alternatives considered:**

- Full case study for all 14: impossible with the available evidence and would dilute quality.
- Only 4 featured projects: underuses the breadth the user wants to show.
- Auto-generated case pages from READMEs: produces inconsistent, first-person-plural, template copy.

### 12. CV data adapter and PDF

**Decision:** Wrap `data.js` in a typed adapter (`cv.es.ts`) that validates the generated object and strips the mobile phone. Create `cv.en.ts` as a complete English translation of the same structure. Both are validated against a shared Zod schema at build time. Render print-optimized `/cv` and `/en/cv` pages. Generate PDFs with a small Playwright script into `public/cv/` and link them from the pages; keep the browser print stylesheet as a fallback.

**Why:** The CV is generated elsewhere; treating it as a read-only input avoids a second source of truth. Validation catches schema drift in the generated file. Playwright is already in Walker's stack and runs at build time, not in the browser. Committing the generated PDFs keeps deployment static.

**Alternatives considered:**

- Edit `data.js`: forbidden; it is generated.
- Client-side PDF generation: heavy and inconsistent.
- Hand-maintained PDF: drifts from the CV page.
- Include the phone number: rejected for public scraping; email and LinkedIn are sufficient.

### 13. SEO, performance, and quality floor

**Decision:** Generate static pages, a sitemap, robots directives, canonical URLs, `hreflang` alternates, and per-page Open Graph metadata. Use `astro:assets` for covers, explicit dimensions, and lazy loading below the fold. Prefetch project pages on intent. Add `Person` JSON-LD on the home page. Budget: ≤30 KB compressed initial JavaScript, LCP ≤2.0 s on mid-tier mobile, no layout shift, WCAG AA in both themes.

**Why:** A portfolio that claims performance and accessibility must demonstrate them. The catalog's JavaScript is small enough to stay within budget; the rest is static HTML and CSS. Prefetching makes the master–detail interaction feel instant without shipping a client router.

**Alternatives considered:**

- Client-side page transitions: motion-heavy and unnecessary for a content site.
- Heavy animation library: contradicts the performance claim.
- Analytics in v1: not needed to prove the work; adds consent and privacy overhead.

## Risks / Trade-offs

- **The 14th project is an assumption** → It is Portfolio 2026 (this site). If the user supplies another documented project, swap that entry before content freeze; the schema and tasks do not change.
- **Several projects lack screenshots and links** → Use designed placeholders and honest availability labels. The biggest quality lever is deploying TODO-mcp, Image Prompt, and Cheatsheet; that is an external task, not a blocker.
- **Bilingual content doubles the writing work** → Require both locales in the schema so missing translations fail the build. Write Spanish first, then translate; do not machine-publish unreviewed English.
- **The master–detail interaction is desktop-centric** → Mobile uses a thumbnail list, and the preview is decorative/informational, never the only path to a project.
- **Hover preview can flicker** → 90 ms entry delay, 140 ms crossfade, preload adjacent covers, and instant focus updates.
- **Dark theme doubles visual QA** → Separate token sets, contrast checks, and screenshot review in both themes. Do not invert.
- **PDF generation adds a dev dependency** → Use Playwright only in a build script; commit the generated PDFs and keep print CSS as fallback.
- **Excluding Puja removes a professional case** → Accepted by the user. Portfolio 2026 and URL Shortener carry the full-stack/professional proof.
- **Case-study copy could become generic** → Cap each case at the fixed sequence, require specific decisions and verifiable results, and link to the source material.
- **Static filters need JavaScript** → Without JavaScript all 14 projects remain visible and navigable; filtering is an enhancement, not a requirement.
- **Fonts can cause layout shift** → Self-host subset WOFF2, preload the display face, and use `font-display: swap` with metric-compatible fallbacks.

## Migration Plan

This is a greenfield build, so there is no data migration.

1. Scaffold the Astro project and Tailwind v4 integration.
2. Build the design tokens, shell, and shared primitives.
3. Add the 14 project records and tier 1 case bodies, with placeholders where assets are missing.
4. Build the catalog, detail pages, home, about, and CV.
5. Add Spanish/English routing and the theme system.
6. Run accessibility, performance, and content QA in both locales and themes.
7. Deploy a preview, verify canonical URLs and redirects, then cut over.

Rollback: keep the current `walkeralfaro.com` deployment live until the new build passes QA. If cutover fails, restore the previous deployment; the new site is static, so rollback is a hosting-level action.

## Open Questions

- The production domain and whether this replaces `walkeralfaro.com` or ships on a new subdomain. This affects canonical URLs and deployment configuration, not the architecture; resolve before the SEO task.
- Final screenshots and live URLs for the projects that currently use placeholders. These improve visual quality but do not change the design or task breakdown.
- Whether the English CV should be a professional translation reviewed by a native speaker. Recommended; the site can ship with a careful translation and be refined later.
