@echo off
title Launching BookShelf...
cd /d "%~dp0"
echo ===================================================
echo   Starting BookShelf - Personal Library Manager
echo ===================================================
echo Opening at http://localhost:3000...
echo Press Ctrl+C in this window to stop the server.
echo.
npm run dev
pause
