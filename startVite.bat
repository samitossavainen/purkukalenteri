@echo off
setlocal
cd /d "%~dp0"

if not exist "package.json" (
  echo ERROR: package.json was not found in "%~dp0".
  goto failed
)

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js 20 or newer is required. Install Node.js and restart this window.
  goto failed
)

for /f "delims=" %%V in ('node -p "parseInt(process.versions.node)"') do set "NODE_MAJOR=%%V"
if not defined NODE_MAJOR (
  echo ERROR: Could not determine the Node.js version.
  goto failed
)
if %NODE_MAJOR% LSS 20 (
  echo ERROR: Node.js 20 or newer is required. Current version:
  node --version
  goto failed
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm was not found. Reinstall Node.js and restart this window.
  goto failed
)

if not exist "node_modules\.bin\vite.cmd" (
  echo Installing project dependencies...
  call npm.cmd ci
  if errorlevel 1 goto failed
)

echo Starting PurkuKalenteri. Your browser will open when Vite is ready.
call npm.cmd run dev -- --open
set "EXIT_CODE=%ERRORLEVEL%"
if not "%EXIT_CODE%"=="0" echo Vite stopped with exit code %EXIT_CODE%.
pause
exit /b %EXIT_CODE%

:failed
echo.
echo Startup failed. Review the message above.
pause
exit /b 1
