/**
 * 用户相关 API 端点函数 + TanStack Query Hooks
 * 对接：获取用户信息 / 更新游戏密码
 *
 * 用户信息统一通过 TanStack Query 缓存管理，支持自动失效和强制更新。
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import { authStore } from '#/stores/auth-store'
import type {
  UpdateGamePasswordRequest,
  UserCurrentResponse,
} from '#/api/types'

// ─── 常量定义 ──────────────────────────────────────────────

/** 用户信息的 Query Key（集中定义，避免散落各处的魔法字符串） */
export const USER_INFO_QUERY_KEY = ['user', 'info'] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 获取当前用户信息（含账户完善状态） */
export async function getUserInfo(): Promise<UserCurrentResponse> {
  return apiClient.get<UserCurrentResponse>('/user/info')
}

/** 更新游戏密码（用于 Minecraft 启动器认证，非网站登录） */
export async function updateGamePassword(
  data: UpdateGamePasswordRequest,
): Promise<UserCurrentResponse> {
  return apiClient.put<UserCurrentResponse>('/user/game-password', data)
}

// ─── TanStack Query Hooks ───────────────────────────────────

/**
 * 用户信息 Query Hook
 * 所有需要用户信息的组件统一使用此 Hook
 *
 * @param options.enabled - 是否启用查询（默认根据认证状态自动判断）
 */
export function useUserInfo(options?: { enabled?: boolean }) {
  const isAuthenticated = authStore.state.isAuthenticated

  return useQuery({
    queryKey: USER_INFO_QUERY_KEY,
    queryFn: getUserInfo,
    enabled: (options?.enabled ?? true) && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 分钟内不重新请求
    gcTime: 10 * 60 * 1000, // 缓存保留 10 分钟，防止页面导航时被回收
  })
}

/**
 * 同步读取用户信息缓存（非异步版本）
 * 用于 SidebarFooter 等只需同步读取、不需要 loading/error 状态的场景。
 * 必须在 React 组件内部调用（依赖 useQueryClient）。
 */
export function useUserInfoSync(): UserCurrentResponse | null {
  const queryClient = useQueryClient()
  return queryClient.getQueryData<UserCurrentResponse>(USER_INFO_QUERY_KEY) ?? null
}

/**
 * 更新用户信息缓存操作 Hook
 * 用于密码设置成功后刷新缓存等场景。
 */
export function useUpdateUserInfoCache() {
  const queryClient = useQueryClient()

  return {
    /** 用新的用户数据替换缓存 */
    setUser: (data: UserCurrentResponse) => {
      queryClient.setQueryData(USER_INFO_QUERY_KEY, data)
    },
    /** 使缓存失效并触发重新获取 */
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: USER_INFO_QUERY_KEY })
    },
  }
}

/**
 * 更新游戏密码 Mutation Hook
 * 成功后自动刷新用户信息缓存（account_ready 状态会更新）
 */
export function useUpdateGamePasswordMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateGamePassword,
    onSuccess: (data) => {
      // 用返回的最新数据更新缓存（包含更新后的 account_ready）
      queryClient.setQueryData(USER_INFO_QUERY_KEY, data)
    },
  })
}
