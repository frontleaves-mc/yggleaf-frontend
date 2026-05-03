/**
 * 玩家称号 API 端点函数 + TanStack Query Hooks
 * 对接锋楪核心后端 (mcApiClient)
 *
 * 接口路径：/game-profiles/{uuid}/titles (列表/装备/卸下/当前装备)
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type {
  PlayerTitleResponse,
  EquippedTitleResponse,
  EquipTitleRequest,
} from '../../types/api-mc/title'

// ─── Query Keys ────────────────────────────────────────────

export const PLAYER_TITLES_QUERY_KEY = ['player', 'mc', 'titles'] as const
export const PLAYER_EQUIPPED_TITLE_QUERY_KEY = [
  'player',
  'mc',
  'titles',
  'equipped',
] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 获取玩家拥有的称号列表 */
export async function getPlayerTitles(
  uuid: string,
): Promise<PlayerTitleResponse[]> {
  return mcApiClient.get<PlayerTitleResponse[]>(
    `/game-profiles/${uuid}/titles`,
  )
}

/** 装备称号（PUT 幂等，后端自动卸下旧的） */
export async function equipTitle(
  uuid: string,
  data: EquipTitleRequest,
): Promise<void> {
  return mcApiClient.put(`/game-profiles/${uuid}/titles/equip`, data)
}

/** 卸下当前装备的称号 */
export async function unequipTitle(uuid: string): Promise<void> {
  return mcApiClient.delete(`/game-profiles/${uuid}/titles/equip`)
}

/** 获取当前装备的称号 */
export async function getEquippedTitle(
  uuid: string,
): Promise<EquippedTitleResponse> {
  return mcApiClient.get<EquippedTitleResponse>(
    `/game-profiles/${uuid}/titles/equipped`,
  )
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 玩家称号列表 Query */
export function usePlayerTitles(uuid: string | null) {
  return useQuery({
    queryKey: [...PLAYER_TITLES_QUERY_KEY, uuid],
    queryFn: () => getPlayerTitles(uuid!),
    enabled: !!uuid,
  })
}

/** 装备称号 Mutation */
export function useEquipTitleMutation(uuid: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: EquipTitleRequest) => equipTitle(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...PLAYER_TITLES_QUERY_KEY, uuid],
      })
      queryClient.invalidateQueries({
        queryKey: [...PLAYER_EQUIPPED_TITLE_QUERY_KEY, uuid],
      })
    },
  })
}

/** 卸下称号 Mutation */
export function useUnequipTitleMutation(uuid: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => unequipTitle(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...PLAYER_TITLES_QUERY_KEY, uuid],
      })
      queryClient.invalidateQueries({
        queryKey: [...PLAYER_EQUIPPED_TITLE_QUERY_KEY, uuid],
      })
    },
  })
}

/** 当前装备称号 Query */
export function useEquippedTitle(uuid: string | null) {
  return useQuery({
    queryKey: [...PLAYER_EQUIPPED_TITLE_QUERY_KEY, uuid],
    queryFn: () => getEquippedTitle(uuid!),
    enabled: !!uuid,
  })
}
