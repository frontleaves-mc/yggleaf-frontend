/**
 * 超管服务器负载 API 端点函数 + TanStack Query Hooks
 * 对接锋楪核心后端 (mcApiClient)
 *
 * 接口路径：
 *   GET /admin/servers/load/realtime       — 批量查询服务器实时负载
 *   GET /admin/servers/load/{id}/realtime   — 查询单台服务器实时负载
 *   GET /admin/servers/load/{id}/history    — 查询服务器历史负载趋势
 */

import { useQuery } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type {
  ServerRealtimeLoad,
  ServerRealtimeLoadListResponse,
  ServerLoadHistoryResponse,
  ServerLoadHistoryParams,
} from '../../types/api-mc/server-load'

// ─── Query Keys ────────────────────────────────────────────

export const SERVER_LOAD_REALTIME_QUERY_KEY = [
  'admin',
  'servers',
  'load',
  'realtime',
] as const

export const SERVER_LOAD_REALTIME_SINGLE_QUERY_KEY = [
  'admin',
  'servers',
  'load',
  'realtime',
  'single',
] as const

export const SERVER_LOAD_HISTORY_QUERY_KEY = [
  'admin',
  'servers',
  'load',
  'history',
] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 批量查询所有启用服务器的实时负载 */
export async function getServerLoadRealtime(): Promise<ServerRealtimeLoadListResponse> {
  return mcApiClient.get<ServerRealtimeLoadListResponse>(
    '/admin/servers/load/realtime',
  )
}

/** 查询单台服务器的实时负载 */
export async function getServerLoadRealtimeSingle(
  id: string,
): Promise<ServerRealtimeLoad> {
  return mcApiClient.get<ServerRealtimeLoad>(
    `/admin/servers/load/${id}/realtime`,
  )
}

/** 查询服务器历史负载趋势 */
export async function getServerLoadHistory(
  id: string,
  params: ServerLoadHistoryParams,
): Promise<ServerLoadHistoryResponse> {
  const sp = new URLSearchParams()
  sp.set('start', params.start)
  sp.set('end', params.end)
  if (params.page) sp.set('page', String(params.page))
  if (params.page_size) sp.set('page_size', String(params.page_size))
  return mcApiClient.get<ServerLoadHistoryResponse>(
    `/admin/servers/load/${id}/history?${sp.toString()}`,
  )
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 批量实时负载 Query (10s 自动轮询) */
export function useServerLoadRealtime() {
  return useQuery({
    queryKey: SERVER_LOAD_REALTIME_QUERY_KEY,
    queryFn: getServerLoadRealtime,
    refetchInterval: 10_000,
  })
}

/** 单台服务器实时负载 Query (10s 自动轮询) */
export function useServerLoadRealtimeSingle(id: string) {
  return useQuery({
    queryKey: [...SERVER_LOAD_REALTIME_SINGLE_QUERY_KEY, id],
    queryFn: () => getServerLoadRealtimeSingle(id),
    enabled: !!id,
    refetchInterval: 10_000,
  })
}

/** 服务器历史负载趋势 Query */
export function useServerLoadHistory(
  id: string,
  params: ServerLoadHistoryParams,
  options?: { refetchInterval?: number },
) {
  return useQuery({
    queryKey: [...SERVER_LOAD_HISTORY_QUERY_KEY, id, params],
    queryFn: () => getServerLoadHistory(id, params),
    enabled: !!id && !!params.start && !!params.end,
    refetchInterval: options?.refetchInterval,
  })
}
