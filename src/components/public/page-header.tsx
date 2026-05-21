/**
 * PageHeader - 页面标题组件（MC 风格增强版）
 *
 * 统一的页面头部：图标 + 标题 + 描述 + 操作按钮区
 * 支持可选的 MC 风格图标容器装饰和渐变下划线
 *
 * Design: 清晰的信息层级 + MC 风格装饰 + 底部分隔线
 */

import type { LucideIcon } from 'lucide-react'
import { cn } from '#/lib/utils'
import { McIconBox } from '#/components/shared/mc-icon-box'

interface PageHeaderProps {
  title?: string
  description?: string
  /** 可选的页面图标，使用 McIconBox (grass 配色) 包裹展示 */
  icon?: LucideIcon
  children?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          {Icon && (
            <McIconBox variant="grass" size="md" className="shrink-0">
              <Icon />
            </McIconBox>
          )}
          <div className={cn(!Icon && 'w-full')}>
            {title && (
              <h1 className="text-[22px] font-bold tracking-tight text-foreground sm:text-[24px]">
                {title}
              </h1>
            )}
            {title && (
              <span className="mt-1.5 block h-[2px] w-12 rounded-full bg-gradient-to-r from-[var(--color-mc-grass)] to-transparent opacity-60" />
            )}
            {description && (
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-2.5 shrink-0 mt-2 sm:mt-0">
          {children}
        </div>
      )}
    </div>
  )
}
