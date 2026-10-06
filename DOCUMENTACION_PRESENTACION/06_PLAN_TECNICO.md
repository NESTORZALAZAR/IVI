# 6. Plan Tecnico

Este capitulo describe la solucion tecnica implementada para IVI, una plataforma web orientada al tamizaje, la lectura accesible y el acompanamiento de personas con posibles dificultades de lectoescritura. La descripcion se organiza en modelado de procesos, modelado UML, tecnologias, persistencia, API y modulos funcionales.

El conjunto principal contiene **13 diagramas**: cuatro de procesos y datos, tres de casos de uso, dos de secuencia, uno de actividades, uno de clases, uno de arquitectura y uno de despliegue. Los diagramas de flujo de datos de nivel 2 y el modelo relacional detallado pueden incorporarse como anexos si el reglamento de la tesis los exige.

Las fuentes Mermaid completas y las imagenes SVG listas para insertar se encuentran en [DIAGRAMAS_TESIS.md](DIAGRAMAS_TESIS.md).

## 6.1 Gestion informatica

### 6.1.1 Modelado de procesos

El modelado de procesos presenta el sistema desde una perspectiva general y luego descompone los flujos de informacion entre los actores, los procesos y los repositorios de datos.

**Figuras que se deben incluir:**

- **Figura 6.1. Diagrama de contexto. Nivel 0.** Representa IVI como un sistema que interactua con Paciente/Familia, Profesional y Administrador.
- **Figura 6.2. Diagrama de flujo de datos. Nivel 1.** Descompone autenticacion, evaluacion inicial, cuestionarios, juegos de tamizaje, lector accesible, resultados y recursos.
- **Figura 6.3. Diagrama conceptual.** Presenta las entidades principales y sus relaciones a nivel de negocio: Usuario, Paciente, Evaluacion, Cuestionario, Juego, Resultado, Documento, Recurso y Directorio.

Los flujos funcionales de referencia se encuentran en [06_FLUJOS_PRINCIPALES.md](06_FLUJOS_PRINCIPALES.md) y los actores y casos de uso en [02_CASOS_DE_USO_NIVEL_0.md](02_CASOS_DE_USO_NIVEL_0.md) y [03_CASOS_DE_USO_NIVEL_1.md](03_CASOS_DE_USO_NIVEL_1.md).

### 6.1.2 Modelado UML

El modelado UML describe la estructura y el comportamiento del sistema desde la perspectiva de cada rol y de los procesos principales.

**Figuras que se deben incluir:**

- **Figura 6.4. Diagrama de casos de uso del rol Paciente/Familia.** Incluye registro, autenticacion, evaluacion inicial, cuestionarios, juegos, lectura, accesibilidad y consulta de resultados.
- **Figura 6.5. Diagrama de casos de uso del rol Profesional.** Incluye busqueda de pacientes, modo consultorio y seguimiento de resultados.
- **Figura 6.6. Diagrama de casos de uso del rol Administrador.** Incluye gestion de usuarios, resultados y recursos administrativos.
- **Figura 6.7. Diagrama de secuencia del proceso de tamizaje.** Representa la comunicacion entre usuario, frontend, API y base de datos.
- **Figura 6.8. Diagrama de secuencia de carga de documentos.** Representa la recepcion, extraccion de texto, OCR y generacion de audio.
- **Figura 6.9. Diagrama de actividades del flujo de navegacion.** Muestra el recorrido desde la autenticacion hasta el cierre de sesion y las bifurcaciones por rol.
- **Figura 6.10. Diagrama de clases.** Presenta las clases reales del dominio implementado en Django, como `User`, `Profile`, `Paciente`, `Profesional`, `TipoPrueba`, `ResultadoPrueba`, `RespuestaResultado`, `ArchivoProcesado` y `ConversionAudio`.

En el diagrama conceptual pueden utilizarse nombres funcionales como Evaluacion, Cuestionario, Juego, Documento, Recurso y Directorio para explicar el negocio. Estos nombres no deben presentarse como tablas o clases reales si no tienen una entidad equivalente en el backend.

El catalogo ampliado de casos de uso se encuentra en [18_CATALOGO_DE_CASOS_DE_USO.md](18_CATALOGO_DE_CASOS_DE_USO.md). Los diagramas no deben repetir el DER: el DER se reserva para la estructura de persistencia descrita en la seccion 6.2.2.

## 6.2 Gestion informatica y software

### 6.2.1 Entorno de desarrollo y lenguajes de programacion

IVI utiliza una arquitectura monolitica modular con un frontend desacoplado. El backend se implementa con Python, Django y Django REST Framework, mientras que el frontend es una aplicacion SPA desarrollada con JavaScript y React.

| Componente | Tecnologia confirmada | Funcion |
|---|---|---|
| Backend | Python 3.12 reportado en el entorno, Django 4.2.0 | API, reglas de negocio y persistencia |
| API | Django REST Framework 3.14.0 | Comunicacion HTTP y respuestas JSON |
| Frontend | JavaScript, React 19.2.3 | Interfaz y navegacion |
| Ruteo | React Router 7.13.0 | Rutas publicas y protegidas |
| Build | Create React App, react-scripts 5.0.1 | Desarrollo y compilacion |
| Base de datos | PostgreSQL en produccion (Neon), SQLite como fallback local y Django ORM | Persistencia |
| Procesamiento | Tesseract.js y SpeechSynthesis en el frontend; Pillow, PyPDF2, python-docx, pytesseract, Tesseract y pyttsx3 en el backend | Imagenes, documentos, OCR y audio |
| Control de versiones | Git | Gestion del codigo fuente |

