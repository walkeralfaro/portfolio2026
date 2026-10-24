# Weather App

A responsive weather dashboard built as a solution to the [Frontend Mentor Weather app challenge](https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49). Search for a city to see its current conditions and forecasts, or start with a location detected from your IP address.

## Live demo

- **Live site:** [weather-app-walker.vercel.app](https://weather-app-walker.vercel.app/)
- **Source code:** [github.com/walkeralfaro/frontendmentor-weather-app](https://github.com/walkeralfaro/frontendmentor-weather-app)

## Features

- Detects an approximate location using IP geolocation, with Lima, Peru as a fallback.
- Search for cities with autocomplete suggestions.
- View current conditions, including temperature, feels-like temperature, humidity, wind speed, and precipitation.
- Browse daily high and low temperatures and an hourly forecast with a day selector.
- Choose temperature units (°C or °F), wind speed units (km/h or mph), and precipitation units (mm or inches).
- Switch between light and dark themes.
- Responsive layout for mobile and desktop screens.

## Year

2025 noviembre

## Built with

- [Next.js 16](https://nextjs.org/) with the App Router
- [React 19](https://react.dev/) and TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Zustand](https://zustand.docs.pmnd.rs/) for measurement-unit state
- [Radix UI](https://www.radix-ui.com/) primitives and [Lucide](https://lucide.dev/) icons
- [Open-Meteo](https://open-meteo.com/) for city geocoding and weather forecasts
- [ipapi](https://ipapi.co/) for approximate IP-based location detection

## What I learned

- How to combine external APIs in one user flow: look up a city, use its coordinates to request a forecast, and handle location lookup failures with a fallback.
- How to debounce autocomplete searches so the geocoding API is not called on every keystroke.
- Why weather data needs careful date and timezone handling when grouping hourly forecasts by day.
- How to keep unit preferences in shared state and convert temperature, wind speed, and precipitation for display.
- How to transform API responses into data structures that are easier for typed React components to render.

## Getting started

### Requirements

- Node.js
- npm

### Run locally

```bash
git clone https://github.com/walkeralfaro/frontendmentor-weather-app.git
cd frontendmentor-weather-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app uses the Open-Meteo and ipapi public endpoints; no project-specific environment variables are configured.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production server. Run after `npm run build`. |
| `npm run lint` | Run ESLint. |

## APIs

- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) provides city search results.
- [Open-Meteo Forecast API](https://open-meteo.com/en/docs) provides current, hourly, and daily weather data.
- [ipapi](https://ipapi.co/api/) provides the approximate location used on the initial load.

## Acknowledgments

- [Frontend Mentor](https://www.frontendmentor.io/) for the challenge and design resources.
- [Open-Meteo](https://open-meteo.com/) for its weather and geocoding data.
- [ipapi](https://ipapi.co/) for its IP geolocation service.

## Author

- GitHub: [@walkeralfaro](https://github.com/walkeralfaro)
