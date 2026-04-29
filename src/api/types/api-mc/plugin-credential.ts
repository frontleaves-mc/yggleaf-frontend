/**
 * 插件凭证管理相关类型定义
 * 对接锋楪核心后端 (mcApiClient)
 */

// ─── 响应类型 ──────────────────────────────────────────────

export type PluginCredentialResponse = {
  id: string
  name: string
  description: string
  secret_key: string
  created_at: string
}

export type PluginCredentialListResponse = {
  list: PluginCredentialResponse[]
  total: number
  page: number
  page_size: number
}

// ─── 请求类型 ──────────────────────────────────────────────

export type CreatePluginCredentialRequest = {
  name: string
  description: string
}

export type UpdatePluginCredentialRequest = {
  description: string
}

// ─── 查询参数 ──────────────────────────────────────────────

export type PluginCredentialListParams = {
  page?: number
  page_size?: number
}
