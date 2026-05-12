/**
 * 成就管理相关类型定义
 * 对接锋楪核心后端 (mcApiClient)
 */

// ─── 枚举类型 ──────────────────────────────────────────────

/** 成就类型 */
export enum AchievementType {
  /** 统计类 */
  Stat = 1,
  /** 事件类 */
  Event = 2,
  /** 特殊条件 */
  Special = 3,
  /** 管理员手动 */
  Manual = 4,
}

// ─── 响应类型 ──────────────────────────────────────────────

export interface AchievementResponse {
  id: string
  name: string
  description: string
  type: AchievementType
  condition_key: string
  condition_params: Record<string, unknown> | null
  reward_config: Record<string, unknown> | null
  sort_order: number
  is_active: boolean
}

export interface AchievementListResponse {
  list: AchievementResponse[]
  total: number
  page: number
  page_size: number
}

// ─── 请求类型 ──────────────────────────────────────────────

export interface CreateAchievementRequest {
  name: string
  description: string
  type: AchievementType
  condition_key: string
  condition_params?: Record<string, unknown>
  reward_config?: Record<string, unknown>
  sort_order?: number
}

export interface UpdateAchievementRequest {
  name: string
  description: string
  type: AchievementType
  condition_key: string
  condition_params?: Record<string, unknown>
  reward_config?: Record<string, unknown>
  sort_order?: number
  is_active?: boolean
}

export interface GrantAchievementRequest {
  player_uuid: string
}

// ─── 查询参数 ──────────────────────────────────────────────

export interface AdminAchievementListParams {
  page?: number
  page_size?: number
  type?: AchievementType
}
