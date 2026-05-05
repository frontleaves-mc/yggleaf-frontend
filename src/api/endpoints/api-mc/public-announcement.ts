/**
 * 公开公告 API 端点函数 + TanStack Query Hooks
 * 对接锋楪核心后端 (mcApiClient) — 无需认证
 *
 * 接口路径：/announcements (只读)
 */

import { useQuery } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type {
  PublicAnnouncementListParams,
  AnnouncementResponse,
  AnnouncementListResponse,
} from '../../types/api-mc/announcement'

// ─── Query Keys ────────────────────────────────────────────

export const PUBLIC_ANNOUNCEMENT_LIST_QUERY_KEY = [
  'public',
  'announcements',
] as const

export const PUBLIC_ANNOUNCEMENT_DETAIL_QUERY_KEY = [
  'public',
  'announcement',
  'detail',
] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 查询公开公告列表（分页 + 类型筛选，无需认证） */
export async function getPublicAnnouncements(
  params?: PublicAnnouncementListParams,
): Promise<AnnouncementListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.page_size) sp.set('page_size', String(params.page_size))
  if (params?.type !== undefined) sp.set('type', String(params.type))
  const qs = sp.toString()
  return mcApiClient.get<AnnouncementListResponse>(
    qs ? `/announcements?${qs}` : '/announcements',
    { skipAuth: true },
  )
}

/** 查询公开公告详情（无需认证） */
export async function getPublicAnnouncementDetail(
  id: string,
): Promise<AnnouncementResponse> {
  return mcApiClient.get<AnnouncementResponse>(`/announcements/${id}`, {
    skipAuth: true,
  })
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 公开公告列表 Query */
export function usePublicAnnouncements(params?: PublicAnnouncementListParams) {
  return useQuery({
    queryKey: [...PUBLIC_ANNOUNCEMENT_LIST_QUERY_KEY, params],
    queryFn: () => getPublicAnnouncements(params),
  })
}

/** 公开公告详情 Query */
export function usePublicAnnouncementDetail(id: string) {
  return useQuery({
    queryKey: [...PUBLIC_ANNOUNCEMENT_DETAIL_QUERY_KEY, id],
    queryFn: () => getPublicAnnouncementDetail(id),
    enabled: !!id,
  })
}
