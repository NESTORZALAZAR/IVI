# Guía de Contribución - IVI Frontend

## Antes de Empezar

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/NESTORZALAZAR/IVI.git
   cd IVI/frontend
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Configura variables de entorno**
   ```bash
   cp .env.example .env.local
   # Edita .env.local con tus valores
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm start
   ```

## Flujo de Trabajo

### 1. Crear una rama
```bash
git checkout -b feature/nombre-del-feature
# o
git checkout -b fix/nombre-del-bug
```

### 2. Hacer cambios
- Mantén los cambios focalizados y pequeños
- Sigue las convenciones de código del proyecto
- Actualiza documentación si es necesario

### 3. Testing
```bash
npm test
npm run build
```

### 4. Commit
```bash
git add .
git commit -m "feat: descripción del cambio"
# o
git commit -m "fix: descripción del arreglo"
```

### 5. Push y Pull Request
```bash
git push origin feature/nombre-del-feature
```

Crea un Pull Request describiendo tu cambio.

## Convenciones de Código

### Nombres de Variables
```javascript
// ✅ Bueno
const fontSize = 16;
const isAccessible = true;
const userData = { name: 'John' };

// ❌ Malo
const fs = 16;
const accessible = true;
const data = { name: 'John' };
```

### Nombres de Componentes
```javascript
// ✅ Bueno
function AccessibilityPanel() { }
function HomePage() { }

// ❌ Malo
function accessibility_panel() { }
function Home() { }
```

### Estructura de Carpetas para Nuevos Componentes
```
src/js/components/[type]/ComponentName/
├── ComponentName.js
├── ComponentName.css
└── ComponentName.test.js
```

## Checklist Antes de Enviar PR

- [ ] Código formateado y limpio
- [ ] Sin errores de consola
- [ ] Tests pasan
- [ ] Documentación actualizada
- [ ] Cambios descritos en el PR
- [ ] Sin archivos innecesarios

## Preguntas Frecuentes

**P: ¿Dónde pongo funciones auxiliares?**
R: En `src/js/utils/` si son globales, o en una carpeta `utils/` dentro del componente si son específicas.

**P: ¿Cómo agrego una nueva página?**
R: Crea el archivo en `src/js/pages/` y agrega la ruta en `src/js/constants/routes.js`.

**P: ¿Cómo llamo a la API?**
R: Usa los servicios en `src/js/services/api.js` o crea un custom hook.

## Contacto

Para dudas o sugerencias, abre un issue en el repositorio.
