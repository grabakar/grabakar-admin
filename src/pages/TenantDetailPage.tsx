import { useParams, Link } from 'react-router-dom'
import { useTenant } from '../api/tenants'
import { useSucursales } from '../api/sucursales'

export function TenantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const tenantId = id ? parseInt(id, 10) : null
  const { data: tenant, isLoading } = useTenant(tenantId)
  const { data: sucursalesData } = useSucursales({ tenant_id: tenantId ?? undefined })

  if (isLoading || !tenant) return <div className="text-slate-500">Cargando...</div>

  const sucursales = sucursalesData?.results ?? []

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
                    <td className="p-3">{s.activa ? 'Sí' : 'No'}</td>
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
