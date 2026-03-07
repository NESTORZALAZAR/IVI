# IVI - Iniciar aplicacion (sin ventanas extra)
$ROOT = $PSScriptRoot
$BACKEND = "$ROOT\backend"
$FRONTEND = "$ROOT\frontend"

Write-Host ""
Write-Host "  IVI - Plataforma de Apoyo y Tamizaje Dislexia" -ForegroundColor Cyan
Write-Host ""

# Backend como job en segundo plano (sin ventana nueva)
Write-Host "  Iniciando backend..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    param($p)
    Set-Location $p
    py manage.py runserver 8000 2>&1
} -ArgumentList $BACKEND

Start-Sleep -Seconds 3
Write-Host "  Backend listo en http://localhost:8000" -ForegroundColor Green

# Frontend en el terminal actual
Write-Host "  Iniciando frontend... (Ctrl+C para detener todo)" -ForegroundColor Yellow
Write-Host ""

Set-Location $FRONTEND
npm start

# Al salir, limpiar el backend
Stop-Job $backendJob -ErrorAction SilentlyContinue
Remove-Job $backendJob -ErrorAction SilentlyContinue
Write-Host "  Todo detenido." -ForegroundColor Green
