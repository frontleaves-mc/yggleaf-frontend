/**
 * Cookie 工具函数
 * Token 存储使用 Cookie（SSR 可读），用户信息使用 localStorage
 */

// ─── 常量 ──────────────────────────────────────────────────

/** Access Token 有效期：1 小时（秒） */
export const AT_MAX_AGE = 3600

/** Refresh Token 有效期：30 天（秒） */
export const RT_MAX_AGE = 30 * 24 * 3600

// ─── Cookie 操作 ──────────────────────────────────────────

/** 设置 Cookie */
export function setCookie(name: string, value: string, maxAge: number): void {
  const isProduction = typeof window !== 'undefined' && window.location.protocol === 'https:'
  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    `path=/`,
    `max-age=${maxAge}`,
    `sameSite=Lax`,
    isProduction ? 'secure' : '',
  ].filter(Boolean).join('; ')
}

/** 获取 Cookie 值 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

/** 删除 Cookie */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0`
}

/** 清除所有 Yggleaf 认证 Cookie */
export function clearAuthCookies(): void {
  deleteCookie('yggleaf_access_token')
  deleteCookie('yggleaf_refresh_token')
}
