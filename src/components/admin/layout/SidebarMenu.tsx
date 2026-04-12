/**
 * SidebarMenu - 侧边栏菜单渲染器
 * 支持嵌套子菜单、激活状态高亮
 * 深色常驻背景配色
 */

import { useLocation } from '@tanstack/react-router'
import { cn } from '#/lib/utils'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { MenuItem } from '#/config/menu'
import { adminMenuItems } from '#/config/menu'
import { SidebarMenuItem } from './SidebarMenuItem'

interface SidebarMenuProps {
  collapsed: boolean
  onItemClick?: () => void
}

export function SidebarMenu({ collapsed, onItemClick }: SidebarMenuProps) {
  const location = useLocation()
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    for (const item of adminMenuItems) {
      if (item.children?.some((c) => location.pathname.startsWith(c.to ?? ''))) {
        initial.add(item.key)
      }
    }
    return initial
  })

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const isActivePath = (path?: string) => {
    if (!path) return false
    return location.pathname === path || location.pathname === path + '/'
  }

  const hasActiveChild = (item: MenuItem): boolean => {
    if (!item.children) return isActivePath(item.to)
    return item.children.some((child) => isActivePath(child.to))
  }

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isActive = isActivePath(item.to)
    const isExpanded = expandedKeys.has(item.key)
    const childActive = hasActiveChild(item)

    if (hasChildren) {
      return (
        <div key={item.key}>
          <button
            onClick={() => toggleExpand(item.key)}
            className={cn(
              "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
              "text-white/50",
              "hover:bg-white/[0.05] hover:text-white/80",
              childActive && "!text-white/80",
              collapsed && "justify-center px-2.5",
            )}
          >
            <item.icon
              className={cn(
                "h-[18px] w-[18px] shrink-0 transition-colors",
                childActive ? "text-[var(--lagoon)]" : "text-white/30 group-hover:text-white/50",
              )}
            />

            {!collapsed && (
              <>
                <span className="truncate font-medium text-[13px]">{item.label}</span>
                <ChevronDown
                  className={cn(
                    "ml-auto h-3.5 w-3.5 shrink-0 text-white/20 transition-transform duration-200",
                    isExpanded && "rotate-180",
                  )}
                />
              </>
            )}
          </button>

          {!collapsed && isExpanded && (
            <div className="mt-0.5 space-y-px pl-3 border-l border-white/[0.06] ml-[22px]">
              {item.children!.map((child) => renderMenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <SidebarMenuItem
        key={item.key}
        item={item}
        collapsed={collapsed}
        isActive={isActive}
        depth={depth}
        onClick={onItemClick}
      />
    )
  }

  return (
    <nav className="space-y-0.5 px-2.5">
      {adminMenuItems.map((item) => renderMenuItem(item))}
    </nav>
  )
}
