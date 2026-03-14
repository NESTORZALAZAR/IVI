import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { useContext, useEffect } from "react";
import { AccessibilityContext } from "./context/AccessibilityContext";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/NewHomePage";
import AboutPage from "./pages/AboutPage";
import DocumentReaderPage from "./pages/DocumentReaderPage";
import TextReaderPage from "./pages/TextReaderPage";
import ImageReaderPage from "./pages/ImageReaderPage";
import ResultadosPage from "./pages/ResultadosPage";
import PruebasPage from "./pages/PruebasPage";
import PruebaLecturaPage from "./pages/PruebaLecturaPage";
import PruebaVelocidadPage from "./pages/PruebaVelocidadPage";
import PruebaComprensionPage from "./pages/PruebaComprensionPage";
import PruebaOrtografiaPage from "./pages/PruebaOrtografiaPage";

import TopNav from "./components/layouts/TopNav/TopNav";
import TextToSpeechPopup from "./components/common/TextToSpeechPopup/TextToSpeechPopup";
import ImageOCRReader from "./components/common/ImageOCRReader/ImageOCRReader";
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

    // 🔤 Tipografía global
    document.documentElement.style.fontFamily = fontFamily;
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.body.style.fontFamily = fontFamily;
    document.body.style.fontSize = `${fontSize}px`;
    document.body.style.lineHeight = spacing;

    // Eliminar estilos previos
    const oldStyle = document.getElementById("accessibility-style");
    if (oldStyle) oldStyle.remove();

    const style = document.createElement("style");
    style.id = "accessibility-style";

    let contrastStyles = "";

    style.innerHTML = `
      * {
        font-family: ${fontFamily} !important;
        font-size: ${fontSize}px !important;
        line-height: ${spacing} !important;
      }
      ${contrastStyles}
    `;
    document.head.appendChild(style);

    // 🎨 Tema global
    document.documentElement.setAttribute("data-theme", theme);
  }, [font, fontSize, spacing, theme]);

  const appStyles = {
    fontFamily: FONT_MAP[font] || FONT_MAP["Lato"],
    fontSize: `${fontSize}px`,
    lineHeight: spacing,
    backgroundColor: theme === "dark"
      ? "#1a1a2e"
      : theme === "sepia"
      ? "#f4ecd8"
      : theme === "cream"
      ? "#fff8e7"
      : "#f7f3e9",
    color: theme === "dark" ? "#e8dcc8" : "#333333",
    transition: "all 0.25s ease",
    minHeight: "100vh"
  };

  return (
    <div className="app-container" style={appStyles}>
      {children}
      <TextToSpeechPopup />
      <ImageOCRReader />
    </div>
  );
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
          <Route path="/lector-textos" element={<TextReaderPage />} />
          <Route path="/lector-imagenes" element={<ImageReaderPage />} />

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
