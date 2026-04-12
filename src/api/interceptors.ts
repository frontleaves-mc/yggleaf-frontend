/**
 * API 请求拦截器 - 401 处理
 * 当 Access Token 过期时，清除认证状态并重定向到 SSO 登录页
 */

import { clearAuth } from '#/stores/auth-store'

/**
 * 处理 401 未授权响应
 * 清除认证状态，重定向到 SSO 登录页
 */
export function handleUnauthorized(): never {
  clearAuth()
  window.location.href = '/login'
  throw new Error('登录已过期，请重新登录')
}
