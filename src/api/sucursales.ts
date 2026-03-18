import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { Sucursal, PaginatedResponse } from '../types/models'

const POLL_INTERVAL = 30_000

export function useSucursales(params?: { page?: number; page_size?: number; tenant_id?: number; search?: string; activa?: boolean }) {
  return useQuery({
    queryKey: ['admin', 'sucursales', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Sucursal>>('/admin/sucursales/', { params })
      return data
    },
    refetchInterval: POLL_INTERVAL,
  })
}

export function useCreateSucursal() {
  const q = useQueryClient()
  return useMutation({
    mutationFn: async (body: { nombre: string; tenant_id: number; activa?: boolean }) => {
      const { data } = await api.post<Sucursal>('/admin/sucursales/', body)
      return data
    },
    onSuccess: () => q.invalidateQueries({ queryKey: ['admin', 'sucursales'] }),
  })
}

export function useUpdateSucursal(id: number) {
  const q = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<Sucursal>) => {
      const { data } = await api.patch<Sucursal>(`/admin/sucursales/${id}/`, body)
      return data
    },
    onSuccess: () => q.invalidateQueries({ queryKey: ['admin', 'sucursales'] }),
  })
}
