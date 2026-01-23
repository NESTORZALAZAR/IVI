import { useState, useEffect } from "react";
import "../../css/pages/ResultadosPage.css";

export default function ResultadosPage() {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResultados();
  }, []);

  const fetchResultados = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token no encontrado. Por favor inicia sesión");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/api/resultados/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Error al obtener resultados");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setResultados(data);
      setError("");
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatearDuracion = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}m ${segs}s`;
  };

  const getColorPuntaje = (puntaje) => {
    if (puntaje >= 80) return "alto";
    if (puntaje >= 60) return "medio";
    return "bajo";
  };

  return (
    <div className="resultados-page">
      <div className="resultados-container">
        <h1>Mis Resultados de Pruebas</h1>
        <p className="subtitle">Histórico de tus evaluaciones de dislexia</p>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Cargando resultados...</div>
        ) : resultados.length === 0 ? (
          <div className="empty-state">
            <p>Aún no tienes resultados registrados</p>
            <p className="hint">Completa una prueba para ver tus resultados aquí</p>
          </div>
        ) : (
          <div className="resultados-grid">
            <div className="resultados-stats">
              <div className="stat-card">
                <h3>Total de Pruebas</h3>
                <p className="stat-number">{resultados.length}</p>
              </div>
              <div className="stat-card">
                <h3>Puntaje Promedio</h3>
                <p className="stat-number">
                  {(
                    resultados.reduce((sum, r) => sum + r.puntaje, 0) /
                    resultados.length
                  ).toFixed(1)}
                </p>
              </div>
              <div className="stat-card">
                <h3>Mejor Puntaje</h3>
                <p className="stat-number">
                  {Math.max(...resultados.map((r) => r.puntaje))}
                </p>
              </div>
            </div>

            <div className="resultados-list">
              <h2>Detalle de Pruebas</h2>
              {resultados.map((resultado) => (
                <div
                  key={resultado.id}
                  className={`resultado-item ${getColorPuntaje(
                    resultado.puntaje
                  )}`}
                >
                  <div className="resultado-header">
                    <div className="resultado-info">
                      <h3>{resultado.tipo_prueba_display}</h3>
                      <p className="resultado-fecha">
                        {formatearFecha(resultado.fecha_prueba)}
                      </p>
                    </div>
                    <div className="resultado-score">
                      <span className="puntaje">{resultado.puntaje}%</span>
                      <span className={`estado ${resultado.estado}`}>
                        {resultado.estado.charAt(0).toUpperCase() +
                          resultado.estado.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="resultado-details">
                    <div className="detail-item">
                      <span className="label">Duración:</span>
                      <span className="value">
                        {formatearDuracion(resultado.duracion_segundos)}
                      </span>
                    </div>
                    {resultado.detalles && Object.keys(resultado.detalles).length > 0 && (
                      <div className="detail-item">
                        <span className="label">Detalles:</span>
                        <span className="value">
                          {JSON.stringify(resultado.detalles)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="resultado-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${resultado.puntaje}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
