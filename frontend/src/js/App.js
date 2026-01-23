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
        * {
          background-color: #000000 !important;
          color: #FFFF00 !important;
          border-color: #FFFF00 !important;
        }
        a {
          color: #00FFFF !important;
        }
        button {
          background-color: #333333 !important;
          color: #FFFF00 !important;
          border-color: #FFFF00 !important;
        }
        input, select, textarea {
          background-color: #1a1a1a !important;
          color: #FFFF00 !important;
          border-color: #FFFF00 !important;
        }
        input::placeholder {
          color: #CCCC00 !important;
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

