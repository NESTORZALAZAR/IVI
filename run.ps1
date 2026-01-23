# Script para ejecutar el proyecto IVI
# Uso: .\run.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "IVI - Plataforma de Tamizaje Dislexico" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
$nodeCheck = node --version 2>$null
if ($nodeCheck) {
    Write-Host "✓ Node.js encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ ERROR: Node.js no instalado" -ForegroundColor Red
    Write-Host "Descarga en: https://nodejs.org/" -ForegroundColor Yellow
    exit
}

# Verificar Python
Write-Host "Verificando Python..." -ForegroundColor Yellow
$pythonCheck = python --version 2>$null
if ($pythonCheck) {
    Write-Host "✓ Python encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ ERROR: Python no instalado" -ForegroundColor Red
    Write-Host "Descarga en: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "====== INSTALACION ======" -ForegroundColor Cyan
Write-Host ""

# Frontend
if (!(Test-Path "frontend\node_modules")) {
    Write-Host "Instalando dependencias del Frontend..." -ForegroundColor Yellow
    Push-Location frontend
    npm install
    Pop-Location
} else {
    Write-Host "✓ Dependencias del Frontend ya instaladas" -ForegroundColor Green
}

Write-Host ""
Write-Host "====== EJECUTANDO APLICACIONES ======" -ForegroundColor Cyan
Write-Host ""

Write-Host "Iniciando Frontend (http://localhost:3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command `"cd 'c:\Users\nesto\OneDrive\Escritorio\IVI\IVI\frontend'; npm start`""

Write-Host "Iniciando Backend (http://localhost:8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command `"cd 'c:\Users\nesto\OneDrive\Escritorio\IVI\IVI\backend'; python manage.py runserver`""

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "✓ Las aplicaciones se estan ejecutando:" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
