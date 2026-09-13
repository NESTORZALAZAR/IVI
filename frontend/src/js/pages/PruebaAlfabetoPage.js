import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/pages/PruebaPage.css";

const PREGUNTAS = [
  { pregunta: "¿Qué letra viene después de la C?", opciones: ["B", "D", "E", "F"], correcta: 1 },
  { pregunta: "¿Cuál es la primera letra del alfabeto?", opciones: ["A", "E", "I", "O"], correcta: 0 },
  { pregunta: "Completa la secuencia: M, N, __, P", opciones: ["L", "O", "Q", "R"], correcta: 1 },
  { pregunta: "¿Qué letra viene antes de la Z?", opciones: ["X", "Y", "W", "V"], correcta: 1 },
  { pregunta: "¿Cuál de estas letras aparece primero en el alfabeto?", opciones: ["R", "H", "K", "T"], correcta: 1 }
];

export default function PruebaAlfabetoPage() {
  const navigate = useNavigate();
  const [respuestas, setRespuestas] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [puntaje, setPuntaje] = useState(null);

  const handleSubmit = async () => {
    const aciertos = PREGUNTAS.filter((pregunta, index) => respuestas[index] === pregunta.correcta).length;
    const resultado = Math.round((aciertos / PREGUNTAS.length) * 100);
    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      const targetUser = JSON.parse(localStorage.getItem("ivi_office_patient") || "null");
      const response = await fetch("http://localhost:8000/api/resultados/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_prueba: "alfabeto",
          puntaje: resultado,
          duracion_segundos: 0,
          detalles: { total_preguntas: PREGUNTAS.length, respuestas_correctas: aciertos },
          target_user_id: targetUser?.id
        })
      });
      if (response.ok) setPuntaje(resultado);
    } finally {
      setGuardando(false);
    }
  };

  if (puntaje !== null) {
    return (
      <div className="prueba-resultado">
        <div className="resultado-container">
          <div className="resultado-score">
            <h1>¡Filtro completado!</h1>
            <div className="score-circle">{puntaje}%</div>
            <p className="score-text">Resultado del test de conocimiento del alfabeto</p>
          </div>
          <button onClick={() => navigate("/resultados")} className="btn-resultados">Ver mis resultados</button>
          <button onClick={() => navigate("/pruebas")} className="btn-volver">Volver a pruebas</button>
        </div>
      </div>
    );
  }

  return (
    <div className="prueba-lectura">
      <div className="prueba-container">
        <div className="prueba-header">
          <h1>Conocimiento del Alfabeto</h1>
          <p>Responde las preguntas sobre las letras y su orden.</p>
        </div>
        <div className="preguntas-section">
          {PREGUNTAS.map((pregunta, index) => (
            <div key={index} className="pregunta-card">
              <p className="pregunta-text">{index + 1}. {pregunta.pregunta}</p>
              <div className="opciones">
                {pregunta.opciones.map((opcion, opcionIndex) => (
                  <label key={opcion} className="opcion">
                    <input type="radio" name={`pregunta-${index}`} checked={respuestas[index] === opcionIndex} onChange={() => setRespuestas({ ...respuestas, [index]: opcionIndex })} />
                    <span>{opcion}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="prueba-actions">
          <button onClick={handleSubmit} disabled={Object.keys(respuestas).length < PREGUNTAS.length || guardando} className="btn-submit">
            {guardando ? "Guardando..." : "Enviar Respuestas"}
          </button>
        </div>
      </div>
    </div>
  );
}