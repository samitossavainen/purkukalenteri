# PurkuKalenteri

A React app for planning weekday unloading appointments and preparing for incoming deliveries.

The calendar supports one booking per weekday time slot. Selecting a booking opens its details; editing is a separate action. The weather view shows current conditions and the next 12 hourly forecasts for Kuopio, with an estimated icing advisory based on forecast temperature and precipitation. The advisory is informational and does not replace checking actual dock conditions.

## Run locally

Install Node.js 20 or newer, then run:

```sh
npm install
npm run dev
```

Bookings are saved in the browser's local storage. Weather is fetched from the Open-Meteo forecast API for Kuopio, Finland.

The UI uses React-Bootstrap and Bootstrap, `date-fns` handles calendar dates, and `lucide-react` supplies icons.

## Build

```sh
npm run build
npm run preview
```

## GitHub Pages

Push this project to a public GitHub repository on the `main` branch and enable **Settings → Pages → GitHub Actions**. The included workflow builds and deploys the app on each push. The Vite base path is derived from the repository name, and hash-based routing keeps app routes working on GitHub Pages.
