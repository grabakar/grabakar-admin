import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import type { PanelPersona } from '../../types/models'

type LinkItem = { to: string; label: string; personas: PanelPersona[] | 'all' }

const links: LinkItem[] = [
  { to: '/', label: 'Dashboard', personas: 'all' },
  { to: '/tenants', label: 'Tenants', personas: ['platform_admin', 'tenant_admin'] },
  { to: '/sucursales', label: 'Sucursales', personas: 'all' },
  { to: '/usuarios', label: 'Usuarios', personas: ['platform_admin', 'tenant_admin'] },
  { to: '/grabados', label: 'Grabados', personas: 'all' },
  { to: '/reportes', label: 'Reportes', personas: ['platform_admin'] },
  { to: '/config', label: 'Configuración', personas: ['platform_admin'] },
]

function linkVisible(persona: PanelPersona | null, item: LinkItem): boolean {
  if (item.personas === 'all') return true
  if (!persona) return false
  return item.personas.includes(persona)
}

export function Sidebar() {
  const { panelPersona } = useAuth()
  const visible = links.filter((l) => linkVisible(panelPersona, l))

  return (
    <aside className="w-56 bg-slate-800 text-slate-200 min-h-screen flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <span className="font-semibold text-lg">GrabaKar Admin</span>
      </div>
      <nav className="flex-1 p-2">
        {visible.map(({ to, label }) => (
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
