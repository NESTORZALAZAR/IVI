import { useEffect, useRef, useState } from "react";
import { generateAudioFromText } from "../../../services/audioService";
import "./AudioGuideButton.css";

export default function AudioGuideButton({ text, rate = 0.95, onStart, label = "Escuchar esta guía" }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, [rate]);

  useEffect(() => () => {
    audioRef.current?.pause();
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
  }, []);

  const createAudio = async () => {
    const url = await generateAudioFromText(text);
    audioUrlRef.current = url;
    const audio = new Audio(url);
    audio.playbackRate = rate;
    audio.onended = () => setIsSpeaking(false);
    audio.onerror = () => setError("No se pudo reproducir el audio");
    audioRef.current = audio;
  };

  const handleAudio = async () => {
    if (!text?.trim() || isLoading) return;

    if (isSpeaking) {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      setIsSpeaking(false);
      return;
    }

    onStart?.();
    setError("");
    setIsLoading(true);
    try {
      if (!audioRef.current) await createAudio();
      audioRef.current.playbackRate = rate;
      await audioRef.current.play();
      setIsSpeaking(true);
    } catch (audioError) {
      setError(audioError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`audio-note ${isSpeaking ? "is-speaking" : ""}`}
      onClick={handleAudio}
      disabled={isLoading || !text?.trim()}
      aria-pressed={isSpeaking}
      aria-busy={isLoading}
      aria-label={isLoading ? "Generando audio" : isSpeaking ? "Detener lectura" : label}
      title={error || label}
    >
      <span aria-hidden="true">{isSpeaking ? "■" : "◖"}</span>
      <strong>{isLoading ? "Generando audio..." : isSpeaking ? "Detener lectura" : label}</strong>
    </button>
  );
}
