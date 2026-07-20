import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../css/pages/LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("user"); // 'user', 'professional', 'admin'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.detail || "Correo o contraseña incorrectos.");
        setLoading(false);
        return;
      }

      // Guardar token y usuario real devuelto por Django
      localStorage.setItem("token", data.token);
      localStorage.setItem("ivi_user", JSON.stringify(data.user));

      // Redirección según el rol confirmado por el servidor
      const userRole = data.user?.role || selectedRole;
      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "professional") {
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
    <div className="login-container">
      <div className="login-box">
        <h1>IVI</h1>
        <p className="subtitle">Plataforma de Apoyo y Tamizaje Dislexia</p>

        {/* Selector de Rol */}
        <div className="role-selector-container">
          <label className="role-label">Tipo de acceso:</label>
          <div className="role-buttons">
            <button
              type="button"
              className={`role-btn ${selectedRole === "user" ? "active" : ""}`}
              onClick={() => setSelectedRole("user")}
            >
              👤 Usuario
            </button>
            <button
              type="button"
              className={`role-btn ${selectedRole === "professional" ? "active" : ""}`}
              onClick={() => setSelectedRole("professional")}
            >
              📊 Profesional
            </button>
            <button
              type="button"
              className={`role-btn ${selectedRole === "admin" ? "active" : ""}`}
              onClick={() => setSelectedRole("admin")}
            >
              ⚙️ Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Tu contraseña"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn-login">
            {loading ? "Ingresando..." : `Ingresar como ${selectedRole === 'admin' ? 'Admin' : selectedRole === 'professional' ? 'Profesional' : 'Usuario'}`}
          </button>
        </form>

        <p className="footer-text">
          ¿No tienes cuenta? <Link to="/signup">Regístrate aquí</Link>
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