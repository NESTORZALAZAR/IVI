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
    contrast,
    setContrast,
    background,
    setBackground
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
              <option value="Lexend">Lexend (Dislexia)</option>
              <option value="Arial">Arial (Sans-serif)</option>
              <option value="Georgia">Georgia (Serif)</option>
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

          {/* Fondo */}
          <div className="panel-control-group">
            <label className="control-title">Fondo</label>
            <select
              className="panel-select"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            >
              <option value="white">Blanco</option>
              <option value="cream">Crema</option>
              <option value="sepia">Sepia</option>
            </select>
          </div>

          {/* Contraste */}
          <div className="panel-control-group">
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={contrast}
                onChange={(e) => setContrast(e.target.checked)}
                style={{ cursor: "pointer", width: "18px", height: "18px" }}
              />
              <span className="control-title" style={{ margin: 0 }}>Contraste alto</span>
            </label>
          </div>

          {/* Botón de Reset */}
          <button
            onClick={() => {
              localStorage.clear();
              setFont("Lato");
              setFontSize(18);
              setSpacing(1.6);
              setContrast(false);
              setBackground("white");
              window.location.reload();
            }}
            style={{
              padding: "10px 15px",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "10px",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            🔄 Resetear configuración
          </button>
        </div>
      </aside>
    </>
  );
}
