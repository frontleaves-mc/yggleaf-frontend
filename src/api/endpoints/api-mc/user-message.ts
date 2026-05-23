/**
 * 用户端消息 API 端点函数 + TanStack Query/Mutation Hooks
 * 对接锋楪插件后端 (mcApiClient)
 *
 * 接口路径：/user/messages/chat, /user/messages/commands
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type {
  ChatLogListResponse,
  CommandLogListResponse,
  UserMessageListParams,
  SendChatMessageRequest,
} from '../../types/api-mc/message'
import { ADMIN_CHAT_LIST_QUERY_KEY } from './admin-message'

// ─── Query Keys ────────────────────────────────────────────

export const USER_CHAT_LIST_QUERY_KEY = [
  'user',
  'messages',
  'chat',
] as const
export const USER_COMMAND_LIST_QUERY_KEY = [
  'user',
  'messages',
  'commands',
] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 查询我的聊天记录（分页） */
export async function getUserChatList(
  params?: UserMessageListParams,
): Promise<ChatLogListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.page_size) sp.set('page_size', String(params.page_size))
  const qs = sp.toString()
  return mcApiClient.get<ChatLogListResponse>(
    qs ? `/user/messages/chat?${qs}` : '/user/messages/chat',
  )
}

/** 查询我的指令记录（分页） */
export async function getUserCommandList(
  params?: UserMessageListParams,
): Promise<CommandLogListResponse> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.page_size) sp.set('page_size', String(params.page_size))
  const qs = sp.toString()
  return mcApiClient.get<CommandLogListResponse>(
    qs ? `/user/messages/commands?${qs}` : '/user/messages/commands',
  )
}

/** 发送聊天消息 */
export async function sendChatMessage(
  data: SendChatMessageRequest,
): Promise<void> {
  return mcApiClient.post('/user/messages/chat', data)
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 我的聊天记录 Query */
export function useUserChatList(params?: UserMessageListParams) {
  return useQuery({
    queryKey: [...USER_CHAT_LIST_QUERY_KEY, params],
    queryFn: () => getUserChatList(params),
  })
}

/** 我的指令记录 Query */
export function useUserCommandList(params?: UserMessageListParams) {
  return useQuery({
    queryKey: [...USER_COMMAND_LIST_QUERY_KEY, params],
    queryFn: () => getUserCommandList(params),
  })
}

/** 发送聊天消息 Mutation */
export function useSendChatMessageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: sendChatMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_CHAT_LIST_QUERY_KEY,
      })
      queryClient.invalidateQueries({
        queryKey: ADMIN_CHAT_LIST_QUERY_KEY,
      })
    },
  })
}
