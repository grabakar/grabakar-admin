import { useState } from 'react'
import { api } from '../api/client'

export function ReportesPage() {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleDownload() {
    if (!fechaInicio || !fechaFin) {
      setError('Indica fecha inicio y fecha fin.')
      return
    }
    setError('')
    setLoading(true)
    api
      .get('/reportes/plataforma/', {
        params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
        responseType: 'blob',
      })
      .then((res) => {
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `reporte_plataforma_${fechaInicio}_${fechaFin}.xlsx`
        a.click()
        URL.revokeObjectURL(url)
      })
      .catch(() => setError('Error al descargar el reporte.'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-800">Reportes</h1>

      <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-md">
        <h2 className="font-medium text-slate-800 mb-3">Reporte XLSX plataforma</h2>
        <p className="text-sm text-slate-600 mb-4">
          Descarga el reporte global (todos los tenants) en formato XLSX. Requiere rango de fechas.
        </p>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Fecha inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Fecha fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={handleDownload}
            disabled={loading}
            className="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? 'Descargando...' : 'Descargar XLSX'}
          </button>
        </div>
      </div>
    </div>
  )
}
