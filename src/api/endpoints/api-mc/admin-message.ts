/**
 * 管理员消息管理 API 端点函数 + TanStack Query Hooks
 * 对接锋楪插件后端 (mcApiClient)
 *
 * 接口路径：/admin/messages/chat, /admin/messages/commands
 */

import { useQuery } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type {
  ChatLogListResponse,
  CommandLogListResponse,
  AdminChatListParams,
  AdminCommandListParams,
} from '../../types/api-mc/message'

// ─── Query Keys ────────────────────────────────────────────

export const ADMIN_CHAT_LIST_QUERY_KEY = [
  'admin',
  'messages',
  'chat',
] as const
export const ADMIN_COMMAND_LIST_QUERY_KEY = [
  'admin',
  'messages',
  'commands',
] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 管理员查询所有聊天记录（分页 + 筛选） */
export async function getAdminChatList(
  params?: AdminChatListParams,
): Promise<ChatLogListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.page_size) sp.set('page_size', String(params.page_size))
  if (params?.player_uuid) sp.set('player_uuid', params.player_uuid)
  if (params?.server_name) sp.set('server_name', params.server_name)
  if (params?.source !== undefined) sp.set('source', String(params.source))
  const qs = sp.toString()
  return mcApiClient.get<ChatLogListResponse>(
    qs ? `/admin/messages/chat?${qs}` : '/admin/messages/chat',
  )
}

/** 管理员查询所有指令记录（分页 + 筛选） */
export async function getAdminCommandList(
  params?: AdminCommandListParams,
): Promise<CommandLogListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.page_size) sp.set('page_size', String(params.page_size))
  if (params?.player_uuid) sp.set('player_uuid', params.player_uuid)
  if (params?.server_name) sp.set('server_name', params.server_name)
  const qs = sp.toString()
  return mcApiClient.get<CommandLogListResponse>(
    qs ? `/admin/messages/commands?${qs}` : '/admin/messages/commands',
  )
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 管理员聊天记录列表 Query */
export function useAdminChatList(params?: AdminChatListParams) {
  return useQuery({
    queryKey: [...ADMIN_CHAT_LIST_QUERY_KEY, params],
    queryFn: () => getAdminChatList(params),
  })
}

/** 管理员指令记录列表 Query */
export function useAdminCommandList(params?: AdminCommandListParams) {
  return useQuery({
    queryKey: [...ADMIN_COMMAND_LIST_QUERY_KEY, params],
    queryFn: () => getAdminCommandList(params),
  })
}
