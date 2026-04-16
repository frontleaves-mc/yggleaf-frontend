/**
 * 认证状态管理 (TanStack Store)
 * 管理用户登录状态、Token 信息
 *
 * 存储策略：
 *   - Access Token / Refresh Token → Cookie（SSR 可读）
 *   - 用户信息 → TanStack Query 缓存（自动失效 + 强制更新）
 */

import { Store } from '@tanstack/store'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '#/config/constants'
import { getCookie, setCookie, clearAuthCookies, AT_MAX_AGE, RT_MAX_AGE } from '#/lib/cookie'

/** 认证状态 */
export interface AuthState {
  /** Access Token */
  accessToken: string | null
  /** Refresh Token */
  refreshToken: string | null
  /** 是否已认证 */
  isAuthenticated: boolean
  /** 是否正在加载初始状态 */
  isLoading: boolean
}

/** 从存储恢复初始状态 */
function getInitialState(): AuthState {
  if (typeof window === 'undefined') {
    return {
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
    }
  }

  const accessToken = getCookie(ACCESS_TOKEN_KEY)
  const refreshToken = getCookie(REFRESH_TOKEN_KEY)

  return {
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken,
    isLoading: false,
  }
}

/** 认证状态 Store（全局单例） */
export const authStore = new Store<AuthState>(getInitialState())

// ─── Store Actions ──────────────────────────────────────────

/**
 * 设置登录成功状态
 * Token 存入 Cookie，用户信息由调用方通过 TanStack Query 缓存管理
 */
export function setAuthState(accessToken: string, refreshToken: string): void {
  // Token → Cookie
  setCookie(ACCESS_TOKEN_KEY, accessToken, AT_MAX_AGE)
  setCookie(REFRESH_TOKEN_KEY, refreshToken, RT_MAX_AGE)

  authStore.setState(() => ({
    accessToken,
    refreshToken,
    isAuthenticated: true,
    isLoading: false,
  }))
}

/** 更新 Token 对（刷新后调用） */
export function updateTokens(accessToken: string, refreshToken: string): void {
  setCookie(ACCESS_TOKEN_KEY, accessToken, AT_MAX_AGE)
  setCookie(REFRESH_TOKEN_KEY, refreshToken, RT_MAX_AGE)
  authStore.setState((prev) => ({
    ...prev,
    accessToken,
    refreshToken,
  }))
}

/** 清除认证状态（登出时调用） */
export function clearAuth(): void {
  clearAuthCookies()
  authStore.setState(() => ({
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
  }))
}
