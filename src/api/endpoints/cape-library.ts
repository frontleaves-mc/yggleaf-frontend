/**
 * 披风库 API 端点函数 + TanStack Query Hooks
 * 对接：披风 CRUD 全部接口
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import type {
  CapeLibrary,
  CreateCapeRequest,
  UpdateCapeRequest,
} from '#/api/types'

// ─── 端点函数 ──────────────────────────────────────────────

/** 获取披风列表 */
export async function getCapes(): Promise<CapeLibrary[]> {
  return apiClient.get<CapeLibrary[]>('/library/capes')
}

/** 创建披风 */
export async function createCape(data: CreateCapeRequest): Promise<CapeLibrary> {
  return apiClient.post<CapeLibrary>('/library/capes', data)
}

/** 更新披风 */
export async function updateCape(
  capeId: number,
  data: UpdateCapeRequest,
): Promise<CapeLibrary> {
  return apiClient.patch<CapeLibrary>(`/library/capes/${capeId}`, data)
}

/** 删除披风 */
export async function deleteCape(capeId: number): Promise<void> {
  return apiClient.delete(`/library/capes/${capeId}`)
}

// ─── TanStack Query Hooks ───────────────────────────────────

/** 披风列表 Query */
export function useCapes(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['capes'],
    queryFn: getCapes,
    enabled: options?.enabled ?? true,
  })
}

/** 创建披风 Mutation */
export function useCreateCapeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCape,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capes'] })
    },
  })
}

/** 更新披风 Mutation */
export function useUpdateCapeMutation(capeId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateCapeRequest) => updateCape(capeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capes'] })
    },
  })
}

/** 删除披风 Mutation */
export function useDeleteCapeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCape,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capes'] })
    },
  })
}
