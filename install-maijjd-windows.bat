@echo off
chcp 65001 >nul
title Maijjd Installation for Windows

echo.
echo ███╗   ███╗ █████╗ ██╗     ██╗     ██╗██████╗ ██████╗ 
echo ████╗ ████║██╔══██╗██║     ██║     ██║██╔══██╗██╔══██╗
echo ██╔████╔██║███████║██║     ██║     ██║██║  ██║██║  ██║
echo ██║╚██╔╝██║██╔══██║██║     ██║     ██║██║  ██║██║  ██║
echo ██║ ╚═╝ ██║██║  ██║███████╗███████╗██║██████╔╝██████╔╝
echo ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚═════╝ ╚═════╝ 
echo.
echo 🚀 Maijjd Installation for Windows
echo =================================
echo.

:: Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running as Administrator
) else (
    echo ❌ Please run this script as Administrator
    echo Right-click on this file and select "Run as administrator"
    pause
    exit /b 1
)

:: Check if Node.js is installed
echo.
echo 🔍 Checking prerequisites...
node --version >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Node.js is installed
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo    Version: %NODE_VERSION%
) else (
    echo ❌ Node.js is not installed
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Choose the LTS version and restart this script after installation
    pause
    exit /b 1
)

:: Check if Python is installed
python --version >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Python is installed
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo    Version: %PYTHON_VERSION%
) else (
    echo ❌ Python is not installed
    echo.
    echo Please install Python from: https://python.org/
    echo Make sure to check "Add Python to PATH" during installation
    echo Restart this script after installation
    pause
    exit /b 1
)

:: Check if Git is installed
git --version >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Git is installed
    for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
    echo    Version: %GIT_VERSION%
) else (
    echo ❌ Git is not installed
    echo.
    echo Please install Git from: https://git-scm.com/
    echo Use default settings during installation
    echo Restart this script after installation
    pause
    exit /b 1
)

:: Check if Docker is installed
docker --version >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Docker is installed
    for /f "tokens=*" %%i in ('docker --version') do set DOCKER_VERSION=%%i
    echo    Version: %DOCKER_VERSION%
) else (
    echo ⚠️  Docker is not installed (optional but recommended)
    echo    You can install Docker Desktop from: https://docker.com/
)

echo.
echo ✅ All prerequisites are satisfied!
echo.

:: Ask user if they want to proceed
set /p CONTINUE="Do you want to proceed with Maijjd installation? (Y/N): "
if /i "%CONTINUE%"=="Y" (
    echo.
    echo 🔧 Starting Maijjd installation...
    goto :install
) else (
    echo Installation cancelled.
    pause
    exit /b 0
)

:install
echo.
echo 📦 Installing Maijjd...

:: Check if maijd_software directory exists
if exist "maijd_software" (
    echo ✅ Maijjd directory already exists
    cd maijd_software
) else (
    echo 📁 Creating Maijjd directory...
    mkdir maijd_software
    cd maijd_software
)

:: Install backend dependencies
echo.
echo 🔧 Installing backend dependencies...
cd ..\backend_maijjd
call npm install
if %errorLevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed

:: Install frontend dependencies
echo.
echo 🌐 Installing frontend dependencies...
cd ..\frontend_maijjd
call npm install
if %errorLevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

:: Return to root directory
cd ..

echo.
echo ✅ Maijjd installation completed successfully!
echo.

:: Create start script
echo 📝 Creating start script...
echo @echo off > start-maijjd-windows.bat
echo title Maijjd Services >> start-maijjd-windows.bat
echo echo Starting Maijjd services... >> start-maijjd-windows.bat
echo echo. >> start-maijjd-windows.bat
echo echo Starting backend server... >> start-maijjd-windows.bat
echo start "Backend Server" cmd /k "cd backend_maijjd ^& set PORT=5001 ^& npm start" >> start-maijjd-windows.bat
echo timeout /t 5 /nobreak ^>nul >> start-maijjd-windows.bat
echo echo Starting frontend... >> start-maijjd-windows.bat
echo start "Frontend Server" cmd /k "cd frontend_maijjd ^& npm start" >> start-maijjd-windows.bat
echo echo. >> start-maijjd-windows.bat
echo echo ✅ All services started! >> start-maijjd-windows.bat
echo echo Frontend: http://localhost:3000 >> start-maijjd-windows.bat
echo echo Backend: http://localhost:5001 >> start-maijjd-windows.bat
echo echo. >> start-maijjd-windows.bat
echo echo Press any key to close this window... >> start-maijjd-windows.bat
echo pause ^>nul >> start-maijjd-windows.bat

echo ✅ Start script created: start-maijjd-windows.bat
echo.

:: Ask if user wants to start services now
set /p START_NOW="Do you want to start Maijjd services now? (Y/N): "
if /i "%START_NOW%"=="Y" (
    echo.
    echo 🚀 Starting Maijjd services...
    call start-maijjd-windows.bat
) else (
    echo.
    echo 📋 To start Maijjd later:
    echo    1. Double-click start-maijjd-windows.bat
    echo    2. Or run manually:
    echo       Backend: cd backend_maijjd ^& set PORT=5001 ^& npm start
    echo       Frontend: cd frontend_maijjd ^& npm start
    echo.
    echo 🌐 Access Maijjd at: http://localhost:3000
    echo.
    pause
)
