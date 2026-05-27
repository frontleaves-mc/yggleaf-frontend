/**
 * 用户端消息 API 端点函数 + TanStack Query/Mutation Hooks
 * 对接锋楪插件后端 (mcApiClient)
 *
 * 接口路径：/user/messages/chat, /user/messages/commands, /user/messages/dm
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type {
  ChatLogListResponse,
  CommandLogListResponse,
  UserMessageListParams,
  SendChatMessageRequest,
  DirectMessageListResponse,
  ConversationListResponse,
  UnreadCountResponse,
  SendDirectMessageRequest,
  MarkAsReadRequest,
  DirectMessageParams,
} from '../../types/api-mc/message'
import { ADMIN_CHAT_LIST_QUERY_KEY } from './admin-message'

// ─── Query Keys ────────────────────────────────────────────

export const USER_CHAT_LIST_QUERY_KEY = ['user', 'messages', 'chat'] as const
export const USER_COMMAND_LIST_QUERY_KEY = [
  'user',
  'messages',
  'commands',
] as const
export const DM_CONVERSATIONS_QUERY_KEY = [
  'user',
  'messages',
  'dm',
  'conversations',
] as const
export const DM_MESSAGES_QUERY_KEY = ['user', 'messages', 'dm'] as const
export const DM_UNREAD_QUERY_KEY = ['user', 'messages', 'dm', 'unread'] as const

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

/** 查询私聊会话列表 */
export async function getUserConversations(): Promise<ConversationListResponse> {
  return mcApiClient.get<ConversationListResponse>(
    '/user/messages/dm/conversations',
  )
}

/** 查询与指定用户的私信记录 */
export async function getDirectMessages(
  params: DirectMessageParams,
): Promise<DirectMessageListResponse> {
  const sp = new URLSearchParams()
  sp.set('target_user', params.target_user)
  if (params.page) sp.set('page', String(params.page))
  if (params.page_size) sp.set('page_size', String(params.page_size))
  return mcApiClient.get<DirectMessageListResponse>(
    `/user/messages/dm?${sp.toString()}`,
  )
}

/** 发送私信 */
export async function sendDirectMessage(
  data: SendDirectMessageRequest,
): Promise<void> {
  return mcApiClient.post('/user/messages/dm', data)
}

/** 标记私信已读 */
export async function markAsRead(data: MarkAsReadRequest): Promise<void> {
  return mcApiClient.put('/user/messages/dm/read', data)
}

/** 获取未读私信统计 */
export async function getUnreadDMCount(): Promise<UnreadCountResponse> {
  return mcApiClient.get<UnreadCountResponse>('/user/messages/dm/unread')
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

/** 私聊会话列表 Query */
export function useUserConversations() {
  return useQuery({
    queryKey: DM_CONVERSATIONS_QUERY_KEY,
    queryFn: getUserConversations,
  })
}

/** 私信记录 Query */
export function useDirectMessages(params: DirectMessageParams) {
  return useQuery({
    queryKey: [...DM_MESSAGES_QUERY_KEY, params],
    queryFn: () => getDirectMessages(params),
    enabled: !!params.target_user,
  })
}

/** 发送私信 Mutation */
export function useSendDMMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: sendDirectMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DM_CONVERSATIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: DM_UNREAD_QUERY_KEY })
    },
  })
}

/** 标记已读 Mutation */
export function useMarkAsReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DM_MESSAGES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: DM_UNREAD_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: DM_CONVERSATIONS_QUERY_KEY })
    },
  })
}

/** 未读私信统计 Query（30 秒轮询） */
export function useUnreadDMCount() {
  return useQuery({
    queryKey: DM_UNREAD_QUERY_KEY,
    queryFn: getUnreadDMCount,
    refetchInterval: 30000,
  })
}
