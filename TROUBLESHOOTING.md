# Guía de Troubleshooting - IVI Project

## ✅ Estado Actual

Todas las dependencias están instaladas y verificadas:
- Node.js 25.4.0 ✓
- Python 3.12.10 ✓
- npm packages (1328 packages) ✓
- pip packages (Django, DRF, etc.) ✓

---

## 🚀 Ejecución Rápida

### Opción 1: Script Batch (Recomendado para Windows)
```batch
run.bat
```

### Opción 2: Ejecución Manual

**Terminal 1 (Backend):**
```bash
cd backend
C:\Users\nesto\AppData\Local\Programs\Python\Python312\python.exe manage.py runserver
```

**Terminal 2 (Frontend):**
```bash
cd frontend
C:\Program Files\nodejs\npm start
```

---

## 🔧 Problemas Comunes y Soluciones

### Problema: "npm: command not found"
**Solución:** npm está en `C:\Program Files\nodejs\npm`
```batch
"C:\Program Files\nodejs\npm" install
```

### Problema: "python: command not found"
**Solución:** Python está en `C:\Users\nesto\AppData\Local\Programs\Python\Python312\python.exe`
```batch
C:\Users\nesto\AppData\Local\Programs\Python\Python312\python.exe manage.py runserver
```

### Problema: "Module not found" en npm
**Solución:** Reinstalar dependencias frontend
```bash
cd frontend
C:\Program Files\nodejs\npm install
```

### Problema: "ModuleNotFoundError" en Django
**Solución:** Reinstalar dependencias backend
```bash
cd backend
C:\Users\nesto\AppData\Local\Programs\Python\Python312\python.exe -m pip install -r requirements.txt
```

### Problema: Puerto 3000 o 8000 en uso
**Solución 1:** Usar puertos diferentes
```bash
# Frontend en puerto 5000
npm start -- --port 5000

# Backend en puerto 9000
python manage.py runserver 0.0.0.0:9000
```

**Solución 2:** Matar procesos en puertos
```bash
# Encontrar proceso en puerto 3000
netstat -ano | findstr :3000

# Matar proceso (reemplazar PID)
taskkill /PID <PID> /F
```

### Problema: npm vulnerabilities
Las 11 vulnerabilidades reportadas son menores. Para arreglarlas:
```bash
cd frontend
C:\Program Files\nodejs\npm audit fix
```

---

## 📦 Reinstalar Todo Limpiamente

Si necesitas reinstalar desde cero:

### Frontend:
```bash
cd frontend
rmdir /s /q node_modules
del package-lock.json
C:\Program Files\nodejs\npm install
```

### Backend:
```bash
cd backend
rmdir /s /q venv
C:\Users\nesto\AppData\Local\Programs\Python\Python312\python.exe -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

---

## 🗄️ Base de Datos

### Ver estado de migraciones:
```bash
C:\Users\nesto\AppData\Local\Programs\Python\Python312\python.exe manage.py showmigrations
```

### Ejecutar migraciones:
```bash
C:\Users\nesto\AppData\Local\Programs\Python\Python312\python.exe manage.py migrate
```

### Crear superusuario:
```bash
C:\Users\nesto\AppData\Local\Programs\Python\Python312\python.exe manage.py createsuperuser
```

---

## 🌐 URLs Locales

- **Frontend (React):** http://localhost:3000
- **Backend (Django):** http://localhost:8000
- **Admin Django:** http://localhost:8000/admin
- **API:** http://localhost:8000/api

---

## 📝 Variables de Entorno

Archivo: `.env` (en raíz del proyecto)

```env
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## 🐛 Debugging

### Frontend (React DevTools)
1. Instala extensión de navegador: React Developer Tools
2. Abre DevTools (F12)
3. Ve a pestaña "Components" o "Profiler"

### Backend (Django Debug Toolbar)
Agrega a `requirements.txt`:
```
django-debug-toolbar==4.2.0
```

Agrega a `INSTALLED_APPS` en `settings.py`:
```python
'debug_toolbar',
```

---

## 📚 Documentación Adicional

Ver carpeta `docs/` para:
- ARCHITECTURE.md - Estructura del proyecto
- COMPONENTS.md - Componentes React
- FOLDER_STRUCTURE.md - Estructura de carpetas
- CONTRIBUTING.md - Cómo contribuir

---

## ✉️ Contacto/Soporte

Si encuentras problemas:
1. Revisa esta guía de troubleshooting
2. Verifica que las versiones sean correctas
3. Limpia y reinstala si es necesario
4. Revisa los logs de error completos

---

**Última actualización:** 23 de enero de 2026
