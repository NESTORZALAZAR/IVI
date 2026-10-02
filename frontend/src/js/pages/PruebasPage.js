import { Link, useNavigate } from "react-router-dom";
import "../../css/pages/PruebasPage.css";

export default function PruebasPage() {
  const navigate = useNavigate();
  const officePatient = JSON.parse(localStorage.getItem("ivi_office_patient") || "null");

  return (
    <div className="pruebas-page">
      <div className="pruebas-container">
        {officePatient && <div className="office-patient-banner"><strong>Paciente en consultorio:</strong> {officePatient.name} - CI: {officePatient.ci}<button type="button" onClick={() => { localStorage.removeItem("ivi_office_patient"); navigate("/doctor"); }}>Finalizar atención</button></div>}
        <div className="pruebas-header">
          <h1>Módulos de Tamizaje y Evaluación</h1>
        </div>

        <section className="knowledge-filter-section">
            <div className="knowledge-filter-heading">
              <div className="knowledge-filter-title-row">
                <span className="knowledge-filter-kicker">Evaluación inicial</span>
                <span className="knowledge-filter-alert">⚠ Aviso Importante</span>
              </div>
              <p>Para mejor resultados del tamizaje, comenzaremos con un ejercicio breve de reconocimiento visual. Esto permite registrar el nivel de familiaridad con el abecedario, personalizando la complejidad de los módulos posteriores. Por favor, complete esta actividad con tranquilidad; su objetivo es netamente técnico.</p>
            </div>
            <Link to="/pruebas/alfabeto" className="prueba-card knowledge-filter-card">
              <div className="prueba-icon">🔤</div>
              <div className="prueba-content">
                <div className="knowledge-card-title">
                  <h2>Conocimiento del Alfabeto</h2>
                  <span>Filtro Esencial</span>
                </div>
                <p className="prueba-descripcion">Identifica letras y completa secuencias alfabéticas de forma guiada.</p>
                <div className="prueba-meta"><span>7+ años</span><span>Inicial</span></div>
                <p className="prueba-duracion">◷ 5 - 7 min</p>
              </div>
              <span className="knowledge-filter-action">Iniciar Evaluación <b>›</b></span>
            </Link>
        </section>

        <section className="games-section" aria-labelledby="games-section-title">
          <div className="games-section-heading">
            <h2 id="games-section-title">Explora el Módulo de Tamizaje de IVI</h2>
            <p>Juegos breves y cuestionarios orientativos según la edad del evaluado.</p>
            <span className="section-kicker">Actividades interactivas | Juegos de tamizaje</span>
            <p>Entrena memoria, sílabas y atención con retos cortos y tres niveles de dificultad.</p>
          </div>
          <Link to="/juegos" className="games-entry-card">
            <span className="games-entry-icon" aria-hidden="true">🎮</span>
            <span className="games-entry-copy"><strong>Entrar a la sala de juegos</strong><small>5 actividades · 5 a 15 años · Fácil, medio y difícil</small></span>
            <span className="games-entry-arrow" aria-hidden="true">→</span>
          </Link>
        </section>

        <div className="pruebas-info">
          <div className="info-card">
            <h3>💡 Consejos para tu sesión</h3>
            <ul>
              <li>Completa las pruebas en un ambiente tranquilo</li>
              <li>Tómate tu tiempo, no hay límite de tiempo</li>
              <li>Usa los controles de accesibilidad si es necesario</li>
              <li>Tus resultados se guardarán automáticamente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
