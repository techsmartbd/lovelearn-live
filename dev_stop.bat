@echo off
title Stop Next.js Dev Server
cd /d "%~dp0"
echo ===================================================
echo   Stopping Next.js Dev Server (Port 3000)
echo ===================================================
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo Stopping process with PID %%a...
    taskkill /f /pid %%a
)
echo Dev Server stopped successfully.
ping 127.0.0.1 -n 4 > nul
exit
