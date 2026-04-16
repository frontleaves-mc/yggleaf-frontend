/**
 * 资源库配额 API 端点函数 + TanStack Query Hook
 * 对接：GET /library/quota
 */

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../client'
import type { LibraryQuota } from '#/api/types'

// ─── 端点函数 ──────────────────────────────────────────────

/** 获取当前用户资源库配额 */
export async function getLibraryQuota(): Promise<LibraryQuota> {
  return apiClient.get<LibraryQuota>('/library/quota')
}

// ─── TanStack Query Hooks ───────────────────────────────────

/** 资源库配额 Query */
export function useLibraryQuota() {
  return useQuery({
    queryKey: ['library-quota'],
    queryFn: getLibraryQuota,
  })
}
