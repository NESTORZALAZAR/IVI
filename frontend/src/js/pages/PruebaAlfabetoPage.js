import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/pages/PruebaPage.css";

const PREGUNTAS = [
  { pregunta: "Escucha o lee las siguientes opciones. ¿Cuál de ellas es una LETRA?", opciones: ["4", "8", "M", "2"], correcta: 2 }, 
  { pregunta: "Ahora, observa estas opciones. ¿Cuál de ellas es un NÚMERO?", opciones: ["7", "P", "L", "S"], correcta: 0 },
  { pregunta: "Si decimos el abecedario: A, B, C, D..., ¿Qué letra sigue a continuación?", opciones: ["Z", "E", "M", "X"], correcta: 1 },
  { pregunta: "¿Cuál es la letra MINÚSCULA de la A mayúscula?", opciones: ["e", "o", "a", "u"], correcta: 2 },
  { pregunta: "¿Cuál de los siguientes grupos está formado SOLO por vocales?", opciones: ["A-E-I", "P-L-M", "1-2-3", "B-C-D"], correcta: 0 },
  { pregunta: "Si contamos del 1 al 5, ¿qué número va justo DESPUÉS del 3?", opciones: ["2", "4", "8", "1"], correcta: 1 },
  { pregunta: "De los siguientes números, ¿cuál representa la cantidad MAYOR (el más grande)?", opciones: ["2", "9", "4", "1"], correcta: 1 },
  { pregunta: "Si juntamos la letra M con la vocal A, ¿qué sonido se forma?", opciones: ["PE", "LA", "MA", "SO"], correcta: 2 },
  { pregunta: "Escucha con atención: ¿Con qué vocal TERMINA la palabra O - S - O?", opciones: ["A", "E", "I", "O"], correcta: 3 },
  { pregunta: "Observa estas palabras. ¿Cuál de ellas es la más CORTA?", opciones: ["MARIPOSA", "ELEFANTE", "PAN", "CARAMELO"], correcta: 2 }
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
    <div className="prueba-lectura prueba-alfabeto">
      <div className="prueba-container">
        <div className="prueba-header">
          <h1>Conocimiento del Alfabeto</h1>
          <h2>Responde las preguntas sobre las letras y su orden.</h2>
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