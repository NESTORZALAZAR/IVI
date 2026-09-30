import { useEffect, useState } from "react";
import ImageFileUploader from "../components/common/ImageFileUploader/ImageFileUploader";
import "./TextReaderPage.css";

export default function TextReaderPage() {
  const [processedData, setProcessedData] = useState(null);
  const [inputText, setInputText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [imageError, setImageError] = useState("");
  const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  useEffect(() => () => {
    if (speechSupported) window.speechSynthesis.cancel();
  }, [speechSupported]);

  const handleTextSubmit = () => {
    if (!inputText.trim()) {
      alert("Por favor ingresa algún texto");
      return;
    }

    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    setProcessedData({ texto: inputText, caracteres: inputText.length });
    setIsPaused(false);
    setIsSpeaking(false);
  };

  const handleSpeak = () => {
    if (!processedData?.texto || !speechSupported) return;

    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(processedData.texto);
    utterance.lang = "es-ES";
    utterance.rate = rate;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); };
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false); };
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleStop = () => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleImageProcessed = ({ texto, caracteres }) => {
    if (!texto?.trim()) {
      setImageError("No se encontró texto legible. Carga una imagen que contenga palabras claras.");
      return;
    }

    window.speechSynthesis.cancel();
    setImageError("");
    setInputText(texto);
    setProcessedData({ texto, caracteres });
    setIsSpeaking(false);
    setIsPaused(false);
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
                <h3>✏️ Escribe o Pega tu Texto</h3>
                <button
                  onClick={handleTextSubmit}
                  disabled={!inputText.trim()}
                  className="btn-submit"
                >
                  Preparar lectura
                </button>
              </div>
              <div className="text-input-actions">
                <span className="character-count">Caracteres: {inputText.length}</span>
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

          <section className="image-reader-section" aria-labelledby="image-reader-title">
            <div className="image-reader-heading">
              <h2 id="image-reader-title">Leer una imagen con texto</h2>
              <p>Carga una foto o captura con texto legible. El OCR extraerá las palabras y podrás escucharlas con la voz del navegador.</p>
            </div>
            <ImageFileUploader onFileProcessed={handleImageProcessed} />
            {imageError && <p className="native-reader-warning" role="alert">{imageError}</p>}
          </section>

          {processedData && (
            <div className="native-reader" aria-live="polite">
              <div className="native-reader-header">
                <h3>Lectura nativa del navegador</h3>
                <p>Caracteres: <strong>{processedData.caracteres}</strong></p>
              </div>
              {!speechSupported && <p className="native-reader-warning">Este navegador no ofrece síntesis de voz.</p>}
              <div className="native-reader-controls">
                <button onClick={handleSpeak} disabled={!speechSupported} className="btn-submit">
                  {isSpeaking && !isPaused ? "Pausar" : isPaused ? "Reanudar" : "Escuchar"}
                </button>
                <button onClick={handleStop} disabled={!isSpeaking} className="native-stop-button">Detener</button>
                <label htmlFor="native-rate">Velocidad: {rate.toFixed(2)}x</label>
                <input id="native-rate" type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
              </div>
              <p className="native-reader-preview">{processedData.texto}</p>
            </div>
          )}

          {!processedData && !inputText && (
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
