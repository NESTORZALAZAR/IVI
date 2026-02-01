# Guía de instalación de Tesseract OCR para Windows

## Requisito: Tesseract OCR

El sistema ahora incluye OCR (Optical Character Recognition) para leer texto en imágenes. Tesseract es una librería externa que debe ser instalada en el sistema operativo.

### Instalación en Windows

1. **Descarga el instalador de Tesseract:**
   - Ve a: https://github.com/UB-Mannheim/tesseract/wiki
   - Descarga la versión más reciente (ej: tesseract-ocr-w64-setup-v5.x.x.exe)

2. **Ejecuta el instalador:**
   - Haz clic en el archivo .exe descargado
   - Sigue los pasos del instalador
   - **IMPORTANTE:** Durante la instalación, anota la ruta de instalación (por defecto: `C:\Program Files\Tesseract-OCR`)

3. **Verifica la instalación:**
   ```powershell
   tesseract --version
   ```

4. **Configura el path en el backend** (opcional):
   Si no está en la ruta por defecto, edita `backend/lector/views.py`:
   ```python
   import pytesseract
   pytesseract.pytesseract.pytesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
   ```

### Instalación en Linux
```bash
sudo apt-get install tesseract-ocr
```

### Instalación en macOS
```bash
brew install tesseract
```

## Lenguajes adicionales (opcional)

Por defecto, Tesseract detecta español e inglés. Si necesitas otros idiomas:

1. Descarga los archivos de idioma desde:
   https://github.com/UB-Mannheim/tesseract/wiki

2. Coloca los archivos .traineddata en:
   - Windows: `C:\Program Files\Tesseract-OCR\tessdata\`
   - Linux/macOS: `/usr/share/tesseract-ocr/4.00/tessdata/`

## Formatos de imagen soportados

- JPG/JPEG
- PNG
- GIF
- BMP

## Nota sobre rendimiento

- Las imágenes grandes pueden tardar más en procesarse
- Para mejor precisión, usa imágenes con buena calidad y contraste
- El OCR funciona mejor con textos impresos que manuscritos
