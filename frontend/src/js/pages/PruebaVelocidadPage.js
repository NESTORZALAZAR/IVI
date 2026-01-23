import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/pages/PruebaPage.css";

const PALABRAS_VELOCIDAD = [
  "gato", "casa", "libro", "computadora", "montaña", "río", "sol", "nube",
  "tierra", "mar", "árbol", "flor", "pájaro", "agua", "fuego", "viento",
  "nieve", "lluvia", "trueno", "relámpago", "niño", "niña", "hombre", "mujer",
  "padre", "madre", "hermano", "hermana", "amigo", "amiga", "maestro", "estudiante"
];

export default function PruebaVelocidadPage() {
  const navigate = useNavigate();
  const [tiempoInicio, setTiempoInicio] = useState(Date.now());
  const [palabrasLeidas, setPalabrasLeidas] = useState(0);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const [corriendo, setCorriendo] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  useEffect(() => {
    if (!corriendo) return;

    const interval = setInterval(() => {
      setTiempoTranscurrido(Math.floor((Date.now() - tiempoInicio) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [corriendo, tiempoInicio]);

  const calcularVelocidad = () => {
    const minutos = tiempoTranscurrido / 60 || 1;
    return Math.round(palabrasLeidas / minutos);
  };

  const handlePalabra = () => {
    setPalabrasLeidas(palabrasLeidas + 1);
  };

  const handleDetener = async () => {
    setCorriendo(false);
    const velocidad = calcularVelocidad();
    
    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/resultados/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo_prueba: "velocidad",
          puntaje: Math.min(velocidad, 100),
          duracion_segundos: tiempoTranscurrido,
          detalles: {
            palabras_leidas: palabrasLeidas,
            velocidad_ppm: velocidad
          }
        }),
      });

      if (response.ok) {
        setMostrarResultados(true);
      }
    } catch (error) {
      console.error("Error al guardar resultado:", error);
    } finally {
      setGuardando(false);
    }
  };

  if (mostrarResultados) {
    const velocidad = calcularVelocidad();
    const desempenio = velocidad > 200 ? "excelente" : velocidad > 150 ? "bueno" : "necesita-mejorar";
    
    return (
      <div className="prueba-resultado">
        <div className="resultado-container">
          <div className={`resultado-score ${desempenio}`}>
            <h1>¡Prueba Completada!</h1>
            <div className="score-circle">{velocidad} <span className="score-unit">ppm</span></div>
            <p className="score-text">
              {velocidad > 200 ? "¡Velocidad excelente!" : velocidad > 150 ? "Buena velocidad" : "Sigue practicando"}
            </p>
          </div>
          <div className="resultado-stats">
            <div className="stat">
              <span className="stat-label">Palabras Leídas</span>
              <span className="stat-value">{palabrasLeidas}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Velocidad (ppm)</span>
              <span className="stat-value">{velocidad}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Tiempo</span>
              <span className="stat-value">{tiempoTranscurrido}s</span>
            </div>
          </div>
          <button onClick={() => navigate("/resultados")} className="btn-resultados">
            Ver mis resultados
          </button>
          <button onClick={() => navigate("/pruebas")} className="btn-volver">
            Volver a pruebas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="prueba-velocidad">
      <div className="prueba-container">
        <div className="prueba-header">
          <h1>Prueba de Velocidad de Lectura</h1>
          <p>Haz clic en cada palabra conforme la lees</p>
        </div>

        <div className="prueba-content">
          <div className="contador-velocidad">
            <div className="contador-item">
              <span className="contador-label">Tiempo</span>
              <span className="contador-valor">{tiempoTranscurrido}s</span>
            </div>
            <div className="contador-item">
              <span className="contador-label">Palabras</span>
              <span className="contador-valor">{palabrasLeidas}</span>
            </div>
            <div className="contador-item">
              <span className="contador-label">Velocidad</span>
              <span className="contador-valor">{calcularVelocidad()} ppm</span>
            </div>
          </div>

          <div className="palabras-container">
            {PALABRAS_VELOCIDAD.map((palabra, index) => (
              <button
                key={index}
                className="palabra-btn"
                onClick={handlePalabra}
              >
                {palabra}
              </button>
            ))}
          </div>

          <div className="prueba-actions">
            <button
              onClick={handleDetener}
              disabled={guardando}
              className="btn-detener"
            >
              {guardando ? "Guardando..." : "Detener y Enviar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
