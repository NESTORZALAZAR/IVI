@echo off
REM Script mejorado para ejecutar ambas aplicaciones (Frontend y Backend)
setlocal enabledelayedexpansion

set PROJECT_ROOT=c:\Users\nesto\OneDrive\Escritorio\IVI\IVI
set PYTHON_PATH=C:\Users\nesto\AppData\Local\Programs\Python\Python312\python.exe
set NODE_PATH=C:\Program Files\nodejs
set NODE_EXE=!NODE_PATH!\node.exe
set NPM_EXE=!NODE_PATH!\npm.cmd

echo.
echo ========================================
echo IVI - Plataforma de Tamizaje Dislexico
echo ========================================
echo.

REM Verificar Node.js
echo Verificando Node.js...
"!NODE_EXE!" --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado
    pause
    exit /b 1
)

REM Verificar Python
echo Verificando Python...
"!PYTHON_PATH!" --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python no esta instalado
    pause
    exit /b 1
)

echo.
echo ====== Iniciando Aplicaciones ======
echo.

REM Crear dos ventanas de terminal
echo Abriendo Frontend (http://localhost:3000)...
cd /d "!PROJECT_ROOT!\frontend"
start "IVI Frontend" cmd /k "!NPM_EXE! start"

timeout /t 2 /nobreak

echo Abriendo Backend (http://localhost:8000)...
cd /d "!PROJECT_ROOT!\backend"
start "IVI Backend" cmd /k ""!PYTHON_PATH!" manage.py runserver"

echo.
echo ========================================
echo Las aplicaciones se estan ejecutando:
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo Admin:    http://localhost:8000/admin
echo ========================================
echo.
pause
endlocal
