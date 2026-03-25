import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGrabados } from '../api/grabados'
import { useTenants } from '../api/tenants'
import { formatearRut } from '../utils/format'
import type { Grabado } from '../types/models'

export function GrabadosPage() {
  const [page, setPage] = useState(1)
  const [tenantId, setTenantId] = useState<number | ''>('')
  const [estadoSync, setEstadoSync] = useState('')
  const [patente, setPatente] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const { data, isLoading } = useGrabados({
    page,
    page_size: 20,
    tenant_id: tenantId || undefined,
    estado_sync: estadoSync || undefined,
    patente: patente || undefined,
    fecha_desde: fechaDesde || undefined,
    fecha_hasta: fechaHasta || undefined,
  })
  const { data: tenantsData } = useTenants({ page_size: 100 })
  const tenants = tenantsData?.results ?? []

  if (isLoading) return <div className="text-slate-500">Cargando...</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-800">Grabados</h1>

      <div className="flex flex-wrap gap-2">
        <select value={tenantId} onChange={(e) => setTenantId(e.target.value === '' ? '' : Number(e.target.value))} className="border border-slate-300 rounded px-3 py-2 text-sm">
          <option value="">Todos los tenants</option>
          {tenants.map((t: { id: number; nombre: string }) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>
        <select value={estadoSync} onChange={(e) => setEstadoSync(e.target.value)} className="border border-slate-300 rounded px-3 py-2 text-sm">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="sincronizado">Sincronizado</option>
          <option value="error">Error</option>
        </select>
        <input type="text" placeholder="Patente" value={patente} onChange={(e) => setPatente(e.target.value)} className="border border-slate-300 rounded px-3 py-2 text-sm w-28" />
        <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className="border border-slate-300 rounded px-3 py-2 text-sm" />
        <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className="border border-slate-300 rounded px-3 py-2 text-sm" />
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-3 font-medium text-slate-700">Patente</th>
              <th className="text-left p-3 font-medium text-slate-700">RUT</th>
              <th className="text-left p-3 font-medium text-slate-700">VIN</th>
              <th className="text-left p-3 font-medium text-slate-700">Tipo mov.</th>
              <th className="text-left p-3 font-medium text-slate-700">Operador</th>
              <th className="text-left p-3 font-medium text-slate-700">Tenant</th>
              <th className="text-left p-3 font-medium text-slate-700">Fecha</th>
              <th className="text-left p-3 font-medium text-slate-700">Sync</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {data?.results.map((g: Grabado) => (
              <tr key={g.uuid} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-3 font-mono">{g.patente}</td>
                <td className="p-3 font-mono text-slate-600">{formatearRut(g.rut_cliente)}</td>
                <td className="p-3 text-slate-600">{g.vin_chasis ? `${g.vin_chasis.slice(0, 8)}…` : '—'}</td>
                <td className="p-3">{g.tipo_movimiento}</td>
                <td className="p-3">{g.usuario_responsable?.nombre_completo ?? '—'}</td>
                <td className="p-3">{g.tenant?.nombre ?? '—'}</td>
                <td className="p-3 text-slate-600">{g.fecha_creacion_local ? new Date(g.fecha_creacion_local).toLocaleString() : '—'}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${g.estado_sync === 'sincronizado' ? 'bg-green-100 text-green-800' : g.estado_sync === 'error' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                    {g.estado_sync}
                  </span>
                </td>
                <td className="p-3">
                  <Link to={`/grabados/${g.uuid}`} className="text-blue-600 hover:underline">Ver</Link>
                </td>
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
