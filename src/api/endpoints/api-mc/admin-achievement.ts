/**
 * 管理员成就管理 API 端点函数 + TanStack Query Hooks
 * 对接锋楪核心后端 (mcApiClient)
 *
 * 接口路径：/admin/achievements (CRUD) + /admin/achievements/{id}/grant (授予)
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type {
  AchievementResponse,
  AchievementListResponse,
  CreateAchievementRequest,
  UpdateAchievementRequest,
  GrantAchievementRequest,
  AdminAchievementListParams,
} from '../../types/api-mc/achievement'

// ─── Query Keys ────────────────────────────────────────────

export const ADMIN_ACHIEVEMENT_LIST_QUERY_KEY = [
  'admin',
  'mc',
  'achievements',
] as const
export const ADMIN_ACHIEVEMENT_DETAIL_QUERY_KEY = [
  'admin',
  'mc',
  'achievement',
  'detail',
] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 管理员查询成就列表（分页 + 类型筛选） */
export async function getAdminAchievements(
  params?: AdminAchievementListParams,
): Promise<AchievementListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.page_size) sp.set('page_size', String(params.page_size))
  if (params?.type !== undefined) sp.set('type', String(params.type))
  const qs = sp.toString()
  return mcApiClient.get<AchievementListResponse>(
    qs ? `/admin/achievements?${qs}` : '/admin/achievements',
  )
}

/** 管理员查询成就详情 */
export async function getAdminAchievementDetail(
  id: string,
): Promise<AchievementResponse> {
  return mcApiClient.get<AchievementResponse>(`/admin/achievements/${id}`)
}

/** 管理员创建成就 */
export async function createAchievement(
  data: CreateAchievementRequest,
): Promise<AchievementResponse> {
  return mcApiClient.post<AchievementResponse>('/admin/achievements', data)
}

/** 管理员更新成就 */
export async function updateAchievement(
  id: string,
  data: UpdateAchievementRequest,
): Promise<AchievementResponse> {
  return mcApiClient.put<AchievementResponse>(`/admin/achievements/${id}`, data)
}

/** 管理员删除成就 */
export async function deleteAchievement(id: string): Promise<void> {
  return mcApiClient.delete(`/admin/achievements/${id}`)
}

/** 管理员授予成就给玩家 */
export async function grantAchievement(
  id: string,
  data: GrantAchievementRequest,
): Promise<void> {
  return mcApiClient.post(`/admin/achievements/${id}/grant`, data)
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 管理员成就列表 Query */
export function useAdminAchievements(params?: AdminAchievementListParams) {
  return useQuery({
    queryKey: [...ADMIN_ACHIEVEMENT_LIST_QUERY_KEY, params],
    queryFn: () => getAdminAchievements(params),
  })
}

/** 管理员成就详情 Query */
export function useAdminAchievementDetail(id: string) {
  return useQuery({
    queryKey: [...ADMIN_ACHIEVEMENT_DETAIL_QUERY_KEY, id],
    queryFn: () => getAdminAchievementDetail(id),
    enabled: !!id,
  })
}

/** 创建成就 Mutation */
export function useCreateAchievementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAchievement,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_ACHIEVEMENT_LIST_QUERY_KEY,
      })
    },
  })
}

/** 更新成就 Mutation */
export function useUpdateAchievementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateAchievementRequest
    }) => updateAchievement(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_ACHIEVEMENT_LIST_QUERY_KEY,
      })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_ACHIEVEMENT_DETAIL_QUERY_KEY, variables.id],
      })
    },
  })
}

/** 删除成就 Mutation */
export function useDeleteAchievementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAchievement,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_ACHIEVEMENT_LIST_QUERY_KEY,
      })
    },
  })
}

/** 授予成就 Mutation */
export function useGrantAchievementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: GrantAchievementRequest
    }) => grantAchievement(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_ACHIEVEMENT_LIST_QUERY_KEY,
      })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_ACHIEVEMENT_DETAIL_QUERY_KEY, variables.id],
      })
    },
  })
}
