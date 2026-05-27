/**
 * 消息模块类型定义
 * 对接锋楪插件后端 (mcApiClient) — 聊天记录 + 指令记录 + SSE 实时流
 */

// ─── 枚举常量 ──────────────────────────────────────────────

/** 消息来源 */
export const MessageSource = {
  /** 游戏内发送 */
  Game: 1,
  /** 网页端发送 */
  Web: 2,
} as const

export type MessageSourceValue =
  (typeof MessageSource)[keyof typeof MessageSource]

// ─── 响应类型 ──────────────────────────────────────────────

export type ChatLogResponse = {
  id: string
  player_uuid: string
  player_name: string
  server_name: string
  world_name: string
  message: string
  source: MessageSourceValue
  sender_id?: string | null
  user_id?: string
}

export type CommandLogResponse = {
  id: string
  player_uuid: string
  player_name: string
  server_name: string
  world_name: string
  command: string
  user_id?: string
}

export type SSEChatMessage = {
  player_name: string
  server_name: string
  message: string
  source: MessageSourceValue
}

// ─── 列表响应类型 ──────────────────────────────────────────

export type ChatLogListResponse = {
  list: ChatLogResponse[]
  total: number
  page: number
  page_size: number
}

export type CommandLogListResponse = {
  list: CommandLogResponse[]
  total: number
  page: number
  page_size: number
}

// ─── 查询参数 ──────────────────────────────────────────────

export type AdminChatListParams = {
  page?: number
  page_size?: number
  player_uuid?: string
  server_name?: string
  source?: MessageSourceValue
}

export type AdminCommandListParams = {
  page?: number
  page_size?: number
  player_uuid?: string
  server_name?: string
}

export type UserMessageListParams = {
  page?: number
  page_size?: number
}

// ─── 请求类型 ──────────────────────────────────────────────

export type SendChatMessageRequest = {
  message: string
  profile_uuid: string
}

// ─── 私信类型 ──────────────────────────────────────────────

/** 私信消息响应 */
export type DirectMessageResponse = {
  id: string
  sender_id: string
  sender_name: string
  receiver_id: string
  receiver_name: string
  message: string
  source: MessageSourceValue
  is_read: boolean
  created_at: string
  read_at?: string
}

/** 私信消息列表响应 */
export type DirectMessageListResponse = {
  list: DirectMessageResponse[]
  total: number
  page: number
  page_size: number
}

/** 会话响应 */
export type ConversationResponse = {
  user_id: string
  user_name: string
  last_message: string
  last_message_at: string
  unread_count: number
}

/** 会话列表响应 */
export type ConversationListResponse = {
  list: ConversationResponse[]
  total: number
}

/** 未读数按用户统计 */
export type UnreadCountByUser = {
  user_id: string
  user_name: string
  count: number
}

/** 未读数响应 */
export type UnreadCountResponse = {
  total: number
  detail: UnreadCountByUser[]
}

/** 发送私信请求 */
export type SendDirectMessageRequest = {
  message: string
  receiver_id: string
}

/** 标记已读请求 */
export type MarkAsReadRequest = {
  sender_id: string
}

/** 私信查询参数 (GET /user/messages/dm) */
export type DirectMessageParams = {
  target_user: string
  page?: number
  page_size?: number
}

/** 管理端私信查询参数 (GET /admin/messages/dm) */
export type AdminDirectMessageParams = {
  page?: number
  page_size?: number
  sender_name?: string
  receiver_name?: string
}

/** SSE 私信推送事件数据 */
export type SSEDirectMessage = {
  sender_id: string
  sender_name: string
  receiver_id: string
  receiver_name: string
  message: string
  source: MessageSourceValue
  is_read: boolean
}
