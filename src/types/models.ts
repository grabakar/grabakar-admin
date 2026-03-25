export type PanelPersona =
  | 'none'
  | 'platform_admin'
  | 'tenant_admin'
  | 'panel_operator_readonly'

export interface Usuario {
  id: number
  username: string
  nombre_completo: string
  rol: string
  is_staff?: boolean
  panel_persona?: PanelPersona
  email?: string
  tenant?: TenantMin
  sucursal?: SucursalMin
  activo?: boolean
  last_login?: string | null
  date_joined?: string
}

export interface TenantMin {
  id: number
  nombre: string
}

export interface Tenant {
  id: number
  nombre: string
  tipo_cliente: string
  logo_url: string | null
  color_primario: string
  color_secundario: string
  configuracion_json: Record<string, unknown>
  sucursales_count?: number
  usuarios_count?: number
  grabados_mes_count?: number
  sucursales?: SucursalMin[]
  usuarios_recientes?: { id: number; nombre_completo: string; rol: string; activo: boolean; last_login: string | null }[]
}

export interface SucursalMin {
  id: number
  nombre: string
  tenant?: TenantMin
  activa?: boolean
}

export interface Sucursal {
  id: number
  nombre: string
  tenant: TenantMin
  activa: boolean
  grabados_mes_count?: number
}

export interface LeyCaso {
  id: number
  nombre: string
  descripcion: string | null
  activa: boolean
}

export interface Grabado {
  uuid: string
  patente: string
  // Backend admin serializers may omit this depending on panel scope/contract.
  // The UI formatter handles missing values (`'—'`).
  rut_cliente?: string
  vin_chasis?: string | null
  orden_trabajo?: string | null
  responsable_texto?: string
  usuario_responsable: { id: number; nombre_completo: string }
  ley_caso?: { id: number; nombre: string }
  tenant: TenantMin
  sucursal?: SucursalMin | null
  tipo_movimiento: string
  tipo_vehiculo: string
  formato_impresion?: string
  fecha_creacion_local: string
  fecha_sincronizacion: string | null
  device_id?: string
  estado_sync: string
  es_duplicado: boolean
  cantidad_impresiones: number
}

export interface DashboardStats {
  fecha: string
  grabados_hoy: number
  grabados_mes: number
  grabados_total: number
  tenants_activos: number
  usuarios_activos: number
  sync_pendientes: number
  sync_errores: number
  sync_tasa_exito: number
}

export interface AnalyticsGrabados {
  periodo: { desde: string; hasta: string }
  serie: { fecha: string; total: number }[]
  por_tenant: { tenant_id: number; tenant_nombre: string; total: number }[]
  por_tipo_movimiento: { tipo: string; total: number }[]
}

export interface AnalyticsSync {
  resumen: { sincronizado: number; pendiente: number; error: number }
  serie: { fecha: string; sincronizado: number; pendiente: number; error: number }[]
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_expiry: number
  usuario: Usuario
  tenant?: TenantMin & { logo_url?: string; color_primario?: string; color_secundario?: string }
}
