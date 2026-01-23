# README - Frontend IVI

## 📦 Instalación y Setup

### Requisitos
- Node.js 14+
- npm o yarn

### Pasos

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```

3. **Iniciar en desarrollo**
   ```bash
   npm start
   ```

4. **Build para producción**
   ```bash
   npm run build
   ```

## 📁 Estructura del Proyecto

```
frontend/
├── public/                 # Archivos estáticos
│   ├── icons/             # Favicon e iconos
│   ├── images/            # Logos
│   ├── json/              # manifest.json
│   ├── fonts/             # Fuentes personalizadas
│   └── readme/            # Documentación
├── src/
│   ├── js/                # Código JavaScript
│   │   ├── components/    # Componentes React
│   │   ├── context/       # React Context
│   │   ├── hooks/         # Custom hooks
│   │   ├── constants/     # Constantes y config
│   │   ├── services/      # Servicios (API, etc)
│   │   ├── pages/         # Páginas principales
│   │   ├── utils/         # Utilidades
│   │   ├── tests/         # Tests compartidos
│   │   ├── App.js
│   │   └── ...
│   ├── css/               # Estilos globales
│   ├── html/              # HTML (index.html)
│   ├── icons/             # Iconos del app
│   ├── images/            # Imágenes
│   ├── json/              # Configs JSON
│   ├── readme/            # Documentación interna
│   └── index.js           # Punto de entrada
├── .env.example           # Ejemplo de variables
├── ARCHITECTURE.md        # Arquitectura del proyecto
├── COMPONENTS.md          # Documentación de componentes
├── CONTRIBUTING.md        # Guía de contribución
└── README.md              # Este archivo
```

## 🎯 Características Principales

### Accesibilidad
- Soporte para múltiples tipografías (Lexend, OpenDyslexic, Atkinson)
- Control de tamaño de letra
- Control de espaciado
- Modos de contraste y fondo
- ARIA labels en componentes

### Estructura Modular
- Componentes organizados por tipo (common, layouts)
- Custom hooks reutilizables
- Servicios centralizados
- Constantes globales

## 📚 Documentación Completa

- [ARCHITECTURE.md](ARCHITECTURE.md) - Decisiones arquitectónicas
- [COMPONENTS.md](COMPONENTS.md) - Documentación de componentes
- [CONTRIBUTING.md](CONTRIBUTING.md) - Guía de contribución
- [src/readme/](src/readme/) - Documentación adicional

## 🚀 Scripts Disponibles

```bash
npm start          # Inicia el servidor de desarrollo
npm test           # Ejecuta los tests
npm run build      # Crea un build de producción
npm run eject      # Expone configuración (cuidado!)
```

## 🛠️ Herramientas Utilizadas

- **React 19** - Librería UI
- **React DOM** - Renderizado
- **Testing Library** - Testing de componentes
- **Jest** - Framework de testing

## 🤝 Contribuir

Lee [CONTRIBUTING.md](CONTRIBUTING.md) para instrucciones detalladas.

### Resumen Rápido
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo licencia MIT.

## 👥 Autores

- **NESTORZALAZAR** - Inicial work

## 📧 Contacto

Para preguntas o sugerencias, abre un issue en el repositorio.

---

**Última actualización:** Enero 2026
