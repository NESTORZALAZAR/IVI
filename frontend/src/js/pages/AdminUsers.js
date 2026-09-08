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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
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
    <main className="admin-page container">
      <section className="admin-hero">
        <div>
          <p className="breadcrumb">Administración <span>/</span> Usuarios</p>
          <h2>Gestión de Usuarios</h2>
          <p className="hero-description">Visualiza, filtra y administra de manera accesible los profesionales, administradores y pacientes registrados en la plataforma IVI.</p>
        </div>
        <button onClick={newUser} className="btn primary-action">+ Nuevo usuario</button>
      </section>

      {error && <div className="error">{error}</div>}

      <section className="filters-panel" aria-label="Filtros de usuarios">
        <div className="filters-row">
          <label className="search-field">
            <span aria-hidden="true">⌕</span>
            <input placeholder="Buscar por usuario, email o CI" value={query} onChange={e=>setQuery(e.target.value)} />
          </label>
          <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} aria-label="Filtrar por rol">
            <option value="">Todos los roles</option>
            <option value="paciente">Paciente</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
          <select value={hasCiFilter} onChange={e=>setHasCiFilter(e.target.value)} aria-label="Filtrar por CI">
            <option value="">CI: Todos</option>
            <option value="1">Con CI</option>
            <option value="0">Sin CI</option>
          </select>
          <button onClick={()=>{ load(1); }} className="btn filter-action">Aplicar</button>
          <button onClick={()=>{ setQuery(''); setRoleFilter(''); setHasCiFilter(''); setDateFrom(''); setDateTo(''); setIsStaffFilter(''); setIsSuperuserFilter(''); load(1); }} className="btn ghost">Limpiar</button>
        </div>
        <div className="advanced-filter-toggle">
          <button type="button" className="text-button" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            {showAdvancedFilters ? '−' : '+'} Búsqueda avanzada
          </button>
        </div>
        {showAdvancedFilters && (
          <div className="advanced-filters">
            <label>Desde <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} /></label>
            <label>Hasta <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} /></label>
            <select value={isStaffFilter} onChange={e=>setIsStaffFilter(e.target.value)} aria-label="Filtrar por staff">
              <option value="">Staff: Todos</option><option value="1">Sí</option><option value="0">No</option>
            </select>
            <select value={isSuperuserFilter} onChange={e=>setIsSuperuserFilter(e.target.value)} aria-label="Filtrar por superusuario">
              <option value="">Superuser: Todos</option><option value="1">Sí</option><option value="0">No</option>
            </select>
          </div>
        )}
        <div className="filter-summary">Mostrando <strong>{users.length}</strong> usuarios registrados <span>•</span> Filtro activo: <em>{query || roleFilter || hasCiFilter ? 'Personalizado' : 'Todos'}</em></div>
      </section>

      <section className="table-panel">
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario &amp; perfil</th>
                <th>Email</th>
                <th>Rol</th>
                <th>CI</th>
                <th>Matrícula</th>
                <th>Especialidad / institución</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="user-id">{u.id}</td>
                  <td>
                    <div className="user-profile"><span className={`avatar avatar-${u.role || 'default'}`}>{(u.username || '?').slice(0, 2).toUpperCase()}</span><div><strong>{u.username}</strong><small>{[u.first_name, u.last_name].filter(Boolean).join(' ') || 'Sin nombre registrado'}</small></div></div>
                  </td>
                  <td className="email-cell">{u.email || '-'}</td>
                  <td><span className={`role-badge role-${u.role || 'default'}`}><i />{u.role || 'Sin rol'}</span></td>
                  <td>{u.ci || '-'}</td>
                  <td>{u.license_number || '-'}</td>
                  <td><strong>{u.specialty || 'Sin asignar'}</strong><small className="institution">{u.institution || ''}</small></td>
                  <td><button onClick={() => startEdit(u)} className="btn edit-action">Editar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span>Página <strong>{page}</strong> de <strong>{totalPages}</strong> <span className="pagination-total">• Total: {total} registros</span></span>
          <div className="pagination-actions">
            <button onClick={() => { if(page>1) { load(page-1); } }} disabled={page<=1}>‹ Anterior</button>
            <span className="current-page">{page}</span>
            <button onClick={() => { if(page<totalPages) { load(page+1); } }} disabled={page>=totalPages}>Siguiente ›</button>
          </div>
        </div>
      </section>

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
    </main>
  );
}
