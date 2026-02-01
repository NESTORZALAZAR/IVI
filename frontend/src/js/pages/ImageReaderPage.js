import { useState } from "react";
import ImageFileUploader from "../components/common/ImageFileUploader/ImageFileUploader";
import AudioPlayer from "../components/common/AudioPlayer/AudioPlayer";
import "./ImageReaderPage.css";

export default function ImageReaderPage() {
  const [processedData, setProcessedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileProcessed = (data) => {
    setProcessedData(data);
    setIsLoading(false);
  };

  return (
    <div className="image-reader-page">
      <div className="reader-container">
        <div className="reader-header">
          <h1>🖼️ Lector de Imágenes (OCR)</h1>
          <p>
            Carga una imagen con texto (JPG, PNG, GIF, BMP) y escúchalo leído en voz alta
          </p>
        </div>

        <div className="reader-content">
          <div className="uploader-section">
            <ImageFileUploader
              onFileProcessed={handleFileProcessed}
              isLoading={isLoading}
            />
          </div>

          {processedData && (
            <AudioPlayer
              audioUrl={processedData.audio}
              texto={processedData.texto}
              caracteres={processedData.caracteres}
            />
          )}

          {!processedData && (
            <div className="empty-state">
              <p>
                Carga una imagen con texto para extraer y escuchar su contenido en voz alta
              </p>
            </div>
          )}
        </div>

        <div className="reader-info">
          <h3>ℹ️ Información</h3>
          <ul>
            <li>
              <strong>Formatos soportados:</strong> JPG, PNG, GIF, BMP
            </li>
            <li>
              <strong>Tecnología OCR:</strong> Usa Tesseract para extraer texto
            </li>
            <li>
              <strong>Velocidad ajustable:</strong> De 0.5x a 2x
            </li>
            <li>
              <strong>Accesible:</strong> Diseñado para personas con dislexia
            </li>
            <li>
              <strong>Nota:</strong> Requiere Tesseract OCR instalado en tu sistema
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
