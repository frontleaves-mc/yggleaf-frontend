'use client'

/**
 * 聊天输入组件
 * 底部固定输入框 + 发送按钮
 */

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Button } from '#/components/ui/button'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

const MAX_LENGTH = 500

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    // 发送后重新聚焦
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // 挂载时自动聚焦
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-t border-border/40">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, MAX_LENGTH))}
        onKeyDown={handleKeyDown}
        placeholder="输入消息..."
        disabled={disabled}
        maxLength={MAX_LENGTH}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 disabled:opacity-50"
      />
      <span className="text-[11px] text-muted-foreground/50 tabular-nums min-w-[3rem] text-right">
        {value.length}/{MAX_LENGTH}
      </span>
      <Button
        variant="gradient"
        size="sm"
        className="h-7 px-3 text-xs gap-1"
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
      >
        <Send className="size-3" />
        发送
      </Button>
    </div>
  )
}
