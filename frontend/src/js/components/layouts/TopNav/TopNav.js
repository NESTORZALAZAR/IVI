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

  // Cerrar dropdown al hacer clic fuera
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
  
  // Detectar si el usuario está logeado
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedIn = !!localStorage.getItem("token");
  const isAdmin = parsedUser && parsedUser.role === 'admin';

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
          <button className="close-warning-badge" aria-label="Cerrar advertencia" onClick={() => setShowWarning(false)}>
            ×
          </button>
        </div>
      )}
      <div className="topnav-container">
        <div className="topnav-brand">
          <Link to="/" className="brand-link">
            <img 
              src="/images/logoSF.png" 
              alt="Logo de IVI" 
              className="brand-logo" 
              style={{ width: fontSize * 2.5 + 'px', height: fontSize * 2.5 + 'px', minWidth: fontSize * 2.5 + 'px', minHeight: fontSize * 2.5 + 'px', objectFit: 'contain' }}
            />
            <div className="brand-text">
              <h1>IVI</h1>
              <p>Plataforma de Apoyo y Tamizaje Dislexico</p>
            </div>
          </Link>
        </div>

        <div className="topnav-menu">
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
          <div className="nav-dropdown" ref={dropdownRef}>
            <button
              className={`nav-link accessibility-btn dropdown-btn ${showLectores ? 'active' : ''}`}
              onClick={() => setShowLectores(prev => !prev)}
              aria-haspopup="true"
              aria-expanded={showLectores}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, fontSize: '1.1rem', padding: '0.6rem 1.2rem', minWidth: '48px', height: '48px', backgroundColor: 'var(--border)' }}
            >
              <img 
                src="/images/IviLector.png" 
                alt="IVI te ayuda" 
                title="IVI te ayuda"
                style={{ width: fontSize * 1.7 + 'px', height: fontSize * 1.7 + 'px', minWidth: fontSize * 1.7 + 'px', minHeight: fontSize * 1.7 + 'px', objectFit: 'contain', display: 'inline-block' }}
              />
              <span>Ivi te ayuda:</span>
            </button>
            {showLectores && (
              <div className="dropdown-menu">
                <Link
                  to="/lector-documentos"
                  className="dropdown-link"
                  onClick={() => setShowLectores(false)}
                >
                  📄 Lectura de Documentos
                </Link>
                <Link
                  to="/lector-textos"
                  className="dropdown-link"
                  onClick={() => setShowLectores(false)}
                >
                  ✏️ Lectura de Textos
                </Link>
              </div>
            )}
          </div>
          
          {/* Mostrar botones según si está logeado o no */}
          {!isLoggedIn ? (
            <>
              <Link 
                to="/signup" 
                className="nav-link signup-btn"
              >
                Registrarse
              </Link>
              <Link 
                to="/login" 
                className="nav-link login-btn"
              >
                Iniciar Sesión
              </Link>
            </>
          ) : (
            <>
              {isAdmin && (
                <div className="nav-dropdown admin-dropdown" ref={adminRef}>
                  <button
                    className={`nav-link dropdown-btn ${showAdminMenu ? 'active' : ''}`}
                    onClick={() => setShowAdminMenu(prev => !prev)}
                    aria-haspopup="true"
                    aria-expanded={showAdminMenu}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
                  >
                    Admin
                  </button>
                  {showAdminMenu && (
                    <div className="dropdown-menu admin-menu">
                      <Link className="dropdown-link" to="/admin">Panel Admin</Link>
                      <Link className="dropdown-link" to="/admin/users">Usuarios</Link>
                      <Link className="dropdown-link" to="/admin/profiles">Perfiles</Link>
                      <Link className="dropdown-link" to="/admin/results">Resultados</Link>
                      <Link className="dropdown-link" to="/admin/lector">Lector</Link>
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

          <button
            className="nav-link accessibility-btn"
            onClick={() => setShowAccessibility(!showAccessibility)}
            aria-label="Abrir panel de accesibilidad"
            title="Accesibilidad"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <img 
              src="/images/IviACC.png" 
              alt="Accesibilidad" 
              className="accessibility-icon"
              style={{ width: fontSize * 1.5 + 'px', height: fontSize * 1.5 + 'px' }}
            />
            <span style={{ fontWeight: 500, fontSize: '1.1rem' }}>Accesibilidad</span>
          </button>
        </div>

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
                {/* Fuente */}
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

                {/* Tamaño de letra */}
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

                {/* Espaciado */}
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

                {/* Temas */}
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
