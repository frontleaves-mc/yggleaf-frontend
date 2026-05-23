'use client'

/**
 * 单条聊天消息组件 — MC 游戏内风格
 * 紧凑格式：[Server] PlayerName: message
 */

import type { ChatLogResponse } from '#/api/types'
import { PlayerName } from './player-name'
import { Monitor } from 'lucide-react'

interface ChatMessageItemProps {
  message: ChatLogResponse
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isWeb = message.source === 2

  return (
    <div className="flex items-start gap-1 px-3 py-0.5 text-sm leading-relaxed hover:bg-white/[0.03] transition-colors">
      {/* 来源标识 */}
      {isWeb && (
        <Monitor className="size-3 mt-1 text-blue-400/70 shrink-0" />
      )}

      {/* 服务器标签 */}
      {message.server_name && (
        <span className="text-muted-foreground/70 text-xs shrink-0">
          [{message.server_name}]
        </span>
      )}

      {/* 玩家名 */}
      <PlayerName name={message.player_name} />

      {/* 分隔符 */}
      <span className="text-muted-foreground/50 shrink-0">:</span>

      {/* 消息内容 */}
      <span className="text-foreground/90 break-all">{message.message}</span>
    </div>
  )
}
