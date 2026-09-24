import { Link, useNavigate } from "react-router-dom";
import "../../css/pages/PruebasPage.css";

export default function PruebasPage() {
  const navigate = useNavigate();
  const officePatient = JSON.parse(localStorage.getItem("ivi_office_patient") || "null");
  const storedUser = JSON.parse(localStorage.getItem("user") || localStorage.getItem("ivi_user") || "null");
  const patientAge = officePatient?.age ?? localStorage.getItem("ivi_test_age") ?? storedUser?.age;
  const canTakeKnowledgeFilter = Number.isFinite(Number(patientAge)) && Number(patientAge) >= 7;
  const pruebas = [
    {
      id: "lectura",
      nombre: "Infancia Temprana (5 a 7 años)",
      descripcion: "Cuestionario de indicadores tempranos relacionados con lenguaje y aprendizaje.",
      duracion: "5-10 min",
      edad: "5-7 años",
      dificultad: "Inicial",
      color: "blue",
      icon: "📖"
    },
    {
      id: "velocidad",
      nombre: "Desarrollo Lector (8 a 10 años)",
      descripcion: "Cuestionario sobre fluidez, precisión y hábitos de lectura.",
      duracion: "5-10 min",
      edad: "8-10 años",
      dificultad: "Básica",
      color: "orange",
      icon: "⚡"
    },
    {
      id: "comprension",
      nombre: "Preadolescencia (11 a 14 años)",
      descripcion: "Cuestionario sobre comprensión, organización y desempeño académico.",
      duracion: "5-10 min",
      edad: "11-14 años",
      dificultad: "Intermedia",
      color: "green",
      icon: "💡"
    },
    {
      id: "ortografia",
      nombre: "Adolescentes y Adultos (15 años en adelante)",
      descripcion: "Cuestionario sobre lectura y escritura en el estudio, trabajo y vida cotidiana.",
      duracion: "5-10 min",
      edad: "15+ años",
      dificultad: "Avanzada",
      color: "purple",
      icon: "✍️"
    }
  ];

  return (
    <div className="pruebas-page">
      <div className="pruebas-container">
        {officePatient && <div className="office-patient-banner"><strong>Paciente en consultorio:</strong> {officePatient.name} - CI: {officePatient.ci}<button type="button" onClick={() => { localStorage.removeItem("ivi_office_patient"); navigate("/doctor"); }}>Finalizar atención</button></div>}
        <div className="pruebas-header">
          <h1>Módulos de Tamizaje y Evaluación</h1>
        </div>

        {canTakeKnowledgeFilter && (
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
        )}

        <div className="tests-heading">
          <h2>Pruebas de Dislexia</h2>
          <p>Selecciona Juegos de tamizaje o elige un cuestioario dependiendo de la edad del evaluado.</p>
        </div>
        <Link to="/juegos" className="games-entry-card">
          <span className="games-entry-icon">🎮</span>
          <span><strong>Juegos de tamizaje</strong><small>Memoria, sílabas y atención · 5-15 años · Fácil, medio y difícil</small></span>
          <span aria-hidden="true">→</span>
        </Link>
        <div className="pruebas-grid">
          {pruebas.map((prueba) => (
            <Link
              key={prueba.id}
              to={`/pruebas/${prueba.id}`}
              className={`prueba-card ${prueba.color}`}
            >
              <div className="prueba-icon">{prueba.icon}</div>
              <div className="prueba-content">
                <h2>{prueba.nombre}</h2>
                <p className="prueba-descripcion">{prueba.descripcion}</p>
                <div className="prueba-meta"><span>{prueba.edad}</span><span>{prueba.dificultad}</span></div>
                <p className="prueba-duracion">⏱️ {prueba.duracion}</p>
              </div>
              <div className="prueba-arrow">→</div>
            </Link>
          ))}
        </div>

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
