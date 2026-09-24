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

  const formatearDetalles = (detalles, esCuestionario = false, puntajeAlcanzado) => {
    const etiquetas = {
      preguntas_respondidas: "Preguntas respondidas",
      total_preguntas: "Total de preguntas",
      correctas: "Correctas",
      incorrectas: "Incorrectas",
      palabras_leidas: "Palabras leídas",
      velocidad_ppm: "Velocidad ppm",
      tiempo_por_palabra: "Tiempo por palabra",
      errores: "Errores",
      aciertos: "Aciertos",
      parejas: "Parejas",
      total_parejas: "Total de parejas",
      intentos: "Intentos",
      precision: "Precisión",
      palabras: "Palabras",
      falsas_alarmas: "Falsas alarmas",
      nivel: "Nivel",
      rango_edad: "Rango de edad",
      puntaje_alcanzado: "Puntaje alcanzado",
    };

    if (esCuestionario) {
      return [
        ["total_preguntas", detalles.total_preguntas],
        ["preguntas_respondidas", detalles.preguntas_respondidas],
        ["rango_edad", detalles.rango_edad],
        ["puntaje_maximo", detalles.puntaje_maximo],
        ["puntaje_alcanzado", detalles.puntaje_alcanzado ?? puntajeAlcanzado],
        ["escala", detalles.escala],
        ["riesgo", detalles.riesgo],
        ["recomendacion", detalles.recomendacion],
      ].filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => ({
          label: etiquetas[key] || key.replace(/_/g, " "),
          value,
        }));
    }

    return Object.entries(detalles)
      .filter(([key]) => key !== "respuestas")
      .map(([key, value]) => ({
        label: etiquetas[key] || key.replace(/_/g, " "),
        value,
      }));
  };

  const getColorPuntaje = (puntaje, detalles = {}) => {
    if (detalles.puntaje_maximo === 30) {
      if (puntaje >= 21) return "alto";
      if (puntaje >= 11) return "medio";
      return "bajo";
    }
    if (puntaje >= 80) return "alto";
    if (puntaje >= 60) return "medio";
    return "bajo";
  };

  const esCuestionarioRiesgo = (resultado) => resultado.detalles?.puntaje_maximo === 30;
  const mostrarPuntaje = (resultado) => esCuestionarioRiesgo(resultado) ? `${resultado.puntaje}/30` : `${resultado.puntaje}%`;

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
                  className={`resultado-item ${getColorPuntaje(resultado.puntaje, resultado.detalles)}`}
                >
                  <div className="resultado-header">
                    <div className="resultado-info">
                      <h3>{resultado.detalles?.rango_edad || resultado.tipo_prueba_display}</h3>
                      <p className="resultado-fecha">
                        {formatearFecha(resultado.fecha_prueba)}
                      </p>
                    </div>
                    <div className="resultado-score">
                      <span className="puntaje">{mostrarPuntaje(resultado)}</span>
                      <span className={`estado ${resultado.estado}`}>
                        {resultado.detalles?.riesgo || resultado.estado.charAt(0).toUpperCase() + resultado.estado.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="resultado-details">
                    {!esCuestionarioRiesgo(resultado) && <div className="detail-item">
                      <span className="label">Duración:</span>
                      <span className="value">{formatearDuracion(resultado.duracion_segundos)}</span>
                    </div>}
                    {resultado.detalles && Object.keys(resultado.detalles).length > 0 &&
                      formatearDetalles(resultado.detalles, esCuestionarioRiesgo(resultado), resultado.puntaje).map(({ label, value }) => (
                        <div className="detail-item" key={label}>
                          <span className="label">{label}:</span>
                          <span className="value">{value}</span>
                        </div>
                      ))
                    }
                  </div>

                  {!esCuestionarioRiesgo(resultado) && resultado.detalles && resultado.detalles.respuestas && resultado.detalles.respuestas.length > 0 && (
                    <div className="respuestas-section">
                      <h4>Respuestas Detalladas</h4>
                      <div className="respuestas-list">
                        {resultado.detalles.respuestas.map((resp, idx) => (
                          <div key={idx} className={`respuesta-item ${resp.es_correcta ? 'correcta' : 'incorrecta'}`}>
                            <div className="respuesta-header">
                              <span className="respuesta-numero">Pregunta {idx + 1}</span>
                              <span className={`respuesta-estado ${resp.es_correcta ? 'correcto' : 'incorrecto'}`}>
                                {resp.es_correcta ? '✓ Correcta' : '✗ Incorrecta'}
                              </span>
                            </div>
                            <p className="respuesta-pregunta">{resp.pregunta}</p>
                            <div className="respuesta-opciones">
                              <div className="opcion-seleccionada">
                                <strong>Tu respuesta:</strong>
                                <p>{resp.respuesta_seleccionada}</p>
                              </div>
                              {!resp.es_correcta && (
                                <div className="opcion-correcta">
                                  <strong>Respuesta correcta:</strong>
                                  <p>{resp.respuesta_correcta}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="resultado-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${esCuestionarioRiesgo(resultado) ? (resultado.puntaje / 30) * 100 : resultado.puntaje}%` }}
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
