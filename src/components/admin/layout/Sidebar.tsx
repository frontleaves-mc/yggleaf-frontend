/**
 * Sidebar - 管理后台左侧导航栏（深色常驻）
 * 包含：Header(Logo) / Menu(菜单) / Footer(折叠按钮)
 *
 * 设计:
 *   - 深色背景不随主题切换，始终使用 #111f23
 *   - 统一 clip-path 切角语言 (致敬 Minecraft 方块)
 *   - 滚动条完全隐藏但保留滚动能力
 */

import { SidebarHeader } from './SidebarHeader'
import { SidebarMenu } from './SidebarMenu'
import { SidebarFooter } from './SidebarFooter'
import { cn } from '#/lib/utils'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  onMobileClose: () => void
  isMobile?: boolean
}

export function Sidebar({ collapsed, onToggleCollapse, onMobileClose, isMobile }: SidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col",
        "bg-[#111f23]",
        "border-r border-white/[0.04]",
        isMobile && "shadow-2xl shadow-black/20",
      )}
    >
      {/* 顶部渐变光条 */}
      <div className="h-px shrink-0 bg-gradient-to-r from-transparent via-[var(--lagoon)]/20 to-transparent" />

      {/* Logo 区域 */}
      <SidebarHeader collapsed={collapsed} onClose={onMobileClose} isMobile={isMobile} />

      {/* 分隔线 */}
      <div className="mx-3 shrink-0 h-px bg-white/[0.06]" />

      {/* 菜单区域（可滚动，隐藏滚动条） */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-none">
        <SidebarMenu collapsed={collapsed} onItemClick={isMobile ? onMobileClose : undefined} />
      </div>

      {/* 底部折叠按钮区域 */}
      {!isMobile && (
        <>
          <div className="mx-3 shrink-0 h-px bg-white/[0.04]" />
          <div className="shrink-0 p-3">
            <SidebarFooter collapsed={collapsed} onToggle={onToggleCollapse} />
          </div>
        </>
      )}
    </div>
  )
}
