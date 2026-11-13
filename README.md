# PurkuKalenteri

A React app for planning weekday unloading appointments and preparing for incoming deliveries.

**Educational demo only:** This is not an operational scheduling system. Use synthetic sample data only. Bookings stay in the current browser's local storage; they are not shared, synced, or backed up. Local development and the live site have separate storage. CSV exports are downloaded locally, and the app has no backend or database. A real-world system would require a separate development and security approval process.

The calendar shows ISO week numbers and supports one active booking per weekday time slot. Bookings can include optional notes, which appear in the time-slot preview and booking details. Reservations can be cancelled to free their slots while remaining in booking history and the total booking count. The booking management view supports searching, filtering, editing, deletion, and CSV export. The weather view shows current conditions and the next 12 hourly forecasts for Kuopio, with an estimated icing advisory based on forecast temperature and precipitation. The advisory is informational and does not replace checking actual dock conditions.

## Run locally

### Prerequisites

- Git
- [Node.js 20 or newer](https://nodejs.org/) (npm is included)

### First-time setup

Clone the repository and enter its folder:

```sh
git clone https://github.com/samitossavainen/purkukalenteri.git
cd purkukalenteri
```

Check that Node.js and npm are available:

```sh
node --version
npm --version
```

Install the exact dependency versions from the lockfile and start Vite:

**Windows PowerShell**

```powershell
npm.cmd ci
npm.cmd run dev
```

On Windows, you can also double-click [startVite.bat](./startVite.bat). It checks the Node.js version, installs dependencies if needed, and opens the browser after Vite starts.

**macOS, Linux, or Windows Command Prompt**

```sh
npm ci
npm run dev
```

Open the **Local** URL printed by Vite (usually `http://localhost:5173/`). Use this development server rather than VS Code Live Server; Vite is required to run the React application. Stop it with `Ctrl+C`.

If Node.js was just installed, restart VS Code so its terminal picks up the updated PATH. If PowerShell reports that `npm.ps1` cannot be loaded, use the `npm.cmd` commands above; changing the system execution policy is not necessary.

For later sessions, open the project folder and run `npm.cmd run dev` in Windows PowerShell, or `npm run dev` in other terminals. Dependencies only need to be installed again after changing the package files.

## Technology and external services

- React and React Router provide the interface and hash-based navigation.
- Bootstrap and React-Bootstrap provide styling and UI components.
- `date-fns` handles date operations; `lucide-react` provides icons.
- Vite runs the local development server and builds the static site.
- Weather data is fetched from the public Open-Meteo REST API and requires an internet connection. The request does not include booking data.
- DM Sans and Manrope are loaded from Google Fonts.

## Source structure

- `src/App.jsx` owns app-level booking state, routing, and booking dialogs.
- `src/pages/` contains the calendar, booking management, and weather screens.
- `src/components/` contains the navigation, footer, and screen-level UI pieces.
- `src/utils/` contains shared date, booking, and weather helpers.

Booking dialogs live at the app level because they are opened from both the calendar and booking management screens.

## Build

**Windows PowerShell**

```powershell
npm.cmd run build
npm.cmd run preview
```

**macOS, Linux, or Windows Command Prompt**

```sh
npm run build
npm run preview
```

## Live demo and deployment

The current public demo is available at [samitossavainen.github.io/purkukalenteri](https://samitossavainen.github.io/purkukalenteri/). GitHub Pages serves the static app; each visitor's bookings remain in that visitor's browser and are not visible to other users. Use synthetic data only.

Deployment is intentionally manual so changes are published only after the project owner considers the project finished. Normal pushes do not deploy. To publish, set **Settings → Pages → Build and deployment source** to **GitHub Actions**, then run **Deploy to GitHub Pages** from the Actions tab. The workflow builds the app and deploys the `dist` output. The Vite base path is derived from the repository name, and hash-based routing keeps app routes working on GitHub Pages.
