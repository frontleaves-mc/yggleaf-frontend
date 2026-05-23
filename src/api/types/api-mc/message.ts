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

export type MessageSourceValue = (typeof MessageSource)[keyof typeof MessageSource]

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
