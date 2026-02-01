# 📖 Lector de Documentos con OCR

## Características Nuevas

El sistema ahora puede leer en voz alta:
- ✅ Documentos PDF
- ✅ Documentos DOCX (Word)
- ✅ Archivos de texto TXT
- ✅ **NUEVO:** Imágenes (JPG, PNG, GIF, BMP) con OCR

## Instalación de Dependencias

### Backend - Tesseract OCR

Para que el sistema pueda leer texto en imágenes, debes instalar Tesseract OCR:

#### En Windows:
1. Descarga desde: https://github.com/UB-Mannheim/tesseract/wiki
2. Ejecuta el instalador
3. Anota la ruta de instalación (por defecto: `C:\Program Files\Tesseract-OCR`)

#### En Linux:
```bash
sudo apt-get install tesseract-ocr
```

#### En macOS:
```bash
brew install tesseract
```

Ver [TESSERACT_SETUP.md](./TESSERACT_SETUP.md) para más detalles.

### Frontend - Ya está instalado

Todas las dependencias necesarias en el frontend están incluidas en `package.json`

## Cómo Usar

### 1. Inicia los servidores

**Backend (Django):**
```powershell
cd backend
C:/Users/ACER/Desktop/IVI/venv/Scripts/python.exe manage.py runserver 0.0.0.0:8000
```

**Frontend (React):**
```powershell
cd frontend
npm start
```

### 2. Abre la aplicación

Ve a: http://localhost:3000 (o http://localhost:3001)

### 3. Navega al Lector de Documentos

- Busca "Lector de Documentos" en el menú
- O ve directamente a: http://localhost:3000/lector-documentos

### 4. Carga un archivo

- Arrastra y suelta una imagen, PDF, DOCX o TXT
- O haz clic para seleccionar el archivo

### 5. Escucha el contenido

- El texto será extraído automáticamente
- Se generará audio y se reproduciré en el reproductor

## Flujo Técnico

```
Imagen/Documento
    ↓
[Frontend FileUploader]
    ↓
Envía archivo a /api/lector/extract-and-speak/
    ↓
[Backend lector/views.py]
    ├→ Si es imagen: extract_text_from_image() → OCR con Tesseract
    ├→ Si es PDF: extract_text_from_pdf()
    ├→ Si es DOCX: extract_text_from_docx()
    └→ Si es TXT: Lee contenido directo
    ↓
generate_speech()
    ├→ Crea audio con pyttsx3
    └→ Retorna como hex
    ↓
[Frontend AudioPlayer]
    ├→ Convierte hex a blob
    ├→ Reproduce audio
    └→ Muestra texto extraído
```

## Lenguajes Soportados

Por defecto: **Español + Inglés**

Para agregar más idiomas:
1. Descarga el archivo .traineddata desde:
   https://github.com/UB-Mannheim/tesseract/wiki
2. Coloca en la carpeta tessdata de Tesseract
3. En `lector/views.py`, actualiza la línea OCR:
   ```python
   text = pytesseract.image_to_string(image, lang='spa+eng+fra')  # Agregar 'fra' para francés
   ```

## Formatos de Imagen Soportados

| Formato | Extensión | OCR |
|---------|-----------|-----|
| JPEG | .jpg, .jpeg | ✅ |
| PNG | .png | ✅ |
| GIF | .gif | ✅ |
| BMP | .bmp | ✅ |

## Notas Importantes

1. **Calidad de imagen:** OCR funciona mejor con imágenes de alta calidad
2. **Texto impreso:** Funciona mejor con texto impreso que manuscrito
3. **Contraste:** Usa imágenes con buen contraste para mejores resultados
4. **Tamaño:** Imágenes muy grandes pueden tardar más en procesarse

## Troubleshooting

### "tesseract is not installed or it's not in your PATH"
- Instala Tesseract (ver sección Instalación)
- Si está instalado, actualiza la ruta en `lector/views.py`:
  ```python
  import pytesseract
  pytesseract.pytesseract.pytesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
  ```

### El audio no se genera
- Verifica que pyttsx3 esté instalado: `pip install pyttsx3`
- En Windows, puede necesitar permisos adicionales
- Intenta reiniciar la aplicación

### OCR no reconoce el texto
- Mejora la calidad de la imagen
- Asegúrate de que el texto sea legible
- Usa imágenes con buen contraste

## Archivos Modificados

- ✅ `backend/lector/views.py` - Endpoint de lectura completo
- ✅ `backend/lector/urls.py` - Rutas creadas
- ✅ `backend/backend/urls.py` - Incluye app lector
- ✅ `backend/requirements.txt` - Dependencias actualizadas
- ✅ `frontend/src/js/pages/DocumentReaderPage.js` - Descripciones actualizadas
- ✅ `frontend/src/js/components/common/FileUploader/FileUploader.js` - Soporte de imágenes
- ✅ `backend/TESSERACT_SETUP.md` - Guía de instalación

## Soporte

Para más información sobre OCR y Tesseract:
- https://github.com/UB-Mannheim/tesseract/wiki
- https://pytesseract.readthedocs.io/
