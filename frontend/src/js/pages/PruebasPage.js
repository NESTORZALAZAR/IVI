import { Link, useNavigate } from "react-router-dom";
import "../../css/pages/PruebasPage.css";

export default function PruebasPage() {
  const navigate = useNavigate();
  const officePatient = JSON.parse(localStorage.getItem("ivi_office_patient") || "null");
  const pruebas = [
    {
      id: "lectura",
      nombre: "Prueba de Lectura",
      descripcion: "Evalúa la capacidad de lectura y comprensión de textos",
      duracion: "10-15 min",
      color: "blue",
      icon: "📖"
    },
    {
      id: "velocidad",
      nombre: "Prueba de Velocidad",
      descripcion: "Mide la velocidad de lectura y procesamiento",
      duracion: "8-10 min",
      color: "orange",
      icon: "⚡"
    },
    {
      id: "comprension",
      nombre: "Prueba de Comprensión",
      descripcion: "Evalúa la comprensión de textos y conceptos",
      duracion: "12-15 min",
      color: "green",
      icon: "💡"
    },
    {
      id: "ortografia",
      nombre: "Prueba de Ortografía",
      descripcion: "Evalúa el conocimiento de reglas ortográficas",
      duracion: "10-12 min",
      color: "purple",
      icon: "✍️"
    }
  ];

  return (
    <div className="pruebas-page">
      <div className="pruebas-container">
        {officePatient && <div className="office-patient-banner"><strong>Paciente en consultorio:</strong> {officePatient.name} - CI: {officePatient.ci}<button type="button" onClick={() => { localStorage.removeItem("ivi_office_patient"); navigate("/doctor"); }}>Finalizar atención</button></div>}
        <div className="pruebas-header">
          <h1>Pruebas de Dislexia</h1>
          <p>Selecciona una prueba para evaluar tus habilidades</p>
        </div>

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
                <p className="prueba-duracion">⏱️ {prueba.duracion}</p>
              </div>
              <div className="prueba-arrow">→</div>
            </Link>
          ))}
        </div>

        <div className="pruebas-info">
          <div className="info-card">
            <h3>💡 Consejos</h3>
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
