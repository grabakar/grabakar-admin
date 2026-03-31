import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { PageLayout } from './components/layout/PageLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { TenantsPage } from './pages/TenantsPage'
import { TenantDetailPage } from './pages/TenantDetailPage'
import { SucursalesPage } from './pages/SucursalesPage'
import { UsuariosPage } from './pages/UsuariosPage'
import { GrabadosPage } from './pages/GrabadosPage'
import { GrabadoDetailPage } from './pages/GrabadoDetailPage'
import { ReportesPage } from './pages/ReportesPage'
import { ConfigPage } from './pages/ConfigPage'

const queryClient = new QueryClient()

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="p-8 text-slate-500">Cargando...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <PageLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="tenants" element={<TenantsPage />} />
        <Route path="tenants/:id" element={<TenantDetailPage />} />
        <Route path="sucursales" element={<SucursalesPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="grabados" element={<GrabadosPage />} />
        <Route path="grabados/:uuid" element={<GrabadoDetailPage />} />
        <Route path="reportes" element={<ReportesPage />} />
        <Route path="config" element={<ConfigPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </HashRouter>
    </QueryClientProvider>
  )
}
