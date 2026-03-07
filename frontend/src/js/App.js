import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { useContext, useEffect } from "react";
import { AccessibilityContext } from "./context/AccessibilityContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/NewHomePage";
import AboutPage from "./pages/AboutPage";
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
    }
    
    style.innerHTML = `
      * { 
        font-family: ${fontFamily} !important;
        line-height: ${spacing} !important;
      }
      html, body {
        font-size: ${fontSize}px !important;
      }
      ${contrastStyles}
    `;
    document.head.appendChild(style);
  }, [font, fontSize, spacing, contrast]);

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
}

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Página principal sin login */}
        <Route
          path="/"
          element={
            <AppLayout>
              <TopNav />
              <HomePage />
            </AppLayout>
          }
        />
        
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/about"
          element={
            <AppLayout>
              <TopNav />
              <AboutPage />
            </AppLayout>
          }
        />
        
        {/* Rutas protegidas */}
        <Route
          path="/resultados"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TopNav />
                <ResultadosPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Rutas de Pruebas */}
        <Route
          path="/pruebas"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TopNav />
                <PruebasPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pruebas/lectura"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TopNav />
                <PruebaLecturaPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pruebas/velocidad"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TopNav />
                <PruebaVelocidadPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pruebas/comprension"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TopNav />
                <PruebaComprensionPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pruebas/ortografia"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TopNav />
                <PruebaOrtografiaPage />
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

