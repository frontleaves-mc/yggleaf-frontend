/**
 * 玩家在线状态 API 端点函数 + TanStack Query Hooks
 * 对接锋楪核心后端 (mcApiClient)
 *
 * 接口路径：/servers/game-profiles/online/mine (GET) + /servers/players/online/check (GET)
 */

import { useQuery } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type {
  OnlineGameProfileResponse,
  PlayerOnlineResponse,
} from '../../types/api-mc/player-online'

// ─── Query Keys ────────────────────────────────────────────

export const PLAYER_ONLINE_QUERY_KEY = ['player', 'online'] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 查询当前用户在线的游戏档案列表 */
export async function getOnlineGameProfiles(): Promise<
  OnlineGameProfileResponse[]
> {
  return mcApiClient.get<OnlineGameProfileResponse[]>(
    '/servers/game-profiles/online/mine',
  )
}

/** 检查玩家是否在线 */
export async function checkPlayerOnline(params: {
  uuid?: string
  username?: string
}): Promise<PlayerOnlineResponse> {
  const sp = new URLSearchParams()
  if (params.uuid) sp.set('uuid', params.uuid)
  if (params.username) sp.set('username', params.username)
  const qs = sp.toString()
  return mcApiClient.get<PlayerOnlineResponse>(
    qs
      ? `/servers/players/online/check?${qs}`
      : '/servers/players/online/check',
  )
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 在线游戏档案列表 Query（30s 轮询） */
export function useOnlineGameProfiles(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: PLAYER_ONLINE_QUERY_KEY,
    queryFn: getOnlineGameProfiles,
    refetchInterval: 30_000,
    ...options,
  })
}

/** 检查玩家在线状态 Query */
export function useCheckPlayerOnline(params: {
  uuid?: string
  username?: string
}) {
  return useQuery({
    queryKey: [...PLAYER_ONLINE_QUERY_KEY, 'check', params],
    queryFn: () => checkPlayerOnline(params),
    enabled: !!(params.uuid || params.username),
  })
}
