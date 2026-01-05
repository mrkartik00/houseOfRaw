@echo off
REM =================================================
REM House of Raw - Deployment Script (Windows)
REM =================================================
REM This script deploys the application to Digital Ocean
REM Run this script from your local machine after setting up SSH access

setlocal enabledelayedexpansion

REM Configuration
set SERVER_USER=deploy
set SERVER_HOST=your-droplet-ip
set DEPLOY_PATH=/var/www/houseofraw
set BRANCH=main

echo.
echo ===================================
echo   House of Raw - Deployment
echo ===================================
echo.

REM Check if SSH is available
where ssh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] SSH not found. Please install OpenSSH or use Git Bash.
    pause
    exit /b 1
)

echo [1/5] Checking SSH Connection...
ssh -o ConnectTimeout=5 %SERVER_USER%@%SERVER_HOST% "echo 'SSH OK'" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] SSH connection failed. Check your credentials.
    pause
    exit /b 1
)
echo [SUCCESS] SSH connection established

echo.
echo [2/5] Building Frontend...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm install failed
    cd ..
    pause
    exit /b 1
)

call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend build failed
    cd ..
    pause
    exit /b 1
)
echo [SUCCESS] Frontend built successfully
cd ..

echo.
echo [3/5] Deploying to Server...
ssh %SERVER_USER%@%SERVER_HOST% "cd %DEPLOY_PATH% && git pull origin %BRANCH% && cd backend && npm install --production && pm2 restart houseofraw-api && cd ../frontend && npm install && npm run build && sudo systemctl reload nginx && pm2 status"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Deployment failed
    pause
    exit /b 1
)

echo.
echo [4/5] Verifying Deployment...
curl -I https://houseofraw.tech 2>nul | findstr /C:"HTTP"
curl -I https://api.houseofraw.tech 2>nul | findstr /C:"HTTP"

echo.
echo [5/5] Deployment Complete!
echo.
echo ===================================
echo   Deployment Successful!
echo ===================================
echo   Frontend: https://houseofraw.tech
echo   Backend:  https://api.houseofraw.tech
echo ===================================
echo.

pause
