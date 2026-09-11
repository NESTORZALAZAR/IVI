import { useState, useContext, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AccessibilityContext } from "../../../context/AccessibilityContext";
import "./TopNav.css";

export default function TopNav() {
  const [showWarning, setShowWarning] = useState(true);
  const navigate = useNavigate();
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showLectores, setShowLectores] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const dropdownRef = useRef(null);
  const adminRef = useRef(null);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowLectores(false);
      }
      if (adminRef.current && !adminRef.current.contains(e.target)) {
        setShowAdminMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    font,
    setFont,
    fontSize,
    setFontSize,
    spacing,
    setSpacing,
    theme,
    setTheme
  } = useContext(AccessibilityContext);

  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAbout = location.pathname === "/about";
  const isLectorDocs = location.pathname === "/lector-documentos";
  const isLectorText = location.pathname === "/lector-textos";
  const isPaciente = location.pathname === "/paciente";

  // Detectar sesión del usuario
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedIn = !!localStorage.getItem("token");
  const isAdmin = parsedUser && parsedUser.role === "admin";
  const isDoctor = parsedUser && parsedUser.role === "doctor";
  const isPatient = parsedUser && parsedUser.role === "patient";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="topnav" role="navigation" aria-label="Navegación principal">
      {/* Badge flotante de advertencia */}
      {showWarning && (
        <div className="floating-warning-badge" role="status" aria-live="polite">
          <span>
            ⚠️ Los resultados son orientativos y no constituyen un diagnóstico médico. Se recomienda acudir a un profesional especializado para una evaluación completa.
          </span>
          <button 
            className="close-warning-badge" 
            aria-label="Cerrar advertencia" 
            onClick={() => setShowWarning(false)}
          >
            ×
          </button>
        </div>
      )}

      <div className="topnav-container">
        <div className="topnav-primary">
          {/* Logo / Marca */}
          <div className="topnav-brand">
            <Link to="/" className="brand-link">
              <img
                className="brand-logo"
                src="/images/logoNuevoSF.png"
                alt="IVI"
              />
              <div className="brand-text">
                <h1>IVI</h1>
                <p>Plataforma de Apoyo y Tamizaje Disléxico</p>
              </div>
            </Link>
          </div>

          {/* Menú principal */}
          <div className="topnav-menu primary-menu">
          <Link 
            to="/" 
            className={`nav-link ${isHome ? 'active' : ''}`}
          >
            Inicio
          </Link>

          <Link 
            to="/about" 
            className={`nav-link ${isAbout ? 'active' : ''}`}
          >
            Acerca de
          </Link>

          {/* Menú desplegable: IVI te ayuda */}
          <div className="nav-dropdown" ref={dropdownRef}>
            <button
              className={`nav-link accessibility-btn dropdown-btn ${showLectores || isLectorDocs || isLectorText ? 'active' : ''}`}
              onClick={() => setShowLectores(prev => !prev)}
              aria-haspopup="true"
              aria-expanded={showLectores}
            >
              <span>Ivi te ayuda:</span>
            </button>

            {showLectores && (
              <div className="dropdown-menu">
                <Link
                  to="/lector-documentos"
                  className={`dropdown-link ${isLectorDocs ? 'active' : ''}`}
                  onClick={() => setShowLectores(false)}
                >
                  📄 Lectura de Documentos
                </Link>
                <Link
                  to="/lector-textos"
                  className={`dropdown-link ${isLectorText ? 'active' : ''}`}
                  onClick={() => setShowLectores(false)}
                >
                  ✏️ Lectura de Textos
                </Link>
              </div>
            )}
          </div>

          </div>

        </div>

        <div className="topnav-actions">
          <div className="topnav-menu actions-menu">
          {/* Rutas condicionales por autenticación y roles */}
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="nav-link login-btn">
                Iniciar Sesión
              </Link>
              <Link to="/signup" className="nav-link signup-btn">
                Registrarse
              </Link>
            </>
          ) : (
            <>
              {isPatient && (
                <Link 
                  to="/paciente" 
                  className={`nav-link ${isPaciente ? 'active' : ''}`}
                >
                  Mi Perfil
                </Link>
              )}

              {isDoctor && (
                <Link to="/doctor" className="nav-link">
                  Doctor
                </Link>
              )}

              {isAdmin && (
                <div className="nav-dropdown admin-dropdown" ref={adminRef}>
                  <button
                    className={`nav-link accessibility-btn dropdown-btn ${showAdminMenu ? 'active' : ''}`}
                    onClick={() => setShowAdminMenu(prev => !prev)}
                    aria-haspopup="true"
                    aria-expanded={showAdminMenu}
                  >
                    Admin
                  </button>
                  {showAdminMenu && (
                    <div className="dropdown-menu admin-menu">
                      <Link className="dropdown-link" to="/admin" onClick={() => setShowAdminMenu(false)}>
                        Panel Admin
                      </Link>
                      <Link className="dropdown-link" to="/admin/users" onClick={() => setShowAdminMenu(false)}>
                        Usuarios
                      </Link>
                      <Link className="dropdown-link" to="/admin/results" onClick={() => setShowAdminMenu(false)}>
                        Resultados
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <button 
                className="nav-link logout-btn" 
                onClick={handleLogout}
                aria-label="Cerrar sesión"
              >
                Salir
              </button>
            </>
          )}

          {/* 🌟 BOTÓN GLOBAL DE PERSONALIZAR VISTA (UBICADO A LA DERECHA DEL TODO) */}
          <button
            type="button"
            className="nav-link global-accessibility-trigger"
            onClick={() => setShowAccessibility(prev => !prev)}
            aria-label="Personalizar vista"
            aria-expanded={showAccessibility}
          >
            <span aria-hidden="true" className="access-icon">◔</span>
            <span className="access-text">Personalizar vista</span>
          </button>
          </div>
        </div>

        {/* Modal Configuraciones de Accesibilidad */}
        {showAccessibility && (
          <div className="accessibility-modal-overlay" onClick={() => setShowAccessibility(false)}>
            <div className="accessibility-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Personalizar vista</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowAccessibility(false)}
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>

              <div className="modal-content">
                {/* Selección de Fuentes */}
                <div className="modal-control-group">
                  <label className="control-label-modal">
                    Fuente: <span>{font || "Lato"}</span>
                  </label>
                  <select
                    value={font || "Lato"}
                    onChange={(e) => setFont(e.target.value)}
                    className="modal-select"
                  >
                    <option value="Lato">Lato (Estándar)</option>
                    <option value="Lexend">Lexend (Google)</option>
                    <option value="Arial">Arial (Sans-serif)</option>
                    <option value="Georgia">Georgia (Serif)</option>
                    <option value="LexendLocal">Lexend (Local - Dislexia)</option>
                    <option value="AtkinsonLocal">Atkinson Hyperlegible (Local)</option>
                    <option value="OpenDyslexicLocal">OpenDyslexic (Local - Dislexia)</option>
                  </select>
                </div>

                {/* Ajuste de Tamaño de Fuente */}
                <div className="modal-control-group">
                  <label className="control-label-modal">
                    Tamaño: <span>{fontSize}px</span>
                  </label>
                  <input
                    type="range"
                    min="14"
                    max="28"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="modal-range"
                  />
                </div>

                {/* Ajuste de Interlineado */}
                <div className="modal-control-group">
                  <label className="control-label-modal">
                    Interlineado: <span>{spacing.toFixed(1)}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.1"
                    value={spacing}
                    onChange={(e) => setSpacing(Number(e.target.value))}
                    className="modal-range"
                  />
                </div>

                {/* Selección de Tema */}
                <div className="modal-control-group">
                  <label className="control-label-modal">Temas</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="modal-select"
                  >
                    <option value="white">Blanco</option>
                    <option value="sepia">Sepia</option>
                    <option value="cream">Crema</option>
                    <option value="dark">Oscuro (Dislexia)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}