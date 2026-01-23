# Script para ejecutar ambas aplicaciones (Frontend y Backend)

$ProjectRoot = "c:\Users\nesto\OneDrive\Escritorio\IVI\IVI"
$PythonPath = "C:\Users\nesto\AppData\Local\Programs\Python\Python312\python.exe"
$NodePath = "C:\Program Files\nodejs"

Write-Host ""
Write-Host "========================================"
Write-Host "IVI - Plataforma de Tamizaje Dislexico"
Write-Host "========================================"
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..."
$nodeCheck = & "$NodePath\node.exe" --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js no esta instalado"
    Write-Host "Descarga en: https://nodejs.org/"
    Read-Host "Presiona Enter para continuar"
    exit 1
}

# Verificar Python
Write-Host "Verificando Python..."
$pythonCheck = & $PythonPath --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Python no esta instalado"
    Write-Host "Descarga en: https://www.python.org/downloads/"
    Read-Host "Presiona Enter para continuar"
    exit 1
}

Write-Host ""
Write-Host "====== Iniciando Aplicaciones ======"
Write-Host ""

# Abrir Frontend
Write-Host "Abriendo Frontend (http://localhost:3000)..."
Start-Process cmd.exe -ArgumentList "/k cd /d $ProjectRoot\frontend && $NodePath\npm start" -WindowStyle Normal -PassThru

# Esperar un poco
Start-Sleep -Seconds 2

# Abrir Backend
Write-Host "Abriendo Backend (http://localhost:8000)..."
Start-Process cmd.exe -ArgumentList "/k cd /d $ProjectRoot\backend && $PythonPath manage.py runserver" -WindowStyle Normal -PassThru

Write-Host ""
Write-Host "========================================"
Write-Host "Las aplicaciones se estan ejecutando:"
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend:  http://localhost:8000"
Write-Host "========================================"
Write-Host ""
Read-Host "Presiona Enter para continuar"
