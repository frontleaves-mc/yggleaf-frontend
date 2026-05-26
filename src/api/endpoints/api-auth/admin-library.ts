/**
 * 管理员资源库管理 API 端点函数 + TanStack Query Hooks
 * 对接：用户皮肤列表 / 用户披风列表 / 赠送皮肤 / 赠送披风 / 撤销皮肤 / 撤销披风 / 同步配额
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApiClient } from '../../client'
import type {
  AdminSkinListResponse,
  AdminCapeListResponse,
  AdminGiftSkinRequest,
  AdminGiftCapeRequest,
} from '#/api/types'

// ─── 参数接口 ─────────────────────────────────────────────

export interface AdminLibraryListParams {
  page?: number
  page_size?: number
}

// ─── Query Keys ────────────────────────────────────────────

export const ADMIN_USER_SKINS_QUERY_KEY = ['admin', 'library', 'user-skins'] as const
export const ADMIN_USER_CAPES_QUERY_KEY = ['admin', 'library', 'user-capes'] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 管理员获取用户皮肤列表 */
export async function getAdminUserSkins(
  userId: string,
  params?: AdminLibraryListParams,
): Promise<AdminSkinListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.page_size) sp.set('page_size', String(params.page_size))
  const qs = sp.toString()
  return authApiClient.get<AdminSkinListResponse>(
    qs ? `/library/admin/users/${userId}/skins?${qs}` : `/library/admin/users/${userId}/skins`,
  )
}

/** 管理员赠送皮肤给用户 */
export async function giftSkinToUser(
  userId: string,
  data: AdminGiftSkinRequest,
): Promise<void> {
  return authApiClient.post(`/library/admin/users/${userId}/skins/gift`, data)
}

/** 管理员撤销用户皮肤 */
export async function revokeSkinFromUser(
  userId: string,
  skinLibraryId: string,
): Promise<void> {
  return authApiClient.delete(`/library/admin/users/${userId}/skins/${skinLibraryId}`)
}

/** 管理员获取用户披风列表 */
export async function getAdminUserCapes(
  userId: string,
  params?: AdminLibraryListParams,
): Promise<AdminCapeListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.page_size) sp.set('page_size', String(params.page_size))
  const qs = sp.toString()
  return authApiClient.get<AdminCapeListResponse>(
    qs ? `/library/admin/users/${userId}/capes?${qs}` : `/library/admin/users/${userId}/capes`,
  )
}

/** 管理员赠送披风给用户 */
export async function giftCapeToUser(
  userId: string,
  data: AdminGiftCapeRequest,
): Promise<void> {
  return authApiClient.post(`/library/admin/users/${userId}/capes/gift`, data)
}

/** 管理员撤销用户披风 */
export async function revokeCapeFromUser(
  userId: string,
  capeLibraryId: string,
): Promise<void> {
  return authApiClient.delete(`/library/admin/users/${userId}/capes/${capeLibraryId}`)
}

/** 管理员同步用户配额 */
export async function syncUserQuota(
  userId: string,
): Promise<void> {
  return authApiClient.post(`/library/admin/users/${userId}/quota/sync`)
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 管理员用户皮肤列表 Query */
export function useAdminUserSkins(userId: string) {
  return useQuery({
    queryKey: [...ADMIN_USER_SKINS_QUERY_KEY, userId],
    queryFn: () => getAdminUserSkins(userId),
    enabled: !!userId,
  })
}

/** 赠送皮肤 Mutation */
export function useGiftSkinMutation(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AdminGiftSkinRequest) => giftSkinToUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_USER_SKINS_QUERY_KEY, userId],
      })
    },
  })
}

/** 撤销皮肤 Mutation */
export function useRevokeSkinMutation(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (skinLibraryId: string) => revokeSkinFromUser(userId, skinLibraryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_USER_SKINS_QUERY_KEY, userId],
      })
    },
  })
}

/** 管理员用户披风列表 Query */
export function useAdminUserCapes(userId: string) {
  return useQuery({
    queryKey: [...ADMIN_USER_CAPES_QUERY_KEY, userId],
    queryFn: () => getAdminUserCapes(userId),
    enabled: !!userId,
  })
}

/** 赠送披风 Mutation */
export function useGiftCapeMutation(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AdminGiftCapeRequest) => giftCapeToUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_USER_CAPES_QUERY_KEY, userId],
      })
    },
  })
}

/** 撤销披风 Mutation */
export function useRevokeCapeMutation(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (capeLibraryId: string) => revokeCapeFromUser(userId, capeLibraryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_USER_CAPES_QUERY_KEY, userId],
      })
    },
  })
}

/** 同步配额 Mutation */
export function useSyncQuotaMutation(userId: string) {
  return useMutation({
    mutationFn: () => syncUserQuota(userId),
  })
}