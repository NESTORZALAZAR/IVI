import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../css/pages/SignupPage.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("user"); // 'user' o 'professional'
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    // Campos exclusivos para profesionales:
    licenseNumber: "",
    specialty: "",
    institution: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.value ? e.target.name : e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    // Validación de campos requeridos si es Profesional
    if (accountType === "professional") {
      if (!formData.licenseNumber.trim() || !formData.specialty.trim()) {
        setError("Por favor completa tu Matrícula y Especialidad profesional");
        setLoading(false);
        return;
      }
    }

    // Estructuración del Payload para Django
    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      role: accountType,
      ...(accountType === "professional" && {
        license_number: formData.licenseNumber,
        specialty: formData.specialty,
        institution: formData.institution,
      }),
    };

    try {
      const response = await fetch("http://localhost:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Maneja errores provenientes de Django (ej: username o email duplicados)
        const errorMessage = typeof data === "object" 
          ? Object.values(data).flat().join(" ") 
          : data.error || "Error al crear la cuenta";
        
        setError(errorMessage || "Error al registrar usuario");
        setLoading(false);
        return;
      }

      // Guardar token y usuario devuelto por Django
      localStorage.setItem("token", data.token);
      localStorage.setItem("ivi_user", JSON.stringify(data.user));

      // Redirección posterior al registro según el tipo de cuenta
      if (accountType === "professional") {
        navigate("/professional/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setError("No se pudo conectar con el servidor. Verifica que esté en marcha e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>IVI</h1>
        <p className="subtitle">Crear cuenta en la plataforma</p>

        {/* Selector de Tipo de Cuenta */}
        <div className="role-selector-container">
          <label className="role-label">Tipo de cuenta:</label>
          <div className="role-buttons">
            <button
              type="button"
              className={`role-btn ${accountType === "user" ? "active" : ""}`}
              onClick={() => setAccountType("user")}
            >
              👤 Usuario / Tutor
            </button>
            <button
              type="button"
              className={`role-btn ${accountType === "professional" ? "active" : ""}`}
              onClick={() => setAccountType("professional")}
            >
              📊 Profesional
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Tu nombre de usuario"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Nombre</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Tu nombre"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Apellido</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Tu apellido"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@correo.com"
            />
          </div>

          {/* CAMPOS DINÁMICOS PARA PROFESIONALES */}
          {accountType === "professional" && (
            <div className="professional-fields-section">
              <div className="section-divider">Datos Profesionales</div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="licenseNumber">N° Matrícula / Cédula</label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                    placeholder="Ej. MP-12345"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="specialty">Especialidad</label>
                  <input
                    type="text"
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    required
                    placeholder="Ej. Psicopedagogía"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="institution">Institución / Centro (Opcional)</label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder="Ej. Centro de Aprendizaje IVI"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Repite tu contraseña"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn-signup">
            {loading
              ? "Creando cuenta..."
              : `Registrarse como ${accountType === "professional" ? "Profesional" : "Usuario"}`}
          </button>
        </form>

        <p className="footer-text">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="btn-home"
        >
          ← Volver al Inicio
        </button>
      </div>
    </div>
  );
}