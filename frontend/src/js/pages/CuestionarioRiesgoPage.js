import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/pages/PruebaPage.css";

const ESCALA = [
  { valor: 0, label: "Nunca" },
  { valor: 1, label: "A veces" },
  { valor: 2, label: "Frecuentemente" },
  { valor: 3, label: "Siempre" },
];

const CUESTIONARIOS = {
  lectura: {
    titulo: "Infancia Temprana (5 a 7 años)",
    subtitulo: "Responde según la forma en que el niño o la niña suele desenvolverse.",
    preguntas: [
"¿El niño presenta dificultades para identificar palabras que riman (ej. 'gato' y 'pato') o para separar palabras en sílabas simples mediante aplausos? ",
"¿Le cuesta pronunciar palabras largas o nuevas, invirtiendo los sonidos dentro de la misma palabra (ej. decir ‘popótamo’ en lugar de ‘hipopótamo’)?",
"¿Muestra dificultad para recordar y repetir secuencias verbales básicas, como los días de la semana, los colores principales o el abecedario en orden? ",
"¿Presenta confusión constante al intentar nombrar las letras del alfabeto, olvidando su nombre o el sonido que producen? ",
"¿Le resulta complejo seguir instrucciones verbales de dos o tres pasos consecutivos (ej. ‘Guarda tu juguete, lávate las manos y ven a comer’)?",
"¿Invierte de forma recurrente números o letras al intentar copiarlos de la pizarra o de un cuaderno? ",
"¿Tiene dificultades para recordar el nombre correcto de objetos cotidianos, utilizando términos genéricos como ‘esa cosa’ o ‘el coso ese’?", 
"¿Le resulta muy difícil reconocer o escribir las letras de su propio nombre en comparación con sus compañeros? ", 
"Cuando intenta escribir o copiar palabras muy sencillas, ¿tiende a omitir letras o a escribirlas en un orden incorrecto? ",
"¿Le resulta muy difícil reconocer o escribir las letras de su propio nombre en comparación con sus compañeros? ",

    ],
  },
  velocidad: {
    titulo: "Desarrollo Lector (8 a 10 años)",
    subtitulo: "Indica con qué frecuencia observas cada situación en la lectura diaria.",
    preguntas: [
"¿Lee de forma muy lenta, silabeando las palabras (ej. ‘pe-lo-ta’ en vez de ‘pelota’), con un ritmo notablemente inferior al de sus compañeros de clase?",
"Al leer en voz alta, ¿tiende a inventar palabras o a adivinar el final de una oración basándose únicamente en las primeras letras o en el contexto?",
"¿Se pierde de renglón con facilidad si no sigue la lectura guiándose con el dedo u otro marcador visual? ",
"¿Invierte o confunde de manera persistente letras simétricas al escribir y leer (específicamente confusiones espaciales como b/d, p/q, o rotaciones como u/n)? ",
"¿Comete errores recurrentes de segmentación en la escritura espontánea, uniendo palabras (‘elperro’) o separándolas de forma incorrecta (‘la ca sa’)?",
"¿Presenta inconsistencia ortográfica severa, llegando a escribir una misma palabra de diferentes maneras dentro de un mismo texto? ",
"¿Tiene dificultades significativas para memorizar las tablas de multiplicar o secuencias matemáticas, a pesar de comprender el concepto lógico? ",
"¿Comprende mucho mejor las lecciones o historias cuando un adulto se las lee en voz alta en lugar de leerlas por sí mismo? ",
"¿Sustituye palabras completas por otras que empiezan con la misma letra pero cambian el sentido de la oración (ej. leer 'camisa' en lugar de 'camino')?",
"Al escribir oraciones cortas de manera espontánea, ¿omite, añade o altera el orden de las letras dentro de una misma palabra? ",

    ],
  },
  comprension: {
    titulo: "Preadolescencia (11 a 14 años)",
    subtitulo: "Valora la frecuencia con que estas dificultades aparecen en el estudio.",
    preguntas: [
"¿Su velocidad de lectura es significativamente lenta y requiere releer un mismo párrafo varias veces para lograr captar la idea principal? ",
"Al leer, ¿omite, añade o sustituye palabras cortas (como ‘de’, ‘el’, ‘por’, ‘en’) alterando el sentido original de la oración? ",
"¿Existe una discrepancia notable entre su alta capacidad para expresarse de manera oral y la pobreza de su expresión escrita (textos cortos, sin cohesión)? ",
"¿Continúa cometiendo faltas de ortografía básicas e inexplicables, incluso en palabras de uso muy frecuente que ya debería dominar? ",
"¿Presenta serias dificultades para resumir un texto escolar, extraer las ideas principales o estructurar un esquema de estudio? ",
"¿Tiene problemas de desorganización en el manejo del tiempo, olvidando frecuentemente fechas de exámenes, entregas de trabajos o los horarios de clase? ",
"¿Le cuesta trabajo aprender vocabulario nuevo o términos técnicos, especialmente en asignaturas como historia, ciencias o idiomas extranjeros? ",
"¿Le cuesta seguir el hilo conductor de instrucciones escritas complejas, como los enunciados largos de los problemas matemáticos? ",
"¿Continúa uniendo palabras de forma incorrecta al escribir (‘elperro’) o fragmentándolas sin sentido (‘la ca sa’)?",
"Al leer en voz alta textos de su nivel escolar, ¿se traba frecuentemente, omite sílabas o cambia el ritmo de lectura de forma brusca? ",

    ],
  },
  ortografia: {
    titulo: "Adolescentes y Adultos (15 años en adelante)",
    subtitulo: "Responde pensando en el desempeño habitual en estudio, trabajo o vida cotidiana.",
    preguntas: [
"¿Necesitas releer un mismo párrafo varias veces para lograr entender la idea principal de un documento, artículo o libro? ",
"¿Te resulta muy difícil tomar apuntes rápidos de forma legible y estructurada mientras escuchas una clase o una exposición oral? ",
"¿Sueles confundir la izquierda con la derecha de forma automática al recibir indicaciones de dirección o al utilizar sistemas de navegación (GPS)? ",
"¿Tienes una tendencia frecuente a olvidar nombres de personas, lugares o palabras específicas cuando estás hablando (el fenómeno de tener la palabra ‘en la punta de la lengua’)?",
"¿Tu velocidad de lectura es considerablemente más lenta de lo esperado y te genera un alto nivel de fatiga mental? ",
"¿Encuentras una gran dificultad para detectar tus propios errores ortográficos o gramaticales al revisar un texto que acabas de escribir? ",
"¿Prefieres abrumadoramente las evaluaciones orales, los debates o las explicaciones verbales por encima de los exámenes escritos o ensayos? ",
"¿Te cuesta llenar formularios impresos o digitales de manera rápida y sin cometer errores en los datos solicitados? ",
"¿Tienes dificultades para aprender secuencias nuevas de información, como números de teléfono, códigos largos o contraseñas? ",
"¿Necesitas mover los labios en silencio o susurrar las palabras para no perder el hilo al leer textos complejos? ",

    ],
  },
};

