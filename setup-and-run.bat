:: KamPare — Quick Setup Script (Windows)
:: Run this file after installing Node.js (https://nodejs.org)
::
:: Usage: Double-click setup-and-run.bat OR run from command prompt

@echo off
TITLE KamPare Setup

echo.
echo  =====================================================
echo   KamPare — Compare Smart. Save More.
echo  =====================================================
echo.

:: Check Node
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Node.js not found. Install from https://nodejs.org then re-run.
  pause
  exit /b 1
)

echo [1/4] Installing backend dependencies...
cd backend
call npm install
IF %ERRORLEVEL% NEQ 0 ( echo [ERROR] Backend install failed. & pause & exit /b 1 )

echo.
echo [2/4] Copying .env file...
IF NOT EXIST .env copy .env.example .env >nul

echo.
echo [3/4] Installing frontend dependencies...
cd ..\frontend
call npm install
IF %ERRORLEVEL% NEQ 0 ( echo [ERROR] Frontend install failed. & pause & exit /b 1 )

echo.
echo [4/4] Starting servers...
echo.
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo.

:: Start backend in a new window
start "KamPare Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"

:: Give backend 3 seconds to boot
timeout /t 3 /nobreak >nul

:: Start frontend in a new window
start "KamPare Frontend" cmd /k "cd /d "%~dp0frontend" && npm start"

echo.
echo  Both servers are starting. The browser should open automatically.
echo  Press any key to exit this window.
pause >nul
