/**
 * SidebarHeader - 侧边栏顶部 Logo 区域
 *
 * 展开时：Logo + 标题 + 副标题
 * 折叠时：仅显示 Logo 图标
 */

import {
  SidebarHeader as SidebarHeaderRoot,
  useSidebar,
} from '#/components/ui/sidebar'
import { cn } from '#/lib/utils'

interface SidebarHeaderProps {
  mode: 'user' | 'admin'
}

const MODE_LABELS: Record<string, string> = {
  user: '我的世界社区中心',
  admin: '管理控制台',
}

export function SidebarHeader({ mode }: SidebarHeaderProps) {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <SidebarHeaderRoot className="relative overflow-hidden p-3">
      <div
        className={cn(
          'pointer-events-none rounded-lg absolute inset-0',
          'bg-[radial-gradient(ellipse_at_top_left,var(--mc-grass-soft),transparent_60%)]',
        )}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-0 left-3 right-3 h-px"
        style={{
          background: 'linear-gradient(90deg in oklch, transparent, var(--mc-grass), var(--mc-diamond), transparent)',
          opacity: 0.5,
        }}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative flex items-center gap-3',
          !isCollapsed && 'px-1',
        )}
      >
        <img
          src="/favicon.png"
          alt="Yggleaf"
          className={cn(
            'shrink-0 rounded-lg object-cover',
            'shadow-[0_2px_8px_-4px_oklch(from_var(--mc-grass)_l_c_h/0.30)]',
            'ring-1 ring-oklch(from_var(--mc-grass)_l_c_h/_0.15)',
            'transition-all duration-300 ease-out',
            isCollapsed ? 'mx-auto size-9' : 'size-10',
          )}
        />

        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <p className={cn(
              'truncate font-heading text-base font-bold tracking-tight leading-tight mc-gradient-text',
            )}>
              锋楪游戏
            </p>
            <p
              className={cn(
                'mt-0.5 text-xs font-medium leading-tight uppercase tracking-[0.16em]',
                'text-sidebar-primary/70',
              )}
            >
              {MODE_LABELS[mode]}
            </p>
          </div>
        )}
      </div>
    </SidebarHeaderRoot>
  )
}
