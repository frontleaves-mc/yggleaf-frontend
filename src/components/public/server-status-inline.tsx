/**
 * 服务器状态指示条
 *
 * 嵌入欢迎区域的排布式状态条，非卡片方案。
 * 管理员可见 TPS，普通用户仅可见在线玩家和在线状态。
 */

import type { ServerStatusResponse } from '#/api/types/api-mc/server-status'

function formatRelativeTime(timestamp: number): string {
  const ts = timestamp > 1e12 ? timestamp : timestamp * 1000
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 0) return '刚刚'
  if (diff < 60) return `${diff}秒前`
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  return `${Math.floor(diff / 86400)}天前`
}

type ServerStatusBarProps = {
  server: ServerStatusResponse | undefined
  isLoading: boolean
  showTps?: boolean
}

export function ServerStatusBar({
  server,
  isLoading,
  showTps = false,
}: ServerStatusBarProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-6">
        <div className="h-4 w-16 animate-pulse rounded bg-muted-foreground/10" />
        <div className="h-4 w-12 animate-pulse rounded bg-muted-foreground/10" />
        {showTps && (
          <div className="h-4 w-10 animate-pulse rounded bg-muted-foreground/10" />
        )}
      </div>
    )
  }

  if (!server) {
    return (
      <span className="text-[13px] tracking-wide text-muted-foreground/40">
        暂无服务器数据
      </span>
    )
  }

  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
      <StatusItem
        label="STATUS"
        value={server.online ? 'ONLINE' : 'OFFLINE'}
        valueClassName={
          server.online
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-red-600 dark:text-red-400'
        }
      >
        {server.online && (
          <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
        )}
      </StatusItem>

      <StatusItem label="PLAYERS" value={`${server.online_players} 在线`}>
        {server.online_players > 0 && (
          <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary/60" />
        )}
      </StatusItem>

      {showTps && (
        <StatusItem
          label="TPS"
          value={server.tps.toFixed(1)}
          valueClassName={
            server.tps >= 19
              ? 'text-emerald-600 dark:text-emerald-400'
              : server.tps >= 15
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-red-600 dark:text-red-400'
          }
        />
      )}

      <span className="text-[11px] tabular-nums text-muted-foreground/35">
        last heartbeat {formatRelativeTime(server.last_heartbeat)}
      </span>
    </div>
  )
}

function StatusItem({
  label,
  value,
  valueClassName,
  children,
}: {
  label: string
  value: string
  valueClassName?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/35">
        {label}
      </span>
      <span
        className={`flex items-center text-[13px] font-semibold tabular-nums ${valueClassName ?? 'text-foreground/80'}`}
      >
        {children}
        {value}
      </span>
    </div>
  )
}
