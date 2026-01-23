import { useContext } from "react";
import { AccessibilityContext } from "../context/AccessibilityContext";
import TopNav from "../components/layouts/TopNav/TopNav";
import "../../css/HomePage.css";

export default function HomePage() {
  return (
    <>
      <TopNav />
      <main className="home-page accessible-text" role="main">
        <div className="container">
          <section className="hero">
            <h1>IVI – Plataforma de Apoyo y Tamizaje Disléxico</h1>
            <p className="lead">
              IVI ayuda a personas con dislexia, familiares y profesionales con información 
              confiable, juegos interactivos y herramientas de lectura accesibles.
            </p>
          </section>

          <section className="features">
            <h2>¿Qué es IVI?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Información Confiable</h3>
                <p>
                  Accede a recursos basados en evidencia sobre dislexia, sus características 
                  y estrategias de apoyo.
                </p>
              </div>

              <div className="feature-card">
                <h3>Herramientas Accesibles</h3>
                <p>
                  Diseñadas específicamente para personas con dislexia, con opciones 
                  personalizables de fuente, contraste y espaciado.
                </p>
              </div>

              <div className="feature-card">
                <h3>Juegos Interactivos</h3>
                <p>
                  Aprende mientras te diviertes con actividades diseñadas para mejorar 
                  habilidades de lectura y procesamiento.
                </p>
              </div>

              <div className="feature-card">
                <h3>Tamizaje Temprano</h3>
                <p>
                  Herramientas para identificar posibles indicadores de dislexia de forma 
                  temprana en niños.
                </p>
              </div>
            </div>
          </section>

          <section className="accessibility-tips">
            <h2>Personaliza tu Experiencia</h2>
            <p>
              Utiliza los controles en la barra superior para ajustar la presentación según 
              tus necesidades:
            </p>
            <ul>
              <li><strong>Fuente:</strong> Elige entre Lexend, OpenDyslexic y Atkinson Hyperlegible</li>
              <li><strong>Tamaño:</strong> Ajusta el tamaño del texto con los botones + y -</li>
              <li><strong>Espaciado:</strong> Modifica el interlineado para mayor comodidad de lectura</li>
              <li><strong>Fondo:</strong> Selecciona entre blanco, crema o sepia</li>
              <li><strong>Contraste:</strong> Activa el contraste alto para mejor legibilidad</li>
            </ul>
          </section>

          <section className="cta">
            <h2>¿Listo para comenzar?</h2>
            <p>Explora nuestras herramientas y recursos diseñados para ti.</p>
            <div className="button-group">
              <button className="btn btn-primary">Comenzar Evaluación</button>
              <button className="btn btn-secondary">Ver Recursos</button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

