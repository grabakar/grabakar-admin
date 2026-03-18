import { useQuery } from '@tanstack/react-query'
import { api } from './client'
import type { Grabado, PaginatedResponse } from '../types/models'

const POLL_INTERVAL = 30_000

export function useGrabados(params?: {
  page?: number
  page_size?: number
  tenant_id?: number
  sucursal_id?: number
  operador_id?: number
  estado_sync?: string
  tipo_movimiento?: string
  tipo_vehiculo?: string
  patente?: string
  fecha_desde?: string
  fecha_hasta?: string
  es_duplicado?: boolean
}) {
  return useQuery({
    queryKey: ['admin', 'grabados', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Grabado>>('/admin/grabados/', { params })
      return data
    },
    refetchInterval: POLL_INTERVAL,
  })
}

export function useGrabado(uuid: string | null) {
  return useQuery({
    queryKey: ['admin', 'grabado', uuid],
    queryFn: async () => {
      const { data } = await api.get<Grabado>(`/admin/grabados/${uuid}/`)
      return data
    },
    enabled: !!uuid,
  })
}
