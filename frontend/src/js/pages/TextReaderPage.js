import { useState } from "react";
import ImageFileUploader from "../components/common/ImageFileUploader/ImageFileUploader";
import AudioGuideButton from "../components/common/AudioGuideButton/AudioGuideButton";
import "./TextReaderPage.css";

export default function TextReaderPage() {
  const [textData, setTextData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [inputText, setInputText] = useState("");
  const [textRate, setTextRate] = useState(1);
  const [imageRate, setImageRate] = useState(1);
  const [imageError, setImageError] = useState("");
  const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  const handleImageProcessed = ({ texto, caracteres }) => {
    if (!texto?.trim()) {
      setImageError("No se encontró texto legible. Carga una imagen que contenga palabras claras.");
      return;
    }

    window.speechSynthesis.cancel();
    setImageError("");
    setImageData({ texto, caracteres });
  };

  return (
    <div className="text-reader-page">
      <div className="reader-container">
        <h1 className="text-reader-title">Lector de Textos</h1>
        <h2 className="text-reader-subtitle">
          Ingresa tu texto y escúchalo leído en voz alta con controles accesibles.
        </h2>

        <div className="reader-content">
          {/* Sección de Entrada de Texto Directa */}
          <div className="text-input-section">
            <div className="text-input-header">
              <div className="text-input-title-group">
                <h3 style={{ whiteSpace: "nowrap", flexShrink: 0 }}>✏️ Escribe o Pega tu Texto</h3>
                <div className="reader-audio-controls">
                  <AudioGuideButton
                    text={inputText}
                    rate={textRate}
                    label="Escuchar texto"
                    onStart={() => setTextData({ texto: inputText, caracteres: inputText.length })}
                  />
                  <label htmlFor="text-rate">Velocidad: {textRate.toFixed(2)}x</label>
                  <input id="text-rate" type="range" min="0.5" max="2" step="0.1" value={textRate} onChange={(event) => setTextRate(Number(event.target.value))} />
                </div>
              </div>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ingresa aquí el texto que deseas escuchar..."
              className="text-input"
              rows="8"
            />
          </div>

          {textData && (
            <div className="native-reader" aria-live="polite">
              <div className="native-reader-header">
                <h3>Texto escrito</h3>
                <p>Caracteres: <strong>{textData.caracteres}</strong></p>
              </div>
              {!speechSupported && <p className="native-reader-warning">Este navegador no ofrece síntesis de voz.</p>}
              <p className="native-reader-preview">{textData.texto}</p>
            </div>
          )}

          <section className="image-reader-section" aria-labelledby="image-reader-title">
            <div className="image-reader-heading">
              <h2 id="image-reader-title">Leer una imagen con texto</h2>
              <p>Carga una foto o captura con texto legible. El OCR extraerá las palabras y podrás escucharlas con la voz del navegador.</p>
            </div>
            <ImageFileUploader onFileProcessed={handleImageProcessed} />
            {imageError && <p className="native-reader-warning" role="alert">{imageError}</p>}
            {imageData && (
              <div className="image-reader-result" aria-live="polite">
                <div className="reader-audio-row">
                  <AudioGuideButton text={imageData.texto} rate={imageRate} label="Escuchar texto" />
                  <label htmlFor="image-rate">Velocidad: {imageRate.toFixed(2)}x</label>
                  <input id="image-rate" type="range" min="0.5" max="2" step="0.1" value={imageRate} onChange={(event) => setImageRate(Number(event.target.value))} />
                </div>
                <p className="native-reader-preview">{imageData.texto}</p>
              </div>
            )}
          </section>

          {!textData && !imageData && !inputText && (
            <div className="empty-state">
              <p>
                Ingresa texto directamente para empezar a escuchar su contenido en voz alta
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
