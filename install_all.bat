@echo off
setlocal enabledelayedexpansion

cd /d "c:\Users\nesto\OneDrive\Escritorio\IVI\IVI"

set NODE_PATH=C:\Program Files\nodejs
set PYTHON_PATH=C:\Users\nesto\AppData\Local\Programs\Python\Python312

echo.
echo ========================================
echo Installing Frontend Dependencies (npm)
echo ========================================
cd frontend
!NODE_PATH!\npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    echo Error Level: %errorlevel%
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Installing Backend Dependencies (pip)
echo ========================================
cd ..\backend
!PYTHON_PATH!\python.exe -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    echo Error Level: %errorlevel%
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo All dependencies installed successfully!
echo ========================================
echo.
echo Frontend: npm start (in frontend folder)
echo Backend: python manage.py runserver (in backend folder)
echo.
pause
endlocal
