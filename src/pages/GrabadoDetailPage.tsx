import { useParams, Link } from 'react-router-dom'
import { useGrabado } from '../api/grabados'
import { formatearRut } from '../utils/format'
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
          <dt className="text-slate-500">RUT Cliente</dt>
          <dd className="font-mono">{formatearRut(g.rut_cliente)}</dd>
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
          <dt className="text-slate-500">Impresiones</dt>
          <dd>{g.cantidad_impresiones}</dd>
        </dl>
      </div>
    </div>
  )
}
