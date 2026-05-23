'use client'

/**
 * ChatContainer - 聊天页面专用容器
 *
 * 纯静态布局容器，无 motion hover/tap 效果。
 * 对话界面不需要装饰性强调线，仅保留圆角边框。
 */

import { cn } from '#/lib/utils'

interface ChatContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ChatContainer({
  className,
  children,
  ...props
}: ChatContainerProps) {
  return (
    <div
      data-slot="chat-container"
      className={cn(
        'relative overflow-hidden rounded-xl',
        'border border-border/60 bg-card',
        'shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
