/**
 * 管理员端 - 用户详情页共享子组件
 * MC 风格：nether + gold 配色
 */

import type { ElementType, ReactNode } from 'react'
import { cn } from '#/lib/utils'
import { McCard } from '#/components/shared/mc-card'
import { McBadge } from '#/components/shared/mc-badge'
import { McIconBox } from '#/components/shared/mc-icon-box'

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

// ─── 子组件：信息展示行（MC 风格） ──────────────────────────

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
    <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-4 py-3">
      <span className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
        <McIconBox variant="nether" size="sm">
          <Icon />
        </McIconBox>
        {label}
      </span>
      <span className="text-[13px] font-medium">{value}</span>
    </div>
  )
}

// ─── 子组件：配额进度条（MC 风格） ──────────────────────────

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
  // 接近满时用 nether 警告色，否则用 gold
  const isWarning = pct >= 80
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums font-medium">
          {used} / {total}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isWarning ? 'bg-mc-nether' : 'bg-mc-gold',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
