/**
 * 玩家在线状态相关类型定义
 * 对接锋楪核心后端 (mcApiClient)
 */

// ─── 响应类型 ──────────────────────────────────────────────

export type OnlineGameProfileResponse = {
  server_name: string
  username: string
  uuid: string
  world_name: string
}

export type PlayerOnlineResponse = {
  online: boolean
  player_name: string
  player_uuid: string
  server_name: string
  world_name: string
  last_seen: string
}
