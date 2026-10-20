# Walker Alfaro — portfolio

Bilingual static portfolio built with Astro and Tailwind CSS.

## Development

```sh
npm install
npm run dev
npm run build
```

## Site and locale configuration

`astro.config.mjs` sets `site` to `https://walkeralfaro.com` so generated canonical URLs and sitemap entries use the production domain.

Spanish (`es`) is the default locale and uses unprefixed routes (`/`, `/work`). English (`en`) uses the `/en` prefix. Astro prefetching is enabled for internal links through `prefetch.prefetchAll`.
