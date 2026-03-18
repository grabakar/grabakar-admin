import { useAuth } from '../../contexts/AuthContext'

export function TopBar() {
  const { user, logout } = useAuth()

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4">
      <div className="text-slate-600 text-sm">Panel de administración</div>
      <div className="flex items-center gap-3">
        <span className="text-slate-700 text-sm">{user?.nombre_completo ?? user?.username}</span>
        <button
          type="button"
          onClick={logout}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
