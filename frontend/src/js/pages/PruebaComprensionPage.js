import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/pages/PruebaPage.css";

const PREGUNTAS_COMPRENSION = [
  {
    pregunta: "¿Cuál es la capital de Francia?",
    opciones: ["Londres", "Berlín", "París", "Madrid"],
    correcta: 2
  },
  {
    pregunta: "¿En qué año termina la Segunda Guerra Mundial?",
    opciones: ["1943", "1944", "1945", "1946"],
    correcta: 2
  },
  {
    pregunta: "¿Cuál es el planeta más grande del sistema solar?",
    opciones: ["Saturno", "Júpiter", "Neptuno", "Urano"],
    correcta: 1
  },
  {
    pregunta: "¿Cuál es el océano más profundo?",
    opciones: ["Atlántico", "Índico", "Pacífico", "Ártico"],
    correcta: 2
  },
  {
    pregunta: "¿Cuántas continentes hay en el mundo?",
    opciones: ["5", "6", "7", "8"],
    correcta: 2
  },
  {
    pregunta: "¿Cuál es el mineral más duro conocido?",
    opciones: ["Cuarzo", "Diamante", "Zafiro", "Topacio"],
    correcta: 1
  },
  {
    pregunta: "¿En qué año llegó el hombre a la Luna?",
    opciones: ["1965", "1968", "1969", "1970"],
    correcta: 2
  },
  {
    pregunta: "¿Cuál es la montaña más alta del mundo?",
    opciones: ["K2", "Everest", "Kangchenjunga", "Lhotse"],
    correcta: 1
  }
];

export default function PruebaComprensionPage() {
  const navigate = useNavigate();
  const [tiempoInicio] = useState(Date.now());
  const [indiceActual, setIndiceActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const preguntaActual = PREGUNTAS_COMPRENSION[indiceActual];
  const todasRespondidas = Object.keys(respuestas).length === PREGUNTAS_COMPRENSION.length;

  const handleRespuesta = (indexOpcion) => {
    setRespuestas({
      ...respuestas,
      [indiceActual]: indexOpcion
    });
    if (indiceActual < PREGUNTAS_COMPRENSION.length - 1) {
      setTimeout(() => setIndiceActual(indiceActual + 1), 300);
    }
  };

  const handleAnterior = () => {
    if (indiceActual > 0) {
      setIndiceActual(indiceActual - 1);
    }
  };

  const handleSiguiente = () => {
    if (indiceActual < PREGUNTAS_COMPRENSION.length - 1) {
      setIndiceActual(indiceActual + 1);
    }
  };

  const calcularPuntaje = () => {
    let aciertos = 0;
    PREGUNTAS_COMPRENSION.forEach((pregunta, index) => {
      if (respuestas[index] === pregunta.correcta) {
        aciertos++;
      }
    });
    return Math.round((aciertos / PREGUNTAS_COMPRENSION.length) * 100);
  };

  const handleSubmit = async () => {
    const puntaje = calcularPuntaje();
    const duracion = Math.floor((Date.now() - tiempoInicio) / 1000);
    
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
          tipo_prueba: "comprension",
          puntaje: puntaje,
          duracion_segundos: duracion,
          detalles: {
            preguntas_respondidas: Object.keys(respuestas).length,
            total_preguntas: PREGUNTAS_COMPRENSION.length
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
    const puntaje = calcularPuntaje();
    return (
      <div className="prueba-resultado">
        <div className="resultado-container">
          <div className={`resultado-score ${puntaje >= 80 ? 'excelente' : puntaje >= 60 ? 'bueno' : 'necesita-mejorar'}`}>
            <h1>¡Prueba Completada!</h1>
            <div className="score-circle">{puntaje}%</div>
            <p className="score-text">
              {puntaje >= 80 ? "¡Excelente desempeño!" : puntaje >= 60 ? "Buen trabajo" : "Necesitas practicar más"}
            </p>
          </div>
          <div className="resultado-stats">
            <div className="stat">
              <span className="stat-label">Respuestas Correctas</span>
              <span className="stat-value">
                {Object.values(respuestas).filter((r, i) => r === PREGUNTAS_COMPRENSION[i]?.correcta).length} / {PREGUNTAS_COMPRENSION.length}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Tiempo</span>
              <span className="stat-value">{Math.floor((Date.now() - tiempoInicio) / 1000)}s</span>
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
    <div className="prueba-comprension">
      <div className="prueba-container">
        <div className="prueba-header">
          <h1>Prueba de Comprensión</h1>
          <div className="prueba-progress">
            <span>Pregunta {indiceActual + 1} de {PREGUNTAS_COMPRENSION.length}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((indiceActual + 1) / PREGUNTAS_COMPRENSION.length) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="prueba-content">
          <div className="pregunta-grande">
            <h2>{preguntaActual.pregunta}</h2>
            <div className="opciones-grid">
              {preguntaActual.opciones.map((opcion, index) => (
                <button
                  key={index}
                  onClick={() => handleRespuesta(index)}
                  className={`opcion-btn ${
                    respuestas[indiceActual] === index ? 'seleccionada' : ''
                  }`}
                >
                  {String.fromCharCode(65 + index)}) {opcion}
                </button>
              ))}
            </div>
          </div>

          <div className="prueba-actions">
            <button onClick={handleAnterior} disabled={indiceActual === 0} className="btn-anterior">
              ← Anterior
            </button>
            <button onClick={handleSiguiente} disabled={indiceActual === PREGUNTAS_COMPRENSION.length - 1} className="btn-siguiente">
              Siguiente →
            </button>
          </div>

          {todasRespondidas && (
            <button onClick={handleSubmit} disabled={guardando} className="btn-submit">
              {guardando ? "Guardando..." : "Enviar Respuestas"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
