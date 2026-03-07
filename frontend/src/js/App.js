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

    // 🔤 Tipografía global - Aplicar a múltiples elementos
    document.documentElement.style.fontFamily = fontFamily;
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.body.style.fontFamily = fontFamily;
    document.body.style.fontSize = `${fontSize}px`;
    document.body.style.lineHeight = spacing;

    // 🎨 Aplicar tema (fondo + colores)
    let bgColor = "#ffffff";
    let textColor = "#000000";
    
<<<<<<< HEAD
    // Aplicar a todos los elementos
    const style = document.createElement("style");
    style.id = "accessibility-style";
    const oldStyle = document.getElementById("accessibility-style");
    if (oldStyle) oldStyle.remove();
    
    let contrastStyles = "";
    if (contrast) {
      contrastStyles = `
        /* Fondos oscuros para contenedores — excepto el modal de accesibilidad */
        html, body, #root,
        .app-container, main, section, article, aside, footer,
        .home-page, .container, .hero, .features, .feature-card,
        .accessibility-tips, .cta, .card,
        .topnav, .topnav-container, .nav-links,
        .page-wrapper, .content, .results-container {
          background-color: #000000 !important;
        }
        /* Color de texto para todos los elementos — excepto modal de accesibilidad */
        *:not(.accessibility-modal-overlay):not(.accessibility-modal):not(.accessibility-modal *):not(.modal-header):not(.modal-header *):not(.modal-content):not(.modal-content *):not(.modal-close) {
          color: #FFFF00 !important;
          border-color: #FFFF00 !important;
        }
        /* El overlay solo usa transparencia, no negro sólido */
        .accessibility-modal-overlay {
          background-color: rgba(0, 0, 0, 0.6) !important;
        }
        /* El modal de accesibilidad mantiene sus propios colores */
        .accessibility-modal,
        .accessibility-modal * {
          background-color: revert !important;
          color: revert !important;
          border-color: revert !important;
        }
        a {
          color: #00FFFF !important;
          text-decoration: underline !important;
        }
        a:hover {
          color: #ffffff !important;
        }
        button:not(.accessibility-modal button):not(.modal-close) {
          background-color: #222222 !important;
          color: #FFFF00 !important;
          border: 2px solid #FFFF00 !important;
        }
        button:not(.accessibility-modal button):not(.modal-close):hover {
          background-color: #333333 !important;
        }
        input:not(.accessibility-modal input),
        select:not(.accessibility-modal select),
        textarea:not(.accessibility-modal textarea) {
          background-color: #111111 !important;
          color: #FFFF00 !important;
          border: 2px solid #FFFF00 !important;
        }
        input::placeholder {
          color: #CCCC00 !important;
        }
        /* Imágenes: no tocar fondo */
        img, svg, canvas, video {
          background-color: transparent !important;
          filter: brightness(0.9) contrast(1.1);
        }
        /* Scrollbar */
        ::-webkit-scrollbar-track {
          background: #111111 !important;
        }
        ::-webkit-scrollbar-thumb {
          background: #FFFF00 !important;
        }
      `;
=======
    if (theme === "sepia") {
      bgColor = "#f4ecd8";
      textColor = "#5c4a3a";
    } else if (theme === "cream") {
      bgColor = "#fff8e7";
      textColor = "#4a4a4a";
    } else if (theme === "dark") {
      bgColor = "#1a1a1a";
      textColor = "#e8d4b8";
>>>>>>> 294325eae5f1d74e9929a94714aab5b75590f67e
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

<<<<<<< HEAD
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
    minHeight: "100vh"
  };

  return (
    <div className="app-container" style={appStyles}>
      {children}
      <TextToSpeechPopup />
      <ImageOCRReader />
    </div>
  );
=======
    // 🎨 Tema global
    document.documentElement.setAttribute("data-theme", theme);
  }, [font, fontSize, spacing, theme]);

  return <div className="app-container">{children}</div>;
>>>>>>> 294325eae5f1d74e9929a94714aab5b75590f67e
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
