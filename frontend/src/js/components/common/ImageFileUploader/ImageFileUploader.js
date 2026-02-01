import { useState } from "react";
import "./ImageFileUploader.css";

export default function ImageFileUploader({ onFileProcessed, isLoading: externalLoading }) {
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      procesarArchivo(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      procesarArchivo(e.target.files[0]);
    }
  };

  const procesarArchivo = async (archivo) => {
    // Validar extensión solo para imágenes
    const extensionesValidas = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
    const esValido = extensionesValidas.some((ext) =>
      archivo.name.toLowerCase().endsWith(ext)
    );

    if (!esValido) {
      alert("Por favor carga una imagen: JPG, PNG, GIF o BMP");
      return;
    }

    setIsLoading(true);

    // Crear FormData para enviar archivo
    const formData = new FormData();
    formData.append("file", archivo);

    try {
      // Intentar con localhost, sino con 127.0.0.1
      const backendUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:8000/api/lector/extract-and-speak/'
        : 'http://127.0.0.1:8000/api/lector/extract-and-speak/';

      const respuesta = await fetch(backendUrl, {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!respuesta.ok) {
        const error = await respuesta.json();
        
        // Si es error de Tesseract con imagen
        if (error.error && error.error.includes("Tesseract OCR no está instalado")) {
          throw new Error(
            "❌ Tesseract OCR no está instalado en tu sistema.\n\n" +
            "Para procesar imágenes, debes instalar Tesseract OCR:\n\n" +
            "1. Ve a: https://github.com/UB-Mannheim/tesseract/wiki\n" +
            "2. Descarga e instala tesseract-ocr-w64-setup-v5.x.x.exe\n" +
            "3. Reinicia la aplicación"
          );
        }
        
        throw new Error(error.error || `Error ${respuesta.status}: No se pudo procesar la imagen`);
      }

      const datos = await respuesta.json();
      // Convertir hex a blob para el audio
      const hexString = datos.audio;
      const bytes = new Uint8Array(hexString.length / 2);
      for (let i = 0; i < hexString.length; i += 2) {
        bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
      }
      const blob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);
      
      onFileProcessed({
        audio: audioUrl,
        texto: datos.text,
        caracteres: datos.text.length
      });
    } catch (error) {
      console.error("Error detallado:", error);
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loading = isLoading || externalLoading;

  return (
    <div className="image-file-uploader">
      <div
        className={`upload-area ${dragActive ? "active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          <div className="upload-icon">🖼️</div>
          <h3>Carga tu imagen con texto</h3>
          <p>Arrastra y suelta aquí o haz clic para seleccionar</p>
          <p className="file-types">Soportados: JPG, PNG, GIF, BMP</p>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.bmp,image/*"
            onChange={handleChange}
            className="file-input"
            disabled={loading}
            aria-label="Seleccionar imagen para procesar con OCR"
          />
        </div>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Procesando imagen con OCR...</p>
        </div>
      )}
    </div>
  );
}
