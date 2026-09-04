@echo off
setlocal EnableExtensions EnableDelayedExpansion

title VibesOnly - One Click Vercel Deploy

REM ============================================================
REM VIBESONLY - ONE CLICK VERCEL DEPLOY
REM Windows 10 / Windows 11
REM ============================================================

set "TEAM_SLUG=vibes-only"
set "PROJECT_DIR=%~dp0"

REM Remove trailing backslash
if "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

cd /d "%PROJECT_DIR%"

echo.
echo ============================================================
echo              VIBESONLY - VERCEL DEPLOY
echo ============================================================
echo.
echo Team      : VibesOnly
echo Team Slug : %TEAM_SLUG%
echo Project   : %PROJECT_DIR%
echo.
echo ============================================================
echo.


REM ============================================================
REM 1. CHECK NODE.JS
REM ============================================================

echo [1/5] Checking Node.js...

where node >nul 2>&1

if errorlevel 1 (
    echo.
    echo [ERROR] Node.js is not installed.
    echo.
    echo Install Node.js LTS first.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js:
node --version
echo.


REM ============================================================
REM 2. CHECK NPM
REM ============================================================

echo [2/5] Checking npm...

where npm >nul 2>&1

if errorlevel 1 (
    echo.
    echo [ERROR] npm was not found.
    echo.
    pause
    exit /b 1
)

echo [OK] npm:
npm --version
echo.


REM ============================================================
REM 3. CHECK / INSTALL VERCEL CLI
REM ============================================================

echo [3/5] Checking Vercel CLI...

where vercel >nul 2>&1

if errorlevel 1 (

    echo.
    echo [INFO] Vercel CLI is not installed.
    echo [INFO] Installing Vercel CLI...
    echo.

    call npm install -g vercel

    if errorlevel 1 (
        echo.
        echo [ERROR] Vercel CLI installation failed.
        echo.
        pause
        exit /b 1
    )

    echo.
    echo [OK] Vercel CLI installed.
)

echo.
vercel --version
echo.


REM ============================================================
REM 4. CHECK LOGIN
REM ============================================================

echo [4/5] Checking Vercel login...

vercel whoami

if errorlevel 1 (

    echo.
    echo ============================================================
    echo VERCEL LOGIN REQUIRED
    echo ============================================================
    echo.
    echo A browser will open.
    echo.
    echo Login with the Vercel account that has access to:
    echo.
    echo             VibesOnly
    echo.
    echo ============================================================
    echo.

    pause

    call vercel login

    if errorlevel 1 (
        echo.
        echo [ERROR] Vercel login failed.
        echo.
        pause
        exit /b 1
    )

    echo.
    echo [OK] Login successful.
)

echo.


REM ============================================================
REM 5. PROJECT LINK
REM ============================================================

echo [5/5] Checking Vercel project link...
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
    echo.
    echo Vercel will ask you some questions.
    echo.
    echo IMPORTANT:
    echo.
    echo Scope:
    echo     Select VibesOnly
    echo.
    echo Existing project:
    echo     Select YES if your project already exists
    echo     Select NO to create a new project
    echo.
    echo Directory:
    echo     ./
    echo.
    echo ============================================================
    echo.

    pause

    call vercel link --scope "%TEAM_SLUG%"

    if errorlevel 1 (
        echo.
        echo ============================================================
        echo [ERROR] PROJECT LINKING FAILED
        echo ============================================================
        echo.
        echo Make sure your Vercel account has access to:
        echo.
        echo     VibesOnly
        echo.
        echo Also verify that the team slug is:
        echo.
        echo     vibes-only
        echo.
        pause
        exit /b 1
    )

    if not exist "%PROJECT_DIR%\.vercel\project.json" (
        echo.
        echo [ERROR] Vercel did not create the project link.
        echo.
        pause
        exit /b 1
    )

    echo.
    echo [OK] Project linked successfully.
    echo.
)


REM ============================================================
REM DEPLOY TO PRODUCTION
REM ============================================================

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
    echo.
    echo Check the Vercel error shown above.
    echo.
    pause
    exit /b 1
)


REM ============================================================
REM SUCCESS
REM ============================================================

echo.
echo.
echo ============================================================
echo              DEPLOYMENT SUCCESSFUL!
echo ============================================================
echo.
echo Team:
echo     VibesOnly
echo.
echo Project:
echo     %PROJECT_DIR%
echo.
echo.
echo Your latest local files are now deployed to production.
echo.
echo ============================================================
echo.

pause

endlocal
exit /b 0