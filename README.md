# IVI - Plataforma de Apoyo y Tamizaje Disléxico

## 🎯 Acerca del Proyecto

IVI es una plataforma integral diseñada para apoyar a personas con dislexia, familias y profesionales. Ofrece información confiable, herramientas accesibles y juegos interactivos.

## 🚀 Inicio Rápido (Automático)

### Opción 1: Windows Batch (run.bat)
```bash
# Solo ejecuta el archivo
run.bat
```

### Opción 2: PowerShell (run.ps1)
```bash
# En PowerShell
.\run.ps1
```

Esto instalará dependencias y ejecutará ambas aplicaciones automáticamente.

---

## 📖 Inicio Manual

### ⚠️ Requisitos Previos
- **Node.js 14+** - [Descargar](https://nodejs.org/)
- **Python 3.8+** - [Descargar](https://www.python.org/downloads/)

**Importante:** Durante la instalación, marca "Add to PATH"

### Frontend (React)

```bash
# 1. Ir a la carpeta frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm start
```

Abre http://localhost:3000 en tu navegador

### Backend (Django)

```bash
# 1. Ir a la carpeta backend
cd backend

# 2. Crear entorno virtual (opcional)
python -m venv venv
venv\Scripts\activate  # Windows

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Ejecutar migraciones
python manage.py migrate

# 5. Iniciar servidor
python manage.py runserver
```

El backend estará en http://localhost:8000

## 📁 Estructura del Proyecto

```
IVI/
├── frontend/               # React app
│   ├── public/            # Archivos estáticos
│   ├── src/               # Código fuente
│   ├── docs/              # Documentación ⭐
│   └── package.json
└── backend/               # Django API
    ├── manage.py
    ├── db.sqlite3
    └── [apps]/
```

## 📚 Documentación

### Documentos Principales
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Resumen de todo completado
- **[SETUP.md](SETUP.md)** - Instrucciones detalladas de instalación

### Frontend
Toda la documentación está en `frontend/docs/`:

- **[INDEX.md](frontend/docs/INDEX.md)** - Índice de documentación
- **[README_FRONTEND.md](frontend/docs/README_FRONTEND.md)** - Setup y inicio
- **[ARCHITECTURE.md](frontend/docs/ARCHITECTURE.md)** - Arquitectura del proyecto
- **[COMPONENTS.md](frontend/docs/COMPONENTS.md)** - Documentación de componentes
- **[CONTRIBUTING.md](frontend/docs/CONTRIBUTING.md)** - Guía de contribución
- **[FOLDER_STRUCTURE.md](frontend/docs/FOLDER_STRUCTURE.md)** - Estructura de carpetas

## 🎯 Características Principales

### Accesibilidad ♿
- ✅ Múltiples tipografías (Lexend, OpenDyslexic, Atkinson)
- ✅ Control de tamaño de letra (14-28px)
- ✅ Controles de contraste y espaciado
- ✅ Modos de fondo (Blanco, Sepia, Crema)
- ✅ ARIA labels en componentes

### Frontend 🎨
- ✅ React 19 - Framework moderno
- ✅ Context API - Estado global
- ✅ Custom Hooks - Lógica reutilizable
- ✅ Estructura profesional y escalable

### Backend ⚙️
- ✅ Django REST API
- ✅ Autenticación de usuarios
- ✅ Módulos: Archivos, Lector, Tamizaje, Usuarios

## 🤖 Scripts Disponibles

### Windows Batch
```bash
run.bat              # Ejecuta todo automáticamente
```

### PowerShell
```bash
.\run.ps1            # Ejecuta todo automáticamente
```

## 🤝 Contribuir

Lee [CONTRIBUTING.md](frontend/docs/CONTRIBUTING.md) para instrucciones completas.

### Pasos Rápidos
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

Para preguntas o sugerencias, abre un issue en el repositorio.

---

**Versión:** 1.0  
**Última actualización:** Enero 2026  
**Estado:** ✅ Listo para desarrollar
