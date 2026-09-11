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
        <h1 className="reader-title">Leer un documento</h1>
        <h2 className="reader-subtitle">
          Sube tu archivo PDF, Word o imágenes con texto legible (JPG, PNG). IVI lo leerá en voz alta y te ayudará a entenderlo mejor, de forma clara y sencilla.
        </h2>

        <div className="reader-content">
          {!processedData && (
            <section className="uploader-section upload-card">
              <FileUploader
                onFileProcessed={handleFileProcessed}
                isLoading={isLoading}
              />
            </section>
          )}

          {processedData && (
            <section className="result-card">
              <AudioPlayer
                audioUrl={processedData.audio}
                texto={processedData.texto}
                caracteres={processedData.caracteres}
              />
            </section>
          )}

          {processedData && (
            <section className="uploader-section upload-card compact-upload-card">
              <FileUploader
                onFileProcessed={handleFileProcessed}
                isLoading={isLoading}
                compact
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
