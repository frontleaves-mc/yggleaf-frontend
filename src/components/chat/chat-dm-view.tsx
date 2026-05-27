'use client'

/**
 * 私聊对话视图组件
 * 选中私聊会话时的聊天区域，复用 ChatMessageList + ChatInput
 */

import { useMemo } from 'react'
import { Loader2, MessageSquare } from 'lucide-react'
import { useDirectMessages } from '#/api/endpoints/api-mc/user-message'
import type { DirectMessageResponse, ChatLogResponse } from '#/api/types'
import { ChatMessageList } from './chat-message-list'
import { ChatInput } from './chat-input'

// ─── Props ──────────────────────────────────────────────

interface ChatDMViewProps {
  targetUserId: string
  targetUserName: string
  currentUserId: string
  currentPlayerName: string
  onSend: (message: string) => void
  sendPending: boolean
}

// ─── DM → ChatLog 映射 ──────────────────────────────────

function dmToChatLog(
  dm: DirectMessageResponse,
  currentUserId: string,
  currentPlayerName: string,
): ChatLogResponse {
  const isSelf = dm.sender_id === currentUserId
  return {
    id: dm.id,
    player_uuid: isSelf ? currentUserId : dm.sender_id,
    player_name: isSelf ? currentPlayerName : dm.sender_name,
    server_name: '',
    world_name: '',
    message: dm.message,
    source: dm.source,
  }
}

// ─── 组件 ────────────────────────────────────────────────

export function ChatDMView({
  targetUserId,
  targetUserName,
  currentUserId,
  currentPlayerName,
  onSend,
  sendPending,
}: ChatDMViewProps) {
  const { data, isLoading } = useDirectMessages({
    target_user: targetUserId,
    page_size: 50,
  })

  const messages: ChatLogResponse[] = useMemo(() => {
    if (!data?.list) return []
    return data.list.map((dm) =>
      dmToChatLog(dm, currentUserId, currentPlayerName),
    )
  }, [data?.list, currentUserId, currentPlayerName])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground/50" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* 对话对象标题 */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30">
        <MessageSquare className="size-3.5 text-muted-foreground/50" />
        <span className="text-xs text-muted-foreground/70">
          与 {targetUserName} 的对话
        </span>
      </div>

      {/* 消息列表 */}
      <ChatMessageList
        messages={messages}
        currentPlayerName={currentPlayerName}
      />

      {/* 输入框 */}
      <ChatInput onSend={onSend} disabled={sendPending} />
    </div>
  )
}
