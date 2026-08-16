import { Link, useNavigate } from "react-router-dom";
import "../../css/pages/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleBeginTests = () => {
    if (isLoggedIn) {
      navigate("/pruebas");
    } else {
      navigate("/login");
    }
  };

  const handleViewResults = () => {
    if (isLoggedIn) {
      navigate("/resultados");
    } else {
      navigate("/login");
    }
  };

  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>IVI</h1>
          <p className="hero-subtitle">Plataforma de Apoyo y Tamizaje Dislexia</p>
          <p className="hero-description">
            Herramientas de accesibilidad diseñadas para apoyar a personas con dislexia
          </p>
          <div className="hero-buttons">
            <button className="btn-comenza" onClick={handleBeginTests}>
              Comenzar Pruebas
            </button>
            {isLoggedIn && (
              <button className="btn-resultados" onClick={handleViewResults}>
                Ver Mis Resultados
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>📚 Pruebas de Tamizaje</h3>
          <p>Evaluaciones especializadas para detectar indicios de dislexia</p>
        </div>
        <div className="feature-card">
          <h3>🎨 Accesibilidad</h3>
          <p>Personaliza tu experiencia con diferentes fuentes y colores</p>
        </div>
        <div className="feature-card">
          <h3>📖 Recursos</h3>
          <p>Acceso a contenido especializado y herramientas de apoyo</p>
        </div>
      </section>
    </main>
  );
}
