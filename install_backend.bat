@echo off
setlocal enabledelayedexpansion

cd /d "c:\Users\nesto\OneDrive\Escritorio\IVI\IVI\backend"

set PYTHON_PATH=C:\Users\nesto\AppData\Local\Programs\Python\Python312

echo.
echo ========================================
echo Installing Backend Dependencies (pip)
echo ========================================
!PYTHON_PATH!\python.exe -m pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    echo Error Level: %errorlevel%
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Backend dependencies installed!
echo ========================================
echo.
pause
endlocal
