# Estructura del Frontend - IVI

## 📁 Organización de Carpetas en `src/`

```
src/
├── js/                     # Código JavaScript
│   ├── components/         # Componentes React
│   │   ├── common/        # Componentes reutilizables
│   │   │   └── AccessibilityPanel/
│   │   │       ├── AccessibilityPanel.js
│   │   │       ├── AccessibilityPanel.css
│   │   │       └── AccessibilityPanel.test.js
│   │   └── layouts/       # Componentes de estructura
│   │       └── TopNav/
│   │           ├── TopNav.js
│   │           ├── TopNav.css
│   │           └── TopNav.test.js
│   ├── context/           # React Context
│   │   └── AccessibilityContext.js
│   ├── hooks/             # Custom Hooks reutilizables
│   │   └── useAccessibility.js
│   ├── constants/         # Constantes y configuración
│   │   ├── accessibility.js
│   │   └── routes.js
│   ├── services/          # Servicios (API, etc)
│   │   └── api.js
│   ├── pages/             # Componentes de página
│   │   └── HomePage.js
│   ├── utils/             # Funciones auxiliares
│   ├── tests/             # Tests compartidos
│   ├── App.js             # Componente principal
│   ├── App.test.js
│   ├── reportWebVitals.js
│   └── setupTests.js
├── css/                    # Estilos globales
│   ├── App.css
│   ├── index.css
│   └── HomePage.css
├── html/                   # Archivos HTML
│   └── index.html
├── icons/                  # Iconos y SVG
│   └── logo.svg
├── images/                 # Imágenes
├── json/                   # Archivos JSON
├── readme/                 # Documentación
│   ├── README.md
│   └── STRUCTURE.md
└── index.js               # Punto de entrada
```

## 📋 Descripción de Carpetas

| Carpeta | Descripción | Contenido |
|---------|-------------|----------|
| **js/** | Código JavaScript | Componentes, contexto, hooks, servicios |
| **js/components/** | Componentes React | Componentes por tipo (common, layouts) |
| **js/context/** | React Context | Estado global |
| **js/hooks/** | Custom Hooks | Lógica reutilizable |
| **js/constants/** | Constantes | Config, rutas, opciones |
| **js/services/** | Servicios | API calls, integración backend |
| **js/pages/** | Páginas | Componentes principales |
| **js/utils/** | Utilidades | Funciones auxiliares |
| **css/** | Estilos CSS | CSS global y de componentes |
| **html/** | Templates HTML | index.html |
| **icons/** | Iconos | SVG, favicon |
| **images/** | Imágenes | PNG, JPG, etc |
| **json/** | JSON | Configuraciones |
| **readme/** | Documentación | Docs internas |

## 🏗️ Estructura de Componentes

Cada componente sigue esta estructura:

```
ComponentName/
├── ComponentName.js       # Lógica del componente
├── ComponentName.css      # Estilos específicos
└── ComponentName.test.js  # Tests
```

## 🎯 Patrones de Uso

### Importar un Componente
```javascript
import AccessibilityPanel from '../components/common/AccessibilityPanel/AccessibilityPanel';
```

### Usar un Custom Hook
```javascript
import { useAccessibility } from '../../hooks/useAccessibility';

const { fontSize, setFontSize } = useAccessibility();
```

### Usar Constantes
```javascript
import { FONT_OPTIONS } from '../../constants/accessibility';
```

### Llamar a la API
```javascript
import { API } from '../../services/api';

API.screening.get();
```

## ✨ Beneficios de esta Estructura

✅ **Escalable** - Fácil agregar nuevos componentes, hooks, servicios  
✅ **Mantenible** - Código organizado y fácil de encontrar  
✅ **Testeable** - Tests cerca del código que testean  
✅ **Reutilizable** - Custom hooks y servicios centralizados  
✅ **Profesional** - Sigue estándares de proyectos React grandes  

## 📚 Documentación Adicional

- Ver [ARCHITECTURE.md](../../ARCHITECTURE.md) para decisiones de diseño
- Ver [COMPONENTS.md](../../COMPONENTS.md) para documentación de componentes
- Ver [CONTRIBUTING.md](../../CONTRIBUTING.md) para guía de contribución
