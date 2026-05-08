/**
 * 服务器管理相关类型定义
 * 对接锋楪核心后端 (mcApiClient)
 */

// ─── 响应类型 ──────────────────────────────────────────────

export type ServerResponse = {
  id: string
  name: string
  display_name: string
  address: string
  description: string
  is_enabled: boolean
  is_public: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type ServerListResponse = {
  list: ServerResponse[]
  total: number
  page: number
  page_size: number
}

// ─── 请求类型 ──────────────────────────────────────────────

export type CreateServerRequest = {
  name: string
  display_name: string
  address?: string
  description?: string
  sort_order?: number
}

export type UpdateServerRequest = {
  display_name: string
  address?: string
  description?: string
  sort_order?: number
}

export type SetServerEnabledRequest = {
  is_enabled: boolean
}

export type SetServerPublicRequest = {
  is_public: boolean
}

// ─── 查询参数 ──────────────────────────────────────────────

export type ServerListParams = {
  page?: number
  page_size?: number
}
