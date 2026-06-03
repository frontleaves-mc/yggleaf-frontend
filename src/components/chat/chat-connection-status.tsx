'use client'

/**
 * SSE 连接状态指示器
 * 绿色=已连接 / 红色=重连中 / 灰色=未连接
 */

interface ChatConnectionStatusProps {
  isConnected: boolean
  reconnectCount: number
}

export function ChatConnectionStatus({
  isConnected,
  reconnectCount,
}: ChatConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border/30 text-xs text-muted-foreground">
      <span
        className={`size-2 rounded-none shrink-0 ${
          isConnected
            ? 'bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]'
            : reconnectCount > 0
              ? 'bg-yellow-500 shadow-[0_0_4px_rgba(234,179,8,0.5)] animate-pulse'
              : 'bg-muted-foreground/40'
        }`}
      />
      <span>
        {isConnected
          ? '已连接'
          : reconnectCount > 0
            ? `重连中 (第 ${reconnectCount} 次)...`
            : '未连接'}
      </span>
    </div>
  )
}
