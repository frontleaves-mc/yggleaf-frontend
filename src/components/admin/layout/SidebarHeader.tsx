/**
 * SidebarHeader - 侧边栏顶部 Logo 区域
 * 深色常驻背景，品牌色为 lagoon 渐变
 */

import { cn } from '#/lib/utils'
import { X } from 'lucide-react'
import { APP_NAME } from '#/config/constants'

interface SidebarHeaderProps {
  collapsed: boolean
  onClose: () => void
  isMobile?: boolean
}

export function SidebarHeader({ collapsed, onClose, isMobile }: SidebarHeaderProps) {
  return (
    <div className="flex h-[60px] items-center justify-between px-3">
      {/* Logo / 品牌名 */}
      <div className="flex items-center gap-3 overflow-hidden min-w-0">
        {/* Logo 图标：切角方块 + lagoon 渐变 */}
        <div
          className={cn(
            "flex shrink-0 items-center justify-center text-white font-bold shadow-lg shadow-[var(--lagoon)]/15",
            "bg-gradient-to-br from-[var(--lagoon)] to-[var(--lagoon-deep)]",
            "transition-all duration-300",
            "hover:rotate-6 hover:shadow-xl hover:shadow-[var(--lagoon)]/25",
            collapsed && !isMobile ? "h-10 w-10 text-base rounded-lg" : "h-9 w-9 text-sm rounded-xl",
          )}
          style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
        >
          Y
        </div>

        {/* 品牌名：折叠时优雅消失 */}
        <div
          className={cn(
            "min-w-0 overflow-hidden transition-all duration-280",
            collapsed && !isMobile ? "opacity-0 w-0" : "opacity-100",
          )}
        >
          <p className="truncate font-semibold text-[15px] tracking-tight text-white leading-tight">
            {APP_NAME}
          </p>
          <p className="text-[11px] text-white/30 leading-tight mt-0.5">
            Minecraft 管理平台
          </p>
        </div>
      </div>

      {/* 移动端关闭按钮 */}
      {isMobile && (
        <button
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/60"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
