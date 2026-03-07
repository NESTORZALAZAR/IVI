import { useContext, useState } from "react";
import { AccessibilityContext } from "../../context/AccessibilityContext";
import "../../css/AccessibilityPanel.css";

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
        <h2>Personalizar vista</h2>

        {/* Fuente */}
        <label>
          Fuente
          <select value={font} onChange={(e) => setFont(e.target.value)}>
            <option value="Lato">Lato (Estándar)</option>
            <option value="Lexend">Lexend (Google)</option>
            <option value="Arial">Arial (Sans-serif)</option>
            <option value="Georgia">Georgia (Serif)</option>
            <option value="LexendLocal">Lexend (Local - Dislexia)</option>
            <option value="AtkinsonLocal">Atkinson Hyperlegible (Local)</option>
            <option value="OpenDyslexicLocal">OpenDyslexic (Local - Dislexia)</option>
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

        {/* Temas */}
        <label>
          Temas
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="white">Blanco</option>
            <option value="sepia">Sepia</option>
            <option value="cream">Crema</option>
            <option value="dark">Oscuro (Dislexia)</option>
          </select>
        </label>
      </aside>
    </>
  );
}
