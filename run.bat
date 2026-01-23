@echo off
REM Script para ejecutar ambas aplicaciones (Frontend y Backend)
setlocal enabledelayedexpansion

set PROJECT_ROOT=c:\Users\nesto\OneDrive\Escritorio\IVI\IVI
set PYTHON_PATH=C:\Users\nesto\AppData\Local\Programs\Python\Python312\python.exe
set NODE_PATH=C:\Program Files\nodejs

echo.
echo ========================================
echo IVI - Plataforma de Tamizaje Dislexico
echo ========================================
echo.

REM Verificar Node.js
echo Verificando Node.js...
"!NODE_PATH!\node.exe" --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado
    echo Descarga en: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar Python
echo Verificando Python...
"!PYTHON_PATH!" --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python no esta instalado
    echo Descarga en: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo.
echo ====== Iniciando Aplicaciones ======
echo.

REM Crear dos ventanas de terminal
echo Abriendo Frontend (http://localhost:3000)...
start "IVI Frontend" cmd /k "set PATH=!NODE_PATH!;!PATH! && cd /d !PROJECT_ROOT!\frontend && npm start"

timeout /t 2 /nobreak

echo Abriendo Backend (http://localhost:8000)...
start "IVI Backend" cmd /k "cd /d !PROJECT_ROOT!\backend && "!PYTHON_PATH!" manage.py runserver"

echo.
echo ========================================
echo Las aplicaciones se estan ejecutando:
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo ========================================
echo.
pause
endlocal
