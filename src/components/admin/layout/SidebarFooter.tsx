/**
 * SidebarFooter - 侧边栏底部区域
 * 折叠/展开切换按钮 + 版本信息
 * 深色常驻背景配色
 */

import { cn } from '#/lib/utils'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { APP_VERSION } from '#/config/constants'

interface SidebarFooterProps {
  collapsed: boolean
  onToggle: () => void
}

export function SidebarFooter({ collapsed, onToggle }: SidebarFooterProps) {
  return (
    <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between gap-2")}>
      {/* 版本号（仅展开时显示） */}
      <span
        className={cn(
          "text-[11px] leading-none text-white/15 tabular-nums font-mono transition-all duration-280",
          collapsed && "opacity-0 w-0 overflow-hidden absolute",
        )}
      >
        v{APP_VERSION}
      </span>

      {/* 折叠切换按钮 */}
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center justify-center rounded-lg",
          "text-white/20",
          "hover:bg-white/[0.06] hover:text-white/50",
          "active:scale-95",
          "transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lagoon)]/30",
          collapsed ? "h-9 w-9" : "h-8 w-8",
        )}
        title={collapsed ? '展开侧边栏' : '收起侧边栏'}
        aria-label={collapsed ? '展开侧边栏' : '收起侧边栏'}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-[18px] w-[18px]" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}
