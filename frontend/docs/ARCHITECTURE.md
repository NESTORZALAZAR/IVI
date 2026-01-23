# Arquitectura del Proyecto - IVI Frontend

## Estructura General

```
src/
├── js/                     # Código JavaScript
│   ├── components/         # Componentes React
│   │   ├── common/        # Componentes reutilizables
│   │   └── layouts/       # Componentes de layout
│   ├── context/           # Context de React
│   ├── hooks/             # Custom hooks
│   ├── constants/         # Constantes y configuración
│   ├── services/          # Servicios (API, etc)
│   ├── utils/             # Funciones auxiliares
│   ├── pages/             # Páginas principales
│   └── tests/             # Tests compartidos
├── css/                    # Estilos globales
├── html/                   # Archivos HTML
├── icons/                  # Iconos
├── images/                 # Imágenes
├── json/                   # Configuraciones JSON
└── readme/                 # Documentación
```

## Flujo de Datos

```
index.js → App.js → AccessibilityProvider (Context)
                  → HomePage
                     → TopNav (con contexto)
                     → Contenido principal
```

## Decisiones Arquitectónicas

### 1. Context API para Estado Global
- Usado para configuración de accesibilidad
- Alternativa a Redux por simplicidad

### 2. Separación de Componentes
- **common/**: Componentes reutilizables en toda la app
- **layouts/**: Componentes de estructura (Header, Footer, etc)
- **pages/**: Componentes de página principal

### 3. Custom Hooks
- Encapsular lógica reutilizable
- Facilitar testing
- Evitar prop drilling

### 4. Constantes y Configuración
- Centralizar valores que se repiten
- Facilitar cambios globales
- Mejorar mantenibilidad

## Patrones de Código

### Estructura de un Componente

```
js/components/common/MyComponent/
├── MyComponent.js
├── MyComponent.css
└── MyComponent.test.js
```

### Uso de Custom Hooks

```javascript
const { fontSize, setFontSize } = useAccessibility();
```

### Uso de Constantes

```javascript
import { FONT_OPTIONS } from '../../constants/accessibility';
```

## Próximas Mejoras

- [ ] Agregar Redux/Context mejorado
- [ ] Tests unitarios
- [ ] Testing de componentes
- [ ] Storybook para documentación de componentes
- [ ] i18n para internacionalización
