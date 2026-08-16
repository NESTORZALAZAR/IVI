import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLector(){
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token){ navigate('/login'); return; }
    fetch('http://localhost:8000/api/admin/lector/', { headers: { Authorization: `Bearer ${token}` } })
      .then(async res=>{ if(!res.ok){ const d=await res.json().catch(()=>({})); setError(d.error||'Error'); return;} const data=await res.json(); setStatus(data); })
      .catch(()=>setError('Error de conexión'));
  },[navigate]);

  return (
    <div className="admin-page container">
      <h2>Lector OCR</h2>
      {error && <div className="error">{error}</div>}
      {status && (
        <div>
          <p>Tesseract instalado: {status.tesseract_available ? 'Sí' : 'No'}</p>
        </div>
      )}
    </div>
  );
}
