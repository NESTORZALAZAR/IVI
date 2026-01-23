# Guía de Componentes - IVI Frontend

## Componentes Disponibles

### Common Components

#### AccessibilityPanel
**Ubicación:** `src/js/components/common/AccessibilityPanel/`

Panel de configuración de accesibilidad. Permite a los usuarios personalizar:
- Fuente tipográfica
- Tamaño de letra
- Espaciado de líneas
- Contraste
- Modo de fondo

**Uso:**
```javascript
import AccessibilityPanel from '../components/common/AccessibilityPanel/AccessibilityPanel';

<AccessibilityPanel />
```

**Props:** Ninguno (usa Context)

---

### Layout Components

#### TopNav
**Ubicación:** `src/js/components/layouts/TopNav/`

Barra de navegación superior con controles de accesibilidad integrados.

**Uso:**
```javascript
import TopNav from '../components/layouts/TopNav/TopNav';

<TopNav />
```

**Props:** Ninguno (usa Context)

---

## Creando un Nuevo Componente

### Paso 1: Crear la carpeta
```bash
mkdir src/js/components/[type]/MyComponent
```

### Paso 2: Crear los archivos
```
src/js/components/[type]/MyComponent/
├── MyComponent.js
├── MyComponent.css
└── MyComponent.test.js
```

### Paso 3: Implementar el componente

**MyComponent.js:**
```javascript
import { useContext } from 'react';
import { AccessibilityContext } from '../../../context/AccessibilityContext';
import './MyComponent.css';

export default function MyComponent({ title, children }) {
  const { fontSize } = useContext(AccessibilityContext);

  return (
    <div className="my-component">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

**MyComponent.css:**
```css
.my-component {
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
}

.my-component h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
```

## Mejores Prácticas

✅ **DO:**
- Usar custom hooks para lógica reutilizable
- Componentes funcionales con hooks
- Importar CSS localmente
- Usar Context para estado global

❌ **DON'T:**
- Componentes muy grandes (>300 líneas)
- Prop drilling profundo
- Nombres genéricos (Component.js, Page.js)
- Lógica compleja en componentes presentacionales
