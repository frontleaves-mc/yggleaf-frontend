/**
 * 模组元数据 API 端点函数 + TanStack Query Hook
 * 对接：GET /sync/mods/metadata（公开接口，无需认证）
 */

import { useQuery } from '@tanstack/react-query'
import { authApiClient } from '../client'
import type { ModsMetadataResponse } from '#/api/types'

// ─── 端点函数 ──────────────────────────────────────────────

/** 获取服务器模组元数据列表 */
export async function getModsMetadata(): Promise<ModsMetadataResponse> {
  return authApiClient.get<ModsMetadataResponse>('/sync/mods/metadata', { skipAuth: true })
}

// ─── TanStack Query Hooks ───────────────────────────────────

/** 模组元数据 Query（5 分钟缓存） */
export function useModsMetadata() {
  return useQuery({
    queryKey: ['mods', 'metadata'],
    queryFn: getModsMetadata,
    staleTime: 5 * 60 * 1000,
  })
}
