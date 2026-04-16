/**
 * 认证状态 Hook
 * 提供登出操作和用户状态访问
 * 登录走 OAuth2 SSO 流程，不在此处理
 *
 * 用户信息从 TanStack Query 缓存读取（而非 authStore），
 * 确保数据一致性并支持自动失效。
 */

import { useCallback } from 'react'
import { useStore } from '@tanstack/react-store'
import { useQueryClient } from '@tanstack/react-query'
import { authStore } from '#/stores/auth-store'
import { logout as apiLogout } from '#/api/endpoints/auth'
import { USER_INFO_QUERY_KEY } from '#/api/endpoints/user'
import type { User } from '#/api/types'

/** 返回认证状态和操作方法 */
export function useAuth() {
  const state = useStore(authStore, (s) => s)
  const queryClient = useQueryClient()

  /** 登出 */
  const doLogout = useCallback(async () => {
    await apiLogout()
  }, [])

  // 从 TanStack Query 缓存同步读取用户信息
  const user = queryClient.getQueryData<User>(USER_INFO_QUERY_KEY) ?? null

  return {
    user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    accessToken: state.accessToken,
    logout: doLogout,
  }
}
