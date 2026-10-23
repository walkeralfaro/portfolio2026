# Frontend Mentor - REST Countries API with color theme switcher solution

This is a solution to the [REST Countries API with color theme switcher challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/rest-countries-api-with-color-theme-switcher-5cacc469fec04111f7b848ca). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- See all countries from the data on the homepage
- Search for a country using an `input` field
- Filter countries by region
- Click on a country to see more detailed information on a separate page
- Click through to the border countries on the detail page
- Toggle the color scheme between light and dark mode

The application includes a homepage with a searchable and filterable grid of country cards, a dynamic detail route (`/country/[code]`) with the country's main information and its bordering countries, plus loading and not-found states for each view.

> **Note on the data source:** both the homepage and the detail route (`/country/[code]`) read from the local `data.json` file included in this repository — no external API calls are made at runtime. That file uses the legacy REST Countries v2 shape (`name` as a string, `alpha3Code`, `capital` as a string, `currencies`/`languages` as arrays), so each route normalizes it to the shape the UI consumes and validates the result with Zod before rendering.

### Screenshot

![](./screenshot.jpg)

### Links

- Solution URL: [walkeralfaro/frontendmentor-countries](https://github.com/walkeralfaro/frontendmentor-countries)
- Live Site URL: [Add live site URL here](https://countries-app-walker.vercel.app/)

## My process

### Built with

- TypeScript
- [Next.js 16](https://nextjs.org/) with the App Router (Server Components, dynamic routes, Cache Components)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) with a CSS-first configuration (`@theme`, CSS custom properties)
- [shadcn/ui](https://ui.shadcn.com/) components (New York style) on top of [Radix UI](https://www.radix-ui.com/) primitives
- [next-themes](https://github.com/pacocoursey/next-themes) for light/dark mode
- [Zod](https://zod.dev/) for runtime validation of the country dataset
- [Lucide React](https://lucide.dev/) for icons
- [Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans) loaded with `next/font/google`
- Mobile-first responsive layout with CSS Grid and Flexbox

### What I learned

**1. Validating data at the boundary.** The dataset is treated as untrusted input, even though it ships with the repository. A Zod schema describes only the fields the UI actually uses, and the parsed result becomes the typed data passed to the client components. If the data does not match the schema, the route falls back to `notFound()` instead of rendering broken UI.

The local `data.json` uses the legacy v2 shape, so the first step is a small normalization layer that maps it to the model the UI expects:

```ts
import countriesData from "@/data.json"

const normalized = countriesData.map((country) => ({
  name: { common: country.name },
  flags: {
    svg: country.flags.svg,
    alt: `The flag of ${country.name}`,
  },
  population: country.population,
  region: country.region,
  capital: country.capital ? [country.capital] : undefined,
  cca3: country.alpha3Code,
}))

const parsed = CountriesSchema.safeParse(normalized)

if (!parsed.success) {
  console.error(parsed.error)
  notFound()
}

return <CountriesClient countries={parsed.data} />
```

```ts
export const CountryResumeSchema = z.object({
  flags: z.object({ svg: z.url(), alt: z.string() }),
  name: z.object({ common: z.string() }),
  region: z.string(),
  capital: z.array(z.string()).optional(),
  cca3: z.string(),
  population: z.number(),
})
```

**2. Resolving relations from a local dataset.** Instead of requesting every border from an API, the detail route indexes the dataset once by `alpha3Code` and resolves both the country and its neighbours from memory. The whole lookup still uses the `'use cache'` directive, enabled by `cacheComponents: true` in `next.config.ts`:

```ts
const countriesByCode = new Map(
  countriesData.map((country) => [country.alpha3Code.toUpperCase(), country])
)

const formattedBorders = (country.borders ?? []).map((border) => ({
  code: border,
  name: countriesByCode.get(border.toUpperCase())?.name ?? border,
}))
```

**3. Combining search and region filtering.** Filtering is done in a single `useMemo` over the already-validated array, so typing or changing the region does not trigger any additional network requests. Search is prefix-based (`startsWith`), which mirrors the behaviour shown in the design:

```tsx
const filtered = useMemo(() => {
  return countries.filter((country) => {
    if (region !== "all" && country.region !== region) return false

    if (search.trim() !== "") {
      return country.name.common.toLowerCase().startsWith(search.toLowerCase())
    }

    return true
  })
}, [region, search, countries])
```

**4. Theming with CSS variables.** The color palette lives in `app/globals.css` as `:root` and `.dark` variables, and the Tailwind theme maps them through `@theme inline`. `next-themes` toggles the `dark` class on `<html>`, so every component picks up the new palette without duplicating styles. `disableTransitionOnChange` avoids a flash of animated colors when switching themes.

**5. Handling optional data.** Fields such as `capital` and `borders` are optional in the schema, because some territories have no capital or no land borders. The detail page guards against empty border arrays and the UI degrades gracefully instead of crashing.

### Continued development

- **Centralize data access.** Both routes now read from `data.json`, but each one normalizes the legacy v2 fields it needs. Extracting a shared `lib/countries.ts` (list, lookup by code, and border resolution) would remove that duplication and give the Zod validation a single entry point.
- **Upgrade the dataset shape.** Normalizing `name`, `capital`, `currencies`, and `languages` in every route is a direct consequence of the legacy v2 format. Storing the data in the v3.1 shape — or converting it once at build time — would simplify both components.
- **Improve search semantics.** The current search matches the beginning of the country name only. I would like to compare `startsWith` with a normalized `includes` search and decide which one feels better for users.
- **Accessibility.** Add explicit `<label>`/`aria-label` attributes to the search input and the region select, and announce the number of results when the filters change.
- **Empty states.** Show a friendly message when no country matches the current search/filter combination.
- **Images.** Evaluate `next/image` with `remotePatterns` for the flag CDN to benefit from automatic sizing and optimization.
- **Metadata and polish.** Replace the default `Create Next App` metadata with a proper title and description, derive the theme toggle label from the active theme, and add automated tests for the Zod schemas and the filtering logic.

### Useful resources

- [Next.js App Router documentation](https://nextjs.org/docs/app) - The reference for Server Components, `'use cache'`, `Suspense`, and the `notFound()` flow used in this project.
- [Tailwind CSS v4 documentation](https://tailwindcss.com/docs) - Helpful for the new CSS-first configuration and the `@theme` directive.
- [shadcn/ui documentation](https://ui.shadcn.com/docs) - Used to set up the card, input group, select, and button components.
- [Zod documentation](https://zod.dev/) - Essential for writing the schemas that validate the country data.
- [REST Countries API](https://restcountries.com) - The original source of the bundled `data.json` dataset.
- [next-themes](https://github.com/pacocoursey/next-themes) - Simple and reliable light/dark mode handling in Next.js.

### AI Collaboration

I used an AI coding assistant as a learning partner throughout the project:

- **Architecture and data flow:** discussing how to normalize the local `data.json` into the UI model, where to validate it (server vs. client), and how to keep the client components focused on presentation.
- **Debugging:** reviewing the `'use cache'` setup, `Suspense` boundaries, and the not-found handling for invalid country codes.
- **Documentation:** drafting and organizing this README based on the actual implementation.

What worked well was getting quick explanations and alternative approaches to compare against the docs. What required extra care was verifying that suggestions matched the versions in use (Next.js 16, React 19, Tailwind CSS v4), since older patterns are still common in examples online.

## Author

- GitHub - [@walkeralfaro](https://github.com/walkeralfaro)
- Frontend Mentor - [@walkeralfaro](https://www.frontendmentor.io/profile/walkeralfaro)

## Acknowledgments

- [Frontend Mentor](https://www.frontendmentor.io) for the challenge and the design files.
- [flagcdn.com](https://flagcdn.com) for serving the flag images.
- [REST Countries](https://restcountries.com) for the country data.
- The Frontend Mentor community, whose solutions and discussions are a great reference for layout and accessibility details.
