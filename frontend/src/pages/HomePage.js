import { useContext } from "react";
import { AccessibilityContext } from "../context/AccessibilityContext";

export default function HomePage() {
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

  // Estilos dinámicos para la página
  const styles = {
    fontFamily: font,
    fontSize: `${fontSize}px`,
    lineHeight: spacing,
    backgroundColor:
      background === "sepia"
        ? "#f4ecd8"
        : background === "cream"
        ? "#fff8e7"
        : "#ffffff",
    color: contrast ? "#000000" : "#333333",
    minHeight: "100vh",
    padding: "2rem"
  };

  return (
    <main style={styles} tabIndex="0" className="accessible-text">
      <h1>IVI – Plataforma de Apoyo y Tamizaje Disléxico</h1>
      <p>
        IVI ayuda a personas con dislexia, familiares y profesionales con información confiable,
        juegos interactivos y herramientas de lectura accesibles.
      </p>

      <h2>Opciones de accesibilidad</h2>

      {/* Selector de fuente */}
      <label>
        Fuente:{" "}
        <select value={font} onChange={(e) => setFont(e.target.value)}>
          <option value="Lexend">Lexend</option>
          <option value="OpenDyslexic">OpenDyslexic</option>
          <option value="Atkinson">Atkinson Hyperlegible</option>
        </select>
      </label>

      {/* Selector de tamaño */}
      <label style={{ marginLeft: "1rem" }}>
        Tamaño de letra:{" "}
        <input
          type="number"
          min="12"
          max="48"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />{" "}
        px
      </label>

      {/* Selector de espaciado */}
      <label style={{ marginLeft: "1rem" }}>
        Espaciado (interlineado):{" "}
        <input
          type="number"
          min="1"
          max="3"
          step="0.1"
          value={spacing}
          onChange={(e) => setSpacing(Number(e.target.value))}
        />
      </label>

      {/* Selector de fondo */}
      <label style={{ marginLeft: "1rem" }}>
        Fondo:{" "}
        <select value={background} onChange={(e) => setBackground(e.target.value)}>
          <option value="white">Blanco</option>
          <option value="cream">Crema</option>
          <option value="sepia">Sepia</option>
        </select>
      </label>

      {/* Contraste alto */}
      <label style={{ marginLeft: "1rem" }}>
        Contraste alto:{" "}
        <input
          type="checkbox"
          checked={contrast}
          onChange={(e) => setContrast(e.target.checked)}
        />
      </label>
    </main>
  );
}

