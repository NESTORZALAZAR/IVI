import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AccessibilityContext } from "../../../context/AccessibilityContext";
import "./TopNav.css";

export default function TopNav() {
  const {
    font,
    setFont,
    fontSize,
    setFontSize,
    spacing,
    setSpacing,
    contrast,
    setContrast,
    background,
    setBackground
  } = useContext(AccessibilityContext);

  const location = useLocation();
  const isHome = location.pathname === "/home";
  const isAbout = location.pathname === "/about";

  return (
    <nav className="topnav" role="navigation" aria-label="Navegación principal">
      <div className="topnav-container">
        <div className="topnav-brand">
          <Link to="/home" className="brand-link">
            <h1>IVI</h1>
            <p>Plataforma de Apoyo y Tamizaje Dislexia</p>
          </Link>
        </div>

        <div className="topnav-menu">
          <Link 
            to="/home" 
            className={`nav-link ${isHome ? 'active' : ''}`}
          >
            Inicio
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isAbout ? 'active' : ''}`}
          >
            Acerca de
          </Link>
          <button className="nav-link logout-btn" onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
          }}>
            Salir
          </button>
        </div>

        <div className="topnav-controls">
          {/* Fuente */}
          <div className="control-group">
            <label htmlFor="font-select">
              <span className="control-label">Fuente</span>
            </label>
            <select
              id="font-select"
              value={font || "Lato"}
              onChange={(e) => setFont(e.target.value)}
              className="control-select"
              aria-label="Seleccionar fuente tipográfica"
            >
              <option value="Lato">Lato</option>
              <option value="Lexend">Lexend</option>
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>

          {/* Tamaño de letra con botones */}
          <div className="control-group font-size-group">
            <label className="control-label">Tamaño: {fontSize}px</label>
            <div className="font-size-buttons">
              <button
                onClick={() => {
                  if (fontSize > 14) {
                    setFontSize(fontSize - 2);
                  }
                }}
                disabled={fontSize <= 14}
                className="size-button decrease"
                aria-label="Reducir tamaño de letra"
                title="Reducir (mínimo 14px)"
                type="button"
              >
                −
              </button>
              <span className="font-size-display">{fontSize}px</span>
              <button
                onClick={() => {
                  if (fontSize < 28) {
                    setFontSize(fontSize + 2);
                  }
                }}
                disabled={fontSize >= 28}
                className="size-button increase"
                aria-label="Aumentar tamaño de letra"
                title="Aumentar (máximo 28px)"
                type="button"
              >
                +
              </button>
            </div>
          </div>

          {/* Espaciado (interlineado) */}
          <div className="control-group">
            <label htmlFor="spacing-input">
              <span className="control-label">Espaciado: {spacing.toFixed(1)}</span>
            </label>
            <input
              id="spacing-input"
              type="range"
              min="1"
              max="2.5"
              step="0.1"
              value={String(spacing)}
              onChange={(e) => setSpacing(parseFloat(e.target.value))}
              className="control-range"
              aria-label="Ajustar espaciado entre líneas"
              aria-valuenow={spacing}
              aria-valuemin="1"
              aria-valuemax="2.5"
            />
          </div>

          {/* Fondo */}
          <div className="control-group">
            <label htmlFor="background-select">
              <span className="control-label">Fondo</span>
            </label>
            <select
              id="background-select"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="control-select"
              aria-label="Seleccionar color de fondo"
            >
              <option value="white">Blanco</option>
              <option value="sepia">Sepia</option>
              <option value="cream">Crema</option>
            </select>
          </div>

          {/* Contraste alto */}
          <div className="control-group checkbox-group">
            <label htmlFor="contrast-toggle" className="checkbox-label">
              <input
                id="contrast-toggle"
                type="checkbox"
                checked={contrast}
                onChange={(e) => setContrast(e.target.checked)}
                aria-label="Activar contraste alto"
              />
              <span className="control-label">Contraste Alto</span>
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
}
