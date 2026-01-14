import HomePage from "./pages/HomePage";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { useContext, useEffect } from "react";
import { AccessibilityContext } from "./context/AccessibilityContext";

function AppContent() {
  const { fontSize, spacing, contrast, background, font } =
    useContext(AccessibilityContext);

  // Aplica el tamaño de letra globalmente
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  const appStyles = {
    fontFamily: font,
    lineHeight: spacing,
    backgroundColor:
      background === "sepia"
        ? "#f4ecd8"
        : background === "cream"
        ? "#fff8e7"
        : "#ffffff",
    color: contrast ? "#000000" : "#333333",
    transition: "font-size 0.2s ease, line-height 0.2s ease"
  };

  return (
    <div style={appStyles} className="app-container accessible-text">
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
