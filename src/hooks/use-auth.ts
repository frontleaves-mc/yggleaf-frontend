/**
 * 认证状态 Hook
 * 提供登出操作和用户状态访问
 * 登录走 OAuth2 SSO 流程，不在此处理
 */

import { useCallback } from 'react'
import { useStore } from '@tanstack/react-store'
import { authStore } from '#/stores/auth-store'
import { logout as apiLogout } from '#/api/endpoints/auth'

/** 返回认证状态和操作方法 */
export function useAuth() {
  const state = useStore(authStore, (s) => s)

  /** 登出 */
  const doLogout = useCallback(async () => {
    await apiLogout()
  }, [])

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    accessToken: state.accessToken,
    logout: doLogout,
  }
}
