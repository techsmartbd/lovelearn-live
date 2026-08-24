@echo off
title Next.js Dev Server - Landing Page
cd /d "%~dp0"
echo ===================================================
echo   Starting Next.js Dev Server in Background
echo ===================================================
echo Set WshShell = CreateObject("WScript.Shell") > temp_run.vbs
echo WshShell.Run "cmd.exe /c npm run dev", 0, false >> temp_run.vbs
wscript.exe temp_run.vbs
del temp_run.vbs
echo Dev Server started successfully in background.
ping 127.0.0.1 -n 4 > nul
exit
