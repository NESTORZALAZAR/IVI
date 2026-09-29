import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../css/pages/ConsejosPage.css";

const myths = [
  {
    myth: "La dislexia es falta de esfuerzo.",
    reality: "Es una forma distinta de procesar el lenguaje. El apoyo adecuado permite desarrollar estrategias eficaces."
  },
  {
    myth: "Se supera sin acompañamiento.",
    reality: "Las adaptaciones, la práctica guiada y el acompañamiento emocional ayudan a sostener el aprendizaje."
  },
  {
    myth: "Solo afecta la lectura.",
    reality: "También puede influir en la escritura, la memoria de trabajo, la organización y la confianza."
  }
];

const stages = [
  {
    icon: "01",
    title: "En el estudio",
    intro: "Haz visible la información y reduce la carga de memoria.",
    tips: [
      "Divide las tareas largas en pasos pequeños.",
      "Usa audiolibros, lectura en voz alta y mapas visuales.",
      "Permite más tiempo cuando la actividad lo necesite."
    ]
  },
  {
    icon: "02",
    title: "En el entorno laboral",
    intro: "Acordar formas claras de comunicación mejora el desempeño.",
    tips: [
      "Entrega instrucciones breves y por escrito.",
      "Prioriza listas, calendarios y recordatorios visuales.",
      "Confirma prioridades sin convertir los errores en etiquetas."
    ]
  },
  {
    icon: "03",
    title: "En casa",
    intro: "La calma y la rutina convierten el apoyo en confianza.",
    tips: [
      "Crea un espacio de lectura sin interrupciones.",
      "Reconoce el proceso, no solo el resultado.",
      "Pregunta qué herramienta le resulta más cómoda."
    ]
  },
  {
    icon: "04",
    title: "Con profesionales",
    intro: "Una evaluación completa orienta las decisiones de apoyo.",
    tips: [
      "Registra situaciones concretas y cambios observados.",
      "Comparte estrategias que ya han funcionado.",
      "Consulta a especialistas ante dudas persistentes."
    ]
  }
];

const tools = [
  ["Lectura asistida", "Escucha textos extensos mientras sigues la lectura visual."],
  ["Texto a voz", "Convierte instrucciones y apuntes en audio para repasar a tu ritmo."],
  ["Dictado por voz", "Captura ideas sin que la escritura interrumpa el pensamiento."],
  ["Formato accesible", "Prefiere tipografías claras, interlineado amplio y poco ruido visual."]
];

export default function ConsejosPage() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const guideText = "Consejos y orientación sobre dislexia. Estrategias claras para estudiar, trabajar y acompañar con menos sobrecarga y más confianza. Pensar diferente también es una fortaleza. Las adaptaciones hacen visible el talento.";

  const handleGuideAudio = () => {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(guideText);
    utterance.lang = "es-ES";
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <main className="consejos-page">
      <div className="consejos-shell">
        <nav className="consejos-steps" aria-label="Secciones de apoyo">
          <Link to="/senales">01&nbsp;&nbsp; ¿Qué es y señales?</Link>
          <Link className="is-current" to="/consejos" aria-current="page">02&nbsp;&nbsp; Consejos prácticos</Link>
          <Link to="/lector-textos">03&nbsp;&nbsp; Herramientas y apoyo</Link>
        </nav>

        <header className="consejos-intro">
          <div>
            <p className="eyebrow">Guía práctica e inclusiva</p>
            <h1>Consejos y orientación sobre dislexia</h1>
            <p className="intro-copy">
              Estrategias claras para estudiar, trabajar y acompañar con menos sobrecarga y más confianza.
            </p>
          </div>
          <button
            type="button"
            className={`audio-note ${isSpeaking ? "is-speaking" : ""}`}
            onClick={handleGuideAudio}
            aria-pressed={isSpeaking}
            aria-label={isSpeaking ? "Detener lectura de la guía" : "Escuchar esta guía"}
          >
            <span aria-hidden="true">{isSpeaking ? "■" : "◖"}</span>
            <div><strong>{isSpeaking ? "Detener lectura" : "Escuchar esta guía"}</strong><small>{isSpeaking ? "La guía se está leyendo" : "Lectura clara y pausada"}</small></div>
          </button>
        </header>

        <section className="consejos-feature" aria-labelledby="feature-title">
          <div className="feature-mark" aria-hidden="true">i</div>
          <div>
            <p className="eyebrow">Una mirada neurodivergente</p>
            <h2 id="feature-title">Pensar diferente también es una fortaleza</h2>
            <p>
              Las personas con dislexia pueden destacar en razonamiento espacial, creatividad, resolución de problemas y pensamiento global. Las adaptaciones no reducen la exigencia: hacen visible el talento.
            </p>
          </div>
        </section>

        <section className="consejos-section" aria-labelledby="myths-title">
          <div className="section-heading">
            <p className="eyebrow">Definición amigable</p>
            <h2 id="myths-title">Comprender antes de corregir</h2>
            <p>Una explicación precisa abre espacio para pedir ayuda sin vergüenza ni prejuicios.</p>
          </div>
          <div className="myths-grid">
            {myths.map((item) => (
              <article className="myth-card" key={item.myth}>
                <span className="card-kicker">MITO COMÚN</span>
                <h3>{item.myth}</h3>
                <div className="reality-label">◉ REALIDAD</div>
                <p>{item.reality}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="consejos-section" aria-labelledby="stages-title">
          <div className="section-heading compact-heading">
            <p className="eyebrow">Apoyo cotidiano</p>
            <h2 id="stages-title">Pequeños cambios, menos esfuerzo invisible</h2>
          </div>
          <div className="stages-grid">
            {stages.map((stage) => (
              <article className="stage-card" key={stage.title}>
                <div className="stage-number" aria-hidden="true">{stage.icon}</div>
                <div>
                  <h3>{stage.title}</h3>
                  <p className="stage-intro">{stage.intro}</p>
                  <ul>
                    {stage.tips.map((tip) => <li key={tip}>{tip}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="consejos-tools" aria-labelledby="tools-title">
          <div className="tools-heading">
            <p className="eyebrow">Tecnología útil</p>
            <h2 id="tools-title">Elige la herramienta que te quite una barrera</h2>
            <p>IVI reúne recursos para que el formato del contenido no limite lo que puedes comprender.</p>
          </div>
          <div className="tools-list">
            {tools.map(([title, description]) => (
              <div className="tool-row" key={title}>
                <span className="tool-icon" aria-hidden="true">+</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="consejos-callout" aria-label="Siguiente paso">
          <div>
            <p className="eyebrow">Siguiente paso</p>
            <h2>La ayuda funciona mejor cuando se adapta a la persona.</h2>
          </div>
          <Link className="consejos-button" to="/pruebas">Comenzar pruebas <span aria-hidden="true">→</span></Link>
        </section>
      </div>
      <footer className="consejos-footer">
        <span>© 2026 Plataforma IVI · Entorno inclusivo para la evaluación y apoyo a la dislexia.</span>
        <span>Guía de accesibilidad&nbsp;&nbsp; · &nbsp;&nbsp;Soporte y ayuda</span>
      </footer>
    </main>
  );
}