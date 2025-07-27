@echo off
set PORT=8000
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :%PORT%') DO (
    echo Killing PID %%P on port %PORT%
    taskkill /PID %%P /F >nul 2>&1
)

