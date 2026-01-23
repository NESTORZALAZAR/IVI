import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/pages/PruebaPage.css";

const TEXTOS_LECTURA = [
  {
    id: 1,
    titulo: "El Aprendizaje en la Era Digital",
    texto: `En los últimos años, la educación ha experimentado una transformación significativa con 
la llegada de la tecnología digital. Los estudiantes ahora tienen acceso a una cantidad 
sin precedentes de información, recursos educativos y plataformas de aprendizaje online.

Sin embargo, esta abundancia de recursos también presenta nuevos desafíos. La capacidad 
de discernimiento y selección de fuentes confiables se ha vuelto crucial. Los educadores 
deben adaptar sus metodologías para preparar a los estudiantes no solo para consumir 
información, sino para analizarla críticamente.

El aprendizaje colaborativo en línea ha abierto oportunidades para estudiantes de 
diferentes geografías y contextos económicos. Plataformas como aulas virtuales permiten 
la interacción sincrónica y asincrónica, adaptándose a ritmos individuales de aprendizaje.

A pesar de estos avances, es importante no perder de vista los beneficios del aprendizaje 
presencial. La interacción cara a cara, la mentoría directa y el contacto humano siguen 
siendo elementos irreemplazables en el proceso educativo.`,
    preguntas: [
      {
        pregunta: "¿Cuál es el tema principal del texto?",
        opciones: [
          "La transformación de la educación con tecnología digital",
          "Los problemas de Internet en las escuelas",
          "El fin de la educación presencial",
          "Las desventajas del aprendizaje en línea"
        ],
        correcta: 0
      },
      {
        pregunta: "¿Qué desafío menciona el texto sobre la abundancia de recursos?",
        opciones: [
          "Que son muy caros",
          "Que son difíciles de usar",
          "La capacidad de discernimiento y selección de fuentes confiables",
          "Que no hay suficientes recursos"
        ],
        correcta: 2
      },
      {
        pregunta: "¿Cuál de las siguientes NO es mencionada como ventaja del aprendizaje en línea?",
        opciones: [
          "Acceso a información sin precedentes",
          "Aprendizaje colaborativo entre diferentes geografías",
          "Eliminación total de la educación presencial",
          "Interacción sincrónica y asincrónica"
        ],
        correcta: 2
      }
    ]
  }
];

export default function PruebaLecturaPage() {
  const navigate = useNavigate();
  const [tiempoInicio] = useState(Date.now());
  const [indiceTexto, setIndiceTexto] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const textoActual = TEXTOS_LECTURA[indiceTexto];

  const handleRespuesta = (indexPregunta, indexOpcion) => {
    setRespuestas({
      ...respuestas,
      [indexPregunta]: indexOpcion
    });
  };

  const calcularPuntaje = () => {
    let aciertos = 0;
    textoActual.preguntas.forEach((pregunta, index) => {
      if (respuestas[index] === pregunta.correcta) {
        aciertos++;
      }
    });
    return Math.round((aciertos / textoActual.preguntas.length) * 100);
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
          tipo_prueba: "lectura",
          puntaje: puntaje,
          duracion_segundos: duracion,
          detalles: {
            preguntas_respondidas: Object.keys(respuestas).length,
            total_preguntas: textoActual.preguntas.length
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
                {Object.values(respuestas).filter((r, i) => r === textoActual.preguntas[i]?.correcta).length} / {textoActual.preguntas.length}
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
    <div className="prueba-lectura">
      <div className="prueba-container">
        <div className="prueba-header">
          <h1>Prueba de Lectura</h1>
          <div className="prueba-progress">
            <span>Texto {indiceTexto + 1} de {TEXTOS_LECTURA.length}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((indiceTexto + 1) / TEXTOS_LECTURA.length) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="prueba-content">
          <div className="texto-lectura">
            <h2>{textoActual.titulo}</h2>
            <p>{textoActual.texto}</p>
          </div>

          <div className="preguntas-section">
            <h3>Preguntas de Comprensión</h3>
            {textoActual.preguntas.map((pregunta, indexPregunta) => (
              <div key={indexPregunta} className="pregunta-card">
                <p className="pregunta-text">
                  {indexPregunta + 1}. {pregunta.pregunta}
                </p>
                <div className="opciones">
                  {pregunta.opciones.map((opcion, indexOpcion) => (
                    <label key={indexOpcion} className="opcion">
                      <input
                        type="radio"
                        name={`pregunta-${indexPregunta}`}
                        checked={respuestas[indexPregunta] === indexOpcion}
                        onChange={() => handleRespuesta(indexPregunta, indexOpcion)}
                      />
                      <span>{opcion}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="prueba-actions">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(respuestas).length < textoActual.preguntas.length || guardando}
              className="btn-submit"
            >
              {guardando ? "Guardando..." : "Enviar Respuestas"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