const obtenerRiesgo = (puntaje) => {
  if (puntaje <= 10) return { nombre: "Riesgo Bajo", clase: "bajo", descripcion: "Desarrollo dentro de los parámetros esperados." };
  if (puntaje <= 20) return { nombre: "Riesgo Moderado", clase: "moderado", descripcion: "Se sugiere observación activa en el entorno escolar y en el hogar." };
  return { nombre: "Riesgo Alto", clase: "alto", descripcion: "La plataforma recomienda una derivación psicopedagógica para evaluación profesional." };
};

export default function CuestionarioRiesgoPage({ tipo }) {
  const navigate = useNavigate();
  const cuestionario = CUESTIONARIOS[tipo];
  const [respuestas, setRespuestas] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [tiempoInicio] = useState(Date.now());

  const responder = (indice, valor) => {
    setRespuestas((actuales) => ({ ...actuales, [indice]: valor }));
  };

  const enviar = async () => {
    const puntaje = Object.values(respuestas).reduce((total, valor) => total + valor, 0);
    const riesgo = obtenerRiesgo(puntaje);
    const respuestasDetalladas = cuestionario.preguntas.map((pregunta, indice) => ({
      pregunta,
      respuesta: ESCALA.find((opcion) => opcion.valor === respuestas[indice])?.label,
      puntos: respuestas[indice],
    }));

    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      const paciente = JSON.parse(localStorage.getItem("ivi_office_patient") || "null");
      const response = await fetch("http://localhost:8000/api/resultados/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_prueba: tipo,
          puntaje,
          duracion_segundos: Math.floor((Date.now() - tiempoInicio) / 1000),
          detalles: {
            preguntas_respondidas: cuestionario.preguntas.length,
            total_preguntas: cuestionario.preguntas.length,
            rango_edad: cuestionario.titulo,
            puntaje_maximo: 30,
            puntaje_alcanzado: puntaje,
            escala: "Nunca=0, A veces=1, Frecuentemente=2, Siempre=3",
            riesgo: riesgo.nombre,
            recomendacion: riesgo.clase === "alto" ? "Se recomienda derivación psicopedagógica. Este resultado no sustituye el diagnóstico oficial de un profesional." : riesgo.descripcion,
            respuestas: respuestasDetalladas,
          },
          target_user_id: paciente?.id,
        }),
      });

      if (response.ok) setResultado({ puntaje, riesgo });
    } catch (error) {
      console.error("Error al guardar cuestionario:", error);
    } finally {
      setGuardando(false);
    }
  };

  if (resultado) {
    return (
      <div className="prueba-resultado">
        <div className="resultado-container">
          <div className={`resultado-score ${resultado.riesgo.clase}`}>
            <h1>Cuestionario completado</h1>
            <div className="score-circle">{resultado.puntaje}<span className="score-unit">/30</span></div>
            <p className="score-text">{resultado.riesgo.nombre}</p>
          </div>
          <p>{resultado.riesgo.descripcion}</p>
          {resultado.riesgo.clase === "alto" && <p><strong>Importante:</strong> este resultado es orientativo y no sustituye el diagnóstico oficial de un profesional.</p>}
          <button onClick={() => navigate("/resultados")} className="btn-resultados">Ver mis resultados</button>
          <button onClick={() => navigate("/pruebas")} className="btn-volver">Volver a pruebas</button>
        </div>
      </div>
    );
  }

  return (
    <div className="prueba-lectura prueba-cuestionario">
      <div className="prueba-container">
        <div className="prueba-header">
          <h1>{cuestionario.titulo}</h1>
          <p>{cuestionario.subtitulo}</p>
          <p><strong>Escala:</strong> Nunca (0), A veces (1), Frecuentemente (2), Siempre (3).</p>
        </div>
        <div className="preguntas-section">
          {cuestionario.preguntas.map((pregunta, indice) => (
            <div key={pregunta} className="pregunta-card">
              <p className="pregunta-text">{indice + 1}. {pregunta}</p>
              <div className="opciones escala-opciones">
                {ESCALA.map((opcion) => (
                  <label key={opcion.valor} className="opcion">
                    <input type="radio" name={`pregunta-${indice}`} checked={respuestas[indice] === opcion.valor} onChange={() => responder(indice, opcion.valor)} />
                    <span>{opcion.label} ({opcion.valor})</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="prueba-actions">
          <button onClick={enviar} disabled={Object.keys(respuestas).length < 10 || guardando} className="btn-submit">
            {guardando ? "Guardando..." : "Enviar cuestionario"}
          </button>
        </div>
      </div>
    </div>
  );
}
