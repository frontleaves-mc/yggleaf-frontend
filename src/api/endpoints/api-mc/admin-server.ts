/**
 * 管理员服务器管理 API 端点函数 + TanStack Query Hooks
 * 对接锋楪核心后端 (mcApiClient)
 *
 * 接口路径：/admin/servers (CRUD) + /admin/servers/{id}/enabled + /admin/servers/{id}/public
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type {
  ServerResponse,
  ServerListResponse,
  CreateServerRequest,
  UpdateServerRequest,
  SetServerEnabledRequest,
  SetServerPublicRequest,
  ServerListParams,
} from '../../types/api-mc/server-management'

// ─── Query Keys ────────────────────────────────────────────

export const ADMIN_SERVER_LIST_QUERY_KEY = ['admin', 'servers'] as const
export const ADMIN_SERVER_DETAIL_QUERY_KEY = [
  'admin',
  'servers',
  'detail',
] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 管理员查询服务器列表（分页） */
export async function getAdminServerList(
  params?: ServerListParams,
): Promise<ServerListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.page_size) sp.set('page_size', String(params.page_size))
  const qs = sp.toString()
  return mcApiClient.get<ServerListResponse>(
    qs ? `/admin/servers?${qs}` : '/admin/servers',
  )
}

/** 管理员查询服务器详情 */
export async function getAdminServerDetail(
  id: string,
): Promise<ServerResponse> {
  return mcApiClient.get<ServerResponse>(`/admin/servers/${id}`)
}

/** 管理员创建服务器 */
export async function createServer(
  data: CreateServerRequest,
): Promise<ServerResponse> {
  return mcApiClient.post<ServerResponse>('/admin/servers', data)
}

/** 管理员更新服务器 */
export async function updateServer(
  id: string,
  data: UpdateServerRequest,
): Promise<ServerResponse> {
  return mcApiClient.put<ServerResponse>(`/admin/servers/${id}`, data)
}

/** 管理员删除服务器 */
export async function deleteServer(id: string): Promise<void> {
  return mcApiClient.delete(`/admin/servers/${id}`)
}

/** 管理员设置服务器启用状态 */
export async function setServerEnabled(
  id: string,
  data: SetServerEnabledRequest,
): Promise<ServerResponse> {
  return mcApiClient.put<ServerResponse>(`/admin/servers/${id}/enabled`, data)
}

/** 管理员设置服务器公开状态 */
export async function setServerPublic(
  id: string,
  data: SetServerPublicRequest,
): Promise<ServerResponse> {
  return mcApiClient.put<ServerResponse>(`/admin/servers/${id}/public`, data)
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 服务器列表 Query */
export function useAdminServerList(params?: ServerListParams) {
  return useQuery({
    queryKey: [...ADMIN_SERVER_LIST_QUERY_KEY, params],
    queryFn: () => getAdminServerList(params),
  })
}

/** 服务器详情 Query */
export function useAdminServerDetail(id: string) {
  return useQuery({
    queryKey: [...ADMIN_SERVER_DETAIL_QUERY_KEY, id],
    queryFn: () => getAdminServerDetail(id),
    enabled: !!id,
  })
}

/** 创建服务器 Mutation */
export function useCreateServerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createServer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_SERVER_LIST_QUERY_KEY,
      })
    },
  })
}

/** 更新服务器 Mutation */
export function useUpdateServerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServerRequest }) =>
      updateServer(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_SERVER_LIST_QUERY_KEY,
      })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_SERVER_DETAIL_QUERY_KEY, variables.id],
      })
    },
  })
}

/** 删除服务器 Mutation */
export function useDeleteServerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteServer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_SERVER_LIST_QUERY_KEY,
      })
    },
  })
}

/** 设置服务器启用状态 Mutation */
export function useSetServerEnabledMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SetServerEnabledRequest }) =>
      setServerEnabled(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_SERVER_LIST_QUERY_KEY,
      })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_SERVER_DETAIL_QUERY_KEY, variables.id],
      })
    },
  })
}

/** 设置服务器公开状态 Mutation */
export function useSetServerPublicMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SetServerPublicRequest }) =>
      setServerPublic(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_SERVER_LIST_QUERY_KEY,
      })
      queryClient.invalidateQueries({
        queryKey: [...ADMIN_SERVER_DETAIL_QUERY_KEY, variables.id],
      })
    },
  })
}
