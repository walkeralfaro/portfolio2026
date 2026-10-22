# Walker Alfaro — portfolio

Bilingual static portfolio built with Astro and Tailwind CSS.

## Development

```sh
npm install
npm run dev
npm run build
```

## Images

Project covers and screenshots live in the repository and are processed at build time:

- `src/assets/covers/<project-slug>.webp` — the cover of a project, referenced by `cover: <key>` in its record.
- `src/assets/gallery/<project-slug>/<shot>.webp` — the screenshots of a tier 1 project, referenced by `gallery` in its case body.

The authoring rules, the key format, and the validation rules are in `docs/content.md`. A reference to a file that does not exist fails the build and `npm run validate:content`.

## Site and locale configuration

`astro.config.mjs` sets `site` to `https://walkeralfaro.com` so generated canonical URLs and sitemap entries use the production domain.

Spanish (`es`) is the default locale and uses unprefixed routes (`/`, `/work`). English (`en`) uses the `/en` prefix. Astro prefetching is enabled for internal links through `prefetch.prefetchAll`.
