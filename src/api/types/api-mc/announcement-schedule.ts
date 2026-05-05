/**
 * 公告调度管理相关类型定义
 * 对接锋楪核心后端 (mcApiClient)
 */

// ─── 枚举类型 ──────────────────────────────────────────────

/** 调度模式 */
export type ScheduleMode = 1 | 2

// ─── 响应类型 ──────────────────────────────────────────────

/** 调度项（响应） */
export interface ScheduleItemResponse {
  /** 公告 ID */
  announcement_id: string
  /** 公告标题 */
  announcement_title: string
  /** 延迟秒数 */
  delay_seconds: number
  /** 排序序号 */
  sort_order: number
}

/** 调度详情 */
export interface ScheduleResponse {
  /** 调度 ID */
  id: string
  /** 调度名称 */
  name: string
  /** 调度模式 */
  mode: number
  /** 间隔秒数（仅循环模式） */
  interval_seconds?: number
  /** 是否启用 */
  is_active: boolean
  /** 状态 */
  status: number
  /** 调度项列表 */
  items: ScheduleItemResponse[]
  /** 创建时间 */
  created_at: string
}

/** 调度列表响应 */
export interface ScheduleListResponse {
  /** 调度列表 */
  list: ScheduleResponse[]
  /** 总记录数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页大小 */
  page_size: number
}

// ─── 请求类型 ──────────────────────────────────────────────

/** 调度项（请求输入） */
export interface ScheduleItemInput {
  /** 公告 ID */
  announcement_id: string
  /** 延迟秒数 */
  delay_seconds?: number
  /** 排序序号 */
  sort_order?: number
}

/** 创建调度请求 */
export interface CreateScheduleRequest {
  /** 调度名称 */
  name: string
  /** 调度模式 */
  mode: number
  /** 调度项列表 */
  items: ScheduleItemInput[]
  /** 间隔秒数（仅循环模式） */
  interval_seconds?: number
}

/** 更新调度请求 */
export interface UpdateScheduleRequest {
  /** 调度名称 */
  name: string
  /** 调度模式 */
  mode: number
  /** 调度项列表 */
  items: ScheduleItemInput[]
  /** 间隔秒数（仅循环模式） */
  interval_seconds?: number
}

// ─── 查询参数 ──────────────────────────────────────────────

/** 管理端调度列表查询参数 */
export interface AdminScheduleListParams {
  /** 页码 */
  page?: number
  /** 每页大小 */
  page_size?: number
}
