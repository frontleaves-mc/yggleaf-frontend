/**
 * Matrix 反作弊模块类型定义
 * 对接锋楪核心后端 (mcApiClient)
 */

// ─── 响应类型 ──────────────────────────────────────────────

/** 玩家统计响应 */
export interface MatrixStatisticResponse {
  id: string
  player_uuid: string
  player_name: string
  current_session_start: string
  total_play_time_ms: number
  total_sessions: number
  total_blocks_broken: number
  total_blocks_placed: number
  total_deaths: number
  total_entities_killed: number
  blocks_break: number[]
  blocks_place: number[]
  deaths: number[]
  entities_kill: number[]
  items_used: number[]
}

/** 警告列表项 */
export interface MatrixWarningListItem {
  id: string
  player_uuid: string
  player_name: string
  server_name: string
  warning_type: string
  risk_score: number
  description: string
  created_at: string
}

/** 警告列表响应 */
export interface MatrixWarningListResponse {
  list: MatrixWarningListItem[]
  page: number
  page_size: number
  total: number
}

/** 警告详情（继承列表项 + 上下文数据） */
export type MatrixWarningDetailResponse = MatrixWarningListItem & {
  context_data: number[]
}

// ─── 查询参数 ──────────────────────────────────────────────

/** 管理端警告列表查询参数 */
export type AdminMatrixWarningListParams = {
  page?: number
  page_size?: number
  player_uuid?: string
  warning_type?: string
  risk_score_min?: number
  risk_score_max?: number
  server_name?: string
  start_time?: string
  end_time?: string
}
