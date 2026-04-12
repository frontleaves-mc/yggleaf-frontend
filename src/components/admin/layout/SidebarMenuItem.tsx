/**
 * SidebarMenuItem - 单个菜单项组件
 * 深色常驻背景，lagoon 强调色激活态
 */

import { Link } from '@tanstack/react-router'
import { cn } from '#/lib/utils'
import { Badge } from '#/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip'
import type { MenuItem } from '#/config/menu'

interface SidebarMenuItemProps {
  item: MenuItem
  collapsed: boolean
  isActive: boolean
  depth: number
  onClick?: () => void
}

export function SidebarMenuItem({ item, collapsed, isActive, depth, onClick }: SidebarMenuItemProps) {
  const content = (
    <Link
      to={item.to!}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg text-sm transition-all duration-180",
        "h-9 px-3",
        // 激活态：左侧指示线 + lagoon 半透明背景
        isActive && [
          "bg-[var(--lagoon)]/12",
          "text-white font-semibold",
          "shadow-[inset_0_0_0_1px_rgba(56,197,181,0.08)]",
        ],
        // 非激活态
        !isActive && "text-white/50 hover:bg-white/[0.05] hover:text-white/80",
        // 折叠模式居中
        collapsed && "justify-center px-2.5",
        // 子菜单缩进
        depth > 0 && !collapsed && "pl-3",
      )}
    >
      {/* 左侧激活指示线 */}
      <span
        className={cn(
          "absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 transition-all duration-200",
          isActive
            ? "bg-[var(--lagoon)] opacity-100 rounded-full"
            : "bg-[var(--lagoon)] opacity-0 group-hover:opacity-20",
        )}
      />

      {/* 图标 */}
      <item.icon
        className={cn(
          "h-[17px] w-[17px] shrink-0 transition-colors duration-150",
          isActive
            ? "text-[var(--lagoon)]"
            : "text-white/30 group-hover:text-white/50",
        )}
      />

      {/* 文字 + Badge */}
      {!collapsed && (
        <>
          <span className="truncate flex-1 text-[13px]">{item.label}</span>
          {item.badge !== undefined && (
            <Badge
              variant="secondary"
              className="h-[18px] min-w-[18px] bg-white/[0.08] text-white/60 px-1 text-[10px] font-semibold tabular-nums border-0"
            >
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip delayDuration={80}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent
          side="right"
          className="font-medium text-xs px-2.5 py-1.5 bg-[#1b353b] text-white border-white/10"
          sideOffset={10}
        >
          {item.label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}
