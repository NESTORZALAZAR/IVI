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
        <div className="hero-copy">
          <h1>IVI: Plataforma de Apoyo y Tamizaje Dislexia</h1>
          <p className="hero-description">
            Herramientas de accesibilidad diseñadas para apoyar a personas con dislexia. Un entorno seguro, claro y adaptable a tus necesidades visuales.
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
        <div className="hero-visual">
          <img src="/images/IviSF.png" alt="Persona leyendo cómodamente" />
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <span className="feature-icon" aria-hidden="true">▣</span>
          <div><h3>Pruebas de Tamizaje</h3><p>Evaluaciones especializadas para detectar indicios de dislexia en un formato claro y sin distracciones.</p></div>
        </div>
        <div className="feature-card">
          <span className="feature-icon" aria-hidden="true">☷</span>
          <div><h3>Accesibilidad</h3><p>Personaliza tu experiencia con diferentes fuentes, colores de fondo y tamaños de letra.</p></div>
        </div>
        <div className="feature-card">
          <span className="feature-icon" aria-hidden="true">▤</span>
          <div><h3>Recursos</h3><p>Acceso a contenido especializado, guías de estudio y herramientas de apoyo.</p></div>
        </div>
      </section>

      <footer className="home-footer">
        <Link to="/" className="footer-brand">IVI</Link>
        <nav className="footer-links" aria-label="Enlaces del pie de página">
          <Link to="/privacidad">Privacidad</Link>
          <Link to="/terminos">Términos</Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/soporte">Soporte</Link>
        </nav>
        <span className="footer-copy">© 2024 IVI Platform. Diseñado para la accesibilidad cognitiva.</span>
      </footer>
    </main>
  );
}
