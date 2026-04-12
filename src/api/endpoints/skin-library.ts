/**
 * 皮肤库 API 端点函数 + TanStack Query Hooks
 * 对接：皮肤 CRUD 全部接口
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import type {
  SkinLibrary,
  CreateSkinRequest,
  UpdateSkinRequest,
} from '#/api/types'

// ─── 端点函数 ──────────────────────────────────────────────

/** 获取皮肤列表 */
export async function getSkins(): Promise<SkinLibrary[]> {
  return apiClient.get<SkinLibrary[]>('/library/skins')
}

/** 创建皮肤 */
export async function createSkin(data: CreateSkinRequest): Promise<SkinLibrary> {
  return apiClient.post<SkinLibrary>('/library/skins', data)
}

/** 更新皮肤 */
export async function updateSkin(
  skinId: number,
  data: UpdateSkinRequest,
): Promise<SkinLibrary> {
  return apiClient.patch<SkinLibrary>(`/library/skins/${skinId}`, data)
}

/** 删除皮肤 */
export async function deleteSkin(skinId: number): Promise<void> {
  return apiClient.delete(`/library/skins/${skinId}`)
}

// ─── TanStack Query Hooks ───────────────────────────────────

/** 皮肤列表 Query */
export function useSkins(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['skins'],
    queryFn: getSkins,
    enabled: options?.enabled ?? true,
  })
}

/** 创建皮肤 Mutation */
export function useCreateSkinMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSkin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skins'] })
    },
  })
}

/** 更新皮肤 Mutation */
export function useUpdateSkinMutation(skinId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateSkinRequest) => updateSkin(skinId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skins'] })
    },
  })
}

/** 删除皮肤 Mutation */
export function useDeleteSkinMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSkin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skins'] })
    },
  })
}
