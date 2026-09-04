@echo off
setlocal EnableExtensions EnableDelayedExpansion

title Lutong Ulam - One Click Vercel Deploy

REM ============================================================
REM LUTONG ULAM - ONE CLICK VERCEL DEPLOY
REM Windows 10 / Windows 11
REM ============================================================

set "TEAM_SLUG=vibes-only"
set "PROJECT_DIR=%~dp0"

if "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

cd /d "%PROJECT_DIR%"

echo.
echo ============================================================
echo              LUTONG ULAM - VERCEL DEPLOY
echo ============================================================
echo.
echo Team      : VibesOnly
echo Team Slug : %TEAM_SLUG%
echo Project   : %PROJECT_DIR%
echo.
echo ============================================================
echo.

echo [1/6] Checking Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Node.js is not installed.
    echo Install Node.js LTS first.
    pause
    exit /b 1
)
echo [OK] Node.js: && node --version && echo.

echo [2/6] Checking npm...
where npm >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] npm was not found.
    pause
    exit /b 1
)
echo [OK] npm: && npm --version && echo.

echo [3/6] Installing dependencies...
if exist "%PROJECT_DIR%\package.json" (
    echo Installing root dependencies...
    call npm install
    if errorlevel 1 ( echo. && echo [ERROR] Root npm install failed. && pause && exit /b 1 )
)
if exist "%PROJECT_DIR%\client\package.json" (
    echo Installing client dependencies...
    cd /d "%PROJECT_DIR%\client"
    call npm install
    if errorlevel 1 ( echo. && echo [ERROR] Client npm install failed. && pause && exit /b 1 )
    cd /d "%PROJECT_DIR%"
)
echo [OK] Dependencies installed. && echo.

echo [4/6] Checking Vercel CLI...
where vercel >nul 2>&1
if errorlevel 1 (
    echo.
    echo [INFO] Vercel CLI is not installed. Installing now...
    call npm install -g vercel
    if errorlevel 1 ( echo. && echo [ERROR] Vercel CLI installation failed. && pause && exit /b 1 )
    echo.
    echo [OK] Vercel CLI installed.
)
echo. && vercel --version && echo.

echo [5/6] Checking Vercel login...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo.
    echo ============================================================
    echo VERCEL LOGIN REQUIRED
    echo ============================================================
    echo.
    echo A browser will open. Login with the Vercel account that
    echo has access to VibesOnly.
    echo ============================================================
    echo.
    pause
    call vercel login
    if errorlevel 1 ( echo. && echo [ERROR] Vercel login failed. && pause && exit /b 1 )
    echo. && echo [OK] Login successful.
)
echo.

echo Checking Vercel project link...
echo.
if exist "%PROJECT_DIR%\.vercel\project.json" (
    echo [OK] Existing Vercel project link found.
    echo.
    echo Project configuration:
    echo ------------------------------------------------------------
    type "%PROJECT_DIR%\.vercel\project.json"
    echo ------------------------------------------------------------
    echo.
) else (
    echo ============================================================
    echo FIRST-TIME VERCEL SETUP
    echo ============================================================
    echo.
    echo This folder is not connected to a Vercel project.
    echo Vercel will ask you some questions.
    echo.
    echo IMPORTANT:
    echo   Scope:    Select VibesOnly
    echo   Existing: YES if project exists, NO to create
    echo   Directory: ./
    echo ============================================================
    echo.
    pause
    call vercel link --scope "%TEAM_SLUG%"
    if errorlevel 1 ( echo. && echo [ERROR] PROJECT LINKING FAILED && pause && exit /b 1 )
    if not exist "%PROJECT_DIR%\.vercel\project.json" ( echo. && echo [ERROR] Vercel did not create the project link. && pause && exit /b 1 )
    echo. && echo [OK] Project linked successfully. && echo.
)

echo [6/6] Environment Variables Check...
echo.
echo ============================================================
echo IMPORTANT: Environment Variables
echo ============================================================
echo.
echo Make sure these are set in your Vercel project:
echo.
echo   VITE_SUPABASE_URL
echo   VITE_SUPABASE_ANON_KEY
echo.
echo Set them at: Vercel Dashboard ^> Settings ^> Environment Variables
echo ============================================================
echo.
choice /C YN /M "Have you set the Supabase environment variables"
if errorlevel 2 (
    echo.
    echo [WARN] Please set the env vars in Vercel dashboard first.
    pause
)

echo.
echo ============================================================
echo              DEPLOYING TO PRODUCTION
echo ============================================================
echo.
call vercel deploy --prod
if errorlevel 1 (
    echo.
    echo ============================================================
    echo                 DEPLOYMENT FAILED
    echo ============================================================
    pause
    exit /b 1
)

echo.
echo.
echo ============================================================
echo              DEPLOYMENT SUCCESSFUL!
echo ============================================================
echo.
echo Team:     VibesOnly
echo Project:  %PROJECT_DIR%
echo.
echo Your latest local files are now deployed to production.
echo ============================================================
echo.
pause

endlocal
exit /b 0
