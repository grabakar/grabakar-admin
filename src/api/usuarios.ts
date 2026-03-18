import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { Usuario, PaginatedResponse } from '../types/models'

const POLL_INTERVAL = 30_000

export function useUsuarios(params?: { page?: number; page_size?: number; tenant_id?: number; rol?: string; activo?: boolean; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'usuarios', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Usuario>>('/admin/usuarios/', { params })
      return data
    },
    refetchInterval: POLL_INTERVAL,
  })
}

export function useCreateUsuario() {
  const q = useQueryClient()
  return useMutation({
    mutationFn: async (body: { username: string; password: string; nombre_completo: string; email?: string; rol: string; tenant_id: number; sucursal_id?: number | null; activo?: boolean; is_staff?: boolean }) => {
      const { data } = await api.post<Usuario>('/admin/usuarios/', body)
      return data
    },
    onSuccess: () => q.invalidateQueries({ queryKey: ['admin', 'usuarios'] }),
  })
}

export function useUpdateUsuario(id: number) {
  const q = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<Usuario>) => {
      const { data } = await api.patch<Usuario>(`/admin/usuarios/${id}/`, body)
      return data
    },
    onSuccess: () => q.invalidateQueries({ queryKey: ['admin', 'usuarios'] }),
  })
}

export function useResetPassword(id: number) {
  const q = useQueryClient()
  return useMutation({
    mutationFn: async (new_password: string) => {
      await api.post(`/admin/usuarios/${id}/reset_password/`, { new_password })
    },
    onSuccess: () => q.invalidateQueries({ queryKey: ['admin', 'usuarios'] }),
  })
}
