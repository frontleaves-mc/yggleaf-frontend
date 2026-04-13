/**
 * 应用全局常量配置
 */

// ─── API 配置 ──────────────────────────────────────────────

/**
 * AJAX API 基础地址
 * 本地开发走 Vite proxy（/api → http://localhost:5577）
 * 生产环境使用完整后端地址
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

/**
 * SSO 登录跳转地址（浏览器直接导航，不走 AJAX）
 * 本地开发需要跳转到后端真实地址，因为 Vite proxy 不支持 302 重定向跟随
 */
export const SSO_LOGIN_BASE_URL = import.meta.env.VITE_SSO_BASE_URL || 'http://localhost:5577/api/v1'

/** API 请求超时时间（毫秒） */
export const API_TIMEOUT = 30000

// ─── Token 存储键名 ───────────────────────────────────────

/** Access Token localStorage key */
export const ACCESS_TOKEN_KEY = 'yggleaf_access_token'

/** Refresh Token localStorage key */
export const REFRESH_TOKEN_KEY = 'yggleaf_refresh_token'

/** 用户信息 localStorage key */
export const USER_KEY = 'yggleaf_user'

/** 登录后重定向 URL key */
export const REDIRECT_KEY = 'yggleaf_redirect_url'

/** 侧边栏折叠状态 key */
export const SIDEBAR_COLLAPSED_KEY = 'yggleaf_sidebar_collapsed'

// ─── 应用信息 ──────────────────────────────────────────────

/** 应用名称 */
export const APP_NAME = 'Yggleaf'

/** 应用版本 */
export const APP_VERSION = '1.0.0'
