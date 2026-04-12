/**
 * 路由守卫 Hook
 * 检查认证状态，未登录时返回 false 用于 beforeLoad 重定向
 */

import { authStore } from '#/stores/auth-store'

/** 检查当前是否已认证 */
export function checkIsAuthenticated(): boolean {
  return authStore.state.isAuthenticated && !!authStore.state.accessToken
}
