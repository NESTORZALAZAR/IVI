import { useContext, useState } from "react";
import { AccessibilityContext } from "../context/AccessibilityContext";
import "./AccessibilityPanel.css";

export default function AccessibilityPanel() {
  const {
    font, setFont,
    fontSize, setFontSize,
    spacing, setSpacing,
    contrast, setContrast,
    background, setBackground
  } = useContext(AccessibilityContext);

  const [isOpen, setIsOpen] = useState(false);
  const togglePanel = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botón flotante */}
      <button className="accessibility-button" onClick={togglePanel} aria-label="Abrir panel de accesibilidad" aria-expanded={isOpen}>
        <span className="button-icon">⚙️</span>
        <span className="button-text">Accesibilidad</span>
      </button>

      {/* Panel lateral */}
      <aside className={`accessibility-panel ${isOpen ? "open" : ""}`} role="complementary" aria-label="Panel de controles de accesibilidad">
        <div className="panel-header">
          <h2>Personalizar Vista</h2>
          <button className="close-button" onClick={togglePanel} aria-label="Cerrar panel">✕</button>
        </div>

        <div className="panel-content">
          {/* Fuente */}
          <div className="panel-control-group">
            <label htmlFor="panel-font-select">
              <span className="control-title">Fuente Tipográfica</span>
            </label>
            <select id="panel-font-select" value={font} onChange={(e) => setFont(e.target.value)} className="panel-select" aria-label="Seleccionar fuente">
              <option value="Lexend">Lexend</option>
              <option value="OpenDyslexic">OpenDyslexic</option>
              <option value="Atkinson">Atkinson Hyperlegible</option>
            </select>
          </div>

          {/* Tamaño de letra */}
          <div className="panel-control-group">
            <label htmlFor="panel-font-size">
              <span className="control-title">Tamaño de Letra</span>
              <span className="control-value">{fontSize}px</span>
            </label>
            <input
              id="panel-font-size"
              type="range"
              min="14"
              max="28"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
              className="panel-range"
              aria-label="Ajustar tamaño de letra"
              aria-valuenow={fontSize}
              aria-valuemin="14"
              aria-valuemax="28"
            />
          </div>

          {/* Espaciado */}
          <div className="panel-control-group">
            <label htmlFor="panel-spacing">
              <span className="control-title">Espaciado (Interlineado)</span>
              <span className="control-value">{spacing.toFixed(1)}</span>
            </label>
            <input
              id="panel-spacing"
              type="range"
              min="1"
              max="2.5"
              step="0.1"
              value={spacing}
              onChange={(e) => setSpacing(parseFloat(e.target.value))}
              className="panel-range"
              aria-label="Ajustar espaciado"
              aria-valuenow={spacing}
              aria-valuemin="1"
              aria-valuemax="2.5"
            />
          </div>

          {/* Fondo */}
          <div className="panel-control-group">
            <label htmlFor="panel-background">
              <span className="control-title">Color de Fondo</span>
            </label>
            <select id="panel-background" value={background} onChange={(e) => setBackground(e.target.value)} className="panel-select" aria-label="Seleccionar color de fondo">
              <option value="white">Blanco</option>
              <option value="cream">Crema</option>
              <option value="sepia">Sepia</option>
            </select>
          </div>

          {/* Contraste */}
          <div className="panel-control-group checkbox-group">
            <label htmlFor="panel-contrast" className="checkbox-label">
              <input id="panel-contrast" type="checkbox" checked={contrast} onChange={(e) => setContrast(e.target.checked)} aria-label="Activar contraste alto" />
              <span className="control-title">Contraste Alto</span>
            </label>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && <div className="accessibility-overlay" onClick={togglePanel} aria-hidden="true" />}
    </>
  );
}
