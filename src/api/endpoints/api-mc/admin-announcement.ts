/**
 * 管理员公告管理 API 端点函数 + TanStack Query Hooks
 * 对接锋楪核心后端 (mcApiClient)
 *
 * 接口路径：/admin/announcements (CRUD + 发布/下线)
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type {
  AnnouncementResponse,
  AnnouncementListResponse,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
  AdminAnnouncementListParams,
} from '../../types/api-mc/announcement'

// ─── Query Keys ────────────────────────────────────────────

export const ADMIN_ANNOUNCEMENT_LIST_QUERY_KEY = [
  'admin',
  'mc',
  'announcements',
] as const
export const ADMIN_ANNOUNCEMENT_DETAIL_QUERY_KEY = [
  'admin',
  'mc',
  'announcement',
  'detail',
] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 管理员查询公告列表（分页 + 类型/状态筛选） */
export async function getAdminAnnouncements(
  params?: AdminAnnouncementListParams,
): Promise<AnnouncementListResponse> {
  const sp = new URLSearchParams()
  if (params?.page !== undefined) sp.set('page', String(params.page))
  if (params?.page_size !== undefined) sp.set('page_size', String(params.page_size))
  if (params?.type !== undefined) sp.set('type', String(params.type))
  if (params?.status !== undefined) sp.set('status', String(params.status))
  const qs = sp.toString()
  return mcApiClient.get<AnnouncementListResponse>(
    qs ? `/admin/announcements?${qs}` : '/admin/announcements',
  )
}

/** 管理员创建公告 */
export async function createAnnouncement(
  data: CreateAnnouncementRequest,
): Promise<AnnouncementResponse> {
  return mcApiClient.post<AnnouncementResponse>('/admin/announcements', data)
}

/** 管理员查询公告详情 */
export async function getAdminAnnouncementDetail(
  id: string,
): Promise<AnnouncementResponse> {
  return mcApiClient.get<AnnouncementResponse>(`/admin/announcements/${id}`)
}

/** 管理员更新公告 */
export async function updateAnnouncement(
  id: string,
  data: UpdateAnnouncementRequest,
): Promise<AnnouncementResponse> {
  return mcApiClient.put<AnnouncementResponse>(
    `/admin/announcements/${id}`,
    data,
  )
}

/** 管理员删除公告 */
export async function deleteAnnouncement(id: string): Promise<void> {
  return mcApiClient.delete(`/admin/announcements/${id}`)
}

/** 管理员发布公告 */
export async function publishAnnouncement(id: string): Promise<void> {
  return mcApiClient.post(`/admin/announcements/${id}/publish`)
}

/** 管理员下线公告 */
export async function offlineAnnouncement(id: string): Promise<void> {
  return mcApiClient.post(`/admin/announcements/${id}/offline`)
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 管理员公告列表 Query */
export function useAdminAnnouncements(params?: AdminAnnouncementListParams) {
  return useQuery({
    queryKey: [...ADMIN_ANNOUNCEMENT_LIST_QUERY_KEY, params],
    queryFn: () => getAdminAnnouncements(params),
  })
}

/** 管理员公告详情 Query */
export function useAdminAnnouncementDetail(id: string) {
  return useQuery({
    queryKey: [...ADMIN_ANNOUNCEMENT_DETAIL_QUERY_KEY, id],
    queryFn: () => getAdminAnnouncementDetail(id),
    enabled: !!id,
  })
}

/** 创建公告 Mutation */
export function useCreateAnnouncementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_ANNOUNCEMENT_LIST_QUERY_KEY,
      })
    },
  })
}

/** 更新公告 Mutation */
export function useUpdateAnnouncementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateAnnouncementRequest
    }) => updateAnnouncement(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_ANNOUNCEMENT_LIST_QUERY_KEY,
      })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_ANNOUNCEMENT_DETAIL_QUERY_KEY, variables.id],
      })
    },
  })
}

/** 删除公告 Mutation */
export function useDeleteAnnouncementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_ANNOUNCEMENT_LIST_QUERY_KEY,
      })
    },
  })
}

/** 发布公告 Mutation */
export function usePublishAnnouncementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => publishAnnouncement(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_ANNOUNCEMENT_LIST_QUERY_KEY,
      })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_ANNOUNCEMENT_DETAIL_QUERY_KEY, id],
      })
    },
  })
}

/** 下线公告 Mutation */
export function useOfflineAnnouncementMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => offlineAnnouncement(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_ANNOUNCEMENT_LIST_QUERY_KEY,
      })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_ANNOUNCEMENT_DETAIL_QUERY_KEY, id],
      })
    },
  })
}
