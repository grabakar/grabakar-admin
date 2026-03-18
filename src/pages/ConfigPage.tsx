import { useState } from 'react'
import { useLeyes, useCreateLey, useUpdateLey } from '../api/leyes'
import type { LeyCaso } from '../types/models'

export function ConfigPage() {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<LeyCaso | null>(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '', activa: true })

  const { data: leyesData, isLoading } = useLeyes()
  const create = useCreateLey()
  const update = useUpdateLey(editing?.id ?? 0)

  const leyes = leyesData ?? []

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      update.mutate(form, { onSuccess: () => { setEditing(null); setForm({ nombre: '', descripcion: '', activa: true }); } })
    } else {
      create.mutate(form, { onSuccess: () => { setShowForm(false); setForm({ nombre: '', descripcion: '', activa: true }); } })
    }
  }

  if (isLoading) return <div className="text-slate-500">Cargando...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Configuración</h1>
        <button
          type="button"
          onClick={() => { setShowForm(true); setEditing(null); setForm({ nombre: '', descripcion: '', activa: true }); }}
          className="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-700"
        >
          Nueva ley / caso
        </button>
      </div>

      <div>
        <h2 className="text-lg font-medium text-slate-800 mb-2">Leyes / Casos</h2>
        <p className="text-sm text-slate-600 mb-3">Normativas aplicables a grabados (ej. Ley 20.580).</p>

        {(showForm || editing) && (
          <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 max-w-md">
            <h3 className="font-medium text-slate-800 mb-3">{editing ? 'Editar' : 'Crear'} ley/caso</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                className="w-full border border-slate-300 rounded px-3 py-2"
                required
              />
              <textarea
                placeholder="Descripción"
                value={form.descripcion}
                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                className="w-full border border-slate-300 rounded px-3 py-2"
                rows={2}
              />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.activa} onChange={(e) => setForm((f) => ({ ...f, activa: e.target.checked }))} />
                Activa
              </label>
              <div className="flex gap-2">
                <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded text-sm" disabled={create.isPending || update.isPending}>
                  {editing ? 'Guardar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditing(null); setForm({ nombre: '', descripcion: '', activa: true }); }}
                  className="border border-slate-300 px-4 py-2 rounded text-sm"
                >
                  Cancelar
                </button>
              </div>
              {(create.isError || update.isError) && <p className="text-sm text-red-600">Error al guardar</p>}
            </form>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-3 font-medium text-slate-700">Nombre</th>
                <th className="text-left p-3 font-medium text-slate-700">Descripción</th>
                <th className="text-left p-3 font-medium text-slate-700">Activa</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {leyes.map((l: LeyCaso) => (
                <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3">{l.nombre}</td>
                  <td className="p-3 text-slate-600">{l.descripcion || '—'}</td>
                  <td className="p-3">{l.activa ? 'Sí' : 'No'}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => { setEditing(l); setForm({ nombre: l.nombre, descripcion: l.descripcion || '', activa: l.activa }); setShowForm(false); }}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leyes.length === 0 && <p className="p-4 text-slate-500 text-sm">Sin leyes/casos configurados</p>}
        </div>
      </div>
    </div>
  )
}
