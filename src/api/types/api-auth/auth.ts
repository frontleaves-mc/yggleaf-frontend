/**
 * 认证相关类型定义
 * 对接 Yggleaf API - OAuth 2.0 SSO
 */

/** OAuth2 callback 返回的 Token 数据 */
export interface OAuthTokenData {
  /** Access Token */
  access_token: string
  /** Refresh Token */
  refresh_token: string
  /** Access Token 有效期（秒） */
  expires_in: number
  /** Token 过期时间（ISO 8601） */
  expiry?: string
  /** Token 类型（通常为 "Bearer"） */
  token_type: string
}

/** 本地存储的 Token 对（含元信息） */
export interface TokenPair {
  access_token: string
  refresh_token: string
  expires_at: number // Access Token 过期时间戳 (ms)
}
