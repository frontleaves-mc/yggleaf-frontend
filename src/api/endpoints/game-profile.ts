/**
 * 游戏档案 API 端点函数 + TanStack Query Hooks
 * 对接：获取档案列表 / 创建档案 / 获取配额 / 获取详情 / 修改用户名 / 设置皮肤 / 设置披风
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import type {
  GameProfile,
  GameProfileListResponse,
  GameProfileQuota,
  CreateGameProfileRequest,
  UpdateUsernameRequest,
  SetSkinRequest,
  SetCapeRequest,
} from '#/api/types'

// ─── 端点函数 ──────────────────────────────────────────────

/** 获取游戏档案列表（当前用户的） */
export async function getGameProfiles(): Promise<GameProfile[]> {
  const result = await apiClient.get<GameProfileListResponse>('/game-profile')
  return result?.items ?? []
}

/** 创建游戏档案 */
export async function createGameProfile(data: CreateGameProfileRequest): Promise<GameProfile> {
  return apiClient.post<GameProfile>('/game-profile', data)
}

/** 获取游戏档案配额 */
export async function getGameProfileQuota(): Promise<GameProfileQuota> {
  return apiClient.get<GameProfileQuota>('/game-profile/quota')
}

/** 获取游戏档案详情 */
export async function getGameProfileDetail(profileId: number): Promise<GameProfile> {
  return apiClient.get<GameProfile>(`/game-profile/${profileId}`)
}

/** 修改游戏档案用户名 */
export async function updateGameProfileUsername(
  profileId: number,
  data: UpdateUsernameRequest,
): Promise<GameProfile> {
  return apiClient.patch<GameProfile>(`/game-profile/${profileId}/username`, data)
}

/** 设置/卸下皮肤 */
export async function setGameProfileSkin(
  profileId: number,
  data: SetSkinRequest,
): Promise<GameProfile> {
  return apiClient.patch<GameProfile>(`/game-profile/${profileId}/skin`, data)
}

/** 设置/卸下披风 */
export async function setGameProfileCape(
  profileId: number,
  data: SetCapeRequest,
): Promise<GameProfile> {
  return apiClient.patch<GameProfile>(`/game-profile/${profileId}/cape`, data)
}

// ─── TanStack Query Hooks ───────────────────────────────────

/** 档案级 Mutation 工厂（统一缓存失效逻辑） */
function createProfileMutation<T>(
  profileId: number,
  mutationFn: (data: T) => Promise<GameProfile>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-profiles'] })
      queryClient.invalidateQueries({ queryKey: ['game-profile', profileId] })
    },
  })
}

/** 游戏档案列表 Query */
export function useGameProfiles(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['game-profiles'],
    queryFn: getGameProfiles,
    enabled: options?.enabled ?? true,
  })
}

/** 游戏档案配额 Query */
export function useGameProfileQuota(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['game-profile', 'quota'],
    queryFn: getGameProfileQuota,
    enabled: options?.enabled ?? true,
  })
}

/** 游戏档案详情 Query */
export function useGameProfileDetail(profileId: number | null) {
  return useQuery({
    queryKey: ['game-profile', profileId],
    queryFn: () => getGameProfileDetail(profileId!),
    enabled: profileId !== null,
  })
}

/** 创建游戏档案 Mutation */
export function useCreateGameProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGameProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-profiles'] })
      queryClient.invalidateQueries({ queryKey: ['game-profile', 'quota'] })
    },
  })
}

/** 修改用户名 Mutation */
export function useUpdateUsernameMutation(profileId: number) {
  return createProfileMutation(profileId, (data: UpdateUsernameRequest) =>
    updateGameProfileUsername(profileId, data),
  )
}

/** 设置皮肤 Mutation */
export function useSetSkinMutation(profileId: number) {
  return createProfileMutation(profileId, (data: SetSkinRequest) =>
    setGameProfileSkin(profileId, data),
  )
}

/** 设置披风 Mutation */
export function useSetCapeMutation(profileId: number) {
  return createProfileMutation(profileId, (data: SetCapeRequest) =>
    setGameProfileCape(profileId, data),
  )
}
