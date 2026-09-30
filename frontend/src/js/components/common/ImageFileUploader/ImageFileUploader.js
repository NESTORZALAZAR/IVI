import { useState } from "react";
import { createWorker } from "tesseract.js";
import "./ImageFileUploader.css";

let tesseractWorker = null;
let workerLoading = false;
let workerCallbacks = [];

// Limpia líneas de ruido OCR (cuadrículas, bordes, símbolos de imágenes)
function limpiarTexto(texto) {
  const lineas = texto.split("\n");
  const limpias = lineas.filter((linea) => {
    const t = linea.trim();
    if (!t) return false;

    // Contar letras vs total de caracteres
    const letras = (t.match(/[a-záéíóúüñA-ZÁÉÍÓÚÜÑ]/g) || []).length;
    const ratio = letras / t.length;

    // Descartar si menos del 40% son letras
    if (ratio < 0.4) return false;

    // Descartar si es solo números
    if (/^\d+$/.test(t)) return false;

    // Descartar si tiene separadores de cuadrícula
    if (/[|=\-»«<>]{2,}/.test(t) && letras < 3) return false;

    // Obtener palabras reales (>= 2 letras)
    const palabrasReales = t.match(/[a-záéíóúüñA-ZÁÉÍÓÚÜÑ]{2,}/g) || [];

    // Descartar si no hay ninguna palabra real
    if (palabrasReales.length === 0) return false;

    // Descartar si la palabra más larga tiene menos de 4 letras (ruido: "DOI E", "e af")
    const palabraMasLarga = Math.max(...palabrasReales.map(p => p.length));
    if (palabraMasLarga < 4) return false;

    // Descartar si todas las "palabras" son de 1 letra (ruido gráfico)
    const palabrasTodas = t.match(/\S+/g) || [];
    const soloCortas = palabrasTodas.every((p) => p.replace(/[^a-zA-Z]/g, "").length <= 1);
    if (soloCortas && palabrasTodas.length > 1) return false;

    // Descartar si la línea tiene menos de 3 letras en total (muy corta para ser útil)
    if (letras < 3) return false;

    return true;
  });

  // Unir palabras separadas por | o & en la misma línea
  return limpias
    .map((l) => l.replace(/\s*[|&]\s*/g, "  ").trim())
    .join("\n");
}

function prepararImagenParaOCR(archivo, binarizar = false) {
  return new Promise((resolve, reject) => {
    const imagen = new Image();
    const url = URL.createObjectURL(archivo);

    imagen.onload = () => {
      const escala = Math.min(2, Math.max(1, 1600 / Math.max(imagen.naturalWidth, imagen.naturalHeight)));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(imagen.naturalWidth * escala);
      canvas.height = Math.round(imagen.naturalHeight * escala);
      const contexto = canvas.getContext("2d", { willReadFrequently: true });
      contexto.drawImage(imagen, 0, 0, canvas.width, canvas.height);

      const datos = contexto.getImageData(0, 0, canvas.width, canvas.height);
      for (let indice = 0; indice < datos.data.length; indice += 4) {
        const gris = 0.299 * datos.data[indice] + 0.587 * datos.data[indice + 1] + 0.114 * datos.data[indice + 2];
        const contraste = Math.max(0, Math.min(255, (gris - 128) * 1.45 + 128));
        const valor = binarizar ? (contraste < 175 ? 0 : 255) : contraste;
        datos.data[indice] = valor;
        datos.data[indice + 1] = valor;
        datos.data[indice + 2] = valor;
      }
      contexto.putImageData(datos, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    imagen.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo preparar la imagen"));
    };
    imagen.src = url;
  });
}

async function getWorker() {
  if (tesseractWorker) return tesseractWorker;
  if (workerLoading) {
    return new Promise((resolve) => workerCallbacks.push(resolve));
  }
  workerLoading = true;
  const worker = await createWorker("spa+eng");
  await worker.setParameters({
    tessedit_pageseg_mode: "11",
    preserve_interword_spaces: "1",
  });
  tesseractWorker = worker;
  workerLoading = false;
  workerCallbacks.forEach((cb) => cb(worker));
  workerCallbacks = [];
  return worker;
}

async function reconocerTexto(worker, imagen, modo) {
  await worker.setParameters({ tessedit_pageseg_mode: modo });
  return worker.recognize(imagen);
}

export default function ImageFileUploader({ onFileProcessed }) {
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progreso, setProgreso] = useState("");
  const [imagenPreview, setImagenPreview] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      procesarArchivo(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0])
      procesarArchivo(e.target.files[0]);
  };

  const procesarArchivo = async (archivo) => {
    const extensionesValidas = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff"];
    const esValido = extensionesValidas.some((ext) =>
      archivo.name.toLowerCase().endsWith(ext)
    );
    if (!esValido) {
      alert("Por favor carga una imagen: JPG, PNG, GIF, BMP, WEBP o TIFF");
      return;
    }

    // Mostrar preview
    const previewUrl = URL.createObjectURL(archivo);
    setImagenPreview(previewUrl);
    setIsLoading(true);
    setProgreso("Cargando motor OCR...");

    try {
      const worker = await getWorker();
      setProgreso("Probando enfoque de texto...");
      const imagenEnGrises = await prepararImagenParaOCR(archivo);
      const imagenBinarizada = await prepararImagenParaOCR(archivo, true);
        const resultadoDisperso = await reconocerTexto(worker, imagenEnGrises, "11");
        const resultadoBloques = await reconocerTexto(worker, imagenBinarizada, "6");
      const resultado = [resultadoDisperso, resultadoBloques]
        .sort((primero, segundo) => (segundo.data.confidence || 0) - (primero.data.confidence || 0))[0];
      const { data } = resultado;
      const texto = limpiarTexto(data.text.trim());

      setProgreso("");
      
      // Siempre procesar la imagen, incluso sin texto OCR
      // Si no hay texto, el sistema intentará con IA automáticamente
      onFileProcessed({ 
        texto: texto || "", // Pasar texto vacío si no se encontró nada
        caracteres: texto ? texto.length : 0,
        archivo 
      });
    } catch (error) {
      console.error("Error OCR:", error);
      setProgreso("");
      alert("Error al procesar la imagen: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
          <p className="file-types">Soportados: JPG, PNG, GIF, BMP, WEBP</p>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,image/*"
            onChange={handleChange}
            className="file-input"
            disabled={isLoading}
            aria-label="Seleccionar imagen para procesar con OCR"
          />
        </div>
      </div>

      {imagenPreview && (
        <div className="image-preview">
          <img src={imagenPreview} alt="Vista previa" />
        </div>
      )}

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>{progreso || "Procesando..."}</p>
        </div>
      )}
    </div>
  );
}
