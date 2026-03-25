import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from 'react'
import { api } from '../api/client'
import type { Usuario, LoginResponse, PanelPersona } from '../types/models'

const AUTH_ACCESS = 'admin_access_token'
const AUTH_REFRESH = 'admin_refresh_token'
const AUTH_USER = 'admin_user'

const PANEL_ALLOWED: ReadonlySet<PanelPersona> = new Set([
  'platform_admin',
  'tenant_admin',
  'panel_operator_readonly',
])

function isPanelLogin(u: Usuario | null | undefined): boolean {
  const p = u?.panel_persona
  return !!p && PANEL_ALLOWED.has(p)
}

interface AuthState {
  user: Usuario | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  /** @deprecated prefer panelPersona === 'platform_admin' */
  isStaff: boolean
  panelPersona: PanelPersona | null
  isPlatformAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadUser(): Usuario | null {
  try {
    const raw = localStorage.getItem(AUTH_USER)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(loadUser)
  const [isLoading, setIsLoading] = useState(true)

  const login = useCallback(async (username: string, password: string) => {
    const { data } = await api.post<LoginResponse>('/auth/login/', { username, password })
    if (!isPanelLogin(data.usuario)) {
      throw new Error('Tu cuenta no tiene acceso al panel de administración.')
    }
    localStorage.setItem(AUTH_ACCESS, data.access_token)
    localStorage.setItem(AUTH_REFRESH, data.refresh_token)
    localStorage.setItem(AUTH_USER, JSON.stringify(data.usuario))
    setUser(data.usuario)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_ACCESS)
    localStorage.removeItem(AUTH_REFRESH)
    localStorage.removeItem(AUTH_USER)
    setUser(null)
    window.location.href = '/login'
  }, [])

  useEffect(() => {
    setUser(loadUser())
    setIsLoading(false)
  }, [])

  const panelPersona = (user?.panel_persona as PanelPersona | undefined) ?? null
  const isPlatformAdmin = panelPersona === 'platform_admin'

  const value: AuthContextValue = {
    user,
    isAuthenticated: isPanelLogin(user),
    isLoading,
    login,
    logout,
    isStaff: isPlatformAdmin,
    panelPersona,
    isPlatformAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
