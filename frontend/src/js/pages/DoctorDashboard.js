import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorDashboard.css';

export default function DoctorDashboard(){
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [ci, setCi] = useState('');
  const [tipoPrueba, setTipoPrueba] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [testMode, setTestMode] = useState(null);
  const [officeName, setOfficeName] = useState('');
  const [officeCi, setOfficeCi] = useState('');
  const [officeError, setOfficeError] = useState('');
  const [showOfficeResults, setShowOfficeResults] = useState(false);
  const [officeResults, setOfficeResults] = useState([]);

  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(()=>{
    if (!token) { navigate('/login'); return; }
    // parsedUser is read from localStorage and may be a new object each render;
    // check role by reading stored string to avoid infinite re-renders.
    try {
      const su = localStorage.getItem('user');
      const pu = su ? JSON.parse(su) : null;
      if (!pu || (pu.role !== 'doctor' && pu.role !== 'admin')) { navigate('/'); return; }
    } catch(e) {
      navigate('/'); return;
    }
    // fetch preview on mount
    fetchPreview();
  }, [token, navigate]);

  const search = async () => {
    setError(''); setLoading(true); setResults([]);
    if (!token) { setError('No autenticado'); setLoading(false); return; }
    try {
    let url = `http://127.0.0.1:8000/api/doctor/?`;
    if (ci) url += `ci=${encodeURIComponent(ci)}`;
    else if (query) url += `name=${encodeURIComponent(query)}`;
    if (tipoPrueba) url += `&tipo_prueba=${encodeURIComponent(tipoPrueba)}`;
    if (dateFrom) url += `&date_from=${encodeURIComponent(dateFrom)}`;
    if (dateTo) url += `&date_to=${encodeURIComponent(dateTo)}`;
      // allow empty to fetch preview
      //if (!ci && !query) { setError('Ingrese nombre, usuario o CI'); setLoading(false); return; }
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { const d = await res.json().catch(()=>({})); setError(d.error||'Error'); setLoading(false); return; }
      const data = await res.json();
      // data is array of resultados each with paciente info
      // group by paciente
      const map = {};
      data.forEach(r => {
        const pid = r.paciente_id || r.paciente_username || 'unknown';
        if (!map[pid]) map[pid] = { paciente_id: r.paciente_id, paciente_username: r.paciente_username, paciente_ci: r.paciente_ci, resultados: [] };
        map[pid].resultados.push(r);
      });
      setResults(Object.values(map));
    } catch(e){ setError('Error de conexión'); }
    setLoading(false);
  }

  const fetchPreview = async () => {
    setError(''); setLoading(true); setResults([]);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/doctor/', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { const d = await res.json().catch(()=>({})); setError(d.error||'Error'); setLoading(false); return; }
      const data = await res.json();
      // data is preview array of patients
      setResults(data.map(p=>({ paciente_id: p.paciente_id, paciente_username: p.paciente_username, paciente_ci: p.paciente_ci, preview: p })));
    } catch(e){ setError('Error de conexión'); }
    setLoading(false);
  }

  const openDetail = (ci) => {
    if (!ci) return;
    navigate(`/doctor/patient/${encodeURIComponent(ci)}`);
  }

  const beginOfficeTest = async () => {
    setOfficeError('');
    if (!officeName.trim() || !officeCi.trim()) {
      setOfficeError('Ingresa el nombre y el número de cédula.');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/doctor/consultorio/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: officeName, ci: officeCi })
      });
      const data = await response.json();
      if (!response.ok) {
        setOfficeError(data.error || Object.values(data.field_errors || {}).join(' '));
        return;
      }
      localStorage.setItem('ivi_office_patient', JSON.stringify(data.patient));
      navigate('/pruebas');
    } catch (e) {
      setOfficeError('No se pudo iniciar la evaluación en consultorio.');
    }
  };

  const loadOfficeResults = async () => {
    setShowOfficeResults(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/doctor/?office=1', { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) return;
      const data = await response.json();
      setOfficeResults(data.map(p => ({ paciente_id: p.paciente_id, paciente_username: p.paciente_username, paciente_ci: p.paciente_ci, preview: p })));
    } catch (e) {
      setError('No se pudieron cargar los resultados de consultorio.');
    }
  };

  const statsFor = (resList) => {
    const byGame = {};
    resList.forEach(r => {
      const t = r.tipo_prueba || 'unknown';
      if (!byGame[t]) byGame[t] = { count:0, sum:0, items:[] };
      byGame[t].count += 1; byGame[t].sum += (r.puntaje||0); byGame[t].items.push(r);
    });
    const out = {};
    Object.keys(byGame).forEach(k=>{ out[k] = { average: (byGame[k].sum/byGame[k].count)||0, count: byGame[k].count, items: byGame[k].items } });
    return out;
  }

  return (
    <div className="doctor-page container">
      <h2>Panel Doctor - Resultados de Pacientes</h2>
      <div className="doctor-actions">
        <button onClick={() => setTestMode('choose')} className="btn">Comenzar Pruebas</button>
        <button onClick={() => showOfficeResults ? setShowOfficeResults(false) : loadOfficeResults()} className="btn">Pacientes en consultorio</button>
      </div>
      {showOfficeResults && <div className="office-results-tab"><h3>Resultados de pacientes en consultorio</h3>{officeResults.length === 0 && <p>Aún no hay resultados de consultorio.</p>}{officeResults.map(p => <div key={p.paciente_id} className="office-result-row"><strong>{p.paciente_username}</strong> <span>CI: {p.paciente_ci}</span> <span>Pruebas: {p.preview?.recent_count || 0}</span><button className="btn" onClick={() => openDetail(p.paciente_ci)}>Ver resultados</button></div>)}</div>}
      <div className="doctor-search">
        <input placeholder="Buscar por nombre o usuario" value={query} onChange={e=>setQuery(e.target.value)} />
        <input placeholder="O buscar por CI" value={ci} onChange={e=>setCi(e.target.value)} />
        <select value={tipoPrueba} onChange={e=>setTipoPrueba(e.target.value)}>
          <option value="">Todos juegos</option>
          <option value="lectura">Lectura</option>
          <option value="velocidad">Velocidad</option>
          <option value="comprension">Comprensión</option>
          <option value="ortografia">Ortografía</option>
        </select>
        <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} />
        <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} />
        <button onClick={search} className="btn">Buscar</button>
      </div>
      {loading && <div>Buscando...</div>}
      {error && <div className="error">{error}</div>}
      <div className="patients-list">
        {results.map(p=> (
          <div className="patient-card" key={p.paciente_id || p.paciente_username}>
            <h3>{p.paciente_username || 'Paciente'} {p.paciente_ci ? `- CI: ${p.paciente_ci}` : ''}</h3>
            <div className="patient-stats">
              {p.preview ? (
                <div>
                  <div>Resultados recientes: {p.preview.recent_count || 0}</div>
                  <div>Promedios:
                    {Object.entries(p.preview.averages||{}).map(([k,v])=> (<span key={k} style={{marginLeft:8}}>{k}: {v.toFixed(1)}%</span>))}
                  </div>
                  <div style={{marginTop:8}}>
                    {(p.preview.last_results||[]).map(r=> (
                      <div key={r.resultado_id}>{new Date(r.fecha_prueba).toLocaleString()} — {r.tipo_prueba} — {r.puntaje}</div>
                    ))}
                  </div>
                </div>
              ) : (
                Object.entries(statsFor(p.resultados)).map(([game, s])=> (
                  <div className="game-stats" key={game}>
                    <strong>{game}</strong>
                    <div>Promedio: {s.average.toFixed(1)}%</div>
                    <div>Resultados: {s.count}</div>
                    <details>
                      <summary>Ver resultados</summary>
                      <ul>
                        {s.items.map(it=> (
                          <li key={it.resultado_id || Math.random()}>
                            {new Date(it.fecha_prueba).toLocaleString()} — Puntaje: {it.puntaje} — Detalles: {JSON.stringify(it.detalles)}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                ))
              )}
            </div>
            <div style={{marginTop:8}}>
              <button className="btn" onClick={()=> openDetail(p.paciente_ci || p.paciente_username)}>Ver detalle</button>
            </div>
          </div>
        ))}
      </div>
      {testMode && <div className="modal-overlay">
        <div className="modal">
          {testMode === 'choose' ? <>
            <h3>¿Quién realizará las pruebas?</h3>
            <button className="btn" onClick={() => { localStorage.removeItem('ivi_office_patient'); navigate('/pruebas'); }}>Doctor</button>
            <button className="btn" onClick={() => setTestMode('patient')}>Paciente en consultorio</button>
            <button className="btn ghost" onClick={() => setTestMode(null)}>Cancelar</button>
          </> : <>
            <h3>Datos del paciente</h3>
            <input placeholder="Nombre completo" value={officeName} onChange={e => setOfficeName(e.target.value)} />
            <input placeholder="Número de cédula" value={officeCi} onChange={e => setOfficeCi(e.target.value)} />
            {officeError && <div className="error">{officeError}</div>}
            <button className="btn" onClick={beginOfficeTest}>Continuar</button>
            <button className="btn ghost" onClick={() => setTestMode('choose')}>Volver</button>
          </>}
        </div>
      </div>}
    </div>
  )
}
