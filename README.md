# PurkuKalenteri

A React app for planning weekday unloading appointments and preparing for incoming deliveries.

**Educational demo only:** This is not an operational scheduling system. Use synthetic sample data only. Bookings stay in the current browser's local storage, and CSV exports are downloaded locally; the app does not sync or back up either. A real-world system would require a separate development and security approval process.

The calendar supports one active booking per weekday time slot. Reservations can be cancelled to free their slots while remaining in booking history and the total booking count. Selecting a booking opens its details; editing is a separate action. The weather view shows current conditions and the next 12 hourly forecasts for Kuopio, with an estimated icing advisory based on forecast temperature and precipitation. The advisory is informational and does not replace checking actual dock conditions.

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

Weather data is fetched from Open-Meteo and requires an internet connection. The weather request does not include booking data.

The UI uses React-Bootstrap and Bootstrap, `date-fns` handles calendar dates, and `lucide-react` supplies icons.

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

## GitHub Pages (deployment step)

GitHub Pages deployment is not required for local development and can be completed as the final project step. If published, use synthetic data only: Pages hosts the public demo, while bookings stay in each visitor's browser. The workflow is manual-only, so normal pushes will not attempt to deploy. When ready, enable **Settings → Pages → GitHub Actions** and run **Deploy to GitHub Pages** from the Actions tab. The Vite base path is derived from the repository name, and hash-based routing keeps app routes working on GitHub Pages.
