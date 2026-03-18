import { useState } from 'react'
import { useSucursales, useCreateSucursal } from '../api/sucursales'
import { useTenants } from '../api/tenants'
import type { Sucursal } from '../types/models'

export function SucursalesPage() {
  const [page, setPage] = useState(1)
  const [tenantId, setTenantId] = useState<number | ''>('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', tenant_id: 0, activa: true })

  const { data, isLoading } = useSucursales({ page, page_size: 20, tenant_id: tenantId || undefined })
  const { data: tenantsData } = useTenants({ page_size: 100 })
  const create = useCreateSucursal()

  const tenants = tenantsData?.results ?? []

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.tenant_id) return
    create.mutate({ nombre: form.nombre, tenant_id: form.tenant_id, activa: form.activa }, {
      onSuccess: () => {
        setShowForm(false)
        setForm({ nombre: '', tenant_id: tenants[0]?.id ?? 0, activa: true })
      },
    })
  }

  if (isLoading) return <div className="text-slate-500">Cargando...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Sucursales</h1>
        <button
          type="button"
          onClick={() => { setShowForm(true); setForm({ nombre: '', tenant_id: tenants[0]?.id ?? 0, activa: true }); }}
          className="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-700"
        >
          Nueva sucursal
        </button>
      </div>

      <div className="flex gap-2">
        <select
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value === '' ? '' : Number(e.target.value))}
          className="border border-slate-300 rounded px-3 py-2"
        >
          <option value="">Todos los tenants</option>
          {tenants.map((t: { id: number; nombre: string }) => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 max-w-md">
          <h2 className="font-medium text-slate-800 mb-3">Crear sucursal</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <select
              value={form.tenant_id}
              onChange={(e) => setForm((f) => ({ ...f, tenant_id: Number(e.target.value) }))}
              className="w-full border border-slate-300 rounded px-3 py-2"
              required
            >
              <option value={0}>Seleccionar tenant</option>
              {tenants.map((t: { id: number; nombre: string }) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Nombre sucursal"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              className="w-full border border-slate-300 rounded px-3 py-2"
              required
            />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.activa} onChange={(e) => setForm((f) => ({ ...f, activa: e.target.checked }))} />
              Activa
            </label>
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
              <th className="text-left p-3 font-medium text-slate-700">Nombre</th>
              <th className="text-left p-3 font-medium text-slate-700">Tenant</th>
              <th className="text-left p-3 font-medium text-slate-700">Activa</th>
              <th className="text-right p-3 font-medium text-slate-700">Grabados mes</th>
            </tr>
          </thead>
          <tbody>
            {data?.results.map((s: Sucursal) => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3">{s.nombre}</td>
                <td className="p-3">{s.tenant?.nombre ?? '—'}</td>
                <td className="p-3">{s.activa ? 'Sí' : 'No'}</td>
                <td className="p-3 text-right">{s.grabados_mes_count ?? 0}</td>
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
