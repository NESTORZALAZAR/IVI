import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AccessibilityProvider, AccessibilityContext } from "./context/AccessibilityContext";
import { useContext, useEffect } from "react";

// 🏛️ Páginas Públicas / Base
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/NewHomePage";
import AboutPage from "./pages/AboutPage";
import DocumentReaderPage from "./pages/DocumentReaderPage";
import TextReaderPage from "./pages/TextReaderPage";

// 🗺️ Layout & Componentes Globales
import TopNav from "./components/layouts/TopNav/TopNav";
import TextToSpeechPopup from "./components/common/TextToSpeechPopup/TextToSpeechPopup";
import ImageOCRReader from "./components/common/ImageOCRReader/ImageOCRReader";
import "../css/App.css";

// 👑 Vistas Temporales de Roles (Placeholders hasta que creemos los archivos reales)
const AdminDashboard = () => (
  <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
    <h1>Panel de Administración (Desarrollador)</h1>
    <p>Vista en desarrollo con permisos totales.</p>
  </div>
);

const ProDashboard = () => (
  <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
    <h1>Panel Profesional (Psicólogos / Maestros)</h1>
    <p>Vista en desarrollo para gestión de pacientes y test.</p>
  </div>
);

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

/**
 * 🛡️ Componente Guardián de Rutas (ProtectedRoute)
 */
function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("ivi_user")) || null; 

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppLayout({ children }) {
  const { fontSize, spacing, theme, font } = useContext(AccessibilityContext);

  useEffect(() => {
    const fontFamily = FONT_MAP[font] || FONT_MAP.Lexend;

    document.documentElement.style.setProperty("--app-font-family", fontFamily);
    document.documentElement.style.setProperty("--app-font-size", `${fontSize}px`);
    document.documentElement.style.setProperty("--app-line-height", `${spacing}`);

    const oldStyle = document.getElementById("accessibility-style");
    if (oldStyle) oldStyle.remove();

    const style = document.createElement("style");
    style.id = "accessibility-style";

    style.innerHTML = `
      * {
        font-family: var(--app-font-family) !important;
        font-size: var(--app-font-size) !important;
        line-height: var(--app-line-height) !important;
      }
    `;
    document.head.appendChild(style);

    document.documentElement.setAttribute("data-theme", theme);
  }, [font, fontSize, spacing, theme]);

  return (
    <div className="app-container">
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
          {/* ==========================================================
              RUTAS PÚBLICAS
             ========================================================== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutPage />} />
          
          <Route path="/lector-documentos" element={<DocumentReaderPage />} />
          <Route path="/lector-textos" element={<TextReaderPage />} />

          {/* ==========================================================
              RUTAS PROTEGIDAS POR ROL
             ========================================================== */}
          
          {/* 👑 Rol 1: Desarrollador / Admin Total */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* 🩺 Rol 2: Profesional */}
          <Route 
            path="/professional/dashboard" 
            element={
              <ProtectedRoute allowedRoles={["professional"]}>
                <ProDashboard />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
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