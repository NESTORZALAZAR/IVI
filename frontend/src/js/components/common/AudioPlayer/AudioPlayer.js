import { useState, useRef, useEffect } from "react";
import "./AudioPlayer.css";

export default function AudioPlayer({ audioUrl, texto, caracteres }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [velocity, setVelocity] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const handleVelocityChange = (e) => {
    const newVelocity = parseFloat(e.target.value);
    setVelocity(newVelocity);
    if (audioRef.current) {
      audioRef.current.playbackRate = newVelocity;
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={audioUrl} />

      <div className="player-header">
        <h3>🔊 Reproductor de Audio</h3>
        <p className="document-info">
          Caracteres extraídos: <strong>{caracteres}</strong>
        </p>
      </div>

      <div className="player-controls">
        <button
          className={`play-button ${isPlaying ? "playing" : ""}`}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pausar" : "Reproducir"}
          title={isPlaying ? "Pausar" : "Reproducir"}
        >
          {isPlaying ? "⏸ Pausar" : "▶ Reproducir"}
        </button>

        <button
          className="stop-button"
          onClick={handleStop}
          aria-label="Detener"
          title="Detener"
        >
          ⏹ Detener
        </button>

        <div className="velocity-control">
          <label htmlFor="velocity-slider">Velocidad:</label>
          <input
            id="velocity-slider"
            type="range"
            min="0.5"
            max="2"
            step="0.25"
            value={velocity}
            onChange={handleVelocityChange}
            aria-label="Ajustar velocidad de reproducción"
          />
          <span className="velocity-value">{velocity.toFixed(2)}x</span>
        </div>
      </div>

      <div className="progress-container">
        <span className="time-display">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <div className="progress-bar-wrapper">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
              const newTime = parseFloat(e.target.value);
              if (audioRef.current) {
                audioRef.current.currentTime = newTime;
                setCurrentTime(newTime);
              }
            }}
            className="progress-bar"
            aria-label="Barra de progreso"
          />
        </div>
      </div>

      <div className="text-preview">
        <h4>📝 Vista previa del texto extraído:</h4>
        <div className="text-content">
          {texto.substring(0, 500)}
          {texto.length > 500 && "..."}
        </div>
      </div>
    </div>
  );
}
