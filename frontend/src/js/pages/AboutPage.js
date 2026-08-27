import React from "react";
import "../../css/pages/AboutPage.css";

export default function AboutPage() {
  const features = [
    {
      title: "Pruebas de Tamizaje:",
      description: "Evaluaciones especializadas para detectar indicios de dislexia."
    },
    {
      title: "Panel de Accesibilidad:",
      description: "Personaliza fuentes, tamaño, espaciado y contraste."
    },
    {
      title: "Recursos Educativos:",
      description: "Acceso a contenido especializado y materiales de apoyo."
    },
    {
      title: "Interfaz Intuitiva:",
      description: "Diseño pensado especialmente para la facilidad de uso."
    }
  ];

  return (
    <div className="about-wrapper-bg">
      <main className="about-page">
        {/* Se cambia .about-container por .about-standalone-layout para desacoplar del CSS global */}
        <div className="about-standalone-layout">
          
          {/* Encabezado Principal Libre */}
          <header className="about-top-header">
            <div className="about-main-title">
              <div className="about-icon-circle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2B363B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <h1>Acerca de la Plataforma</h1>
            </div>
            <div className="top-divider"></div>
          </header>

          {/* Tarjeta 1 */}
          <section className="about-card">
            <div className="card-header">
              <div className="about-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B363B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h2>¿Quién es IVI y que hace?</h2>
            </div>
            <div className="card-divider"></div>
            <p className="card-paragraph">
              IVI es quien asiste en la Plataforma de Apoyo y Tamizaje Disléxico, muestra que es una herramienta digital diseñada para proporcionar apoyo a personas con dislexia mediante evaluaciones especializadas y herramientas de accesibilidad personalizadas.
            </p>
          </section>

          {/* Tarjeta 2 */}
          <section className="about-card">
            <div className="card-header">
              <div className="about-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B363B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h2>Funcionalidades Principales</h2>
            </div>
            <div className="card-divider"></div>
            <div className="features-list">
              {features.map((item, idx) => (
                <div className="feature-item-box" key={idx}>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A2224" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <p className="feature-text">
                    <strong>{item.title}</strong> {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Tarjeta 3 */}
          <section className="about-card">
            <div className="card-header">
              <div className="about-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B363B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 7 4 4 20 4 20 7"></polyline>
                  <line x1="9" y1="20" x2="15" y2="20"></line>
                  <line x1="12" y1="4" x2="12" y2="20"></line>
                </svg>
              </div>
              <h2>Fuentes Accesibles</h2>
            </div>
            <div className="card-divider"></div>
            <p className="card-paragraph">
              IVI ofrece diferentes opciones de fuentes optimizadas para mejorar la experiencia de lectura:
            </p>
            <div className="fonts-grid">
              <div className="font-box font-lexend">Lexend</div>
              <div className="font-box font-atkinson">Atkinson Hyperlegible</div>
              <div className="font-box font-opendyslexic">OpenDyslexic</div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}