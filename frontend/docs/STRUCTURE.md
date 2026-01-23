# Estructura del Frontend

## Organización de Carpetas

```
src/
├── components/              # Componentes reutilizables
│   ├── common/             # Componentes comunes (AccessibilityPanel, etc.)
│   └── layouts/            # Componentes de diseño (TopNav, etc.)
├── context/                # Context de React
│   └── AccessibilityContext.js
├── pages/                  # Páginas principales
│   └── HomePage.js
├── styles/                 # Estilos CSS
│   ├── App.css
│   ├── index.css
│   ├── HomePage.css
│   ├── AccessibilityPanel.css
│   └── TopNav.css
├── templates/              # Archivos HTML
│   └── index.html
├── utils/                  # Funciones y utilidades
├── App.js                  # Componente principal
└── index.js               # Punto de entrada
```

## Descripción

- **components/**: Componentes React organizados por tipo
- **context/**: Contexto global de React para estado compartido
- **pages/**: Componentes de página (páginas principales)
- **styles/**: Todos los archivos CSS organizados
- **templates/**: Archivos HTML (index.html)
- **utils/**: Funciones auxiliares y utilidades

Esta estructura mantiene el proyecto organizado y facilita el mantenimiento.
