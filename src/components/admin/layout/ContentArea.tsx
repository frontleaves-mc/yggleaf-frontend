/**
 * ContentArea - 内容区域包装器
 *
 * 深度优化:
 *   - 更合理的内边距（移动端紧凑，桌面端宽敞）
 *   - 隐藏滚动条但保留功能
 *   - max-w-6xl 约束内容宽度，保持可读性
 */

import { cn } from '#/lib/utils'

interface ContentAreaProps {
  children: React.ReactNode
  className?: string
}

export function ContentArea({ children, className }: ContentAreaProps) {
  return (
    <main
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden",
        "bg-[var(--background)]",
        "p-4 sm:p-6 lg:p-8",
        // 自定义滚动条（在 admin-layout 内生效）
        "scrollbar-thin",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </main>
  )
}
