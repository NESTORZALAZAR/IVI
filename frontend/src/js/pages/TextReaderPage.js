import { useState } from "react";
import AudioPlayer from "../components/common/AudioPlayer/AudioPlayer";
import "./TextReaderPage.css";

export default function TextReaderPage() {
  const [processedData, setProcessedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleTextSubmit = async () => {
    if (!inputText.trim()) {
      alert("Por favor ingresa algún texto");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/lector/extract-and-speak/", {
        method: "POST",
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Convertir el audio hex a blob
      const hex = data.audio;
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      setProcessedData({
        audio: audioUrl,
        texto: inputText,
        caracteres: inputText.length
      });
    } catch (error) {
      console.error("Error:", error);
      alert(`Error al procesar el texto: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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
                  disabled={isLoading || !inputText.trim()}
                  className="btn-submit"
                >
                  {isLoading ? "Procesando..." : "Escuchar Texto"}
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
              disabled={isLoading}
              rows="8"
            />
          </div>

          {processedData && (
            <AudioPlayer
              audioUrl={processedData.audio}
              texto={processedData.texto}
              caracteres={processedData.caracteres}
            />
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
