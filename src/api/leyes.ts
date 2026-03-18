import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type { LeyCaso, PaginatedResponse } from '../types/models'

const POLL_INTERVAL = 30_000

export function useLeyes() {
  return useQuery({
    queryKey: ['admin', 'leyes'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<LeyCaso>>('/admin/leyes/')
      return data.results ?? []
    },
    refetchInterval: POLL_INTERVAL,
  })
}

export function useCreateLey() {
  const q = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<LeyCaso>) => {
      const { data } = await api.post<LeyCaso>('/admin/leyes/', body)
      return data
    },
    onSuccess: () => q.invalidateQueries({ queryKey: ['admin', 'leyes'] }),
  })
}

export function useUpdateLey(id: number) {
  const q = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<LeyCaso>) => {
      const { data } = await api.put<LeyCaso>(`/admin/leyes/${id}/`, body)
      return data
    },
    onSuccess: () => q.invalidateQueries({ queryKey: ['admin', 'leyes'] }),
  })
}
