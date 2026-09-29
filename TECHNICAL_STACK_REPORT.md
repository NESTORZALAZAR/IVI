# Reporte técnico del stack tecnológico de IVI

**Fecha del análisis:** 27 de septiembre de 2026  
**Alcance:** estructura completa del workspace, archivos de configuración, código representativo, scripts de ejecución y documentación del proyecto.

## Arquitectura General

IVI implementa una arquitectura **monolítica modular con frontend desacoplado**:

- **Backend:** un único proyecto Django (`backend/backend/`) que agrupa aplicaciones por dominio (`usuarios`, `lector`, `archivos` y `tamizaje`) y expone una API HTTP bajo `/api/`.
- **Frontend:** una SPA React independiente en `frontend/`, ejecutada por separado en desarrollo y consumiendo la API Django.
- **Patrón interno del backend:** estructura Django tipo **MVT** (Models, Views, Templates), utilizada principalmente como API REST. El enrutamiento global se concentra en `backend/backend/urls.py` y se delega a las apps.
- **Organización del frontend:** componentes, páginas, layouts, servicios, hooks, contexto y estilos CSS separados. Esto corresponde a una organización por componentes y responsabilidades, no a microservicios.
- **Comunicación:** HTTP/JSON mediante `fetch`; el backend usa prefijos `/api/`, `/api/lector/` y endpoints de usuarios, resultados y administración.
- **Procesamiento especializado:** OCR, extracción de documentos, texto a voz y, en `archivos/views.py`, descripción de imágenes con BLIP/Hugging Face bajo importación opcional. No se detecta una separación de estos servicios en procesos o servicios independientes.

## Backend

### Lenguaje y framework

- **Python:** el repositorio no fija una versión en un archivo de dependencias. La documentación de instalación reporta **Python 3.12.10** y también indica como requisito mínimo Python 3.8+.
- **Django:** `4.2.0`, declarado en `backend/requirements.txt`.
- **Django REST Framework:** `3.14.0`, declarado en `backend/requirements.txt`.
- **Servidor de aplicación:** configuración WSGI en `backend/backend/wsgi.py`; en desarrollo se usa `python manage.py runserver`.

> Nota: `backend/backend/settings.py` contiene comentarios generados para Django 6.0, pero la dependencia controlada por `requirements.txt` es Django 4.2.0. El reporte toma como versión declarada la dependencia, no el comentario del generador.

### Enrutamiento y API

- Enrutamiento nativo con `django.urls.path` e `include`.
- Vistas REST funcionales usando `@api_view`, `Response` y códigos de `rest_framework.status`.
- No se detectan routers de ViewSets, serializers propios, GraphQL ni FastAPI.
- Autenticación observada: token simple construido por la aplicación (`token_<user_id>_<username>`), no JWT ni `TokenAuthentication` de DRF.
- CORS mediante `django-cors-headers==4.0.0`; actualmente `CORS_ALLOW_ALL_ORIGINS = True`.

### Bibliotecas y utilidades principales

| Paquete | Versión declarada | Uso detectado |
|---|---:|---|
| `django-cors-headers` | `4.0.0` | CORS y middleware |
| `python-decouple` | `3.8` | Soporte previsto para configuración por entorno; no se observa uso efectivo en `settings.py` |
| `Pillow` | `>=10.0.0` | Lectura y procesamiento de imágenes |
| `pytesseract` | `0.3.10` | OCR mediante Tesseract externo |
| `pyttsx3` | `2.90` | Conversión de texto a voz |
| `python-docx` | `0.8.11` | Extracción de texto DOCX |
| `PyPDF2` | sin versión fijada | Extracción de texto PDF |
| `requests` | sin versión fijada | Pruebas/scripts de consumo HTTP |

Además, el código importa `torch` y `transformers` para BLIP en `archivos/views.py`, pero esos paquetes **no están declarados** en `backend/requirements.txt`; su disponibilidad no está garantizada por la instalación reproducible del backend.

## Frontend

### Lenguaje, framework y navegación

- **JavaScript**; no se detecta TypeScript.
- **React:** `^19.2.3`.
- **React DOM:** `^19.2.3`.
- **React Router DOM:** `^7.13.0` para rutas públicas, protegidas, de pacientes, doctores y administración.
- **Punto de entrada:** `frontend/src/index.js` / `frontend/src/js/index.js`.
- **Componentes clave:** `App`, `TopNav`, `AccessibilityProvider`, páginas de login/registro, pruebas de tamizaje, resultados, lector de documentos/textos, dashboard de doctor y vistas administrativas.

### Estado, servicios y estilos

- **Estado global:** React Context API, concretamente `AccessibilityContext` y `AccessibilityProvider`, para fuente, tamaño, espaciado y tema/accesibilidad.
- **Estado local:** hooks nativos como `useState`, `useEffect`, `useContext`, `useRef` y hooks propios como `useAccessibility`.
- **No detectado:** Redux, Zustand, MobX u otro gestor externo.
- **Servicios API:** módulo `frontend/src/js/services/api.js`, basado en `fetch`; la URL se obtiene de `REACT_APP_API_URL` y tiene fallback local.
- **Estilos:** CSS plano y CSS modular por componente/página, con hojas globales y un design system CSS.
- **No detectado:** Tailwind CSS, Bootstrap, Material UI, styled-components o un preprocesador declarado.
- **Accesibilidad:** fuentes locales (incluyendo Lexend, Atkinson y OpenDyslexic), controles de contraste, tamaño, espaciado y tema.

### Dependencias frontend declaradas

