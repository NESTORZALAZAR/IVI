import HomePage from "./pages/HomePage";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { useContext } from "react";
import { AccessibilityContext } from "./context/AccessibilityContext";

function AppContent() {
  const { fontSize, spacing, contrast, background, font } = useContext(AccessibilityContext);

  const appStyles = {
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
    transition: "all 0.3s ease"
  };

  return (
    <div style={appStyles} className="app-container">
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

