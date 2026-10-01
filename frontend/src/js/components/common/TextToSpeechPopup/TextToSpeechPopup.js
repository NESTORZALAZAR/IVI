import { useState, useEffect, useRef, useCallback } from "react";
import { generateAudioFromText } from "../../../services/audioService";
import "./TextToSpeechPopup.css";

// ─── Detección de capacidades del navegador ────────────────────────────────
const isSpeechSupported = () =>
  typeof window !== "undefined" &&
  typeof window.Audio === "function";

// ─── Componente ───────────────────────────────────────────────────────────
export default function TextToSpeechPopup() {
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0, text: "" });
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);
  const canPause = true;
  const keepAliveRef = useRef(null);
  const speakTimeoutRef = useRef(null);

  const stopKeepAlive = useCallback(() => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  }, []);

  const hidePopup = useCallback(() => {
    setPopup({ visible: false, x: 0, y: 0, text: "" });
    setSpeaking(false);
    setPaused(false);
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }
    audioRef.current?.pause();
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    stopKeepAlive();
  }, [stopKeepAlive]);

  // Verificar soporte al montar
  useEffect(() => {
    if (!isSpeechSupported()) {
      setUnsupported(true);
    }
  }, []);

  useEffect(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = null;
    setSpeaking(false);
    setPaused(false);
  }, [popup.text]);

  // ── Listeners de selección de texto ─────────────────────────────────────
  useEffect(() => {
    if (unsupported) return;

    const handleMouseUp = (e) => {
      if (e.target.closest(".tts-popup")) return;

      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection ? selection.toString().trim() : "";

        if (!selectedText) {
          setPopup((prev) => ({ ...prev, visible: false }));
          return;
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const x = rect.left + rect.width / 2 + window.scrollX;
        const y = rect.top + window.scrollY - 12;

        setPopup({ visible: true, x, y, text: selectedText });
        setSpeaking(false);
        setPaused(false);
      }, 10);
    };

    // Soporte táctil (móviles / tablets)
    const handleTouchEnd = (e) => {
      if (e.target.closest(".tts-popup")) return;
      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection ? selection.toString().trim() : "";
        if (!selectedText) {
          setPopup((prev) => ({ ...prev, visible: false }));
          return;
        }
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const x = rect.left + rect.width / 2 + window.scrollX;
        const y = rect.top + window.scrollY - 12;
        setPopup({ visible: true, x, y, text: selectedText });
        setSpeaking(false);
        setPaused(false);
      }, 150); // más tiempo en táctil para que la selección se estabilice
    };

    const handleMouseDown = (e) => {
      if (e.target.closest(".tts-popup")) return;
      setPopup((prev) => {
        if (prev.visible) {
          stopKeepAlive();
          setSpeaking(false);
          setPaused(false);
          return { ...prev, visible: false };
        }
        return prev;
      });
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [unsupported, stopKeepAlive]);

  // ── Lógica de síntesis ───────────────────────────────────────────────────
  const handleSpeak = async () => {
    if (!popup.text || !isSpeechSupported()) return;

    if (speaking && !paused) {
      audioRef.current?.pause();
      setPaused(true);
      return;
    }

    if (paused) {
      await audioRef.current?.play();
      setPaused(false);
      return;
    }

    try {
      if (!audioRef.current) {
        const url = await generateAudioFromText(popup.text);
        audioUrlRef.current = url;
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => {
          setSpeaking(false);
          setPaused(false);
        };
      }
      await audioRef.current.play();
      setSpeaking(true);
      setPaused(false);
    } catch (error) {
      console.warn("[TTS] Error al generar audio:", error);
      setSpeaking(false);
      setPaused(false);
    }
  };

  const handleStop = (e) => {
    e.stopPropagation();
    audioRef.current?.pause();
    setSpeaking(false);
    setPaused(false);
    stopKeepAlive();
    hidePopup();
  };

  // No renderizar nada si el navegador no soporta TTS o el popup está oculto
  if (unsupported || !popup.visible) return null;

  const mainBtnLabel = speaking && !paused
    ? canPause ? "Pausar" : "Detener"
    : paused
    ? "Reanudar"
    : "Leer en voz alta";

  const mainBtnIcon = speaking && !paused
    ? canPause ? "⏸" : "⏹"
    : paused
    ? "▶"
    : "🔊";

  return (
    <div
      className="tts-popup"
      style={{ left: popup.x, top: popup.y }}
      role="dialog"
      aria-label="Leer texto en voz alta"
    >
      <button
        className={`tts-main-btn ${speaking && !paused ? "tts-speaking" : ""}`}
        onClick={handleSpeak}
        title={mainBtnLabel}
        aria-label={mainBtnLabel}
      >
        <span className="tts-icon">{mainBtnIcon}</span>
        <span className="tts-label">{mainBtnLabel}</span>
      </button>

      {/* Botón de detener — solo cuando puede pausar (para no duplicar en Safari) */}
      {(speaking || paused) && canPause && (
        <button
          className="tts-stop-btn"
          onClick={handleStop}
          title="Detener"
          aria-label="Detener lectura"
        >
          ⏹
        </button>
      )}
    </div>
  );
}
