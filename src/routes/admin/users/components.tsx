/**
 * 管理员端 - 用户详情页共享子组件
 */

import type { ElementType, ReactNode } from 'react'

// ─── 动画常量 ─────────────────────────────────────────────

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

export const fadeUpItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

// ─── 工具函数 ──────────────────────────────────────────────

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── 子组件：信息展示行 ────────────────────────────────────

export function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
      <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="text-[13px] font-medium">{value}</span>
    </div>
  )
}

// ─── 子组件：配额进度条 ────────────────────────────────────

export function QuotaBar({
  label,
  used,
  total,
}: {
  label: string
  used: number
  total: number
}) {
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums font-medium">
          {used} / {total}
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
