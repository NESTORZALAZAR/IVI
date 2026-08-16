import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../../css/pages/ResultadosPage.css";

export default function DoctorPatientDetail(){
  const { ci } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(()=>{
    if (!token) { navigate('/login'); return; }
    fetchData();
  }, [ci]);

  const fetchData = async () => {
    setLoading(true); setError(''); setResults([]);
    try {
      const url = `http://127.0.0.1:8000/api/doctor/?ci=${encodeURIComponent(ci)}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { const d = await res.json().catch(()=>({})); setError(d.error||'Error'); setLoading(false); return; }
      const data = await res.json();
      setResults(data);
    } catch(e){ setError('Error de conexión'); }
    setLoading(false);
  }

  const statsFor = (list) => {
    const byGame = {};
    list.forEach(r => {
      const t = r.tipo_prueba || 'unknown';
      if (!byGame[t]) byGame[t] = { count:0, sum:0, items:[] };
      byGame[t].count += 1; byGame[t].sum += (r.puntaje||0); byGame[t].items.push(r);
    });
    const out = {};
    Object.keys(byGame).forEach(k=>{ out[k] = { average: (byGame[k].sum/byGame[k].count)||0, count: byGame[k].count, items: byGame[k].items } });
    return out;
  }

  const total = results.length;
  const avg = total ? (results.reduce((s,r)=>s+(r.puntaje||0),0)/total) : 0;
  const best = total ? Math.max(...results.map(r=>r.puntaje||0)) : 0;

  const scoreClass = (p) => {
    if (p >= 70) return 'alto';
    if (p >= 40) return 'medio';
    return 'bajo';
  }

  const fmtDuration = (s) => {
    if (!s) return '0m 0s';
    const m = Math.floor(s/60); const sec = s%60; return `${m}m ${sec}s`;
  }

  return (
    <div className="resultados-page">
      <div className="resultados-container">
        <h1>Resultados del paciente</h1>
        <p className="subtitle">Histórico de evaluaciones del paciente</p>

        {loading && <div className="loading">Cargando...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && (
          <>
            <div className="resultados-stats">
              <div className="stat-card">
                <h3>TOTAL DE PRUEBAS</h3>
                <p className="stat-number">{total}</p>
              </div>
              <div className="stat-card">
                <h3>PUNTAJE PROMEDIO</h3>
                <p className="stat-number">{avg.toFixed(1)}</p>
              </div>
              <div className="stat-card">
                <h3>MEJOR PUNTAJE</h3>
                <p className="stat-number">{best}</p>
              </div>
            </div>

            <div className="resultados-list">
              <h2>Detalle de Pruebas</h2>

              {total===0 && <div className="empty-state"><p>No hay resultados para este paciente.</p></div>}

              {results.map(r => {
                const cls = `resultado-item ${scoreClass(r.puntaje||0)}`;
                const estado = (r.estado || '').toLowerCase();
                const statusClass = estado === 'completada' ? 'completada' : (estado === 'incompleta' ? 'incompleta' : 'cancelada');
                const detalles = r.detalles || {};
                const preguntasRespondidas = detalles.preguntas_respondidas || (Array.isArray(detalles.respuestas) ? detalles.respuestas.length : (detalles.respondidas || 0));
                const totalPreguntas = detalles.total_preguntas || detalles.total || 0;
                const progress = r.puntaje || 0;

                return (
                  <div key={r.id} className={cls}>
                    <div className="resultado-header">
                      <div className="resultado-info">
                        <h3>{r.tipo_prueba_display || r.tipo_prueba || 'Prueba'}</h3>
                        <p className="resultado-fecha">{new Date(r.fecha_prueba).toLocaleString()}</p>
                      </div>
                      <div className="resultado-score">
                        <div className={`estado ${'completada'}`}>
                          <span className={`estado ${statusClass}`}>{estado || 'Completada'}</span>
                        </div>
                        <div className="puntaje">{progress}%</div>
                      </div>
                    </div>

                    <div className="resultado-details">
                      <div className="detail-item">
                        <div className="label">Duración:</div>
                        <div className="value">{fmtDuration(r.duracion_segundos)}</div>
                      </div>
                      <div className="detail-item">
                        <div className="label">Preguntas respondidas:</div>
                        <div className="value">{preguntasRespondidas}</div>
                      </div>
                      <div className="detail-item">
                        <div className="label">Total de preguntas:</div>
                        <div className="value">{totalPreguntas}</div>
                      </div>
                    </div>

                    <div className="resultado-progress">
                      <div className="progress-bar">
                        <div className={`progress-fill`} style={{width:`${progress}%`}} />
                      </div>
                    </div>

                    {detalles && detalles.respuestas && (
                      <div className="respuestas-section">
                        <h4>Respuestas</h4>
                        <div className="respuestas-list">
                          {detalles.respuestas.map((resp, idx) => (
                            <div key={idx} className={`respuesta-item ${resp.correcta ? 'correcta' : 'incorrecta'}`}>
                              <div className="respuesta-header">
                                <div className="respuesta-numero">Pregunta {idx+1}</div>
                                <div className={`respuesta-estado ${resp.correcta ? 'correcto' : 'incorrecto'}`}>{resp.correcta ? 'Correcta' : 'Incorrecta'}</div>
                              </div>
                              <div className="respuesta-pregunta">{resp.pregunta || ''}</div>
                              <div className="respuesta-opciones">
                                <div className="opcion-seleccionada">{resp.seleccion || resp.respuesta}</div>
                                {resp.correcta && <div className="opcion-correcta">Respuesta correcta: {resp.correcta_text || ''}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )
              })}

            </div>

            <div style={{marginTop:16}}>
              <button onClick={()=>navigate('/doctor')} className="btn">Volver</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
 
