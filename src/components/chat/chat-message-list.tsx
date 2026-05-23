'use client'

/**
 * 聊天消息列表组件
 * 可滚动消息列表，支持自动滚到底部
 */

import { useEffect, useRef } from 'react'
import type { ChatLogResponse } from '#/api/types'
import { ChatMessageItem } from './chat-message-item'

interface ChatMessageListProps {
  messages: ChatLogResponse[]
}

export function ChatMessageList({ messages }: ChatMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)

  // 检测用户是否在底部
  const handleScroll = () => {
    const el = containerRef.current
    if (!el) return
    const threshold = 50
    isAtBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold
  }

  // 新消息时自动滚到底部
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
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}
        </div>
      )}
    </div>
  )
}
