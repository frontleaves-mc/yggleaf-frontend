/**
 * 管理员游戏档案管理 API 端点函数 + TanStack Query Hooks
 * 对接：档案列表 / 档案详情 / 强制设置皮肤 / 强制设置披风 / 重置档案
 *
 * 注意：所有实体 ID 均为雪花算法生成，使用 string 避免精度丢失
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApiClient } from '../../client'
import type {
  AdminGameProfileListResponse,
  AdminGameProfileDetail,
  AdminForceSetSkinRequest,
  AdminForceSetCapeRequest,
} from '#/api/types'

// ─── 参数接口 ─────────────────────────────────────────────

export interface AdminGameProfileListParams {
  page?: number
  page_size?: number
  keyword?: string
  uuid?: string
}

// ─── Query Keys ────────────────────────────────────────────

export const ADMIN_GAME_PROFILE_LIST_QUERY_KEY = ['admin', 'game-profiles'] as const
export const ADMIN_GAME_PROFILE_DETAIL_QUERY_KEY = ['admin', 'game-profile', 'detail'] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 管理员获取游戏档案分页列表 */
export async function getAdminGameProfiles(
  params?: AdminGameProfileListParams,
): Promise<AdminGameProfileListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.page_size) sp.set('page_size', String(params.page_size))
  if (params?.keyword) sp.set('keyword', params.keyword)
  if (params?.uuid) sp.set('uuid', params.uuid)
  const qs = sp.toString()
  return authApiClient.get<AdminGameProfileListResponse>(
    qs ? `/admin/game-profiles?${qs}` : '/admin/game-profiles',
  )
}

/** 管理员获取游戏档案详情 */
export async function getAdminGameProfileDetail(
  profileId: string,
): Promise<AdminGameProfileDetail> {
  return authApiClient.get<AdminGameProfileDetail>(`/admin/game-profiles/${profileId}`)
}

/** 管理员强制设置档案皮肤 */
export async function forceSetGameProfileSkin(
  profileId: string,
  data: AdminForceSetSkinRequest,
): Promise<void> {
  return authApiClient.patch(`/admin/game-profiles/${profileId}/skin`, data)
}

/** 管理员强制设置档案披风 */
export async function forceSetGameProfileCape(
  profileId: string,
  data: AdminForceSetCapeRequest,
): Promise<void> {
  return authApiClient.patch(`/admin/game-profiles/${profileId}/cape`, data)
}

/** 管理员重置游戏档案 */
export async function forceResetGameProfile(
  profileId: string,
): Promise<void> {
  return authApiClient.post(`/admin/game-profiles/${profileId}/reset`)
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 管理员游戏档案列表 Query */
export function useAdminGameProfiles(params?: AdminGameProfileListParams) {
  return useQuery({
    queryKey: [...ADMIN_GAME_PROFILE_LIST_QUERY_KEY, params],
    queryFn: () => getAdminGameProfiles(params),
  })
}

/** 管理员游戏档案详情 Query */
export function useAdminGameProfileDetail(profileId: string) {
  return useQuery({
    queryKey: [...ADMIN_GAME_PROFILE_DETAIL_QUERY_KEY, profileId],
    queryFn: () => getAdminGameProfileDetail(profileId),
    enabled: !!profileId,
  })
}

/** 强制设置皮肤 Mutation */
export function useForceSetSkinMutation(profileId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AdminForceSetSkinRequest) =>
      forceSetGameProfileSkin(profileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_GAME_PROFILE_DETAIL_QUERY_KEY, profileId],
      })
      queryClient.invalidateQueries({
        queryKey: ADMIN_GAME_PROFILE_LIST_QUERY_KEY,
      })
    },
  })
}

/** 强制设置披风 Mutation */
export function useForceSetCapeMutation(profileId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AdminForceSetCapeRequest) =>
      forceSetGameProfileCape(profileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_GAME_PROFILE_DETAIL_QUERY_KEY, profileId],
      })
      queryClient.invalidateQueries({
        queryKey: ADMIN_GAME_PROFILE_LIST_QUERY_KEY,
      })
    },
  })
}

/** 重置游戏档案 Mutation */
export function useForceResetProfileMutation(profileId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => forceResetGameProfile(profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_GAME_PROFILE_DETAIL_QUERY_KEY, profileId],
      })
      queryClient.invalidateQueries({
        queryKey: ADMIN_GAME_PROFILE_LIST_QUERY_KEY,
      })
    },
  })
}