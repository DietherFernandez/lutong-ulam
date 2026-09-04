@echo off
setlocal EnableDelayedExpansion

echo ========================================
echo   Vercel Auto-Deploy Script
echo ========================================
echo.

:: Navigate to project root (where this .bat file lives)
cd /d "%~dp0"

:: Detect project name from folder name
for %%F in ("!cd!") do set "PROJECT_NAME=%%~nxF"
echo [INFO] Project: !PROJECT_NAME!
echo [INFO] Folder:  !cd!
echo.

:: -------------------------------------------------
:: Step 0: Make sure Vercel CLI is installed
:: -------------------------------------------------
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Vercel CLI not found. Installing globally via npm...
    call npm install -g vercel
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install Vercel CLI. Make sure Node.js / npm is installed.
        pause
        exit /b 1
    )
    echo [OK] Vercel CLI installed.
    echo.
)

:: -------------------------------------------------
:: Step 1: Make sure user is logged in
:: -------------------------------------------------
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Not logged in to Vercel. Starting login...
    call vercel login
    if %errorlevel% neq 0 (
        echo [ERROR] Login failed.
        pause
        exit /b 1
    )
)
echo [OK] Logged in as:
call vercel whoami
echo.

:: -------------------------------------------------
:: Step 2: Make sure project is linked to Vercel
:: -------------------------------------------------
if not exist ".vercel\project.json" (
    echo [INFO] Project not linked yet. Running "vercel link"...
    echo        When prompted, select:
    echo          1) The Vercel account you want to deploy to
    echo          2) "Link to existing project" (or create a new one)
    echo.
    echo        TIP: If the project does not exist on Vercel yet, it will be created automatically.
    echo.
    call vercel link
    if %errorlevel% neq 0 (
        echo [ERROR] Linking failed.
        pause
        exit /b 1
    )
    echo.
)
echo [OK] Project linked:
type ".vercel\project.json"
echo.
echo.

:: -------------------------------------------------
:: Step 3: Warn if vercel.json is missing
:: -------------------------------------------------
if not exist "vercel.json" (
    echo [WARNING] No vercel.json found in this folder.
    echo          Deploy may fail or use default settings.
    echo.
)

:: -------------------------------------------------
:: Step 4: Deploy to production
:: -------------------------------------------------
echo [1/2] Deploying !PROJECT_NAME! to Vercel production...
echo.
vercel --prod --yes
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Deployment failed. Check the error messages above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Project: !PROJECT_NAME!
echo.
echo Tip: Vercel may take 1-2 minutes to propagate globally.
echo.
pause
endlocal
