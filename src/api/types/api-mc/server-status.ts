/**
 * 服务器状态相关类型定义
 * 对接锋楪核心后端 (mcApiClient)
 */

// ─── 响应类型 ──────────────────────────────────────────────

export type PlayerStatusInfo = {
  player_name: string
  player_uuid: string
  world_name: string
}

export type ServerStatusResponse = {
  server_name: string
  online: boolean
  tps: number
  online_players: number
  last_heartbeat: number
  players: PlayerStatusInfo[]
}

export type ServerStatusListResponse = ServerStatusResponse[]
