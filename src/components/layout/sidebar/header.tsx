/**
 * SidebarHeader - 侧边栏顶部 Logo 区域
 *
 * 展开时：Logo + 标题 + 副标题
 * 折叠时：仅显示 Logo 图标
 */

import { useSidebar, SidebarHeader as SidebarHeaderRoot } from '#/components/ui/sidebar'
import { cn } from '#/lib/utils'

interface SidebarHeaderProps {
  mode: 'user' | 'admin'
}

const MODE_LABELS: Record<string, string> = {
  user: 'Minecraft 认证平台',
  admin: '管理控制台',
}

export function SidebarHeader({ mode }: SidebarHeaderProps) {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <SidebarHeaderRoot className="p-3">
      <div className={cn('flex items-center gap-3', !isCollapsed && 'px-1')}>
        <div
          className={cn(
            'flex shrink-0 items-center justify-center',
            'bg-linear-to-br from-primary to-primary',
            'text-white font-bold shadow-md shadow-primary/20',
            'transition-all duration-300 hover:shadow-lg hover:shadow-primary/30',
            isCollapsed ? 'mx-auto size-8 text-xs' : 'size-9 text-sm',
          )}
          style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
        >
          Y
        </div>

        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold tracking-tight leading-tight text-sidebar-foreground">
              Yggleaf
            </p>
            <p className="mt-0.5 text-[11px] font-medium leading-tight uppercase tracking-[0.16em] text-sidebar-foreground/50">
              {MODE_LABELS[mode]}
            </p>
          </div>
        )}
      </div>
    </SidebarHeaderRoot>
  )
}
