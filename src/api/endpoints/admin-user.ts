/**
 * 管理员用户管理 API 端点函数 + TanStack Query Hooks
 * 对接：用户列表 / 用户详情 / 调整游戏档案配额
 *
 * 注意：所有实体 ID 均为雪花算法生成，使用 string 避免精度丢失
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import type {
  AdminUserListResponse,
  AdminUserDetailResponse,
  AdjustGameProfileQuotaRequest,
  GameProfileQuota,
} from '#/api/types'

// ─── 参数接口 ─────────────────────────────────────────────

export interface AdminUserListParams {
  page?: number
  page_size?: number
  role?: RoleName
  keyword?: string
  start_time?: string
  end_time?: string
}

type RoleName = 'SUPER_ADMIN' | 'ADMIN' | 'PLAYER'

// ─── Query Keys ────────────────────────────────────────────

export const ADMIN_USER_LIST_QUERY_KEY = ['admin', 'users'] as const
export const ADMIN_USER_DETAIL_QUERY_KEY = ['admin', 'user', 'detail'] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 管理员获取用户列表 */
export async function getAdminUsers(params?: AdminUserListParams): Promise<AdminUserListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.page_size) sp.set('page_size', String(params.page_size))
  if (params?.role) sp.set('role', params.role)
  if (params?.keyword) sp.set('keyword', params.keyword)
  if (params?.start_time) sp.set('start_time', params.start_time)
  if (params?.end_time) sp.set('end_time', params.end_time)
  const qs = sp.toString()
  return apiClient.get<AdminUserListResponse>(qs ? `/admin/users?${qs}` : '/admin/users')
}

/** 管理员获取用户详情 */
export async function getAdminUserDetail(userId: string): Promise<AdminUserDetailResponse> {
  return apiClient.get<AdminUserDetailResponse>(`/admin/users/${userId}`)
}

/** 管理员调整用户游戏档案配额 */
export async function adjustGameProfileQuota(
  userId: string,
  data: AdjustGameProfileQuotaRequest,
): Promise<GameProfileQuota> {
  return apiClient.post<GameProfileQuota>(
    `/admin/game-profile/users/${userId}/quota`,
    data,
  )
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 管理员用户列表 Query */
export function useAdminUsers(params?: AdminUserListParams) {
  return useQuery({
    queryKey: [...ADMIN_USER_LIST_QUERY_KEY, params],
    queryFn: () => getAdminUsers(params),
  })
}

/** 管理员用户详情 Query */
export function useAdminUserDetail(userId: string) {
  return useQuery({
    queryKey: [...ADMIN_USER_DETAIL_QUERY_KEY, userId],
    queryFn: () => getAdminUserDetail(userId),
    enabled: !!userId,
  })
}

/** 调整游戏档案配额 Mutation */
export function useAdjustGameProfileQuotaMutation(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AdjustGameProfileQuotaRequest) =>
      adjustGameProfileQuota(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_USER_DETAIL_QUERY_KEY, userId],
      })
    },
  })
}
