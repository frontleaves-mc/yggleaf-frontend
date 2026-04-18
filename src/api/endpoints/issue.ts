/**
 * 问题工单 API 端点函数 + TanStack Query Hooks（用户端）
 * 对接：提交问题 / 我的问题列表 / 详情 / 附件 / 回复
 *
 * 注意：所有实体 ID 均为雪花算法生成，使用 string 避免精度丢失
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import type {
  IssueListResponse,
  IssueDetailResponse,
  IssueReplyItem,
  IssueAttachmentItem,
  CreateIssueRequest,
  ReplyIssueRequest,
  UploadAttachmentRequest,
  IssuePriority,
  IssueStatus,
} from '#/api/types'

// ─── 参数接口 ─────────────────────────────────────────────

export interface IssueListParams {
  page?: number
  page_size?: number
  status?: IssueStatus
  priority?: IssuePriority
  issue_type_id?: string
}

// ─── Query Keys ────────────────────────────────────────────

export const ISSUE_LIST_QUERY_KEY = ['issues'] as const
export const ISSUE_DETAIL_QUERY_KEY = ['issue-detail'] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 提交问题 */
export async function createIssue(data: CreateIssueRequest): Promise<IssueDetailResponse> {
  return apiClient.post<IssueDetailResponse>('/issue', data)
}

/** 我的问题列表 */
export async function getMyIssues(params?: IssueListParams): Promise<IssueListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.page_size) sp.set('page_size', String(params.page_size))
  if (params?.status) sp.set('status', params.status)
  if (params?.priority) sp.set('priority', params.priority)
  if (params?.issue_type_id) sp.set('issue_type_id', params.issue_type_id)
  const qs = sp.toString()
  return apiClient.get<IssueListResponse>(qs ? `/issue/list?${qs}` : '/issue/list')
}

/** 问题详情 */
export async function getIssueDetail(id: string): Promise<IssueDetailResponse> {
  return apiClient.get<IssueDetailResponse>(`/issue/${id}`)
}

/** 上传附件（Base64） */
export async function uploadAttachment(
  issueId: string,
  data: UploadAttachmentRequest,
): Promise<IssueAttachmentItem> {
  return apiClient.post<IssueAttachmentItem>(`/issue/${issueId}/attachment`, data)
}

/** 回复问题 */
export async function replyIssue(
  issueId: string,
  data: ReplyIssueRequest,
): Promise<IssueReplyItem> {
  return apiClient.post<IssueReplyItem>(`/issue/${issueId}/reply`, data)
}

/** 删除附件 */
export async function deleteAttachment(attachmentId: string): Promise<void> {
  return apiClient.delete(`/issue/attachment/${String(attachmentId)}`)
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 我的问题列表 Query */
export function useMyIssues(params?: IssueListParams) {
  return useQuery({
    queryKey: [...ISSUE_LIST_QUERY_KEY, params],
    queryFn: () => getMyIssues(params),
  })
}

/** 问题详情 Query */
export function useIssueDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...ISSUE_DETAIL_QUERY_KEY, id],
    queryFn: () => getIssueDetail(id),
    enabled: options?.enabled ?? true,
  })
}

/** 创建问题 Mutation */
export function useCreateIssueMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ISSUE_LIST_QUERY_KEY })
    },
  })
}

/** 回复问题 Mutation */
export function useReplyIssueMutation(issueId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ReplyIssueRequest) => replyIssue(issueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ISSUE_DETAIL_QUERY_KEY, issueId] })
    },
  })
}

/** 上传附件 Mutation */
export function useUploadAttachmentMutation(issueId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UploadAttachmentRequest) => uploadAttachment(issueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ISSUE_DETAIL_QUERY_KEY, issueId] })
    },
  })
}

/** 删除附件 Mutation */
export function useDeleteAttachmentMutation(issueId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ISSUE_DETAIL_QUERY_KEY, issueId] })
    },
  })
}
