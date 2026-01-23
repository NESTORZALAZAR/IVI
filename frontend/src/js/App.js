import HomePage from "./pages/HomePage";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { useContext, useEffect } from "react";
import { AccessibilityContext } from "./context/AccessibilityContext";

// Mapeo de fuentes
const FONT_MAP = {
  "Lato": "'Lato', sans-serif",
  "Lexend": "'Lexend', sans-serif",
  "Arial": "Arial, sans-serif",
  "Georgia": "Georgia, serif"
};

function AppContent() {
  const { fontSize, spacing, contrast, background, font } =
    useContext(AccessibilityContext);

  // Aplicar estilos globales
  useEffect(() => {
    const fontFamily = FONT_MAP[font] || FONT_MAP["Lato"];
    
    // Aplicar al documento
    document.documentElement.style.fontFamily = fontFamily;
    document.body.style.fontFamily = fontFamily;
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.body.style.fontSize = `${fontSize}px`;
    document.body.style.lineHeight = spacing;
    
    // Aplicar a todos los elementos
    const style = document.createElement("style");
    style.id = "accessibility-style";
    const oldStyle = document.getElementById("accessibility-style");
    if (oldStyle) oldStyle.remove();
    
    style.innerHTML = `
      * { 
        font-family: ${fontFamily} !important;
        line-height: ${spacing} !important;
      }
      html, body {
        font-size: ${fontSize}px !important;
      }
    `;
    document.head.appendChild(style);
  }, [font, fontSize, spacing]);

  const appStyles = {
    fontFamily: FONT_MAP[font] || FONT_MAP["Lato"],
    fontSize: `${fontSize}px`,
    lineHeight: spacing,
    backgroundColor: contrast
      ? "#000000"
      : background === "sepia"
      ? "#f4ecd8"
      : background === "cream"
      ? "#fff8e7"
      : "#ffffff",
    color: contrast ? "#FFFF00" : "#333333",
    transition: "all 0.25s ease",
    filter: contrast ? "contrast(1.3)" : "none",
    minHeight: "100vh"
  };

  return (
    <div className="app-container" style={appStyles}>
      <HomePage />
    </div>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  );
}

export default App;
