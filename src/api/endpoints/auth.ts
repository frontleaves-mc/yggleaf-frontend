/**
 * 认证相关 API 端点函数 + TanStack Query Hooks
 * 仅使用 OAuth2 SSO 流程：
 *   - /sso/oauth/login    → SSO 登录跳转（后端 302）
 *   - /sso/oauth/callback → 授权码换 Token
 *   - /sso/oauth/logout   → 登出
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import { clearAuth, setAuthState } from '#/stores/auth-store'
import { getUserInfo, USER_INFO_QUERY_KEY } from './user'
import { SSO_LOGIN_BASE_URL } from '#/config/constants'
import type { OAuthTokenData } from '#/api/types'

// ─── OAuth2 SSO 端点函数 ─────────────────────────────────

/**
 * 获取 OAuth2 SSO 登录 URL
 * 浏览器直接导航到此 URL（后端真实地址），后端返回 302 重定向到 SSO 提供商
 * 注意：不走 Vite proxy，因为需要浏览器跟随 302 重定向
 */
export function getOAuthLoginUrl(): string {
  return `${SSO_LOGIN_BASE_URL}/sso/oauth/login`
}

/**
 * 完整的 OAuth2 SSO 回调处理
 * SSO 提供商认证后回调到前端 /callback?code=xxx&state=xxx
 * 处理流程：用授权码换 Token → 获取用户信息 → 预填 Query 缓存 + 设置认证状态
 */
export async function handleOAuthCallback(
  code: string,
  state: string,
  queryClient: QueryClient,
): Promise<void> {
  // 1. 用授权码换 Token
  const tokenData = await apiClient.get<OAuthTokenData>(
    `/sso/oauth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
    { skipAuth: true },
  )

  // 2. 临时写入 Token（后续获取用户信息需要 Authorization header）
  const { authStore } = await import('#/stores/auth-store')
  const { setCookie, AT_MAX_AGE, RT_MAX_AGE } = await import('#/lib/cookie')
  const { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = await import('#/config/constants')

  setCookie(ACCESS_TOKEN_KEY, tokenData.access_token, AT_MAX_AGE)
  setCookie(REFRESH_TOKEN_KEY, tokenData.refresh_token, RT_MAX_AGE)
  authStore.setState(() => ({
    ...authStore.state,
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    isAuthenticated: true,
    isLoading: false,
  }))

  // 3. 获取用户信息
  const user = await getUserInfo()

  // 4. 预填 TanStack Query 缓存（替代原来的 localStorage 写入）
  queryClient.setQueryData(USER_INFO_QUERY_KEY, user)

  // 5. 最终设置认证状态（Token → Cookie + Store，不含 user）
  setAuthState(tokenData.access_token, tokenData.refresh_token)
}

/** OAuth2 登出 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/sso/oauth/logout')
  } finally {
    clearAuth()
  }
}

// ─── TanStack Query Hooks ───────────────────────────────────

/** 登出 Mutation */
export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
