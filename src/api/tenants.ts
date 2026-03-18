import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { Tenant, PaginatedResponse } from '../types/models'

const POLL_INTERVAL = 30_000

export function useTenants(params?: { page?: number; page_size?: number; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'tenants', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Tenant>>('/admin/tenants/', { params })
      return data
    },
    refetchInterval: POLL_INTERVAL,
  })
}

export function useTenant(id: number | null) {
  return useQuery({
    queryKey: ['admin', 'tenant', id],
    queryFn: async () => {
      const { data } = await api.get<Tenant>(`/admin/tenants/${id}/`)
      return data
    },
    enabled: id != null,
  })
}

export function useCreateTenant() {
  const q = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<Tenant>) => {
      const { data } = await api.post<Tenant>('/admin/tenants/', body)
      return data
    },
    onSuccess: () => q.invalidateQueries({ queryKey: ['admin', 'tenants'] }),
  })
}

export function useUpdateTenant(id: number) {
  const q = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<Tenant>) => {
      const { data } = await api.put<Tenant>(`/admin/tenants/${id}/`, body)
      return data
    },
    onSuccess: () => {
      q.invalidateQueries({ queryKey: ['admin', 'tenants'] })
      q.invalidateQueries({ queryKey: ['admin', 'tenant', id] })
    },
  })
}
