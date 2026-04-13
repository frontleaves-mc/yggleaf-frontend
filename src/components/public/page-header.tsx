/**
 * PageHeader - 页面标题组件
 * 统一的页面头部：标题 + 描述 + 操作按钮区
 *
 * Design: 清晰的信息层级 + 底部分隔线
 */

import { cn } from '#/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="text-[22px] font-bold tracking-tight text-foreground sm:text-[24px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2.5 shrink-0 mt-2 sm:mt-0">
          {children}
        </div>
      )}
    </div>
  )
}
