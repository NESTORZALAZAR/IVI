import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetch('http://localhost:8000/api/admin/results/', { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => {
        if (!res.ok) { const d = await res.json().catch(()=>({})); setError(d.error||'Error'); return; }
        const data = await res.json(); setResults(data.results || data);
      }).catch(()=> setError('Error de conexión'));
  }, [navigate]);

  return (
    <div className="admin-page container">
      <h2>Resultados</h2>
      {error && <div className="error">{error}</div>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Tipo</th>
            <th>Puntaje</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {results.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.usuario_username}</td>
              <td>{r.tipo_prueba_display}</td>
              <td>{r.puntaje}</td>
              <td>{r.fecha_prueba}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
