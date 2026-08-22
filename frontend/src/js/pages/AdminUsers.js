import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminUsers.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [hasCiFilter, setHasCiFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isStaffFilter, setIsStaffFilter] = useState('');
  const [isSuperuserFilter, setIsSuperuserFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const load = useCallback((p=1) => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    let qs = `?page=${p}&page_size=${pageSize}`;
    if (query) qs += `&q=${encodeURIComponent(query)}`;
    if (roleFilter) qs += `&role=${encodeURIComponent(roleFilter)}`;
    if (hasCiFilter!==undefined && hasCiFilter!=='') qs += `&has_ci=${encodeURIComponent(hasCiFilter)}`;
    if (dateFrom) qs += `&date_joined_from=${encodeURIComponent(dateFrom)}`;
    if (dateTo) qs += `&date_joined_to=${encodeURIComponent(dateTo)}`;
    if (isStaffFilter!=='') qs += `&is_staff=${encodeURIComponent(isStaffFilter)}`;
    if (isSuperuserFilter!=='') qs += `&is_superuser=${encodeURIComponent(isSuperuserFilter)}`;
    fetch(`http://localhost:8000/api/admin/users/${qs}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(async res => {
      if (!res.ok) { const d = await res.json().catch(()=>({})); setError(d.error||'Error'); return; }
      const data = await res.json(); setUsers(data.results); setTotal(data.count); setPage(data.page);
    }).catch(()=> setError('Error de conexión'));
  }, [pageSize, query, roleFilter, hasCiFilter, dateFrom, dateTo, isStaffFilter, isSuperuserFilter, navigate]);

  useEffect(()=>{ load(1); }, [load]);

  const newUser = () => {
    setEditing({ isNew: true, username: '', email: '', first_name: '', last_name: '', role: 'paciente', ci: '', license_number: '', specialty: '', institution: '', password: '' });
  }

  useEffect(()=>{
    if (toast) {
      const t = setTimeout(()=>setToast(null), 3000);
      return ()=>clearTimeout(t);
    }
  }, [toast]);

  const startEdit = (u) => { setEditing({ ...u }); };
  const cancelEdit = () => setEditing(null);

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    console.log('saveEdit called', editing);
    setFieldErrors({});
    const token = localStorage.getItem('token');
    try {
      let res;
      if (editing.isNew) {
        res = await fetch(`http://localhost:8000/api/admin/users/`, {
          method: 'POST',
          headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ username: editing.username, password: editing.password, role: editing.role, ci: editing.ci, license_number: editing.license_number, specialty: editing.specialty, institution: editing.institution, first_name: editing.first_name, last_name: editing.last_name, email: editing.email })
        });
      } else {
        res = await fetch(`http://localhost:8000/api/admin/users/${editing.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ role: editing.role, ci: editing.ci, license_number: editing.license_number, specialty: editing.specialty, institution: editing.institution, first_name: editing.first_name, last_name: editing.last_name, email: editing.email, password: editing.password })
        });
      }
      if (!res.ok) {
        const d = await res.json().catch(()=>({}));
        console.error('saveEdit response error', d);
        if (d.field_errors) {
          setFieldErrors(d.field_errors);
          setError('Errores en los campos');
        } else {
          setError(d.error||JSON.stringify(d) || 'Error guardando');
        }
      } else {
        setEditing(null);
        load(page);
        setToast({ type: 'success', message: editing.isNew ? 'Usuario creado' : 'Usuario guardado' });
      }
    } catch (e) { setError('Error de conexión'); }
    setSaving(false);
  }

  const confirmDelete = (u) => {
    setEditing({ ...u, confirmDelete: true });
  }

  const doDelete = async () => {
    if (!editing) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8000/api/admin/users/${editing.id}/`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { const d = await res.json().catch(()=>({})); setError(d.error||'Error eliminando'); }
      else { setToast({ type: 'success', message: 'Usuario eliminado' }); setEditing(null); load(page); }
    } catch(e){ setError('Error de conexión') }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="admin-page container">
      <h2>Usuarios</h2>
      {error && <div className="error">{error}</div>}
      <style>{`
        .modal-overlay{position:fixed;left:0;right:0;top:0;bottom:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:2000}
        .modal{background:#fff;padding:1rem;border-radius:8px;max-width:520px;width:90%;}
        .admin-table{width:100%;border-collapse:collapse}
        .admin-table th,.admin-table td{padding:0.6rem;border-bottom:1px solid #eee}
        .btn{padding:0.4rem 0.6rem;border-radius:6px;border:none;background:#1976d2;color:#fff;cursor:pointer}
        .btn.ghost{background:#eee;color:#333}
        .btn.small{padding:0.2rem 0.4rem;font-size:0.9rem}
        .btn.danger{background:#e74c3c}
        .pagination{display:flex;gap:1rem;align-items:center;margin-top:0.8rem}
        .toast{position:fixed;right:1rem;bottom:1rem;padding:0.8rem 1rem;border-radius:8px;color:#fff}
        .toast.success{background:green}
      `}</style>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>CI</th>
            <th>Matrícula</th>
            <th>Especialidad</th>
            <th>Institución</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.first_name} {u.last_name}</td>
              <td>{u.role}</td>
              <td>{u.ci}</td>
              <td>{u.license_number || '-'}</td>
              <td>{u.specialty || '-'}</td>
              <td>{u.institution || '-'}</td>
              <td>
                <button onClick={() => startEdit(u)} className="btn small">Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{marginTop:'0.6rem'}}>
        <button onClick={newUser} className="btn">Nuevo usuario</button>
      </div>

      <div style={{display:'flex', gap:'1rem', alignItems:'center', marginTop:'1rem', flexWrap:'wrap'}}>
        <input placeholder="Buscar por usuario, email o CI" value={query} onChange={e=>setQuery(e.target.value)} />
        <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}>
          <option value="">Todos roles</option>
          <option value="paciente">Paciente</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
        <select value={hasCiFilter} onChange={e=>setHasCiFilter(e.target.value)}>
          <option value="">CI: Todos</option>
          <option value="1">Con CI</option>
          <option value="0">Sin CI</option>
        </select>
        <label>Desde: <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} /></label>
        <label>Hasta: <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} /></label>
        <select value={isStaffFilter} onChange={e=>setIsStaffFilter(e.target.value)}>
          <option value="">Staff: Todos</option>
          <option value="1">Sí</option>
          <option value="0">No</option>
        </select>
        <select value={isSuperuserFilter} onChange={e=>setIsSuperuserFilter(e.target.value)}>
          <option value="">Superuser: Todos</option>
          <option value="1">Sí</option>
          <option value="0">No</option>
        </select>
        <button onClick={()=>{ load(1); }} className="btn">Aplicar filtros</button>
        <button onClick={()=>{ setQuery(''); setRoleFilter(''); setHasCiFilter(''); setDateFrom(''); setDateTo(''); setIsStaffFilter(''); setIsSuperuserFilter(''); load(1); }} className="btn ghost">Limpiar</button>
        <div style={{flex:1}} />
      </div>

      <div className="pagination">
        <button onClick={() => { if(page>1) { load(page-1); } }} disabled={page<=1}>Anterior</button>
        <span> Página {page} / {totalPages} </span>
        <button onClick={() => { if(page<totalPages) { load(page+1); } }} disabled={page>=totalPages}>Siguiente</button>
      </div>

      {editing && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editing.isNew ? 'Nuevo usuario' : `Editar usuario ${editing.username}`}</h3>
            {editing.isNew && (
              <>
                <label>Usuario: <input value={editing.username||''} onChange={e=>setEditing({...editing, username: e.target.value})} /></label>
                {fieldErrors.username && <div className="field-error">{fieldErrors.username}</div>}
              </>
            )}
            <label>Nombre: <input value={editing.first_name||''} onChange={e=>setEditing({...editing, first_name: e.target.value})} /></label>
            {fieldErrors.first_name && <div className="field-error">{fieldErrors.first_name}</div>}
            <label>Apellido: <input value={editing.last_name||''} onChange={e=>setEditing({...editing, last_name: e.target.value})} /></label>
            {fieldErrors.last_name && <div className="field-error">{fieldErrors.last_name}</div>}
            <label>Email: <input value={editing.email||''} onChange={e=>setEditing({...editing, email: e.target.value})} /></label>
            {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
            <label>Rol:
              <select value={editing.role||'paciente'} onChange={e=>setEditing({...editing, role: e.target.value})}>
                <option value="paciente">Paciente</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label>CI: <input value={editing.ci||''} onChange={e=>setEditing({...editing, ci: e.target.value})} /></label>
            {fieldErrors.ci && <div className="field-error">{fieldErrors.ci}</div>}
            <label>Matrícula profesional: <input value={editing.license_number||''} onChange={e=>setEditing({...editing, license_number: e.target.value})} /></label>
            <label>Especialidad: <input value={editing.specialty||''} onChange={e=>setEditing({...editing, specialty: e.target.value})} /></label>
            <label>Institución: <input value={editing.institution||''} onChange={e=>setEditing({...editing, institution: e.target.value})} /></label>
            <label>Contraseña (dejar vacío para no cambiar): <input type="password" value={editing.password||''} onChange={e=>setEditing({...editing, password: e.target.value})} /></label>
            {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
            <div style={{marginTop: '1rem'}}>
              {!editing.confirmDelete ? (
                <>
                  <button onClick={saveEdit} disabled={saving} className="btn">Guardar</button>
                  <button onClick={cancelEdit} className="btn ghost">Cancelar</button>
                  <button onClick={()=>confirmDelete(editing)} className="btn danger" style={{marginLeft:'0.5rem'}}>Eliminar</button>
                </>
              ) : (
                <>
                  <p>Confirmar eliminación de {editing.username}?</p>
                  <button onClick={doDelete} className="btn danger">Sí, eliminar</button>
                  <button onClick={()=>setEditing({...editing, confirmDelete:false})} className="btn ghost">Cancelar</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}
