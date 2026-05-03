/**
 * 路由守卫 Hook
 * 检查认证状态，未登录时返回 false 用于 beforeLoad 重定向
 *
 * 策略：
 *   - AT 存在 → 已认证（即使过期，后续 API 401 拦截器会自动刷新）
 *   - AT 缺失但 RT 存在 → 尝试静默刷新，刷新成功则恢复认证
 *   - AT + RT 都缺失 → 未认证，需重新登录
 */

import { authStore, updateTokens, clearAuth } from '#/stores/auth-store'
import { REFRESH_TOKEN_KEY } from '#/config/constants'
import { getCookie } from '#/lib/cookie'
import { refreshAccessToken } from '#/api/client'

/** 检查当前是否已认证（同步快检，适用于 login 页等非关键场景） */
export function checkIsAuthenticated(): boolean {
  return authStore.state.isAuthenticated && !!authStore.state.accessToken
}

/**
 * 确保认证有效（异步，适用于 beforeLoad 路由守卫）
 *
 * 刷新页面时 AT Cookie 可能已被 max-age 清除，但 RT Cookie（30天）仍在。
 * 此时需要先尝试用 RT 刷新 AT，而不是直接判定为未登录。
 *
 * @returns true=认证有效可继续, false=需要跳转登录
 */
export async function ensureAuthenticated(): Promise<boolean> {
  // 1. AT 仍在内存/Cookie 中 → 直接放行（即使过期，401 拦截器会处理）
  if (authStore.state.isAuthenticated && !!authStore.state.accessToken) {
    return true
  }

  // 2. AT 缺失，检查 RT 是否存在
  const refreshToken = authStore.state.refreshToken || getCookie(REFRESH_TOKEN_KEY)
  if (!refreshToken) {
    return false
  }

  // 3. 尝试用 RT 刷新 AT
  try {
    const tokenData = await refreshAccessToken()
    updateTokens(tokenData.access_token, tokenData.refresh_token)
    return true
  } catch {
    // RT 也失效 → 清除认证状态
    clearAuth()
    return false
  }
}
