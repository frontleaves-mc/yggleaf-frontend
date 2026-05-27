'use client'

/**
 * 聊天消息列表组件
 * 可滚动消息列表，自动滚到底部 + 连续消息智能分组
 */

import { useEffect, useRef } from 'react'
import type { ChatLogResponse } from '#/api/types'
import { ChatMessageItem } from './chat-message-item'

interface ChatMessageListProps {
  messages: ChatLogResponse[]
  currentPlayerName?: string | null
}

export function ChatMessageList({
  messages,
  currentPlayerName,
}: ChatMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)

  const handleScroll = () => {
    const el = containerRef.current
    if (!el) return
    const threshold = 50
    isAtBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold
  }

  useEffect(() => {
    if (isAtBottomRef.current) {
      const el = containerRef.current
      if (el) {
        el.scrollTop = el.scrollHeight
      }
    }
  }, [messages.length])

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto min-h-0"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          暂无消息，等待连接...
        </div>
      ) : (
        <div className="py-2">
          {messages.map((msg, i) => {
            const prev = i > 0 ? messages[i - 1] : null
            const next = i < messages.length - 1 ? messages[i + 1] : null

            const sameSenderAsPrev = prev?.player_name === msg.player_name
            const sameSenderAsNext = next?.player_name === msg.player_name

            return (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                currentPlayerName={currentPlayerName}
                isFirstInGroup={!sameSenderAsPrev}
                isLastInGroup={!sameSenderAsNext}
                isSingleInGroup={!sameSenderAsPrev && !sameSenderAsNext}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
