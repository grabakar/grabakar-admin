import { useState } from 'react'
import { useUsuarios, useCreateUsuario } from '../api/usuarios'
import { useTenants } from '../api/tenants'
import { useSucursales } from '../api/sucursales'
import { useAuth } from '../contexts/AuthContext'
import type { PanelPersona, Usuario } from '../types/models'

export function UsuariosPage() {
  const { isPlatformAdmin, user: authUser } = useAuth()
  const [page, setPage] = useState(1)
  const [tenantId, setTenantId] = useState<number | ''>('')
  const [rol, setRol] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    username: '',
    password: '',
    nombre_completo: '',
    email: '',
    rol: 'operador',
    tenant_id: 0,
    sucursal_id: null as number | null,
    activo: true,
    is_staff: false,
    panel_persona: 'none' as PanelPersona,
  })

  const { data, isLoading } = useUsuarios({ page, page_size: 20, tenant_id: tenantId || undefined, rol: rol || undefined })
  const { data: tenantsData } = useTenants({ page_size: 100 })
  const { data: sucursalesData } = useSucursales({ tenant_id: form.tenant_id || undefined })
  const create = useCreateUsuario()

  const tenants = tenantsData?.results ?? []
  const sucursales = sucursalesData?.results ?? []

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.tenant_id) return
    const body = {
      username: form.username,
      password: form.password,
      nombre_completo: form.nombre_completo,
      email: form.email || undefined,
      rol: form.rol,
      tenant_id: form.tenant_id,
      sucursal_id: form.sucursal_id,
      activo: form.activo,
      is_staff: isPlatformAdmin ? form.is_staff : false,
      panel_persona: isPlatformAdmin
        ? form.is_staff
          ? ('platform_admin' as const)
          : ('none' as const)
        : form.panel_persona,
    }
    create.mutate(body, {
      onSuccess: () => {
        setShowForm(false)
        setForm({
          username: '',
          password: '',
          nombre_completo: '',
          email: '',
          rol: 'operador',
          tenant_id: tenants[0]?.id ?? 0,
          sucursal_id: null,
          activo: true,
          is_staff: false,
          panel_persona: 'none',
        })
      },
    })
  }

  if (isLoading) return <div className="text-slate-500">Cargando...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Usuarios</h1>
        {(isPlatformAdmin || authUser?.panel_persona === 'tenant_admin') && (
        <button
          type="button"
          onClick={() => { setShowForm(true); setForm((f) => ({ ...f, tenant_id: tenants[0]?.id ?? 0 })); }}
          className="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-700"
        >
          Nuevo usuario
        </button>
        )}
      </div>

      <div className="flex gap-2">
        <select value={tenantId} onChange={(e) => setTenantId(e.target.value === '' ? '' : Number(e.target.value))} className="border border-slate-300 rounded px-3 py-2">
          <option value="">Todos los tenants</option>
          {tenants.map((t: { id: number; nombre: string }) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>
        <select value={rol} onChange={(e) => setRol(e.target.value)} className="border border-slate-300 rounded px-3 py-2">
          <option value="">Todos los roles</option>
          <option value="operador">Operador</option>
          <option value="supervisor">Supervisor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 max-w-md">
          <h2 className="font-medium text-slate-800 mb-3">Crear usuario</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <input type="text" placeholder="Username" value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} className="w-full border border-slate-300 rounded px-3 py-2" required />
            <input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="w-full border border-slate-300 rounded px-3 py-2" required minLength={8} />
            <input type="text" placeholder="Nombre completo" value={form.nombre_completo} onChange={(e) => setForm((f) => ({ ...f, nombre_completo: e.target.value }))} className="w-full border border-slate-300 rounded px-3 py-2" required />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full border border-slate-300 rounded px-3 py-2" />
            <select value={form.tenant_id} onChange={(e) => setForm((f) => ({ ...f, tenant_id: Number(e.target.value), sucursal_id: null }))} className="w-full border border-slate-300 rounded px-3 py-2" required>
              <option value={0}>Tenant</option>
              {tenants.map((t: { id: number; nombre: string }) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
            <select value={form.sucursal_id ?? ''} onChange={(e) => setForm((f) => ({ ...f, sucursal_id: e.target.value === '' ? null : Number(e.target.value) }))} className="w-full border border-slate-300 rounded px-3 py-2">
              <option value="">Sin sucursal</option>
              {sucursales.map((s: { id: number; nombre: string }) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
            <select value={form.rol} onChange={(e) => setForm((f) => ({ ...f, rol: e.target.value }))} className="w-full border border-slate-300 rounded px-3 py-2">
              <option value="operador">Operador</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.activo} onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))} /> Activo</label>
            {isPlatformAdmin && (
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_staff} onChange={(e) => setForm((f) => ({ ...f, is_staff: e.target.checked }))} /> Administrador de plataforma (staff)</label>
            )}
            {authUser?.panel_persona === 'tenant_admin' && (
              <div>
                <label className="block text-sm text-slate-600 mb-1">Acceso al panel web</label>
                <select value={form.panel_persona} onChange={(e) => setForm((f) => ({ ...f, panel_persona: e.target.value as PanelPersona }))} className="w-full border border-slate-300 rounded px-3 py-2">
                  <option value="none">Sin panel</option>
                  <option value="tenant_admin">Admin de cliente</option>
                  <option value="panel_operator_readonly">Solo lectura (operador)</option>
                </select>
              </div>
            )}
            <div className="flex gap-2">
              <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded text-sm" disabled={create.isPending}>Crear</button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-slate-300 px-4 py-2 rounded text-sm">Cancelar</button>
            </div>
            {create.isError && <p className="text-sm text-red-600">{(create.error as Error).message}</p>}
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-3 font-medium text-slate-700">Usuario</th>
              <th className="text-left p-3 font-medium text-slate-700">Nombre</th>
              <th className="text-left p-3 font-medium text-slate-700">Rol</th>
              <th className="text-left p-3 font-medium text-slate-700">Tenant</th>
              <th className="text-left p-3 font-medium text-slate-700">Panel</th>
              <th className="text-left p-3 font-medium text-slate-700">Activo</th>
              <th className="text-left p-3 font-medium text-slate-700">Último login</th>
            </tr>
          </thead>
          <tbody>
            {data?.results.map((u: Usuario) => (
              <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.nombre_completo}</td>
                <td className="p-3">{u.rol}</td>
                <td className="p-3">{u.tenant?.nombre ?? '—'}</td>
                <td className="p-3 text-slate-600">{u.panel_persona ?? '—'}</td>
                <td className="p-3">{u.activo ? 'Sí' : 'No'}</td>
                <td className="p-3 text-slate-500">{u.last_login ? new Date(u.last_login).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data && data.count > 20 && (
          <div className="p-3 border-t border-slate-200 flex justify-between">
            <span className="text-slate-500 text-sm">Total: {data.count}</span>
            <div className="flex gap-2">
              <button type="button" disabled={!data.previous} onClick={() => setPage((p) => p - 1)} className="border border-slate-300 px-3 py-1 rounded text-sm disabled:opacity-50">Anterior</button>
              <button type="button" disabled={!data.next} onClick={() => setPage((p) => p + 1)} className="border border-slate-300 px-3 py-1 rounded text-sm disabled:opacity-50">Siguiente</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
