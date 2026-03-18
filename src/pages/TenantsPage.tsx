import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTenants, useCreateTenant } from '../api/tenants'
import type { Tenant } from '../types/models'

export function TenantsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', tipo_cliente: '', color_primario: '#1976D2', color_secundario: '#424242' })

  const { data, isLoading } = useTenants({ page, page_size: 20, search: search || undefined })
  const create = useCreateTenant()

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    create.mutate(form, {
      onSuccess: () => {
        setShowForm(false)
        setForm({ nombre: '', tipo_cliente: '', color_primario: '#1976D2', color_secundario: '#424242' })
      },
    })
  }

  if (isLoading) return <div className="text-slate-500">Cargando...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Tenants</h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-700"
        >
          Nuevo tenant
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="search"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 w-64"
        />
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 max-w-md">
          <h2 className="font-medium text-slate-800 mb-3">Crear tenant</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              type="text"
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              className="w-full border border-slate-300 rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Tipo cliente"
              value={form.tipo_cliente}
              onChange={(e) => setForm((f) => ({ ...f, tipo_cliente: e.target.value }))}
              className="w-full border border-slate-300 rounded px-3 py-2"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="#1976D2"
                value={form.color_primario}
                onChange={(e) => setForm((f) => ({ ...f, color_primario: e.target.value }))}
                className="flex-1 border border-slate-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="#424242"
                value={form.color_secundario}
                onChange={(e) => setForm((f) => ({ ...f, color_secundario: e.target.value }))}
                className="flex-1 border border-slate-300 rounded px-3 py-2"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded text-sm" disabled={create.isPending}>
                Crear
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-slate-300 px-4 py-2 rounded text-sm">
                Cancelar
              </button>
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
              <th className="text-left p-3 font-medium text-slate-700">Tipo</th>
              <th className="text-right p-3 font-medium text-slate-700">Sucursales</th>
              <th className="text-right p-3 font-medium text-slate-700">Usuarios</th>
              <th className="text-right p-3 font-medium text-slate-700">Grabados mes</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {data?.results.map((t: Tenant) => (
              <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3">{t.nombre}</td>
                <td className="p-3">{t.tipo_cliente || '—'}</td>
                <td className="p-3 text-right">{t.sucursales_count ?? 0}</td>
                <td className="p-3 text-right">{t.usuarios_count ?? 0}</td>
                <td className="p-3 text-right">{t.grabados_mes_count ?? 0}</td>
                <td className="p-3">
                  <span className="inline-block w-4 h-4 rounded border border-slate-300" style={{ backgroundColor: t.color_primario }} title={t.color_primario} />
                </td>
                <td className="p-3">
                  <Link to={`/tenants/${t.id}`} className="text-blue-600 hover:underline">
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data && data.count > 20 && (
          <div className="p-3 border-t border-slate-200 flex justify-between items-center">
            <span className="text-slate-500 text-sm">Total: {data.count}</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!data.previous}
                onClick={() => setPage((p) => p - 1)}
                className="border border-slate-300 px-3 py-1 rounded text-sm disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={!data.next}
                onClick={() => setPage((p) => p + 1)}
                className="border border-slate-300 px-3 py-1 rounded text-sm disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
