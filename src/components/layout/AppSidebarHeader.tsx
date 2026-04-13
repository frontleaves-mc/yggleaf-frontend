/**
 * AppSidebarHeader - 侧边栏顶部 Logo 区域
 *
 * 保留 Minecraft 风格的 clip-path 切角效果
 * 根据 mode 显示不同副标题
 */

import { cn } from '#/lib/utils'
import { SidebarHeader } from '#/components/ui/sidebar'

interface AppSidebarHeaderProps {
  mode: 'user' | 'admin'
}

const MODE_LABELS: Record<string, string> = {
  user: 'Minecraft 认证平台',
  admin: '管理控制台',
}

export function AppSidebarHeader({ mode }: AppSidebarHeaderProps) {
  return (
    <SidebarHeader className="p-3">
      <div className="flex items-center gap-3 rounded-2xl border border-sidebar-border/60 bg-sidebar-accent/35 px-3 py-3 shadow-[inset_0_1px_0_oklch(1_0_0_/_0.45)]">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center",
            "bg-gradient-to-br from-[var(--diamond)] to-[var(--diamond-deep)]",
            "text-white text-sm font-bold shadow-md shadow-[var(--diamond)]/20",
            "transition-all duration-300 hover:shadow-lg hover:shadow-[var(--diamond)]/30",
          )}
          style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
        >
          Y
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold tracking-tight leading-tight text-sidebar-foreground">
            Yggleaf
          </p>
          <p className="mt-0.5 text-[11px] font-medium leading-tight uppercase tracking-[0.16em] text-sidebar-foreground/50">
            {MODE_LABELS[mode]}
          </p>
        </div>
      </div>
    </SidebarHeader>
  )
}
