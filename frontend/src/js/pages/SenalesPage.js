import { Link } from "react-router-dom";
import "../../css/pages/SenalesPage.css";

const signsByStage = [
  {
    number: "01",
    title: "Preescolar",
    age: "3 a 5 años",
    description: "El juego y el lenguaje pueden mostrar las primeras señales de alerta.",
    signs: [
      "Dificultad persistente para rimar o cantar canciones infantiles.",
      "Le cuesta aprender nombres de colores, formas o secuencias.",
      "Confunde sonidos o tarda en encontrar palabras conocidas."
    ]
  },
  {
    number: "02",
    title: "Primaria",
    age: "6 a 11 años",
    description: "La lectura y la escritura exigen estrategias que no siempre son visibles.",
    signs: [
      "Lectura lenta, entrecortada o con mucho esfuerzo mental.",
      "Inversión o confusión de letras y sonidos parecidos.",
      "Resistencia marcada a leer en voz alta frente al grupo."
    ]
  },
  {
    number: "03",
    title: "Secundaria",
    age: "12 a 17 años",
    description: "Aumenta la exigencia de comprender y organizar textos extensos.",
    signs: [
      "Comprensión reducida cuando el texto requiere mucha velocidad.",
      "Escritura poco estructurada o dificultad para tomar apuntes.",
      "Frustración que afecta la motivación y la participación."
    ]
  },
  {
    number: "04",
    title: "Vida adulta",
    age: "Ámbito laboral y personal",
    description: "Las estrategias de compensación pueden ocultar el esfuerzo diario.",
    signs: [
      "Evita leer o redactar correos e informes extensos.",
      "Prefiere notas de voz, resúmenes o apoyos visuales.",
      "Inseguridad ante faltas recurrentes en documentos compartidos."
    ]
  }
];

export default function SenalesPage() {
  return (
    <main className="senales-page">
      <div className="senales-shell">
        <nav className="senales-steps" aria-label="Secciones de apoyo">
          <Link className="is-current" to="/senales" aria-current="page">01&nbsp;&nbsp; ¿Qué es y señales?</Link>
          <Link to="/consejos">02&nbsp;&nbsp; Consejos prácticos</Link>
          <Link to="/lector-textos">03&nbsp;&nbsp; Herramientas y apoyo</Link>
        </nav>

        <header className="senales-hero">
          <p className="eyebrow">Módulo de acompañamiento</p>
          <h1>¿Qué es la dislexia?</h1>
          <p>
            La dislexia es una forma distinta de procesar el lenguaje escrito y hablado. No es una enfermedad, no es pereza y no define la inteligencia.
          </p>
        </header>

        <section className="senales-definition" aria-labelledby="definition-title">
          <div>
            <p className="eyebrow">Definición amigable</p>
            <h2 id="definition-title">Una manera diferente de aprender</h2>
            <p>
              Las personas con dislexia pueden requerir más energía mental para decodificar letras, relacionar sonidos y automatizar la lectura. Con estrategias multisensoriales, tiempo y empatía, su potencial puede desarrollarse plenamente.
            </p>
          </div>
          <aside>
            <span className="senales-aside-icon" aria-hidden="true">i</span>
            <strong>Dato importante</strong>
            <p>Las señales orientan una conversación; solo una evaluación profesional puede confirmar un diagnóstico.</p>
          </aside>
        </section>

        <section className="senales-section" aria-labelledby="signs-title">
          <div className="senales-section-heading">
            <p className="eyebrow">Detección oportuna</p>
            <h2 id="signs-title">Señales que conviene observar</h2>
            <p>Identificar patrones permite ofrecer adaptaciones sin etiquetar ni comparar.</p>
          </div>
          <div className="senales-grid">
            {signsByStage.map((stage) => (
              <article className="senales-card" key={stage.title}>
                <div className="senales-card-top">
                  <span className="senales-number">{stage.number}</span>
                  <div><h3>{stage.title}</h3><span>{stage.age}</span></div>
                </div>
                <p>{stage.description}</p>
                <ul>
                  {stage.signs.map((sign) => <li key={sign}>{sign}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="senales-note" aria-label="Recomendación">
          <div className="senales-note-icon" aria-hidden="true">✓</div>
          <div>
            <p className="eyebrow">Acompañar con respeto</p>
            <h2>Una señal no es una etiqueta</h2>
            <p>Observa con calma, escucha las necesidades de la persona y busca orientación especializada cuando las dificultades persisten.</p>
          </div>
          <Link to="/consejos">Ver consejos prácticos <span aria-hidden="true">→</span></Link>
        </section>
      </div>
      <footer className="senales-footer">
        <span>© 2026 Plataforma IVI · Entorno inclusivo para la evaluación y apoyo a la dislexia.</span>
        <span>Guía de accesibilidad&nbsp;&nbsp; · &nbsp;&nbsp;Soporte y ayuda</span>
      </footer>
    </main>
  );
}