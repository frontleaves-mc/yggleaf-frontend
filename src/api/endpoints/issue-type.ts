/**
 * 问题类型 API 端点函数 + TanStack Query Hooks
 * 对接：类型列表(公开) + 类型 CRUD(管理)
 *
 * 注意：所有实体 ID 均为雪花算法生成，使用 string 避免精度丢失
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../client'
import type {
  IssueType,
  CreateIssueTypeRequest,
  UpdateIssueTypeRequest,
} from '#/api/types'

// ─── Query Keys ────────────────────────────────────────────

export const ISSUE_TYPE_QUERY_KEY = ['issue-types'] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 获取问题类型列表（公开） */
export async function getIssueTypes(): Promise<IssueType[]> {
  return apiClient.get<IssueType[]>('/issue-type/list')
}

/** 创建问题类型（管理） */
export async function createIssueType(data: CreateIssueTypeRequest): Promise<IssueType> {
  return apiClient.post<IssueType>('/admin/issue-type', data)
}

/** 更新问题类型（管理） */
export async function updateIssueType(id: string, data: UpdateIssueTypeRequest): Promise<IssueType> {
  return apiClient.put<IssueType>(`/admin/issue-type/${id}`, data)
}

/** 删除问题类型（管理） */
export async function deleteIssueType(id: string): Promise<void> {
  return apiClient.delete(`/admin/issue-type/${id}`)
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 问题类型列表 Query */
export function useIssueTypes(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ISSUE_TYPE_QUERY_KEY,
    queryFn: getIssueTypes,
    enabled: options?.enabled ?? true,
  })
}

/** 创建问题类型 Mutation */
export function useCreateIssueTypeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createIssueType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ISSUE_TYPE_QUERY_KEY })
    },
  })
}

/** 更新问题类型 Mutation */
export function useUpdateIssueTypeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIssueTypeRequest }) =>
      updateIssueType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ISSUE_TYPE_QUERY_KEY })
    },
  })
}

/** 删除问题类型 Mutation */
export function useDeleteIssueTypeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteIssueType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ISSUE_TYPE_QUERY_KEY })
    },
  })
}
