@echo off
title Lutong Ulam - Quick Vercel Deploy

echo.
echo ============================================================
echo           LUTONG ULAM - QUICK VERCEL DEPLOY
echo ============================================================
echo.

cd /d "%~dp0"

where vercel >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing Vercel CLI...
    call npm install -g vercel
)

vercel whoami >nul 2>&1
if errorlevel 1 (
    echo [INFO] Please login to Vercel...
    call vercel login
)

echo.
echo Deploying to production...
echo.
call vercel deploy --prod

if errorlevel 1 (
    echo.
    echo [ERROR] Deployment failed.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo            DEPLOYMENT SUCCESSFUL!
echo ============================================================
echo.
pause
