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
import { logout as apiLogout } from '#/api/endpoints/api-auth/auth'
import { USER_INFO_QUERY_KEY } from '#/api/endpoints/api-auth/user'
import type { UserCurrentResponse } from '#/api/types'

/** 返回认证状态和操作方法 */
export function useAuth() {
  const state = useStore(authStore, (s) => s)
  const queryClient = useQueryClient()

  /** 登出 */
  const doLogout = useCallback(async () => {
    await apiLogout()
  }, [])

  // 从 TanStack Query 缓存同步读取用户实体
  const userInfo =
    queryClient.getQueryData<UserCurrentResponse>(USER_INFO_QUERY_KEY) ?? null
  const user = userInfo?.user ?? null

  return {
    user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    accessToken: state.accessToken,
    logout: doLogout,
  }
}
