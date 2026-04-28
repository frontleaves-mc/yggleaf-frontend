/**
 * 称号管理相关类型定义
 * 对接锋楪核心后端 (mcApiClient)
 */

// ─── 枚举类型 ──────────────────────────────────────────────

/** 称号类型 */
export enum TitleType {
  /** 通用称号 */
  General = 1,
  /** 权限组称号 */
  Group = 2,
  /** 玩家专属称号 */
  Exclusive = 3,
}

// ─── 响应类型 ──────────────────────────────────────────────

export interface TitleResponse {
  id: string
  name: string
  description: string
  type: TitleType
  permission_group: string
  is_active: boolean
  created_at: string
}

export interface TitleListResponse {
  list: TitleResponse[]
  total: number
  page: number
  page_size: number
}

// ─── 请求类型 ──────────────────────────────────────────────

export interface CreateTitleRequest {
  name: string
  description: string
  type: TitleType
  permission_group?: string
}

export interface UpdateTitleRequest {
  name: string
  description: string
  type: TitleType
  permission_group?: string
  is_active?: boolean
}

export interface AssignTitleRequest {
  player_uuid: string
}

// ─── 查询参数 ──────────────────────────────────────────────

export interface AdminTitleListParams {
  page?: number
  page_size?: number
  type?: TitleType
}
