# ⚡ QUICK START - 5 Minutos

## 🎯 Lo que tienes

Tu plataforma IVI ahora puede leer imágenes con OCR.

```
📄 PDF ✅    📘 DOCX ✅    📝 TXT ✅    📸 JPG ✅    📸 PNG ✅
```

---

## ⚡ Paso 1: Instalar Tesseract (2 min)

### Windows
- Descarga: https://github.com/UB-Mannheim/tesseract/wiki
- Ejecuta el .exe
- Deja ruta por defecto
- ✅ Listo

### Linux
```bash
sudo apt-get install tesseract-ocr
```

### macOS
```bash
brew install tesseract
```

---

## ⚡ Paso 2: Iniciar (1 min)

**Terminal 1:**
```powershell
cd c:\Users\ACER\Desktop\IVI\IVI\backend
C:/Users/ACER/Desktop/IVI/venv/Scripts/python.exe manage.py runserver 0.0.0.0:8000
```

**Terminal 2:**
```powershell
cd c:\Users\ACER\Desktop\IVI\IVI\frontend
npm start
```

---

## ⚡ Paso 3: Prueba (2 min)

1. Abre: http://localhost:3000/lector-documentos
2. Carga una imagen (JPG/PNG/GIF/BMP)
3. ¡Automágicamente extrae el texto!
4. Reproduce el audio

---

## 🎉 ¡Listo!

Tu sistema OCR funciona.

---

## 📚 Más información

- [RESUMEN_FINAL.md](./RESUMEN_FINAL.md) - Visión general
- [TESSERACT_SETUP.md](./backend/TESSERACT_SETUP.md) - Instalación detallada
- [TESTING_OCR.md](./TESTING_OCR.md) - Pruebas completas
- [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) - Índice de documentos

---

**¡Disfruta! 🚀📸**
