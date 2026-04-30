/**
 * 服务器状态 API 端点函数 + TanStack Query Hooks
 * 对接锋楪核心后端 (mcApiClient)
 *
 * 接口路径：/servers/status (GET) + /servers/{name}/refresh (POST)
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type {
  ServerStatusResponse,
  ServerStatusListResponse,
} from '../../types/api-mc/server-status'

// ─── Query Keys ────────────────────────────────────────────

export const SERVER_STATUS_QUERY_KEY = ['server', 'status'] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 获取所有服务器状态 */
export async function getServerStatus(): Promise<ServerStatusListResponse> {
  return mcApiClient.get<ServerStatusListResponse>('/servers/status')
}

/** 刷新指定服务器状态 */
export async function refreshServerStatus(
  name: string,
): Promise<ServerStatusResponse> {
  return mcApiClient.post<ServerStatusResponse>(`/servers/${name}/refresh`)
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 服务器状态 Query */
export function useServerStatus() {
  return useQuery({
    queryKey: SERVER_STATUS_QUERY_KEY,
    queryFn: getServerStatus,
  })
}

/** 刷新服务器状态 Mutation */
export function useRefreshServerStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ name }: { name: string }) => refreshServerStatus(name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SERVER_STATUS_QUERY_KEY,
      })
    },
  })
}
