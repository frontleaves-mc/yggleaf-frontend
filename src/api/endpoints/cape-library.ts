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
  LibraryListResponse,
} from '#/api/types'

// ─── 参数接口 ─────────────────────────────────────────────

export interface CapeListParams {
  /** 列表模式：market(市场) / mine(我的) */
  mode?: 'market' | 'mine'
  /** 页码 */
  page?: number
  /** 每页数量 */
  page_size?: number
}

// ─── 端点函数 ──────────────────────────────────────────────

/** 获取披风列表 */
export async function getCapes(params?: CapeListParams): Promise<LibraryListResponse<CapeLibrary>> {
  const searchParams = new URLSearchParams()
  if (params?.mode !== undefined) searchParams.set('mode', params.mode)
  if (params?.page !== undefined) searchParams.set('page', String(params.page))
  if (params?.page_size !== undefined) searchParams.set('page_size', String(params.page_size))
  const query = searchParams.toString()
  const path = query ? `/library/capes?${query}` : '/library/capes'
  return apiClient.get<LibraryListResponse<CapeLibrary>>(path)
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
export function useCapes(params?: CapeListParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['capes', params],
    queryFn: () => getCapes(params),
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
      queryClient.invalidateQueries({ queryKey: ['library-quota'] })
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
      queryClient.invalidateQueries({ queryKey: ['library-quota'] })
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
      queryClient.invalidateQueries({ queryKey: ['library-quota'] })
    },
  })
}
