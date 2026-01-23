# 🚀 INICIO RÁPIDO

## Opción 1: Automática (Recomendado)

### Windows (Batch)
1. Haz doble clic en `run.bat`
2. ¡Listo! El proyecto se ejecutará automáticamente

### PowerShell
1. Abre PowerShell en la carpeta del proyecto
2. Ejecuta: `.\run.ps1`
3. ¡Listo! El proyecto se ejecutará automáticamente

---

## Opción 2: Manual

### Requisitos Previos
- Node.js 14+ (https://nodejs.org/)
- Python 3.8+ (https://www.python.org/downloads/)

### Frontend
```bash
cd frontend
npm install
npm start
# Abre http://localhost:3000
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
# Corre en http://localhost:8000
```

---

## URLs del Proyecto

| Servicio | URL |
|----------|-----|
| 🎨 Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:8000/api |
| 🔒 Admin | http://localhost:8000/admin |

---

## 📚 Documentación

- **README.md** - Información principal
- **SETUP.md** - Instalación detallada
- **PROJECT_SUMMARY.md** - Resumen del proyecto
- **frontend/docs/** - Documentación completa del frontend

---

## ❓ Problemas Comunes

### "npm no se reconoce"
→ Instala Node.js desde https://nodejs.org/

### "python no se reconoce"
→ Instala Python desde https://www.python.org/downloads/

### Puerto en uso
```bash
# Frontend otro puerto
npm start -- --port 3001

# Backend otro puerto
python manage.py runserver 8001
```

---

**¡Listo para desarrollar! 🎉**
