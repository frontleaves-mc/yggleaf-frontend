/**
 * 游戏档案 API 端点函数 + TanStack Query Hooks
 * 对接：创建档案 / 修改用户名
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import type {
  GameProfile,
  CreateGameProfileRequest,
  UpdateUsernameRequest,
} from '#/api/types'

// ─── 端点函数 ──────────────────────────────────────────────

/** 获取游戏档案列表（当前用户的） */
export async function getGameProfiles(): Promise<GameProfile[]> {
  return apiClient.get<GameProfile[]>('/game-profile')
}

/** 创建游戏档案 */
export async function createGameProfile(data: CreateGameProfileRequest): Promise<GameProfile> {
  return apiClient.post<GameProfile>('/game-profile', data)
}

/** 修改游戏档案用户名 */
export async function updateGameProfileUsername(
  profileId: number,
  data: UpdateUsernameRequest,
): Promise<void> {
  return apiClient.patch(`/game-profile/${profileId}/username`, data)
}

// ─── TanStack Query Hooks ───────────────────────────────────

/** 游戏档案列表 Query */
export function useGameProfiles(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['game-profiles'],
    queryFn: getGameProfiles,
    enabled: options?.enabled ?? true,
  })
}

/** 创建游戏档案 Mutation */
export function useCreateGameProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGameProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-profiles'] })
    },
  })
}

/** 修改用户名 Mutation */
export function useUpdateUsernameMutation(profileId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUsernameRequest) =>
      updateGameProfileUsername(profileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-profiles'] })
    },
  })
}
