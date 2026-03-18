import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/tenants', label: 'Tenants' },
  { to: '/sucursales', label: 'Sucursales' },
  { to: '/usuarios', label: 'Usuarios' },
  { to: '/grabados', label: 'Grabados' },
  { to: '/reportes', label: 'Reportes' },
  { to: '/config', label: 'Configuración' },
]

export function Sidebar() {
  return (
    <aside className="w-56 bg-slate-800 text-slate-200 min-h-screen flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <span className="font-semibold text-lg">GrabaKar Admin</span>
      </div>
      <nav className="flex-1 p-2">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md mb-0.5 ${isActive ? 'bg-slate-600 text-white' : 'hover:bg-slate-700'}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
