import { useQuery } from '@tanstack/react-query'
import { api } from './client'
import type { DashboardStats, AnalyticsGrabados, AnalyticsSync } from '../types/models'

const POLL_INTERVAL = 30_000

export function useDashboard(fecha?: string) {
  return useQuery({
    queryKey: ['admin', 'dashboard', fecha],
    queryFn: async () => {
      const { data } = await api.get<DashboardStats>('/admin/dashboard/', fecha ? { params: { fecha } } : {})
      return data
    },
    refetchInterval: POLL_INTERVAL,
  })
}

export function useAnalyticsGrabados(params?: { dias?: number; tenant_id?: number }) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'grabados', params],
    queryFn: async () => {
      const { data } = await api.get<AnalyticsGrabados>('/admin/analytics/grabados/', { params })
      return data
    },
    refetchInterval: POLL_INTERVAL,
  })
}

export function useAnalyticsSync(params?: { dias?: number; tenant_id?: number }) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'sync', params],
    queryFn: async () => {
      const { data } = await api.get<AnalyticsSync>('/admin/analytics/sync/', { params })
      return data
    },
    refetchInterval: POLL_INTERVAL,
  })
}
