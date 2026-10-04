# 16. Instalacion y despliegue

![Instalacion y despliegue](16_DESPLIEGUE.svg)

## Desarrollo local

### Backend

```powershell
cd backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py check
python manage.py runserver 127.0.0.1:8000
```

### Frontend

```powershell
cd frontend
npm install
npm start
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:8000`

## Requisito OCR

Instalar Tesseract OCR y verificar:

```powershell
tesseract --version
tesseract --list-langs
```

Debe estar disponible el idioma `spa` para procesar texto en español.

## Produccion

La forma recomendada es un VPS o servicio PaaS con almacenamiento persistente. El
dominio no cambia al reiniciar la aplicación: el dominio apunta siempre al mismo
servidor mediante DNS y el proceso de Django se reinicia con un supervisor
(`systemd`, Docker o el supervisor del PaaS).

1. Crear el servidor y apuntar el registro DNS `A` del dominio a su IP fija.
2. Crear un entorno virtual Python e instalar `backend/requirements.txt`.
3. Configurar las variables de `backend/.env.example` en el proveedor (no subir `.env`).
4. Usar PostgreSQL en producción mediante `DATABASE_URL`. SQLite solo es apropiado
   para desarrollo o un VPS con disco persistente y un único proceso.
5. Ejecutar `python manage.py migrate` y `python manage.py collectstatic --noinput`.
6. Construir el frontend con `REACT_APP_API_URL=/api` y `npm run build`.
7. Servir `frontend/build` y hacer proxy de `/api/` y `/admin/` hacia Gunicorn.
8. Ejecutar Django con `gunicorn backend.wsgi:application` bajo un supervisor.
9. Activar HTTPS (por ejemplo, Let's Encrypt) y conservar el mismo dominio en
   `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` y `CSRF_TRUSTED_ORIGINS`.
10. Configurar copias de seguridad de PostgreSQL y del directorio `media/`.

Ejemplo de arranque de Django en Linux:

```bash
cd backend
gunicorn --bind 127.0.0.1:8000 --workers 3 backend.wsgi:application
```

El frontend debe compilarse con la URL pública de la API:

```bash
cd frontend
REACT_APP_API_URL=/api npm run build
```

En Windows, use Waitress o un servicio equivalente en lugar de Gunicorn.

### Despliegue gratuito con Render y Neon

El repositorio incluye [render.yaml](../render.yaml), un `Dockerfile` con Tesseract
y un servicio React estático. Para usarlo:

1. Crear una cuenta gratuita en Render y conectar el repositorio de GitHub.
2. Crear una base PostgreSQL gratuita en Neon. Copiar su `DATABASE_URL` (la cadena
   de conexión debe comenzar por `postgresql://`).
3. En Render elegir **New > Blueprint**, seleccionar este repositorio y confirmar
   los servicios `ivi-api` e `ivi-web`.
4. En el servicio `ivi-api`, agregar el valor de Neon en la variable secreta
   `DATABASE_URL` y desplegar.
5. Si Render asigna nombres distintos a los servicios, actualizar las URLs
   `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS` y
   `REACT_APP_API_URL` con los dominios mostrados por Render.
6. Probar `https://ivi-api.onrender.com/api/status/` y después abrir el dominio
   del sitio `ivi-web`.

El plan gratuito de Render puede dormir el backend tras unos minutos sin tráfico,
por lo que la primera petición puede tardar. Neon también puede suspender el
proyecto por inactividad. Es adecuado para demostraciones, no para datos clínicos
reales sin copias de seguridad, almacenamiento persistente y un plan con SLA.

Para conservar los datos actuales de SQLite antes de migrar:

```powershell
cd backend
python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 2 > data.json
```

Después de configurar `DATABASE_URL` en Render, cargar el archivo desde una tarea
segura o consola administrativa:

```bash
python manage.py loaddata data.json
```

No subir `data.json` al repositorio si contiene usuarios o información personal.

## Checklist de despliegue

- [ ] Secretos fuera del repositorio.
- [ ] HTTPS activo.
- [ ] CORS restringido.
- [ ] Tesseract instalado en el servidor.
- [ ] Migraciones aplicadas.
- [ ] Verificar que el catalogo de `TipoPrueba` contenga los ocho tipos iniciales.
- [ ] Revisar permisos y politica de retencion para archivos procesados y audio.
- [ ] Usuario administrador creado.
- [ ] Prueba de login ejecutada.
- [ ] Prueba de OCR ejecutada.
- [ ] Copia de seguridad verificada.
