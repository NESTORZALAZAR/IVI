import { useState } from "react";
import FileUploader from "../components/common/FileUploader/FileUploader";
import AudioPlayer from "../components/common/AudioPlayer/AudioPlayer";
import "./DocumentReaderPage.css";

export default function DocumentReaderPage() {
  const [processedData, setProcessedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileProcessed = (data) => {
    setProcessedData(data);
    setIsLoading(false);
  };

  return (
    <div className="document-reader-page">
      <div className="reader-container">
        <div className="reader-header">
          <h1>📖 Lector de Documentos</h1>
          <p>
            Carga un documento PDF, DOCX o TXT y escúchalo leído en voz alta
          </p>
        </div>

        <div className="reader-content">
          <div className="uploader-section">
            <FileUploader
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
                Carga un documento para empezar a escuchar su contenido en voz
                alta
              </p>
            </div>
          )}
        </div>

        <div className="reader-info">
          <h3>ℹ️ Información</h3>
          <ul>
            <li>
              <strong>Formatos soportados:</strong> PDF, DOCX, TXT
            </li>
            <li>
              <strong>Velocidad ajustable:</strong> De 0.5x a 2x
            </li>
            <li>
              <strong>Accesible:</strong> Diseñado para personas con dislexia
            </li>
            <li>
              <strong>Privado:</strong> Los documentos se procesan localmente
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
