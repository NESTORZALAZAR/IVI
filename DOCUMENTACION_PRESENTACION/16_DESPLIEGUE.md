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

1. Crear entorno virtual Python.
2. Configurar variables de entorno y `DEBUG=False`.
3. Definir `ALLOWED_HOSTS` y CORS por dominio.
4. Usar una base de datos de produccion.
5. Ejecutar migraciones.
6. Construir frontend con `npm run build`.
7. Servir el build con Nginx, Apache o un CDN.
8. Ejecutar Django con Gunicorn, Waitress o servicio equivalente.
9. Configurar HTTPS y certificados.
10. Definir copias de seguridad y monitoreo.

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
