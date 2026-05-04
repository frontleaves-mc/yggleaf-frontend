/**
 * 管理员插件凭证管理 API 端点函数 + TanStack Query Hooks
 * 对接锋楪核心后端 (mcApiClient)
 *
 * 接口路径：/admin/plugin-credentials (CRUD) + /admin/plugin-credentials/{id}/reset-key
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type {
  PluginCredentialResponse,
  PluginCredentialListResponse,
  CreatePluginCredentialRequest,
  UpdatePluginCredentialRequest,
  PluginCredentialListParams,
} from '../../types/api-mc/plugin-credential'

// ─── Query Keys ────────────────────────────────────────────

export const PLUGIN_CREDENTIAL_LIST_QUERY_KEY = [
  'admin',
  'plugin-credentials',
] as const
export const PLUGIN_CREDENTIAL_DETAIL_QUERY_KEY = [
  'admin',
  'plugin-credentials',
  'detail',
] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 管理员查询插件凭证列表（分页） */
export async function getPluginCredentialList(
  params?: PluginCredentialListParams,
): Promise<PluginCredentialListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.page_size) sp.set('page_size', String(params.page_size))
  const qs = sp.toString()
  return mcApiClient.get<PluginCredentialListResponse>(
    qs ? `/admin/plugin-credentials?${qs}` : '/admin/plugin-credentials',
  )
}

/** 管理员查询插件凭证详情 */
export async function getPluginCredentialDetail(
  id: string,
): Promise<PluginCredentialResponse> {
  return mcApiClient.get<PluginCredentialResponse>(
    `/admin/plugin-credentials/${id}`,
  )
}

/** 管理员创建插件凭证 */
export async function createPluginCredential(
  data: CreatePluginCredentialRequest,
): Promise<PluginCredentialResponse> {
  return mcApiClient.post<PluginCredentialResponse>(
    '/admin/plugin-credentials',
    data,
  )
}

/** 管理员更新插件凭证描述 */
export async function updatePluginCredential(
  id: string,
  data: UpdatePluginCredentialRequest,
): Promise<PluginCredentialResponse> {
  return mcApiClient.put<PluginCredentialResponse>(
    `/admin/plugin-credentials/${id}`,
    data,
  )
}

/** 管理员删除插件凭证 */
export async function deletePluginCredential(id: string): Promise<void> {
  return mcApiClient.delete(`/admin/plugin-credentials/${id}`)
}

/** 管理员重置插件凭证密钥 */
export async function resetPluginCredentialKey(
  id: string,
): Promise<PluginCredentialResponse> {
  return mcApiClient.put<PluginCredentialResponse>(
    `/admin/plugin-credentials/${id}/reset-key`,
  )
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 插件凭证列表 Query */
export function usePluginCredentialList(params?: PluginCredentialListParams) {
  return useQuery({
    queryKey: [...PLUGIN_CREDENTIAL_LIST_QUERY_KEY, params],
    queryFn: () => getPluginCredentialList(params),
  })
}

/** 插件凭证详情 Query */
export function usePluginCredentialDetail(id: string) {
  return useQuery({
    queryKey: [...PLUGIN_CREDENTIAL_DETAIL_QUERY_KEY, id],
    queryFn: () => getPluginCredentialDetail(id),
    enabled: !!id,
  })
}

/** 创建插件凭证 Mutation */
export function useCreatePluginCredentialMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPluginCredential,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PLUGIN_CREDENTIAL_LIST_QUERY_KEY,
      })
    },
  })
}

/** 更新插件凭证 Mutation */
export function useUpdatePluginCredentialMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdatePluginCredentialRequest
    }) => updatePluginCredential(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: PLUGIN_CREDENTIAL_LIST_QUERY_KEY,
      })
      queryClient.invalidateQueries({
        queryKey: [...PLUGIN_CREDENTIAL_DETAIL_QUERY_KEY, variables.id],
      })
    },
  })
}

/** 删除插件凭证 Mutation */
export function useDeletePluginCredentialMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePluginCredential,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PLUGIN_CREDENTIAL_LIST_QUERY_KEY,
      })
    },
  })
}

/** 重置插件凭证密钥 Mutation */
export function useResetPluginCredentialKeyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string }) => resetPluginCredentialKey(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...PLUGIN_CREDENTIAL_DETAIL_QUERY_KEY, variables.id],
      })
    },
  })
}
