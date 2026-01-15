import HomePage from "./pages/HomePage";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { useContext, useEffect } from "react";
import { AccessibilityContext } from "./context/AccessibilityContext";

function AppContent() {
  const { fontSize, spacing, contrast, background, font } =
    useContext(AccessibilityContext);

  // Tamaño de letra GLOBAL
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // Fuente GLOBAL
  useEffect(() => {
    document.documentElement.style.fontFamily = font;
    document.body.style.fontFamily = font;
  }, [font]);

  const appStyles = {
    lineHeight: spacing,
    backgroundColor:
      background === "sepia"
        ? "#f4ecd8"
        : background === "cream"
        ? "#fff8e7"
        : "#ffffff",
    color: contrast ? "#000000" : "#333333",
    transition: "all 0.25s ease"
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
