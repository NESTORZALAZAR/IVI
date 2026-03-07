import { useState, useEffect, useRef, useCallback } from "react";
import "./TextToSpeechPopup.css";

// ─── Detección de capacidades del navegador ────────────────────────────────
const isSpeechSupported = () =>
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  "SpeechSynthesisUtterance" in window;

// Safari no implementa pause/resume correctamente
const isSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Firefox en Android tiene soporte muy limitado
const isFirefoxAndroid = () =>
  /Firefox/.test(navigator.userAgent) && /Android/.test(navigator.userAgent);

// Obtener la mejor voz en español disponible (con fallback)
const getBestSpanishVoice = () => {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Prioridad: es-ES local > es-* local > es-ES online > es-* online > cualquiera
  return (
    voices.find((v) => v.lang === "es-ES" && v.localService) ||
    voices.find((v) => v.lang.startsWith("es") && v.localService) ||
    voices.find((v) => v.lang === "es-ES") ||
    voices.find((v) => v.lang.startsWith("es")) ||
    null
  );
};

// ─── Componente ───────────────────────────────────────────────────────────
export default function TextToSpeechPopup() {
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0, text: "" });
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const utteranceRef = useRef(null);
  // Safari no soporta pause/resume — lo deshabilitamos
  const canPause = !isSafari() && !isFirefoxAndroid();
  // Chrome tiene un bug conocido: speechSynthesis se detiene en textos largos
  const isChromium = () =>
    /Chrome|Chromium|OPR|Edg/.test(navigator.userAgent) && !isSafari();
  const keepAliveRef = useRef(null);

  // ── Workaround para el bug de Chrome que pausa sola la síntesis ──────────
  const startKeepAlive = useCallback(() => {
    if (!isChromium()) return;
    keepAliveRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  }, []);

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
    stopKeepAlive();
    if (isSpeechSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  }, [stopKeepAlive]);

  // Verificar soporte al montar
  useEffect(() => {
    if (!isSpeechSupported()) {
      setUnsupported(true);
    }
  }, []);

  // ── Listeners de selección de texto ─────────────────────────────────────
  useEffect(() => {
    if (unsupported) return;

    const handleMouseUp = (e) => {
      if (e.target.closest(".tts-popup")) return;

      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection ? selection.toString().trim() : "";

        if (!selectedText || selectedText.length < 2) {
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
        if (!selectedText || selectedText.length < 2) {
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
          if (isSpeechSupported() && window.speechSynthesis.speaking)
            window.speechSynthesis.cancel();
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
  const handleSpeak = () => {
    if (!popup.text || !isSpeechSupported()) return;

    // Pausar (solo en navegadores que lo soportan)
    if (speaking && !paused && canPause) {
      window.speechSynthesis.pause();
      setPaused(true);
      stopKeepAlive();
      return;
    }

    // Reanudar
    if (paused && canPause) {
      window.speechSynthesis.resume();
      setPaused(false);
      startKeepAlive();
      return;
    }

    // Si Safari está "hablando" (no puede pausar), detener y relanzar
    if (speaking && !canPause) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setPaused(false);
      stopKeepAlive();
      return;
    }

    // Cancelar síntesis anterior
    window.speechSynthesis.cancel();
    stopKeepAlive();

    const utterance = new SpeechSynthesisUtterance(popup.text);
    utterance.lang = "es-ES";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    // Esperar a que las voces carguen (necesario en algunos navegadores)
    const assignVoiceAndSpeak = () => {
      const voice = getBestSpanishVoice();
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        setSpeaking(true);
        startKeepAlive();
      };
      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
        stopKeepAlive();
      };
      utterance.onerror = (evt) => {
        // "interrupted" no es un error real (ocurre al cancelar manualmente)
        if (evt.error !== "interrupted" && evt.error !== "canceled") {
          console.warn("[TTS] Error:", evt.error);
        }
        setSpeaking(false);
        setPaused(false);
        stopKeepAlive();
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    // Firefox y algunos navegadores necesitan que las voces estén listas
    if (window.speechSynthesis.getVoices().length > 0) {
      assignVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        assignVoiceAndSpeak();
      };
      // Fallback: si onvoiceschanged no dispara (Safari iOS)
      setTimeout(assignVoiceAndSpeak, 250);
    }
  };

  const handleStop = (e) => {
    e.stopPropagation();
    window.speechSynthesis.cancel();
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
