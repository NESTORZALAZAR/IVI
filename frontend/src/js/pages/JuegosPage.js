import { Link } from "react-router-dom";
import "../../css/pages/JuegosPage.css";

const cuestionarios = [
  {
    path: "lectura",
    age: "5 a 7 años",
    level: "Inicial",
    title: "Infancia temprana",
    description: "Cuestionario de indicadores tempranos relacionados con lenguaje y aprendizaje.",
    icon: "▣",
    color: "blue"
  },
  {
    path: "velocidad",
    age: "8 a 10 años",
    level: "Básica",
    title: "Desarrollo lector",
    description: "Cuestionario sobre fluidez, precisión y hábitos de lectura.",
    icon: "⚡",
    color: "orange"
  },
  {
    path: "comprension",
    age: "11 a 14 años",
    level: "Intermedia",
    title: "Preadolescencia",
    description: "Cuestionario sobre comprensión, organización y desempeño académico.",
    icon: "💡",
    color: "green"
  },
  {
    path: "ortografia",
    age: "15 años en adelante",
    level: "Avanzada",
    title: "Adolescentes y adultos",
    description: "Cuestionario sobre lectura y escritura en el estudio, trabajo y vida cotidiana.",
    icon: "✍️",
    color: "purple"
  }
];

export default function JuegosPage() {
  return (
    <main className="games-page questionnaires-page">
      <header className="games-hero questionnaires-hero">
        <div>
          <span className="eyebrow">Tamizaje orientativo</span>
          <h1>Cuestionarios por edad</h1>
          <p>Selecciona el rango de edad para realizar el cuestionario más adecuado.</p>
        </div>
      </header>

      <section className="questionnaires-grid" aria-label="Cuestionarios disponibles por edad">
        {cuestionarios.map((cuestionario) => (
          <Link
            className={`questionnaire-card ${cuestionario.color}`}
            to={`/pruebas/${cuestionario.path}`}
            key={cuestionario.path}
          >
            <span className="questionnaire-icon" aria-hidden="true">{cuestionario.icon}</span>
            <h2>{cuestionario.title}</h2>
            <p>{cuestionario.description}</p>
            <div className="questionnaire-meta">
              <span>{cuestionario.age}</span>
              <span>{cuestionario.level}</span>
            </div>
            <span className="questionnaire-duration">◷ 5–10 min</span>
            <span className="questionnaire-action">Comenzar cuestionario <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </section>

      <p className="games-note">Los resultados son orientativos y no reemplazan una evaluación profesional.</p>
    </main>
  );
}
