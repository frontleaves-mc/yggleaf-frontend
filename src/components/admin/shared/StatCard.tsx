/**
 * StatCard - Dashboard 统计卡片组件
 * 用于展示关键指标数据
 *
 * Design:
 *   - 微妙的顶部渐变色条（lagoon 色系）
 *   - 图标区域采用柔和的渐变背景
 *   - 数字使用等宽字体 + 大号粗体
 *   - 整体卡片有轻微悬浮感
 */

import { cn } from '#/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[var(--border)]/60 bg-[var(--card)] p-5 sm:p-6",
        "transition-all duration-200 ease-out",
        "hover:border-[var(--border)] hover:shadow-lg hover:shadow-[var(--diamond)]/5",
        className,
      )}
    >
      {/* 顶部装饰线 — lagoon 渐变 */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[var(--diamond)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-center justify-between gap-4">
        {/* 左侧：数据 */}
        <div className="space-y-1.5 min-w-0">
          <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--muted-foreground)]/80">
            {title}
          </p>
          <p className="text-[28px] font-bold tracking-tight text-[var(--foreground)] tabular-nums leading-none sm:text-[32px]">
            {value}
          </p>
          {(trendValue || description) && (
            <div className="flex items-center gap-2 pt-0.5">
              {trendValue && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                    trend === 'up' &&
                      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                    trend === 'down' &&
                      "bg-red-500/10 text-red-500 dark:text-red-400",
                    (!trend || trend === 'neutral') &&
                      "bg-[var(--muted)] text-[var(--muted-foreground)]",
                  )}
                >
                  {trend === 'up' && '↑'}
                  {trend === 'down' && '↓'}
                  {' '}
                  {trendValue}
                </span>
              )}
              {description && !trendValue && (
                <span className="text-[12px] text-[var(--muted-foreground)]/70">{description}</span>
              )}
            </div>
          )}
        </div>

        {/* 右侧：图标 */}
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110",
            // 图标背景：柔和的 lagoon 色调
            "bg-gradient-to-br from-[var(--diamond)]/10 via-[var(--diamond-deep)]/8 to-[var(--diamond)]/5",
          )}
        >
          <Icon className="h-5.5 w-5.5 text-[var(--diamond-deep)]" />
        </div>
      </div>
    </div>
  )
}
