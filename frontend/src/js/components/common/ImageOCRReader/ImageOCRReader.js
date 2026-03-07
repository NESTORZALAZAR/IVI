import { useState, useEffect, useRef, useCallback } from "react";
import "./ImageOCRReader.css";

// Carga Tesseract de forma lazy para no bloquear el inicio
let tesseractWorker = null;
let workerReady = false;
let workerLoading = false;
const workerReadyCallbacks = [];

async function getWorker() {
  if (workerReady) return tesseractWorker;
  if (workerLoading) {
    return new Promise((resolve) => workerReadyCallbacks.push(resolve));
  }

  workerLoading = true;

  const { createWorker } = await import("tesseract.js");
  tesseractWorker = await createWorker("spa", 1, {
    // Logger silencioso, solo errores
    logger: () => {},
  });

  workerReady = true;
  workerLoading = false;
  workerReadyCallbacks.forEach((cb) => cb(tesseractWorker));
  workerReadyCallbacks.length = 0;

  return tesseractWorker;
}

// ─── Síntesis de voz ─────────────────────────────────────────────────────────
function speakText(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const spanishVoice =
    voices.find((v) => v.lang === "es-ES" && v.localService) ||
    voices.find((v) => v.lang.startsWith("es"));
  if (spanishVoice) utterance.voice = spanishVoice;

  window.speechSynthesis.speak(utterance);
}

// ─── Componente ──────────────────────────────────────────────────────────────
export default function ImageOCRReader() {
  const [btn, setBtn] = useState({ visible: false, x: 0, y: 0, img: null });
  const [status, setStatus] = useState("idle"); // idle | loading | done | error | empty
  const [resultText, setResultText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const hideTimer = useRef(null);
  const currentImg = useRef(null);

  const clearHideTimer = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  const scheduleHide = useCallback(() => {
    hideTimer.current = setTimeout(() => {
      setBtn((prev) => ({ ...prev, visible: false }));
      setStatus("idle");
      setResultText("");
      setSpeaking(false);
    }, 300);
  }, []);

  // ── Mostrar botón al pasar el mouse sobre una imagen ──────────────────────
  useEffect(() => {
    const handleMouseOver = (e) => {
      const img = e.target.closest("img");
      if (!img) return;

      // Ignorar imágenes muy pequeñas (iconos)
      if (img.naturalWidth < 40 || img.naturalHeight < 40) return;

      clearHideTimer();
      currentImg.current = img;

      const rect = img.getBoundingClientRect();
      const x = rect.left + rect.width / 2 + window.scrollX;
      const y = rect.top + window.scrollY + 8;

      setBtn({ visible: true, x, y, img });
      setStatus("idle");
      setResultText("");
      setSpeaking(false);
    };

    const handleMouseOut = (e) => {
      const img = e.target.closest("img");
      if (!img) return;
      // No ocultar si el mouse va al propio popup
      if (e.relatedTarget && e.relatedTarget.closest(".ocr-popup")) return;
      scheduleHide();
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [scheduleHide]);

  // ── OCR + TTS ─────────────────────────────────────────────────────────────
  const handleRead = async () => {
    if (!btn.img) return;
    if (status === "loading") return;

    // Si ya tenemos texto, solo volver a leer
    if (status === "done" && resultText) {
      speakText(resultText);
      setSpeaking(true);
      return;
    }

    setStatus("loading");
    setResultText("");
    setSpeaking(false);

    try {
      // Convertir imagen a canvas para evitar problemas CORS con imágenes locales
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = btn.img.naturalWidth || btn.img.width;
      canvas.height = btn.img.naturalHeight || btn.img.height;
      ctx.drawImage(btn.img, 0, 0);

      const imageData = canvas.toDataURL("image/png");
      const worker = await getWorker();
      const { data } = await worker.recognize(imageData);
      const text = data.text.trim();

      if (!text || text.length < 3) {
        setStatus("empty");
        return;
      }

      setResultText(text);
      setStatus("done");
      speakText(text);
      setSpeaking(true);

    } catch (err) {
      console.warn("[OCR] Error al procesar imagen:", err);
      setStatus("error");
    }
  };

  const handleStop = (e) => {
    e.stopPropagation();
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  if (!btn.visible) return null;

  const statusLabel = {
    idle: "📷 Leer imagen",
    loading: "🔍 Analizando...",
    done: speaking ? "⏹ Detener" : "🔊 Leer de nuevo",
    empty: "❌ Sin texto",
    error: "⚠️ Error CORS",
  };

  return (
    <div
      className="ocr-popup"
      style={{ left: btn.x, top: btn.y }}
      onMouseEnter={clearHideTimer}
      onMouseLeave={scheduleHide}
      role="dialog"
      aria-label="Leer texto de imagen"
    >
      <button
        className={`ocr-btn ${status === "loading" ? "ocr-loading" : ""} ${status === "done" && speaking ? "ocr-speaking" : ""}`}
        onClick={speaking ? handleStop : handleRead}
        disabled={status === "loading" || status === "empty"}
        aria-label={statusLabel[status]}
        title={statusLabel[status]}
      >
        <span className="ocr-icon">
          {status === "loading" ? (
            <span className="ocr-spinner" />
          ) : status === "done" && speaking ? (
            "⏹"
          ) : status === "done" ? (
            "🔊"
          ) : status === "empty" ? (
            "❌"
          ) : status === "error" ? (
            "⚠️"
          ) : (
            "📷"
          )}
        </span>
        <span className="ocr-label">{statusLabel[status]}</span>
      </button>

      {status === "error" && (
        <span className="ocr-hint">Imagen con restricción CORS</span>
      )}
      {status === "empty" && (
        <span className="ocr-hint">No se encontró texto</span>
      )}
      {status === "done" && resultText && (
        <div className="ocr-preview" title={resultText}>
          "{resultText.length > 60 ? resultText.slice(0, 60) + "…" : resultText}"
        </div>
      )}
    </div>
  );
}