BLIP y las bibliotecas de Hugging Face deben describirse como dependencias opcionales, salvo que se incorporen formalmente a `backend/requirements.txt` y se validen durante la instalacion.

### 6.2.2 Gestion de la base de datos

La persistencia de produccion utiliza PostgreSQL mediante `DATABASE_URL` y el ORM de Django; en desarrollo local se utiliza SQLite como fallback. Las entidades principales son `User`, `Profile`, `Paciente`, `Profesional`, `TipoPrueba`, `ResultadoPrueba`, `RespuestaResultado`, `ArchivoProcesado` y `ConversionAudio`.

**Figuras que se deben incluir:**

- **Figura 6.11. Diagrama entidad-relacion (DER).** Presenta tablas, claves primarias, claves foraneas y cardinalidades.

El detalle de entidades y reglas de integridad se encuentra en [04_DER_MODELO_DATOS.md](04_DER_MODELO_DATOS.md), mientras que el detalle de campos puede incorporarse como anexo mediante [14_DICCIONARIO_DATOS.md](14_DICCIONARIO_DATOS.md).

### 6.2.3 Arquitectura API REST

La API REST utiliza HTTPS y JSON para comunicar el frontend publicado en GitHub Pages con el backend Django desplegado en un contenedor Docker sobre Hugging Face Spaces. En desarrollo se utilizan los puertos locales 3000 y 8000. Las rutas se agrupan bajo `/api/`, `/api/lector/`, resultados, usuarios, administracion y procesamiento de archivos.

La autenticacion utiliza un token propio enviado mediante `Authorization: Bearer`. En la implementacion actual el token se conserva en el almacenamiento del navegador; por tanto, debe describirse como una solucion de desarrollo y evaluarse para un despliegue productivo.

**Figuras y tablas que se deben incluir:**

- **Figura 6.12. Diagrama de arquitectura general.** Muestra el monolito modular, el frontend desacoplado, la API y SQLite.
- **Figura 6.13. Diagrama de despliegue.** Presenta navegador, frontend en GitHub Pages, backend Django en Hugging Face Spaces, PostgreSQL en Neon y los servicios de procesamiento OCR/audio.
- **Figura 6.14. Diagrama de arquitectura de red.** Detalla la comunicacion HTTPS entre el navegador, el frontend React y la API Django, junto con los despliegues de produccion, los puertos de desarrollo y los servicios de OCR/audio en cliente y servidor.
- **Tabla 6.1. Endpoints principales.** Resume metodo HTTP, ruta, rol requerido, entrada y respuesta.

El contrato ampliado de endpoints se encuentra en [12_API.md](12_API.md).

## 6.3 Modulos del sistema

Cada modulo debe documentarse con su objetivo, rol que lo utiliza, entradas, proceso, salida y una captura representativa. Las capturas deben numerarse de forma consecutiva como Figuras 6.16 en adelante.

### 6.3.1 Autenticacion y seguridad

Gestiona el registro, inicio de sesion, cierre de sesion y control de acceso por roles Paciente/Familia, Profesional y Administrador.

### 6.3.2 Evaluacion inicial

Presenta una evaluacion de reconocimiento del alfabeto para establecer una referencia antes de continuar con el tamizaje.

### 6.3.3 Cuestionarios por rango de edad

Presenta cuestionarios adaptados a los rangos de edad definidos por el sistema. Los resultados son orientativos y no constituyen un diagnostico clinico.

### 6.3.4 Juegos de tamizaje

Incluye actividades interactivas con niveles progresivos, como parejas, silabas, letras, velocidad y ortografia. Cuando corresponde, el puntaje se registra como `ResultadoPrueba`.

### 6.3.5 IVI te ayuda

Permite cargar archivos PDF, DOCX, TXT o imagenes, extraer texto mediante las herramientas disponibles, aplicar OCR cuando corresponde y generar audio con texto a voz.

### 6.3.6 Sobre IVI y accesibilidad

Permite configurar fuentes, contraste, tamano, espaciado y tema. Las preferencias se administran mediante `AccessibilityContext` y se conservan en el navegador.

### 6.3.7 Directorio de resultados

Permite consultar resultados segun el rol. Las familias consultan sus propios resultados, los profesionales consultan los resultados autorizados de sus pacientes y los administradores disponen de funciones de gestion ampliadas.

### 6.3.8 Centro de recursos

Ofrece materiales de apoyo, como articulos, videos, infografias y documentos, dirigidos a familias y profesionales.

### 6.3.9 Gestion del perfil de usuario

Permite consultar y modificar los datos del perfil y las preferencias de accesibilidad disponibles para cada usuario.

## 6.4 Consideraciones tecnicas y limites

La configuracion actual esta orientada al desarrollo local. Para un entorno productivo se deben externalizar secretos, restringir `ALLOWED_HOSTS` y CORS, utilizar HTTPS, revisar el mecanismo de autenticacion y definir una estrategia de despliegue reproducible. Estas condiciones se analizan con mayor detalle en [13_SEGURIDAD_PRIVACIDAD.md](13_SEGURIDAD_PRIVACIDAD.md) y [16_DESPLIEGUE.md](16_DESPLIEGUE.md).