| Paquete | Versión declarada | Uso |
|---|---:|---|
| `react-scripts` | `5.0.1` | Scripts de desarrollo, build, Jest y configuración CRA |
| `@huggingface/transformers` | `^3.8.1` | Modelos/procesamiento en navegador |
| `@xenova/transformers` | `^2.17.2` | Transformadores en JavaScript |
| `tesseract.js` | `^7.0.0` | OCR en navegador |
| `@testing-library/dom` | `^10.4.1` | Utilidades de testing DOM |
| `@testing-library/jest-dom` | `^6.9.1` | Matchers de Jest para DOM |
| `@testing-library/react` | `^16.3.0` | Testing de componentes React |
| `@testing-library/user-event` | `^13.5.0` | Simulación de interacción de usuario |
| `web-vitals` | `^2.1.4` | Métricas de rendimiento web |

Las versiones anteriores son las restricciones declaradas en `frontend/package.json`; `frontend/package-lock.json` usa `lockfileVersion: 3` y contiene el grafo instalado. El `package-lock.json` de la raíz también existe, pero tiene `packages: {}` y no representa una instalación raíz con dependencias.

## Base de Datos y Persistencia

- **Motor confirmado:** SQLite mediante el archivo `backend/db.sqlite3`.
- **Configuración:** `django.db.backends.sqlite3`, con la base en `BASE_DIR / 'db.sqlite3'`.
- **ORM:** Django ORM (`django.db.models`).
- **Modelos principales:** usuario estándar de Django, `Profile` y `ResultadoPrueba`; este último usa `JSONField` para detalles de las pruebas y relaciones `ForeignKey` con usuarios.
- **Migraciones:** Django migrations; se observan migraciones de `usuarios` hasta `0007`.
- **Conector/driver:** SQLite integrado en Python/Django; no se declara un driver externo para PostgreSQL, MySQL o MongoDB.
- **Persistencia frontend:** `localStorage` para usuario, paciente de consultorio y preferencias/datos de sesión locales.
- **No detectado:** PostgreSQL, MySQL, MongoDB, Redis, cache externo o almacenamiento de objetos.

## Gestión de Dependencias y Entorno

- **Frontend:** npm, `frontend/package.json` y `frontend/package-lock.json`; scripts CRA:
  - `npm start`
  - `npm run build`
  - `npm test`
  - `npm run eject`
- **Bundler/build:** Create React App mediante `react-scripts 5.0.1`, que encapsula Webpack/Babel. No hay configuración Webpack o Vite propia.
- **Backend:** pip mediante `backend/requirements.txt`; no hay `pyproject.toml`, `setup.py`, `Pipfile` ni lockfile Python.
- **Scripts operativos:** `.bat` y `.ps1` para instalar y levantar frontend/backend en Windows.
- **Variables frontend:** `frontend/.env.example` define:
  - `REACT_APP_API_URL=http://localhost:8000/api`
  - `REACT_APP_ENV=development`
  - `REACT_APP_DEBUG_MODE=false`
- **Backend:** no se detecta un archivo `.env` real en el workspace. Aunque `python-decouple` está declarado y la documentación menciona `.env`, `settings.py` contiene `SECRET_KEY`, `DEBUG`, hosts y CORS de forma directa.
- **Advertencia de entorno:** `SECRET_KEY` está hardcodeada, `DEBUG=True`, `ALLOWED_HOSTS=[]` y CORS permite todos los orígenes; son configuraciones de desarrollo y deben externalizarse/restringirse en producción.

## Herramientas de Desarrollo y Calidad

### Testing

- **Frontend:** Jest integrado en `react-scripts`, con Testing Library. El script disponible es `npm test`; existen archivos `*.test.js`, `setupTests.js` y pruebas de componentes.
- **Backend:** framework de pruebas integrado de Django (`django.test.TestCase`), pero los archivos `tests.py` revisados contienen únicamente esqueletos generados y no pruebas funcionales sustantivas.
- **Pruebas de integración/manuales:** scripts Python en `backend/scripts/` para crear usuarios, sembrar resultados y verificar endpoints mediante `requests`.
- **No detectado:** PyTest, Selenium, Playwright, Cypress o cobertura configurada.

### Linting y formato

- **ESLint:** configuración indirecta de Create React App mediante `eslintConfig` con `react-app` y `react-app/jest` en `frontend/package.json`.
- **Prettier, Black, isort, flake8:** no se detectan configuraciones ni dependencias explícitas.

### Contenedores y despliegue

- **Docker/Docker Compose:** no se detectan `Dockerfile` ni archivos `docker-compose`.
- **CI/CD:** no se detectan workflows de GitHub Actions ni configuraciones de otros proveedores.
- **Despliegue documentado:** ejecución local en Windows, con frontend en `http://localhost:3000` y backend en `http://localhost:8000`; no se observa una configuración productiva reproducible.

## Inventario de archivos de referencia

- [Frontend package.json](frontend/package.json)
- [Frontend package-lock.json](frontend/package-lock.json)
- [Backend requirements.txt](backend/requirements.txt)
- [Django settings.py](backend/backend/settings.py)
- [Django URLs](backend/backend/urls.py)
- [Frontend environment example](frontend/.env.example)
- [Frontend architecture notes](frontend/docs/ARCHITECTURE.md)
- [Setup instructions](SETUP.md)

## Conclusión

El stack confirmado es **Python/Django 4.2 + Django REST Framework 3.14 + SQLite** en backend y **JavaScript/React 19.2 + React Router 7.13 + Create React App 5.0.1** en frontend. El sistema es un monolito modular con SPA separada, orientado a tamizaje, lectura accesible, OCR y texto a voz. La instalación está pensada para desarrollo local; para producción faltan, como mínimo, configuración de secretos por entorno, restricciones de CORS/hosts, autenticación robusta, dependencias completas para BLIP y una estrategia de despliegue/CI reproducible.
