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
    <SidebarHeader className="border-b border-sidebar-border">
      {/* Logo + 品牌名 */}
      <div className="flex h-[60px] items-center gap-3 overflow-hidden px-2">
        {/* Logo：切角方块 + 钻石蓝渐变 */}
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl",
            "bg-gradient-to-br from-[var(--diamond)] to-[var(--diamond-deep)]",
            "text-white text-sm font-bold shadow-lg shadow-[var(--diamond)]/15",
            "transition-all duration-300 hover:rotate-6 hover:shadow-xl hover:shadow-[var(--diamond)]/25",
          )}
          style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
        >
          Y
        </div>

        {/* 品牌名 */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold tracking-tight leading-tight text-sidebar-foreground">
            Yggleaf
          </p>
          <p className="text-[11px] leading-tight mt-0.5 text-sidebar-foreground/30">
            {MODE_LABELS[mode]}
          </p>
        </div>
      </div>
    </SidebarHeader>
  )
}
