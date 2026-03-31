import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTenant, useUpdateTenant } from '../api/tenants'
import { useSucursales } from '../api/sucursales'
import type { TenantPrecios } from '../types/models'

function formatCLP(value: number | null | undefined): string {
  if (value == null) return '—'
  return `$${value.toLocaleString('es-CL')}`
}

export function TenantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const tenantId = id ? parseInt(id, 10) : null
  const { data: tenant, isLoading } = useTenant(tenantId)
  const { data: sucursalesData } = useSucursales({ tenant_id: tenantId ?? undefined })
  const update = useUpdateTenant(tenantId ?? 0)

  const [editingPrecios, setEditingPrecios] = useState(false)
  const [preciosForm, setPreciosForm] = useState<TenantPrecios>({
    precio_grabado: null,
    precio_vidrio: null,
  })

  if (isLoading || !tenant) return <div className="text-slate-500">Cargando...</div>

  const sucursales = sucursalesData?.results ?? []
  const precios: TenantPrecios = tenant.configuracion_json?.precios ?? {
    precio_grabado: null,
    precio_vidrio: null,
  }

  const startEditPrecios = () => {
    setPreciosForm({ ...precios })
    setEditingPrecios(true)
  }

  const savePrecios = () => {
    update.mutate(
      {
        nombre: tenant.nombre,
        tipo_cliente: tenant.tipo_cliente,
        color_primario: tenant.color_primario,
        color_secundario: tenant.color_secundario,
        configuracion_json: {
          ...tenant.configuracion_json,
          precios: preciosForm,
        },
      },
      { onSuccess: () => setEditingPrecios(false) },
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/tenants" className="hover:text-slate-700">Tenants</Link>
        <span>/</span>
        <span className="text-slate-800">{tenant.nombre}</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h1 className="text-xl font-semibold text-slate-800 mb-4">{tenant.nombre}</h1>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-slate-500">Tipo cliente</dt>
          <dd>{tenant.tipo_cliente || '—'}</dd>
          <dt className="text-slate-500">Sucursales</dt>
          <dd>{tenant.sucursales_count ?? 0}</dd>
          <dt className="text-slate-500">Usuarios</dt>
          <dd>{tenant.usuarios_count ?? 0}</dd>
          <dt className="text-slate-500">Grabados mes</dt>
          <dd>{tenant.grabados_mes_count ?? 0}</dd>
          <dt className="text-slate-500">Colores</dt>
          <dd className="flex gap-1">
            <span className="inline-block w-5 h-5 rounded border" style={{ backgroundColor: tenant.color_primario }} title={tenant.color_primario} />
            <span className="inline-block w-5 h-5 rounded border" style={{ backgroundColor: tenant.color_secundario }} title={tenant.color_secundario} />
          </dd>
        </dl>
      </div>

      {/* Precios — phone-friendly editable cards */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium text-slate-800">Precios</h2>
          {!editingPrecios && (
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={startEditPrecios}
            >
              Editar
            </button>
          )}
        </div>

        {editingPrecios ? (
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Precio por grabado (CLP)
              </label>
              <input
                type="number"
                inputMode="numeric"
                className="w-full border border-slate-300 rounded px-3 py-3 text-lg"
                placeholder="Ej: 5000"
                value={preciosForm.precio_grabado ?? ''}
                onChange={e =>
                  setPreciosForm(p => ({
                    ...p,
                    precio_grabado: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Precio por vidrio (CLP)
              </label>
              <input
                type="number"
                inputMode="numeric"
                className="w-full border border-slate-300 rounded px-3 py-3 text-lg"
                placeholder="Ej: 800"
                value={preciosForm.precio_vidrio ?? ''}
                onChange={e =>
                  setPreciosForm(p => ({
                    ...p,
                    precio_vidrio: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 bg-slate-800 text-white px-4 py-3 rounded text-sm font-medium hover:bg-slate-700 disabled:opacity-50"
                onClick={savePrecios}
                disabled={update.isPending}
              >
                {update.isPending ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                className="flex-1 border border-slate-300 px-4 py-3 rounded text-sm hover:bg-slate-50"
                onClick={() => setEditingPrecios(false)}
                disabled={update.isPending}
              >
                Cancelar
              </button>
            </div>
            {update.isError && (
              <p className="text-sm text-red-600">{(update.error as Error).message}</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Por grabado</p>
              <p className="text-xl font-semibold text-slate-800">
                {formatCLP(precios.precio_grabado)}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Por vidrio</p>
              <p className="text-xl font-semibold text-slate-800">
                {formatCLP(precios.precio_vidrio)}
              </p>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-medium text-slate-800 mb-2">Sucursales</h2>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          {sucursales.length === 0 ? (
            <p className="p-4 text-slate-500 text-sm">Sin sucursales</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-3 font-medium text-slate-700">Nombre</th>
                  <th className="text-left p-3 font-medium text-slate-700">Activa</th>
                </tr>
              </thead>
              <tbody>
                {sucursales.map((s: { id: number; nombre: string; activa: boolean }) => (
                  <tr key={s.id} className="border-t border-slate-100">
                    <td className="p-3">{s.nombre}</td>
                    <td className="p-3">{s.activa ? 'Si' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {tenant.usuarios_recientes && tenant.usuarios_recientes.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-slate-800 mb-2">Usuarios recientes</h2>
          <ul className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
            {tenant.usuarios_recientes.map((u: { id: number; nombre_completo: string; rol: string }) => (
              <li key={u.id} className="p-3 flex justify-between">
                <span>{u.nombre_completo}</span>
                <span className="text-slate-500 text-sm">{u.rol}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
