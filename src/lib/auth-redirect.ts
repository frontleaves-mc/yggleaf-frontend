import { REDIRECT_KEY } from '#/config/constants'

const DEFAULT_AUTH_REDIRECT = '/user/dashboard'

function isSafeInternalUrl(value: string): boolean {
  if (!value || value.startsWith('//')) return false

  if (value.startsWith('/')) return true

  if (typeof window === 'undefined') return false

  try {
    const url = new URL(value)
    return url.origin === window.location.origin
  } catch {
    return false
  }
}

export function normalizeAuthRedirect(value?: string | null): string {
  if (!value || !isSafeInternalUrl(value)) return DEFAULT_AUTH_REDIRECT

  if (value.startsWith('/')) return value

  const url = new URL(value)
  return `${url.pathname}${url.search}${url.hash}`
}

export function getAuthRedirectFromSearch(search: URLSearchParams): string {
  return normalizeAuthRedirect(
    search.get('callback') || search.get('redirect') || undefined,
  )
}

export function stashAuthRedirect(value?: string | null): string {
  const redirectTo = normalizeAuthRedirect(value)

  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(REDIRECT_KEY, redirectTo)
  }

  return redirectTo
}

export function consumeAuthRedirect(fallback?: string | null): string {
  const fallbackRedirect = normalizeAuthRedirect(fallback)

  if (typeof window === 'undefined') return fallbackRedirect

  const cached = window.sessionStorage.getItem(REDIRECT_KEY)
  window.sessionStorage.removeItem(REDIRECT_KEY)

  return normalizeAuthRedirect(cached || fallbackRedirect)
}

export function buildLoginPath(redirectTo?: string): string {
  const normalized = normalizeAuthRedirect(
    redirectTo ||
      (typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}${window.location.hash}`
        : undefined),
  )

  return `/login?callback=${encodeURIComponent(normalized)}`
}
