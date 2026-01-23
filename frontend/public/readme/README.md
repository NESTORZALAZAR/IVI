# Carpeta Public - Estructura

## Archivos Públicos Estáticos

```
public/
├── icons/                  # Iconos y favicon
│   └── favicon.ico
├── images/                 # Imágenes
│   ├── logo192.png
│   └── logo512.png
├── json/                   # Archivos JSON
│   └── manifest.json
├── fonts/                  # Fuentes personalizadas
├── readme/                 # Documentación
│   └── robots.txt
└── .gitkeep               # Mantener carpetas vacías
```

## Descripción

- **icons/** - Favicon e iconos estáticos
- **images/** - Logos e imágenes del proyecto
- **json/** - Manifest.json y configuraciones JSON
- **fonts/** - Fuentes personalizadas
- **readme/** - Documentación y archivos txt

**Nota:** Los archivos en la carpeta `public` se sirven directamente sin procesar. Use `%PUBLIC_URL%/` para referenciarlos en HTML.
