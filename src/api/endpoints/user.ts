/**
 * 用户相关 API 端点函数 + TanStack Query Hooks
 * 对接：获取用户信息 / 修改密码
 */

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../client'
import { authStore } from '#/stores/auth-store'
import type { User } from '#/api/types'

// ─── 端点函数 ──────────────────────────────────────────────

/** 获取当前用户信息 */
export async function getUserInfo(): Promise<User> {
  return apiClient.get<User>('/user/info')
}

// ─── TanStack Query Hooks ───────────────────────────────────

/** 用户信息 Query（自动根据认证状态启用/禁用） */
export function useUserInfo(options?: { enabled?: boolean }) {
  const isAuthenticated = authStore.state.isAuthenticated

  return useQuery({
    queryKey: ['user', 'info'],
    queryFn: getUserInfo,
    enabled: (options?.enabled ?? true) && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 分钟内不重新请求
  })
}
