@echo off
echo ========================================================
echo   Starting FSD Experiment 5: MongoDB + Express API
echo   Author: Kirteesh D. Rakshe (D15A - 43)
echo ========================================================

echo.
echo [1/2] Starting Backend API Server (Port 5000)...
start "FSD Exp 5 Backend (Port 5000)" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo [2/2] Starting React Frontend (Port 5173)...
start "FSD Exp 5 Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Servers are launching in separate windows!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause

