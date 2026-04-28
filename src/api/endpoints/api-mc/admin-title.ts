/**
 * 管理员称号管理 API 端点函数 + TanStack Query Hooks
 * 对接锋楪核心后端 (mcApiClient)
 *
 * 接口路径：/admin/titles (CRUD) + /admin/titles/{id}/assign (分配/撤销)
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type {
  TitleResponse,
  TitleListResponse,
  CreateTitleRequest,
  UpdateTitleRequest,
  AssignTitleRequest,
  AdminTitleListParams,
} from '../../types/api-mc/title'

// ─── Query Keys ────────────────────────────────────────────

export const ADMIN_TITLE_LIST_QUERY_KEY = ['admin', 'mc', 'titles'] as const
export const ADMIN_TITLE_DETAIL_QUERY_KEY = [
  'admin',
  'mc',
  'title',
  'detail',
] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 管理员查询称号列表（分页 + 类型筛选） */
export async function getAdminTitles(
  params?: AdminTitleListParams,
): Promise<TitleListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.page_size) sp.set('page_size', String(params.page_size))
  if (params?.type !== undefined) sp.set('type', String(params.type))
  const qs = sp.toString()
  return mcApiClient.get<TitleListResponse>(
    qs ? `/admin/titles?${qs}` : '/admin/titles',
  )
}

/** 管理员查询称号详情 */
export async function getAdminTitleDetail(id: string): Promise<TitleResponse> {
  return mcApiClient.get<TitleResponse>(`/admin/titles/${id}`)
}

/** 管理员创建称号 */
export async function createTitle(
  data: CreateTitleRequest,
): Promise<TitleResponse> {
  return mcApiClient.post<TitleResponse>('/admin/titles', data)
}

/** 管理员更新称号 */
export async function updateTitle(
  id: string,
  data: UpdateTitleRequest,
): Promise<TitleResponse> {
  return mcApiClient.put<TitleResponse>(`/admin/titles/${id}`, data)
}

/** 管理员删除称号 */
export async function deleteTitle(id: string): Promise<void> {
  return mcApiClient.delete(`/admin/titles/${id}`)
}

/** 管理员分配称号给玩家 */
export async function assignTitle(
  id: string,
  data: AssignTitleRequest,
): Promise<void> {
  return mcApiClient.post(`/admin/titles/${id}/assign`, data)
}

/** 管理员撤销玩家称号 */
export async function revokeTitle(
  id: string,
  data: AssignTitleRequest,
): Promise<void> {
  return mcApiClient.delete(`/admin/titles/${id}/assign`, data)
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 管理员称号列表 Query */
export function useAdminTitles(params?: AdminTitleListParams) {
  return useQuery({
    queryKey: [...ADMIN_TITLE_LIST_QUERY_KEY, params],
    queryFn: () => getAdminTitles(params),
  })
}

/** 管理员称号详情 Query */
export function useAdminTitleDetail(id: string) {
  return useQuery({
    queryKey: [...ADMIN_TITLE_DETAIL_QUERY_KEY, id],
    queryFn: () => getAdminTitleDetail(id),
    enabled: !!id,
  })
}

/** 创建称号 Mutation */
export function useCreateTitleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTitle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TITLE_LIST_QUERY_KEY })
    },
  })
}

/** 更新称号 Mutation */
export function useUpdateTitleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTitleRequest }) =>
      updateTitle(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TITLE_LIST_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_TITLE_DETAIL_QUERY_KEY, variables.id],
      })
    },
  })
}

/** 删除称号 Mutation */
export function useDeleteTitleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTitle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TITLE_LIST_QUERY_KEY })
    },
  })
}

/** 分配称号 Mutation */
export function useAssignTitleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignTitleRequest }) =>
      assignTitle(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TITLE_LIST_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_TITLE_DETAIL_QUERY_KEY, variables.id],
      })
    },
  })
}

/** 撤销称号 Mutation */
export function useRevokeTitleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignTitleRequest }) =>
      revokeTitle(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_TITLE_LIST_QUERY_KEY })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_TITLE_DETAIL_QUERY_KEY, variables.id],
      })
    },
  })
}
