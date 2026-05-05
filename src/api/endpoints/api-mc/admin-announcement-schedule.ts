/**
 * 管理端公告调度管理 API 端点函数 + TanStack Query Hooks
 * 对接锋楪核心后端 (mcApiClient)
 *
 * 接口路径：/admin/announcements/schedules (CRUD) + activate/deactivate
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type {
  ScheduleResponse,
  ScheduleListResponse,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  AdminScheduleListParams,
} from '../../types/api-mc/announcement-schedule'

// ─── Query Keys ────────────────────────────────────────────

export const ADMIN_SCHEDULE_LIST_QUERY_KEY = [
  'admin',
  'mc',
  'announcement-schedules',
] as const
export const ADMIN_SCHEDULE_DETAIL_QUERY_KEY = [
  'admin',
  'mc',
  'announcement-schedule',
  'detail',
] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 管理员查询调度列表（分页） */
export async function getAdminSchedules(
  params?: AdminScheduleListParams,
): Promise<ScheduleListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.page_size) sp.set('page_size', String(params.page_size))
  const qs = sp.toString()
  return mcApiClient.get<ScheduleListResponse>(
    qs ? `/admin/announcements/schedules?${qs}` : '/admin/announcements/schedules',
  )
}

/** 管理员创建调度 */
export async function createSchedule(
  data: CreateScheduleRequest,
): Promise<ScheduleResponse> {
  return mcApiClient.post<ScheduleResponse>(
    '/admin/announcements/schedules',
    data,
  )
}

/** 管理员查询调度详情 */
export async function getAdminScheduleDetail(
  id: string,
): Promise<ScheduleResponse> {
  return mcApiClient.get<ScheduleResponse>(
    `/admin/announcements/schedules/${id}`,
  )
}

/** 管理员更新调度 */
export async function updateSchedule(
  id: string,
  data: UpdateScheduleRequest,
): Promise<ScheduleResponse> {
  return mcApiClient.put<ScheduleResponse>(
    `/admin/announcements/schedules/${id}`,
    data,
  )
}

/** 管理员删除调度 */
export async function deleteSchedule(id: string): Promise<void> {
  return mcApiClient.delete(`/admin/announcements/schedules/${id}`)
}

/** 管理员激活调度 */
export async function activateSchedule(id: string): Promise<void> {
  return mcApiClient.post(`/admin/announcements/schedules/${id}/activate`)
}

/** 管理员停用调度 */
export async function deactivateSchedule(id: string): Promise<void> {
  return mcApiClient.post(`/admin/announcements/schedules/${id}/deactivate`)
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 管理员调度列表 Query */
export function useAdminSchedules(params?: AdminScheduleListParams) {
  return useQuery({
    queryKey: [...ADMIN_SCHEDULE_LIST_QUERY_KEY, params],
    queryFn: () => getAdminSchedules(params),
  })
}

/** 管理员调度详情 Query */
export function useAdminScheduleDetail(id: string) {
  return useQuery({
    queryKey: [...ADMIN_SCHEDULE_DETAIL_QUERY_KEY, id],
    queryFn: () => getAdminScheduleDetail(id),
    enabled: !!id,
  })
}

/** 创建调度 Mutation */
export function useCreateScheduleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SCHEDULE_LIST_QUERY_KEY })
    },
  })
}

/** 更新调度 Mutation */
export function useUpdateScheduleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScheduleRequest }) =>
      updateSchedule(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SCHEDULE_LIST_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_SCHEDULE_DETAIL_QUERY_KEY, variables.id],
      })
    },
  })
}

/** 删除调度 Mutation */
export function useDeleteScheduleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SCHEDULE_LIST_QUERY_KEY })
    },
  })
}

/** 激活调度 Mutation */
export function useActivateScheduleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateSchedule,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SCHEDULE_LIST_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_SCHEDULE_DETAIL_QUERY_KEY, id],
      })
    },
  })
}

/** 停用调度 Mutation */
export function useDeactivateScheduleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateSchedule,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SCHEDULE_LIST_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_SCHEDULE_DETAIL_QUERY_KEY, id],
      })
    },
  })
}
