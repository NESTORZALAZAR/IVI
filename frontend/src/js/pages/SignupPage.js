import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../css/pages/SignupPage.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    ci: ""
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Debounced username availability check
  useEffect(() => {
    const username = formData.username && formData.username.trim();
    if (!username) return;
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/check-username/?username=${encodeURIComponent(username)}`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        if (!data.available) {
          setFieldErrors((prev) => ({ ...prev, username: 'username no disponible' }));
        } else {
          setFieldErrors((prev) => {
            const copy = { ...prev };
            delete copy.username;
            return copy;
          });
        }
      } catch (e) {
        // ignore abort or network errors
      }
    }, 500);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [formData.username]);

  // Debounced email availability check
  useEffect(() => {
    const email = formData.email && formData.email.trim();
    if (!email) return;
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/check-email/?email=${encodeURIComponent(email)}`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        if (!data.available) {
          setFieldErrors((prev) => ({ ...prev, email: 'email ya registrado' }));
        } else {
          setFieldErrors((prev) => {
            const copy = { ...prev };
            delete copy.email;
            return copy;
          });
        }
      } catch (e) {
        // ignore
      }
    }, 500);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [formData.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validaciones
    // Reset field errors
    setFieldErrors({});

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

    // CI obligatorio para registro de pacientes
    if (!formData.ci || !formData.ci.trim()) {
      setFieldErrors({ ci: 'El campo CI es obligatorio' });
      setLoading(false);
      return;
    }
    // CI solo dígitos
    if (!/^[0-9]+$/.test(formData.ci)) {
      setFieldErrors({ ci: 'CI debe contener sólo dígitos' });
      setLoading(false);
      return;
    }

    // Email formato básico
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      setFieldErrors({ email: 'Formato de email inválido' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          ci: formData.ci,
          first_name: formData.firstName,
          last_name: formData.lastName
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.field_errors) {
          setFieldErrors(data.field_errors);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError('Error al crear la cuenta');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>IVI</h1>
        <p className="subtitle">Crear cuenta</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Tu nombre de usuario"
            />
            {fieldErrors.username && <div className="field-error">{fieldErrors.username}</div>}
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
            <label htmlFor="ci">CI (identificador)</label>
            <input
              type="text"
              id="ci"
              name="ci"
              value={formData.ci}
              onChange={handleChange}
              required
              placeholder="Ingrese su CI"
            />
            {fieldErrors.ci && <div className="field-error">{fieldErrors.ci}</div>}
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
            {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
          </div>

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
            {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
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
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p className="footer-text">
          ¿Ya tienes cuenta? <Link to="/">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}
