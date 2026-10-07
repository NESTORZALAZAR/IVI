import { Link, useNavigate } from "react-router-dom";
import "../../css/pages/PruebasPage.css";

const cuestionarios = [
  { path: "lectura", title: "Infancia temprana", text: "Indicadores tempranos relacionados con lenguaje y aprendizaje.", age: "5–7 años", level: "Inicial", icon: "▣", color: "blue" },
  { path: "velocidad", title: "Desarrollo lector", text: "Fluidez, precisión y hábitos de lectura.", age: "8–10 años", level: "Básica", icon: "⚡", color: "orange" },
  { path: "comprension", title: "Preadolescencia", text: "Comprensión, organización y desempeño académico.", age: "11–14 años", level: "Intermedia", icon: "💡", color: "green" },
  { path: "ortografia", title: "Adolescentes y adultos", text: "Lectura y escritura en estudio, trabajo y vida cotidiana.", age: "15+ años", level: "Avanzada", icon: "✍️", color: "purple" }
];

export default function PruebasPage() {
  const navigate = useNavigate();
  const officePatient = JSON.parse(localStorage.getItem("ivi_office_patient") || "null");

  return (
    <div className="pruebas-page">
      <div className="pruebas-container">
        {officePatient && <div className="office-patient-banner"><strong>Paciente en consultorio:</strong> {officePatient.name} - CI: {officePatient.ci}<button type="button" onClick={() => { localStorage.removeItem("ivi_office_patient"); navigate("/doctor"); }}>Finalizar atención</button></div>}
        <div className="pruebas-header"><h1>Módulos de Tamizaje y Evaluación</h1></div>

        <section className="knowledge-filter-section">
          <div className="knowledge-filter-heading">
            <div className="knowledge-filter-title-row">
              <span className="knowledge-filter-kicker">Evaluación inicial</span>
              <span className="knowledge-filter-alert">⚠ Aviso importante</span>
            </div>
            <p>Para mejores resultados del tamizaje, comenzaremos con un ejercicio breve de reconocimiento visual. Esto permite registrar el nivel de familiaridad con el abecedario y personalizar la complejidad de los módulos posteriores.</p>
          </div>
          <Link to="/pruebas/alfabeto" className="prueba-card knowledge-filter-card">
            <div className="prueba-icon">🔤</div>
            <div className="prueba-content">
              <div className="knowledge-card-title"><h2>Conocimiento del alfabeto</h2><span>Filtro esencial</span></div>
              <p className="prueba-descripcion">Identifica letras y completa secuencias alfabéticas de forma guiada.</p>
              <div className="prueba-meta"><span>7+ años</span><span>Inicial</span></div>
              <p className="prueba-duracion">◷ 5–7 min</p>
            </div>
            <span className="knowledge-filter-action">Iniciar evaluación <b>›</b></span>
          </Link>
        </section>

        <section className="games-section" aria-labelledby="games-section-title">
          <div className="games-section-heading">
            <h2 id="games-section-title">Explora el módulo de tamizaje de IVI</h2>
            <p>Selecciona el cuestionario orientativo adecuado para la edad del evaluado.</p>
            <span className="section-kicker">Cuestionarios por edad</span>
          </div>
          <Link to="/juegos" className="games-entry-card">
            <span className="games-entry-icon" aria-hidden="true">🎮</span>
            <span className="games-entry-copy"><strong>Entrar a la sala de juegos</strong><small>5 actividades · 5 a 15 años · Fácil, medio y difícil</small></span>
            <span className="games-entry-arrow" aria-hidden="true">→</span>
          </Link>
          <div className="screening-questionnaires-grid" aria-label="Cuestionarios por edad">
            {cuestionarios.map((item) => (
              <Link className={`screening-questionnaire-card ${item.color}`} to={`/pruebas/${item.path}`} key={item.path}>
                <span className="screening-questionnaire-icon" aria-hidden="true">{item.icon}</span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
                <span className="screening-questionnaire-meta">{item.age} · {item.level}</span>
                <span className="screening-questionnaire-duration">◷ 5–10 min</span>
                <span className="screening-questionnaire-link">Iniciar cuestionario <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </section>

        <div className="pruebas-info"><div className="info-card"><h3>💡 Consejos para tu sesión</h3><ul><li>Completa las pruebas en un ambiente tranquilo</li><li>Tómate tu tiempo, no hay límite de tiempo</li><li>Usa los controles de accesibilidad si es necesario</li><li>Tus resultados se guardarán automáticamente</li></ul></div></div>
      </div>
    </div>
  );
}
