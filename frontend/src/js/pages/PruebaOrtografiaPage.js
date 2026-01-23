import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/pages/PruebaPage.css";

const PALABRAS_ORTOGRAFIA = [
  {
    palabra_incorrecta: "cabesza",
    palabra_correcta: "cabeza",
    opciones: ["cabesza", "cabeza", "cabesa", "cabeza"],
    correcta: 1
  },
  {
    palabra_incorrecta: "ocacion",
    palabra_correcta: "ocasión",
    opciones: ["ocacion", "ocasión", "ocassion", "ocassión"],
    correcta: 1
  },
  {
    palabra_incorrecta: "exeso",
    palabra_correcta: "exceso",
    opciones: ["exeso", "exceso", "excesso", "exesso"],
    correcta: 1
  },
  {
    palabra_incorrecta: "atravez",
    palabra_correcta: "a través",
    opciones: ["atravez", "através", "a través", "atras vez"],
    correcta: 2
  },
  {
    palabra_incorrecta: "despacio",
    palabra_correcta: "despacio",
    opciones: ["despasio", "despacio", "despachio", "despació"],
    correcta: 1
  },
  {
    palabra_incorrecta: "inclusión",
    palabra_correcta: "inclusión",
    opciones: ["inclusión", "inclución", "inlcusión", "inclución"],
    correcta: 0
  },
  {
    palabra_incorrecta: "exepción",
    palabra_correcta: "excepción",
    opciones: ["exepción", "excepción", "execión", "exceción"],
    correcta: 1
  },
  {
    palabra_incorrecta: "satisfacción",
    palabra_correcta: "satisfacción",
    opciones: ["satisfación", "satisfacción", "satisacción", "satisfasción"],
    correcta: 1
  }
];

export default function PruebaOrtografiaPage() {
  const navigate = useNavigate();
  const [tiempoInicio] = useState(Date.now());
  const [indiceActual, setIndiceActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const palabraActual = PALABRAS_ORTOGRAFIA[indiceActual];
  const todasRespondidas = Object.keys(respuestas).length === PALABRAS_ORTOGRAFIA.length;

  const handleRespuesta = (indexOpcion) => {
    setRespuestas({
      ...respuestas,
      [indiceActual]: indexOpcion
    });
    if (indiceActual < PALABRAS_ORTOGRAFIA.length - 1) {
      setTimeout(() => setIndiceActual(indiceActual + 1), 300);
    }
  };

  const handleAnterior = () => {
    if (indiceActual > 0) {
      setIndiceActual(indiceActual - 1);
    }
  };

  const handleSiguiente = () => {
    if (indiceActual < PALABRAS_ORTOGRAFIA.length - 1) {
      setIndiceActual(indiceActual + 1);
    }
  };

  const calcularPuntaje = () => {
    let aciertos = 0;
    PALABRAS_ORTOGRAFIA.forEach((palabra, index) => {
      if (respuestas[index] === palabra.correcta) {
        aciertos++;
      }
    });
    return Math.round((aciertos / PALABRAS_ORTOGRAFIA.length) * 100);
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
          tipo_prueba: "ortografia",
          puntaje: puntaje,
          duracion_segundos: duracion,
          detalles: {
            preguntas_respondidas: Object.keys(respuestas).length,
            total_preguntas: PALABRAS_ORTOGRAFIA.length
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
                {Object.values(respuestas).filter((r, i) => r === PALABRAS_ORTOGRAFIA[i]?.correcta).length} / {PALABRAS_ORTOGRAFIA.length}
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
    <div className="prueba-ortografia">
      <div className="prueba-container">
        <div className="prueba-header">
          <h1>Prueba de Ortografía</h1>
          <div className="prueba-progress">
            <span>Palabra {indiceActual + 1} de {PALABRAS_ORTOGRAFIA.length}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((indiceActual + 1) / PALABRAS_ORTOGRAFIA.length) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="prueba-content">
          <div className="palabra-grande">
            <p className="instruccion">¿Cuál es la forma correcta de escribir?</p>
            <p className="palabra-incorrecta">{palabraActual.palabra_incorrecta}</p>
            
            <div className="opciones-ortografia">
              {palabraActual.opciones.map((opcion, index) => (
                <button
                  key={index}
                  onClick={() => handleRespuesta(index)}
                  className={`opcion-ortografia ${
                    respuestas[indiceActual] === index ? 'seleccionada' : ''
                  }`}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>

          <div className="prueba-actions">
            <button onClick={handleAnterior} disabled={indiceActual === 0} className="btn-anterior">
              ← Anterior
            </button>
            <button onClick={handleSiguiente} disabled={indiceActual === PALABRAS_ORTOGRAFIA.length - 1} className="btn-siguiente">
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
