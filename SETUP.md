# 🚀 Guía de Instalación y Ejecución - IVI

## ⚠️ Requisitos Previos

Antes de ejecutar el proyecto, necesitas instalar:

### 1. Node.js (Para Frontend)

**Descarga:**
- Ir a https://nodejs.org/
- Descargar LTS (versión recomendada)
- Versión mínima: Node 14+

**Instalación Windows:**
1. Descarga el instalador `.msi`
2. Ejecuta el instalador
3. Sigue los pasos del asistente
4. Reinicia tu computadora

**Verificar instalación:**
```bash
node --version
npm --version
```

### 2. Python (Para Backend)

**Descarga:**
- Ir a https://www.python.org/downloads/
- Descargar Python 3.8+
- ⚠️ **Importante:** Marca "Add Python to PATH" durante la instalación

**Instalación Windows:**
1. Descarga el instalador
2. Ejecuta el instalador
3. ✅ Marca "Add Python to PATH"
4. Selecciona "Install Now"

**Verificar instalación:**
```bash
python --version
pip --version
```

---

## 🏃 Ejecutar el Proyecto

### Frontend (React)

```bash
# 1. Ir a la carpeta frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm start
```

El frontend se abrirá en: `http://localhost:3000`

### Backend (Django)

```bash
# 1. Ir a la carpeta backend
cd backend

# 2. Crear entorno virtual (opcional pero recomendado)
python -m venv venv
venv\Scripts\activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Ejecutar migraciones
python manage.py migrate

# 5. Crear superusuario (opcional)
python manage.py createsuperuser

# 6. Iniciar servidor
python manage.py runserver
```

El backend estará en: `http://localhost:8000`

---

## 📦 Scripts Disponibles - Frontend

```bash
npm start          # Inicia dev server
npm test           # Ejecuta tests
npm run build      # Build para producción
npm run eject      # Expone configuración (no reversible)
```

---

## 🆘 Solución de Problemas

### "npm no se reconoce"
- **Causa:** Node.js no instalado o no en PATH
- **Solución:** Reinstala Node.js y marca "Add to PATH"

### "python no se reconoce"
- **Causa:** Python no instalado o no en PATH
- **Solución:** Reinstala Python y marca "Add Python to PATH"

### Puerto 3000 en uso (Frontend)
```bash
npm start -- --port 3001
```

### Puerto 8000 en uso (Backend)
```bash
python manage.py runserver 8001
```

---

## 📋 Checklist

- [ ] Node.js instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Python instalado (`python --version`)
- [ ] pip instalado (`pip --version`)
- [ ] Frontend: `npm install` completado
- [ ] Backend: `pip install -r requirements.txt` completado
- [ ] Frontend ejecutándose en puerto 3000
- [ ] Backend ejecutándose en puerto 8000

---

## 🔗 URLs Locales

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **Admin Django:** http://localhost:8000/admin

---

## 📚 Documentación

- Frontend: `frontend/docs/README_FRONTEND.md`
- Backend: [Pendiente]

---

**Última actualización:** Enero 2026
