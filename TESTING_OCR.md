# ✅ Guía de Prueba - Lector de Documentos con OCR

## Paso 1: Instalar Tesseract OCR

**Importante:** Antes de ejecutar, debes instalar Tesseract OCR en tu sistema.

### Windows:
1. Ve a: https://github.com/UB-Mannheim/tesseract/wiki
2. Descarga: tesseract-ocr-w64-setup-v5.x.x.exe
3. Instala en ruta por defecto (C:\Program Files\Tesseract-OCR)
4. Listo - El sistema lo detectará automáticamente

### Linux:
```bash
sudo apt-get install tesseract-ocr
```

### macOS:
```bash
brew install tesseract
```

## Paso 2: Iniciar Servidores

### Terminal 1 - Backend:
```powershell
cd "C:\Users\ACER\Desktop\IVI\IVI\backend"
C:/Users/ACER/Desktop/IVI/venv/Scripts/python.exe manage.py runserver 0.0.0.0:8000
```

### Terminal 2 - Frontend:
```powershell
cd "C:\Users\ACER\Desktop\IVI\IVI\frontend"
npm start
```

## Paso 3: Pruebas

### Prueba 1: Cargar un PDF
- Abre: http://localhost:3000/lector-documentos
- Carga un archivo PDF
- Verifica que se extraiga el texto
- Haz clic en "Reproducir"

### Prueba 2: Cargar un DOCX
- Carga un archivo WORD (.docx)
- Verifica que se extraiga el texto
- Reproduce el audio

### Prueba 3: Cargar un TXT
- Carga un archivo de texto (.txt)
- Verifica que se extraiga el texto
- Reproduce el audio

### Prueba 4: Cargar una IMAGEN (OCR) ⭐
- Carga una imagen (JPG, PNG, GIF, BMP)
- **El sistema usará OCR para leer el texto**
- Verifica que se extraiga el texto de la imagen
- Reproduce el audio

## Archivos Nuevos/Modificados

### Backend:
- ✅ `backend/lector/views.py` - Nuevas funciones OCR
- ✅ `backend/lector/urls.py` - Creado
- ✅ `backend/backend/urls.py` - Actualizado
- ✅ `backend/requirements.txt` - Actualizado

### Frontend:
- ✅ `frontend/src/js/pages/DocumentReaderPage.js` - Actualizado
- ✅ `frontend/src/js/components/common/FileUploader/FileUploader.js` - Actualizado

### Documentación:
- ✅ `backend/TESSERACT_SETUP.md` - Guía de instalación
- ✅ `backend/LECTOR_OCR_README.md` - Documentación completa

## Posibles Errores y Soluciones

### Error: "tesseract is not installed"
**Solución:** Instala Tesseract (ver Paso 1)

### Error: "No se pudo procesar el archivo"
**Solución:** 
1. Verifica que Django esté corriendo en puerto 8000
2. Revisa la consola de Django para mensajes de error
3. Intenta con un archivo diferente

### El audio no se reproduce
**Solución:**
1. Verifica que pyttsx3 esté instalado
2. Intenta reproducir el audio manualmente
3. Revisa la consola del navegador

### OCR no reconoce el texto en la imagen
**Solución:**
1. Usa una imagen de mayor calidad
2. Asegúrate de que el texto sea legible
3. Usa imágenes con buen contraste
4. Intenta con otra imagen

## Capacidades Finales

| Tipo de Archivo | Soporte | Método |
|---|---|---|
| PDF | ✅ | PyPDF2 |
| DOCX | ✅ | python-docx |
| TXT | ✅ | Lectura directa |
| JPG/JPEG | ✅ | Tesseract OCR |
| PNG | ✅ | Tesseract OCR |
| GIF | ✅ | Tesseract OCR |
| BMP | ✅ | Tesseract OCR |

## Notas Importantes

1. **La carga de imágenes es más lenta** que otros formatos porque debe procesar OCR
2. **OCR funciona mejor con textos impresos** que manuscritos
3. **Imágenes muy grandes** pueden tardar mucho tiempo
4. **El sistema soporta español e inglés por defecto** en OCR

¡Listo! Ahora puedes probar el nuevo sistema de OCR 📖✨
