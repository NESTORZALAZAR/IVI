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
        {/* Logo / Marca */}
        <div className="topnav-brand">
          <Link to="/" className="brand-link">
            <img 
              src="/images/logoSF.png" 
              alt="Logo de IVI" 
              className="brand-logo" 
              style={{ 
                width: `${fontSize * 2.5}px`, 
                height: `${fontSize * 2.5}px`, 
                minWidth: `${fontSize * 2.5}px`, 
                minHeight: `${fontSize * 2.5}px`, 
                objectFit: 'contain' 
              }}
            />
            <div className="brand-text">
              <h1>IVI</h1>
              <p>Plataforma de Apoyo y Tamizaje Disléxico</p>
            </div>
          </Link>
        </div>

        {/* Menú principal */}
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

          {/* Menú desplegable: IVI te ayuda */}
          <div className="nav-dropdown" ref={dropdownRef}>
            <button
              className={`nav-link accessibility-btn dropdown-btn ${showLectores || isLectorDocs || isLectorText ? 'active' : ''}`}
              onClick={() => setShowLectores(prev => !prev)}
              aria-haspopup="true"
              aria-expanded={showLectores}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                fontWeight: 700, 
                fontSize: '1.1rem', 
                padding: '0.6rem 1.2rem', 
                minWidth: '48px', 
                height: '48px', 
                backgroundColor: 'var(--border)' 
              }}
            >
              <img 
                src="/images/IviLector.png" 
                alt="IVI te ayuda" 
                title="IVI te ayuda"
                style={{ 
                  width: `${fontSize * 1.7}px`, 
                  height: `${fontSize * 1.7}px`, 
                  minWidth: `${fontSize * 1.7}px`, 
                  minHeight: `${fontSize * 1.7}px`, 
                  objectFit: 'contain', 
                  display: 'inline-block' 
                }}
              />
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

          {/* Rutas condicionales por autenticación y roles */}
          {!isLoggedIn ? (
            <>
              <Link to="/signup" className="nav-link signup-btn">
                Registrarse
              </Link>
              <Link to="/login" className="nav-link login-btn">
                Iniciar Sesión
              </Link>
            </>
          ) : (
            <>
              {/* Opción para Pacientes */}
              {isPatient && (
                <Link 
                  to="/paciente" 
                  className={`nav-link ${isPaciente ? 'active' : ''}`}
                >
                  Mi Perfil
                </Link>
              )}

              {/* Opción para Doctores */}
              {isDoctor && (
                <Link to="/doctor" className="nav-link">
                  Doctor
                </Link>
              )}

              {/* Desplegable para Administradores */}
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

              {/* Botón de Logout */}
              <button 
                className="nav-link logout-btn" 
                onClick={handleLogout}
                aria-label="Cerrar sesión"
              >
                Salir
              </button>
            </>
          )}

          {/* Modal de Accesibilidad */}
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
              style={{ width: `${fontSize * 1.5}px`, height: `${fontSize * 1.5}px` }}
            />
            <span style={{ fontWeight: 500, fontSize: '1.1rem' }}>Accesibilidad</span>
          </button>
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