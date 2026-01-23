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
        <h2>Personalizar vista</h2>

        {/* Fuente */}
        <label>
          Fuente
          <select 
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
        </label>

        {/* Tamaño letra */}
        <label>
          Tamaño de letra: {fontSize}px
          <input
            type="range"
            min="14"
            max="28"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </label>

        {/* Espaciado */}
        <label>
          Interlineado: {spacing.toFixed(1)}
          <input
            type="range"
            min="1"
            max="2.5"
            step="0.1"
            value={spacing}
            onChange={(e) => setSpacing(Number(e.target.value))}
          />
        </label>

        {/* Fondo */}
        <label>
          Fondo
          <select
            value={background}
            onChange={(e) => setBackground(e.target.value)}
          >
            <option value="white">Blanco</option>
            <option value="cream">Crema</option>
            <option value="sepia">Sepia</option>
          </select>
        </label>

        {/* Contraste */}
        <label>
          <input
            type="checkbox"
            checked={contrast}
            onChange={(e) => setContrast(e.target.checked)}
          />
          Contraste alto
        </label>

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
      </aside>
    </>
  );
}
