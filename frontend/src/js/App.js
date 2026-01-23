import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { useContext, useEffect } from "react";
import { AccessibilityContext } from "./context/AccessibilityContext";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/NewHomePage";
import AboutPage from "./pages/AboutPage";
import TopNav from "./components/layouts/TopNav/TopNav";
import AccessibilityPanel from "./components/common/AccessibilityPanel/AccessibilityPanel";
import "../css/App.css";

// Mapeo de fuentes
const FONT_MAP = {
  "Lato": "'Lato', sans-serif",
  "Lexend": "'Lexend', sans-serif",
  "Arial": "Arial, sans-serif",
  "Georgia": "Georgia, serif"
};

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

function AppLayout({ children }) {
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
      {children}
    </div>
  );
}

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TopNav />
                <HomePage />
                <AccessibilityPanel />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TopNav />
                <AboutPage />
                <AccessibilityPanel />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
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
