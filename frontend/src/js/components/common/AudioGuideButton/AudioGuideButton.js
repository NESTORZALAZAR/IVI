import { useEffect, useRef, useState } from "react";
import "./AudioGuideButton.css";

export default function AudioGuideButton({ text, rate = 0.95, onStart, label = "Escuchar esta guía" }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState("");
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [rate, text]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const handleAudio = async () => {
    if (!text?.trim()) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    onStart?.();
    setError("");
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setError("Este navegador no ofrece lectura en voz alta");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = rate;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setError("No se pudo reproducir la lectura");
      setIsSpeaking(false);
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <button
      type="button"
      className={`audio-note ${isSpeaking ? "is-speaking" : ""}`}
      onClick={handleAudio}
      disabled={!text?.trim()}
      aria-pressed={isSpeaking}
      aria-busy="false"
      aria-label={isSpeaking ? "Detener lectura" : label}
      title={error || label}
    >
      <span aria-hidden="true">{isSpeaking ? "■" : "◖"}</span>
      <strong>{isSpeaking ? "Detener lectura" : label}</strong>
    </button>
  );
}
