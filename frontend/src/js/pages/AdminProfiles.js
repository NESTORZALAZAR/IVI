import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminProfiles(){
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token){ navigate('/login'); return; }
    fetch('http://localhost:8000/api/admin/users/', { headers: { Authorization: `Bearer ${token}` } })
      .then(async res=>{ if(!res.ok){ const d=await res.json().catch(()=>({})); setError(d.error||'Error'); return;} const data=await res.json(); setUsers(data); })
      .catch(()=>setError('Error de conexión'));
  },[navigate]);

  return (
    <div className="admin-page container">
      <h2>Perfiles</h2>
      {error && <div className="error">{error}</div>}
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.username} — {u.role} — CI: {u.ci || '—'}</li>
        ))}
      </ul>
    </div>
  );
}
