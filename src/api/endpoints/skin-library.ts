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
  LibraryListResponse,
  LibrarySimpleListResponse,
} from '#/api/types'

// ─── 参数接口 ─────────────────────────────────────────────

export interface SkinListParams {
  /** 列表模式：market(市场) / mine(我的) */
  mode?: 'market' | 'mine'
  /** 页码 */
  page?: number
  /** 每页数量 */
  page_size?: number
}

// ─── 端点函数 ──────────────────────────────────────────────

/** 获取皮肤列表 */
export async function getSkins(params?: SkinListParams): Promise<LibraryListResponse<SkinLibrary>> {
  const searchParams = new URLSearchParams()
  if (params?.mode !== undefined) searchParams.set('mode', params.mode)
  if (params?.page !== undefined) searchParams.set('page', String(params.page))
  if (params?.page_size !== undefined) searchParams.set('page_size', String(params.page_size))
  const query = searchParams.toString()
  const path = query ? `/library/skins?${query}` : '/library/skins'
  return apiClient.get<LibraryListResponse<SkinLibrary>>(path)
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

/** 获取皮肤精简列表（仅 ID + 名称，用于选择器） */
export async function getSkinsList(): Promise<LibrarySimpleListResponse> {
  return apiClient.get<LibrarySimpleListResponse>('/library/skins/list')
}

// ─── TanStack Query Hooks ───────────────────────────────────

/** 皮肤列表 Query */
export function useSkins(params?: SkinListParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['skins', params],
    queryFn: () => getSkins(params),
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
      queryClient.invalidateQueries({ queryKey: ['library-quota'] })
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
      queryClient.invalidateQueries({ queryKey: ['library-quota'] })
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
      queryClient.invalidateQueries({ queryKey: ['library-quota'] })
    },
  })
}

/** 皮肤精简列表 Query（用于档案皮肤选择器） */
export function useSkinsList(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['skins', 'list'],
    queryFn: getSkinsList,
    enabled: options?.enabled ?? true,
  })
}
