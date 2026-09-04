@echo off
setlocal EnableExtensions
title VibesOnly - Vercel Deploy

echo.
echo ============================================
echo       VIBESONLY - VERCEL DEPLOY
echo ============================================
echo.

:: Always run from the folder containing this BAT file
cd /d "%~dp0"

:: ==================================================
:: STEP 0 - CHECK VERCEL CLI
:: ==================================================

echo [0/3] Checking Vercel CLI...
echo.

where vercel >nul 2>&1

if errorlevel 1 (
    echo [INFO] Vercel CLI is not installed.
    echo.
    echo Installing Vercel CLI...
    echo.

    call npm install -g vercel

    if errorlevel 1 (
        echo.
        echo [ERROR] Failed to install Vercel CLI.
        echo Make sure Node.js and npm are installed.
        echo.
        pause
        exit /b 1
    )

    echo.
    echo [OK] Vercel CLI installed.
    echo.
)

:: ==================================================
:: STEP 1 - CHECK VERCEL AUTHORIZATION
:: ==================================================

echo [1/3] Checking Vercel authorization...
echo.

call vercel whoami >nul 2>&1

if errorlevel 1 (
    echo [INFO] You are not currently authorized.
    echo.
    echo Opening Vercel authorization...
    echo.

    call vercel login

    if errorlevel 1 (
        echo.
        echo [ERROR] Vercel authorization failed.
        echo.
        pause
        exit /b 1
    )

    echo.
    echo [OK] Vercel authorization successful.
    echo.
) else (
    echo [OK] Already authorized with Vercel.
    echo.
)

:: ==================================================
:: STEP 2 - CHECK PROJECT LINK
:: ==================================================

echo [2/3] Checking Vercel project link...
echo.

if not exist ".vercel\project.json" (

    echo [INFO] This project is not linked yet.
    echo.
    echo Linking project to VibesOnly...
    echo.

    call vercel link --scope vibes-only

    if errorlevel 1 (
        echo.
        echo [ERROR] Vercel project linking failed.
        echo.
        pause
        exit /b 1
    )

    echo.
    echo [OK] Project linked to VibesOnly.
    echo.

) else (

    echo [OK] Project is already linked to Vercel.
    echo.

)

:: ==================================================
:: STEP 3 - DEPLOY
:: ==================================================

echo [3/3] Deploying to production...
echo.

call vercel deploy --prod

if errorlevel 1 (
    echo.
    echo ============================================
    echo       DEPLOYMENT FAILED
    echo ============================================
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo       DEPLOYMENT SUCCESSFUL!
echo ============================================
echo.
echo Team: VibesOnly
echo.
echo Your latest files have been deployed.
echo.
pause

endlocal
exit /b 0