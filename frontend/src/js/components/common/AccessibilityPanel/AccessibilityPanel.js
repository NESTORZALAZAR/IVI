import { useContext, useState } from "react";
import { AccessibilityContext } from "../../../context/AccessibilityContext";
import "./AccessibilityPanel.css";

export default function AccessibilityPanel() {
  const {
    font,
    setFont,
    fontSize,
    setFontSize,
    spacing,
    setSpacing,
    theme,
    setTheme
  } = useContext(AccessibilityContext);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="accessibility-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        ⚙️ Accesibilidad
      </button>

      <aside className={`accessibility-panel ${isOpen ? "open" : ""}`}>
        <div className="panel-header">
          <h2>Personalizar vista</h2>
          <button
            className="close-button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar panel"
          >
            ✕
          </button>
        </div>

        <div className="panel-content">
          {/* Fuente */}
          <div className="panel-control-group">
            <label className="control-title">
              Fuente: <span className="control-value">{font || "Lato"}</span>
            </label>
            <select 
              className="panel-select"
              value={font || "Lato"} 
              onChange={(e) => {
                const newFont = e.target.value;
                console.log("Cambiando fuente a:", newFont);
                setFont(newFont);
              }}
            >
              <option value="Lato">Lato (Estándar)</option>
              <option value="Lexend">Lexend (Google)</option>
              <option value="Arial">Arial (Sans-serif)</option>
              <option value="Georgia">Georgia (Serif)</option>
              <option value="LexendLocal">Lexend (Local - Dislexia)</option>
              <option value="AtkinsonLocal">Atkinson Hyperlegible (Local)</option>
              <option value="OpenDyslexicLocal">OpenDyslexic (Local - Dislexia)</option>
            </select>
          </div>

          {/* Tamaño letra */}
          <div className="panel-control-group">
            <label className="control-title">
              Tamaño de letra: <span className="control-value">{fontSize}px</span>
            </label>
            <input
              className="panel-range"
              type="range"
              min="14"
              max="28"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </div>

          {/* Espaciado */}
          <div className="panel-control-group">
            <label className="control-title">
              Interlineado: <span className="control-value">{spacing.toFixed(1)}</span>
            </label>
            <input
              className="panel-range"
              type="range"
              min="1"
              max="2.5"
              step="0.1"
              value={spacing}
              onChange={(e) => setSpacing(Number(e.target.value))}
            />
          </div>

          {/* Temas */}
          <div className="panel-control-group">
            <label className="control-title">Temas</label>
            <select
              className="panel-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="white">Blanco</option>
              <option value="sepia">Sepia</option>
              <option value="cream">Crema</option>
              <option value="dark">Oscuro (Dislexia)</option>
            </select>
          </div>

          {/* Botón de Reset */}
          <button
            onClick={() => {
              localStorage.clear();
              setFont("Lato");
              setFontSize(18);
              setSpacing(1.6);
              setTheme('white');
              window.location.reload();
            }}
            style={{
              padding: "1rem 1.5rem",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "1.5rem",
              fontSize: "1rem",
              fontWeight: "700",
              transition: "all 0.3s ease",
              width: "100%",
              boxShadow: "0 2px 8px rgba(231, 76, 60, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#c0392b";
              e.target.style.boxShadow = "0 4px 12px rgba(231, 76, 60, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#e74c3c";
              e.target.style.boxShadow = "0 2px 8px rgba(231, 76, 60, 0.3)";
            }}
          >
            🔄 Resetear configuración
          </button>
        </div>
      </aside>
    </>
  );
}
