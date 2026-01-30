import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { useContext, useEffect } from "react";
import { AccessibilityContext } from "./context/AccessibilityContext";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/NewHomePage";
import AboutPage from "./pages/AboutPage";
import DocumentReaderPage from "./pages/DocumentReaderPage";
import ResultadosPage from "./pages/ResultadosPage";
import PruebasPage from "./pages/PruebasPage";
import PruebaLecturaPage from "./pages/PruebaLecturaPage";
import PruebaVelocidadPage from "./pages/PruebaVelocidadPage";
import PruebaComprensionPage from "./pages/PruebaComprensionPage";
import PruebaOrtografiaPage from "./pages/PruebaOrtografiaPage";

import TopNav from "./components/layouts/TopNav/TopNav";
import "../css/App.css";

// 🧠 Mapeo de fuentes accesibles
const FONT_MAP = {
  Lato: "'Lato', sans-serif",
  Lexend: "'Lexend', sans-serif",
  Arial: "Arial, sans-serif",
  Georgia: "Georgia, serif",
  LexendLocal: "'Lexend-Local', sans-serif",
  AtkinsonLocal: "'Atkinson-Local', sans-serif",
  OpenDyslexicLocal: "'OpenDyslexic-Local', sans-serif"
};

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

function AppLayout({ children }) {
  const { fontSize, spacing, theme, font } = useContext(AccessibilityContext);

  useEffect(() => {
    const fontFamily = FONT_MAP[font] || FONT_MAP.Lexend;

    // 🔤 Tipografía global - Aplicar a múltiples elementos
    document.documentElement.style.fontFamily = fontFamily;
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.body.style.fontFamily = fontFamily;
    document.body.style.fontSize = `${fontSize}px`;
    document.body.style.lineHeight = spacing;

    // 🎨 Aplicar tema (fondo + colores)
    let bgColor = "#ffffff";
    let textColor = "#000000";
    
    if (theme === "sepia") {
      bgColor = "#f4ecd8";
      textColor = "#5c4a3a";
    } else if (theme === "cream") {
      bgColor = "#fff8e7";
      textColor = "#4a4a4a";
    } else if (theme === "dark") {
      bgColor = "#1a1a1a";
      textColor = "#e8d4b8";
    }
    
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;

    // Aplicar a todos los elementos de texto
    const style = document.getElementById("accessibility-fonts");
    if (style) style.remove();
    
    const newStyle = document.createElement("style");
    newStyle.id = "accessibility-fonts";
    newStyle.innerHTML = `
      * {
        font-family: ${fontFamily} !important;
        font-size: ${fontSize}px !important;
        line-height: ${spacing} !important;
      }
    `;
    document.head.appendChild(newStyle);

    // 🎨 Tema global
    document.documentElement.setAttribute("data-theme", theme);
  }, [font, fontSize, spacing, theme]);

  return <div className="app-container">{children}</div>;
}

function AppContent() {
  return (
    <Router>
      <AppLayout>
        <TopNav />

        <Routes>
          {/* Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/lector-documentos" element={<DocumentReaderPage />} />

          {/* Protegidas */}
          <Route
            path="/resultados"
            element={
              <ProtectedRoute>
                <ResultadosPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pruebas"
            element={
              <ProtectedRoute>
                <PruebasPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pruebas/lectura"
            element={
              <ProtectedRoute>
                <PruebaLecturaPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pruebas/velocidad"
            element={
              <ProtectedRoute>
                <PruebaVelocidadPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pruebas/comprension"
            element={
              <ProtectedRoute>
                <PruebaComprensionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pruebas/ortografia"
            element={
              <ProtectedRoute>
                <PruebaOrtografiaPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppLayout>
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
