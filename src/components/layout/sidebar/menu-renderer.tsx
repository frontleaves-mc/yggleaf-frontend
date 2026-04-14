/**
 * SidebarMenuRenderer - 配置驱动的侧边栏菜单渲染器
 *
 * 基于 shadcn Sidebar 组件体系，支持：
 *   - 平铺菜单项（直接链接）
 *   - 嵌套子菜单（Collapsible 折叠）
 *   - 激活状态检测（基于 TanStack Router 当前路径）
 *   - Badge 角标
 *   - 折叠模式下的 Tooltip 提示
 */

import { Link, useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ChevronRight,
  type LucideIcon as LucideIconType,
} from 'lucide-react'
import { cn } from '#/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '#/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '#/components/ui/sidebar'

// ─── 类型定义 ────────────────────────────────────────────

export interface MenuConfig {
  /** 唯一标识 */
  key: string
  /** 显示标签 */
  label: string
  /** 图标 */
  icon: LucideIcon | LucideIconType
  /** 路由路径 */
  to?: string
  /** 子菜单 */
  children?: MenuConfig[]
  /** 通知角标 */
  badge?: number | string
}

// ─── 组件 ────────────────────────────────────────────────

interface SidebarMenuRendererProps {
  items: MenuConfig[]
}

export function SidebarMenuRenderer({ items }: SidebarMenuRendererProps) {
  const location = useLocation()

  /** 判断给定路径是否为当前激活路径或其父路径 */
  const isActive = (to?: string): boolean => {
    if (!to) return false
    const pathname = location.pathname
    return pathname === to || pathname.startsWith(to + '/')
  }

  /** 检查子菜单中是否有激活项 */
  const hasActiveChild = (children?: MenuConfig[]): boolean => {
    if (!children) return false
    return children.some((child) => isActive(child.to) || hasActiveChild(child.children))
  }

  return (
    <SidebarGroup className="py-2 group-data-[collapsible=icon]:p-2">
      <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:items-center">
        {items.map((item) =>
          item.children ? (
            <CollapsibleMenuItem
              key={item.key}
              item={item}
              defaultOpen={hasActiveChild(item.children)}
            />
          ) : (
            <FlatMenuItem
              key={item.key}
              item={item}
              active={isActive(item.to)}
            />
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}

// ─── 子组件：平铺菜单项 ─────────────────────────────────

function FlatMenuItem({
  item,
  active,
}: {
  item: MenuConfig
  active: boolean
}) {
  const Icon = item.icon

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={item.label}
      >
        <Link to={item.to}>
          <Icon className={cn("size-4", active && "text-sidebar-primary")} />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
      {item.badge != null && (
        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  )
}

// ─── 子组件：可折叠子菜单 ───────────────────────────────

function CollapsibleMenuItem({
  item,
  defaultOpen,
}: {
  item: MenuConfig
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const location = useLocation()
  const Icon = item.icon

  /** 判断给定路径是否为当前激活路径 */
  const isActivePath = (to?: string): boolean => {
    if (!to) return false
    const pathname = location.pathname
    return pathname === to || pathname.startsWith(to + '/')
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.label}>
            <Icon className="size-4" />
            <span>{item.label}</span>
            <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map((child) => (
              <SidebarMenuSubItem key={child.key}>
                <SidebarMenuSubButton asChild isActive={isActivePath(child.to)}>
                  <Link to={child.to}>
                    <child.icon className={cn("size-4", isActivePath(child.to) && "text-sidebar-primary")} />
                    <span>{child.label}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
