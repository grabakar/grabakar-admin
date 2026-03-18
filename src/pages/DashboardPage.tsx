import { useDashboard, useAnalyticsGrabados } from '../api/analytics'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['#1e40af', '#059669', '#b45309']

export function DashboardPage() {
  const { data: dashboard, isLoading: loadingDashboard } = useDashboard()
  const { data: analytics, isLoading: loadingAnalytics } = useAnalyticsGrabados({ dias: 30 })

  if (loadingDashboard || !dashboard) {
    return <div className="text-slate-500">Cargando dashboard...</div>
  }

  const kpis = [
    { label: 'Grabados hoy', value: dashboard.grabados_hoy },
    { label: 'Grabados mes', value: dashboard.grabados_mes },
    { label: 'Total grabados', value: dashboard.grabados_total },
    { label: 'Tenants', value: dashboard.tenants_activos },
    { label: 'Usuarios activos', value: dashboard.usuarios_activos },
    { label: 'Sync pendientes', value: dashboard.sync_pendientes },
    { label: 'Sync errores', value: dashboard.sync_errores },
    { label: 'Tasa éxito sync %', value: dashboard.sync_tasa_exito },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {kpis.map(({ label, value }) => (
          <div key={label} className="bg-white rounded-lg border border-slate-200 p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
            <p className="text-xl font-semibold text-slate-800 mt-1">{value}</p>
          </div>
        ))}
      </div>

      {!loadingAnalytics && analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h2 className="text-sm font-medium text-slate-700 mb-4">Grabados últimos 30 días</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.serie}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="fecha" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#1e40af" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h2 className="text-sm font-medium text-slate-700 mb-4">Por tipo de movimiento</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.por_tipo_movimiento}
                    dataKey="total"
                    nameKey="tipo"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ tipo, total }) => `${tipo}: ${total}`}
                  >
                    {analytics.por_tipo_movimiento.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {!loadingAnalytics && analytics && analytics.por_tenant.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h2 className="text-sm font-medium text-slate-700 mb-4">Grabados por tenant (top 20)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.por_tenant} layout="vertical" margin={{ left: 120 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="tenant_nombre" width={110} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#1e40af" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
