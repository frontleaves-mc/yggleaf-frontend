/**
 * 问题工单 API 端点函数 + TanStack Query Hooks（管理员端）
 * 对接：全量列表 / 更新备注 / 修改优先级 / 修改状态
 *
 * 注意：所有实体 ID 均为雪花算法生成，使用 string 避免精度丢失
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import type {
  IssueListResponse,
  IssuePriority,
  IssueStatus,
  UpdateIssueNoteRequest,
  UpdateIssuePriorityRequest,
  UpdateIssueStatusRequest,
} from '#/api/types'

// ─── 参数接口 ─────────────────────────────────────────────

export interface AdminIssueListParams {
  page?: number
  page_size?: number
  status?: IssueStatus
  priority?: IssuePriority
  issue_type_id?: string
  keyword?: string
}

// ─── Query Keys ────────────────────────────────────────────

export const ADMIN_ISSUE_LIST_QUERY_KEY = ['admin', 'issues'] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 管理员全量问题列表 */
export async function getAdminIssues(params?: AdminIssueListParams): Promise<IssueListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.page_size) sp.set('page_size', String(params.page_size))
  if (params?.status) sp.set('status', params.status)
  if (params?.priority) sp.set('priority', params.priority)
  if (params?.issue_type_id) sp.set('issue_type_id', params.issue_type_id)
  if (params?.keyword) sp.set('keyword', params.keyword)
  const qs = sp.toString()
  return apiClient.get<IssueListResponse>(qs ? `/admin/issue/list?${qs}` : '/admin/issue/list')
}

/** 更新备注 */
export async function updateIssueNote(
  id: string,
  data: UpdateIssueNoteRequest,
): Promise<void> {
  return apiClient.put(`/admin/issue/${id}/note`, data)
}

/** 修改优先级 */
export async function updateIssuePriority(
  id: string,
  data: UpdateIssuePriorityRequest,
): Promise<void> {
  return apiClient.put(`/admin/issue/${id}/priority`, data)
}

/** 修改状态 */
export async function updateIssueStatus(
  id: string,
  data: UpdateIssueStatusRequest,
): Promise<void> {
  return apiClient.put(`/admin/issue/${id}/status`, data)
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 管理员问题列表 Query */
export function useAdminIssues(params?: AdminIssueListParams) {
  return useQuery({
    queryKey: [...ADMIN_ISSUE_LIST_QUERY_KEY, params],
    queryFn: () => getAdminIssues(params),
  })
}

/** 更新备注 Mutation */
export function useUpdateIssueNoteMutation(issueId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateIssueNoteRequest) => updateIssueNote(issueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue-detail', issueId] })
      queryClient.invalidateQueries({ queryKey: ADMIN_ISSUE_LIST_QUERY_KEY })
    },
  })
}

/** 修改优先级 Mutation */
export function useUpdateIssuePriorityMutation(issueId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateIssuePriorityRequest) => updateIssuePriority(issueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue-detail', issueId] })
      queryClient.invalidateQueries({ queryKey: ADMIN_ISSUE_LIST_QUERY_KEY })
    },
  })
}

/** 修改状态 Mutation */
export function useUpdateIssueStatusMutation(issueId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateIssueStatusRequest) => updateIssueStatus(issueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue-detail', issueId] })
      queryClient.invalidateQueries({ queryKey: ADMIN_ISSUE_LIST_QUERY_KEY })
    },
  })
}
