import { useParams, Link } from 'react-router-dom'
import { useGrabado } from '../api/grabados'
import type { Grabado as GrabadoType } from '../types/models'

export function GrabadoDetailPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const { data: grabado, isLoading } = useGrabado(uuid ?? null)

  if (isLoading || !grabado) return <div className="text-slate-500">Cargando...</div>

  const g = grabado as GrabadoType

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/grabados" className="hover:text-slate-700">Grabados</Link>
        <span>/</span>
        <span className="text-slate-800 font-mono">{g.patente}</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h1 className="text-xl font-semibold text-slate-800 mb-4">Grabado {g.patente}</h1>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-slate-500">Patente</dt>
          <dd className="font-mono">{g.patente}</dd>
          <dt className="text-slate-500">VIN</dt>
          <dd>{g.vin_chasis || '—'}</dd>
          <dt className="text-slate-500">Orden trabajo</dt>
          <dd>{g.orden_trabajo || '—'}</dd>
          <dt className="text-slate-500">Responsable</dt>
          <dd>{g.usuario_responsable?.nombre_completo ?? '—'}</dd>
          <dt className="text-slate-500">Tenant</dt>
          <dd>{g.tenant?.nombre ?? '—'}</dd>
          <dt className="text-slate-500">Sucursal</dt>
          <dd>{g.sucursal?.nombre ?? '—'}</dd>
          <dt className="text-slate-500">Tipo movimiento</dt>
          <dd>{g.tipo_movimiento}</dd>
          <dt className="text-slate-500">Tipo vehículo</dt>
          <dd>{g.tipo_vehiculo}</dd>
          <dt className="text-slate-500">Fecha creación</dt>
          <dd>{g.fecha_creacion_local ? new Date(g.fecha_creacion_local).toLocaleString() : '—'}</dd>
          <dt className="text-slate-500">Fecha sync</dt>
          <dd>{g.fecha_sincronizacion ? new Date(g.fecha_sincronizacion).toLocaleString() : '—'}</dd>
          <dt className="text-slate-500">Estado sync</dt>
          <dd><span className={`px-2 py-0.5 rounded text-xs ${g.estado_sync === 'sincronizado' ? 'bg-green-100' : g.estado_sync === 'error' ? 'bg-red-100' : 'bg-amber-100'}`}>{g.estado_sync}</span></dd>
          <dt className="text-slate-500">Duplicado</dt>
          <dd>{g.es_duplicado ? 'Sí' : 'No'}</dd>
        </dl>
      </div>

      {g.vidrios && g.vidrios.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-slate-800 mb-2">Vidrios</h2>
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-3 font-medium text-slate-700">Nº</th>
                  <th className="text-left p-3 font-medium text-slate-700">Nombre</th>
                  <th className="text-left p-3 font-medium text-slate-700">Impreso</th>
                  <th className="text-right p-3 font-medium text-slate-700">Cantidad</th>
                  <th className="text-left p-3 font-medium text-slate-700">Fecha impresión</th>
                </tr>
              </thead>
              <tbody>
                {g.vidrios.map((v) => (
                  <tr key={v.uuid} className="border-t border-slate-100">
                    <td className="p-3">{v.numero_vidrio}</td>
                    <td className="p-3">{v.nombre_vidrio}</td>
                    <td className="p-3">{v.impreso ? 'Sí' : 'No'}</td>
                    <td className="p-3 text-right">{v.cantidad_impresiones}</td>
                    <td className="p-3 text-slate-600">{v.fecha_impresion ? new Date(v.fecha_impresion).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
