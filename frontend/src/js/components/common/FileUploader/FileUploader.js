import { useState } from "react";
import "./FileUploader.css";

export default function FileUploader({ onFileProcessed, isLoading }) {
  const [dragActive, setDragActive] = useState(false);

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
    // Validar extensión
    const extensionesValidas = [".pdf", ".docx", ".txt"];
    const esValido = extensionesValidas.some((ext) =>
      archivo.name.toLowerCase().endsWith(ext)
    );

    if (!esValido) {
      alert("Por favor carga un archivo PDF, DOCX o TXT");
      return;
    }

    // Crear FormData para enviar archivo
    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("velocidad", 1.0);

    try {
      // Intentar con localhost, sino con 127.0.0.1
      const backendUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:8000/api/archivos/procesar/'
        : 'http://127.0.0.1:8000/api/archivos/procesar/';

      const respuesta = await fetch(backendUrl, {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.error || `Error ${respuesta.status}: No se pudo procesar el archivo`);
      }

      const datos = await respuesta.json();
      onFileProcessed(datos);
    } catch (error) {
      console.error("Error detallado:", error);
      alert("Error: " + error.message + "\n\nAsegúrate de que el servidor backend (Django) esté corriendo en http://127.0.0.1:8000");
    }
  };

  return (
    <div className="file-uploader">
      <div
        className={`upload-area ${dragActive ? "active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          <div className="upload-icon">📄</div>
          <h3>Carga tu documento</h3>
          <p>Arrastra y suelta aquí o haz clic para seleccionar</p>
          <p className="file-types">Soportados: PDF, DOCX, TXT</p>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleChange}
            className="file-input"
            disabled={isLoading}
            aria-label="Seleccionar archivo para procesar"
          />
        </div>
      </div>

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Procesando archivo...</p>
        </div>
      )}
    </div>
  );
}
