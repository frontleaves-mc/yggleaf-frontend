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

// ─── 玩家称号类型（用户端） ──────────────────────────────────

/** 玩家拥有的称号 */
export interface PlayerTitleResponse {
  /** 称号 ID */
  id: string
  /** 称号名称 */
  name: string
  /** 称号描述 */
  description: string
  /** 称号类型 */
  type: TitleType
  /** 权限组 */
  permission_group: string
  /** 是否激活 */
  is_active: boolean
  /** 是否已装备 */
  is_equipped: boolean
  /** 来源 */
  source: string
  /** 创建时间 */
  created_at: string
  /** 授予时间 */
  granted_at: string
}

/** 当前装备的称号 */
export interface EquippedTitleResponse {
  /** 称号 ID */
  title_id: string
  /** 称号名称 */
  name: string
  /** 称号描述 */
  description: string
  /** 称号类型 */
  type: TitleType
}

/** 装备称号请求 */
export interface EquipTitleRequest {
  /** 称号 ID */
  title_id: string
}
