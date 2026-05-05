/**
 * 公告管理相关类型定义
 * 对接锋楪核心后端 (mcApiClient)
 */

// ─── 枚举类型 ──────────────────────────────────────────────

/** 公告类型 */
export enum AnnouncementType {
  /** 站内公告 */
  InSite = 1,
  /** 全局公告 */
  Global = 2,
}

/** 公告状态 */
export enum AnnouncementStatus {
  /** 草稿 */
  Draft = 1,
  /** 已发布 */
  Published = 2,
  /** 已下线 */
  Offline = 3,
}

// ─── 响应类型 ──────────────────────────────────────────────

/** 公告列表项 */
export interface AnnouncementListItem {
  id: string
  title: string
  desc: string
  content?: string
  type: number
  status: number
  created_at: string
  published_at: string | null
}

/** 公告详情 */
export interface AnnouncementResponse {
  id: string
  title: string
  content: string
  desc?: string
  type: number
  status: number
  created_at: string
  published_at: string | null
}

/** 公告列表响应 */
export interface AnnouncementListResponse {
  list: AnnouncementListItem[]
  total: number
  page: number
  page_size: number
}

// ─── 请求类型 ──────────────────────────────────────────────

/** 创建公告请求 */
export interface CreateAnnouncementRequest {
  title: string
  content: string
  type: number
}

/** 更新公告请求 */
export interface UpdateAnnouncementRequest {
  title: string
  content: string
  type: number
}

// ─── 查询参数 ──────────────────────────────────────────────

/** 管理端公告列表查询参数 */
export interface AdminAnnouncementListParams {
  page?: number
  page_size?: number
  type?: number
  status?: number
}

/** 用户端公告列表查询参数 */
export interface PublicAnnouncementListParams {
  page?: number
  page_size?: number
  type?: number
}
