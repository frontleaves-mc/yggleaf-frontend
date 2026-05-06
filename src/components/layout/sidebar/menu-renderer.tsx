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
import type { LucideIcon, LucideIcon as LucideIconType } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useUserInfoSync } from '#/api/endpoints/api-auth/user'
import type { RoleName } from '#/api/types'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '#/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '#/components/ui/sidebar'
import { cn } from '#/lib/utils'

// ─── 类型定义 ────────────────────────────────────────────

export interface MenuConfig {
  key: string
  label: string
  icon: LucideIcon | LucideIconType
  to?: string
  children?: MenuConfig[]
  badge?: number | string
  roles?: readonly RoleName[]
}

export interface MenuSectionConfig {
  key: string
  label?: string
  items: MenuConfig[]
}

// ─── 权限过滤 Hook ──────────────────────────────────────

export function useFilteredMenuItems(items: MenuConfig[]): MenuConfig[] {
  const userInfo = useUserInfoSync()
  const role = userInfo?.user?.role_name

  return useMemo(() => filterByRole(items, role), [items, role])
}

export function useFilteredMenuSections(
  sections: MenuSectionConfig[],
): MenuSectionConfig[] {
  const userInfo = useUserInfoSync()
  const role = userInfo?.user?.role_name

  return useMemo(() => {
    const filtered = sections.map((section) => ({
      ...section,
      items: filterByRole(section.items, role),
    }))
    return filtered.filter((s) => s.items.length > 0)
  }, [sections, role])
}

function filterByRole(
  items: MenuConfig[],
  role: RoleName | undefined,
): MenuConfig[] {
  return items
    .map((item) => {
      if (item.roles?.length && !item.roles.includes(role!)) return null

      if (item.children?.length) {
        const filteredChildren = filterByRole(item.children, role)
        if (filteredChildren.length === 0 && !item.to) return null
        return { ...item, children: filteredChildren }
      }

      return item
    })
    .filter((item): item is MenuConfig => item !== null)
}

// ─── 组件 ────────────────────────────────────────────────

interface SidebarMenuRendererProps {
  sections?: MenuSectionConfig[]
  items?: MenuConfig[]
  mode?: 'user' | 'admin'
}

function matchPath(pathname: string, to?: string): boolean {
  if (!to) return false
  return pathname === to || pathname.startsWith(to + '/')
}

function checkActiveChildren(
  pathname: string,
  children?: MenuConfig[],
): boolean {
  if (!children) return false
  return children.some(
    (child) =>
      matchPath(pathname, child.to) ||
      checkActiveChildren(pathname, child.children),
  )
}

export function SidebarMenuRenderer({
  sections,
  items,
  mode = 'user',
}: SidebarMenuRendererProps) {
  const location = useLocation()
  const pathname = location.pathname

  const filteredItems = useFilteredMenuItems(items ?? [])
  const filteredSections = useFilteredMenuSections(sections ?? [])

  const isActive = (to?: string): boolean => matchPath(pathname, to)
  const hasActiveChild = (children?: MenuConfig[]): boolean =>
    checkActiveChildren(pathname, children)

  if (sections && sections.length > 0) {
    return (
      <SidebarSectionedMenu
        sections={filteredSections}
        mode={mode}
        isActive={isActive}
        hasActiveChild={hasActiveChild}
      />
    )
  }

  return (
    <SidebarGroup className="py-2 group-data-[collapsible=icon]:p-2">
      <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:items-center">
        {filteredItems.map((item) =>
          item.children ? (
            <CollapsibleMenuItem
              key={item.key}
              item={item}
              defaultOpen={hasActiveChild(item.children)}
              mode={mode}
            />
          ) : (
            <FlatMenuItem
              key={item.key}
              item={item}
              active={isActive(item.to)}
              mode={mode}
            />
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function SidebarSectionedMenu({
  sections,
  mode,
  isActive,
  hasActiveChild,
}: {
  sections: MenuSectionConfig[]
  mode: 'user' | 'admin'
  isActive: (to?: string) => boolean
  hasActiveChild: (children?: MenuConfig[]) => boolean
}) {
  return (
    <>
      {sections.map((section) => (
        <SidebarGroup
          key={section.key}
          className="py-2 group-data-[collapsible=icon]:p-2"
        >
          {section.label && (
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              {section.label}
            </SidebarGroupLabel>
          )}
          <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:items-center">
            {section.items.map((item) =>
              item.children ? (
                <CollapsibleMenuItem
                  key={item.key}
                  item={item}
                  defaultOpen={hasActiveChild(item.children)}
                  mode={mode}
                />
              ) : (
                <FlatMenuItem
                  key={item.key}
                  item={item}
                  active={isActive(item.to)}
                  mode={mode}
                />
              ),
            )}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}

// ─── 子组件：平铺菜单项 ─────────────────────────────────

function FlatMenuItem({
  item,
  active,
  mode,
}: {
  item: MenuConfig
  active: boolean
  mode: 'user' | 'admin'
}) {
  const Icon = item.icon
  const activeBg =
    'bg-gradient-to-r from-sidebar-primary/12 to-sidebar-primary/6 shadow-[inset_0_0_0_1px_oklch(from_var(--sidebar-primary)_l_c_h_/_0.10)]'
  const activeIcon =
    'text-sidebar-primary drop-shadow-[0_0_6px_oklch(from_var(--sidebar-primary)_l_c_h_/_0.30)]'

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={item.label}
        className={cn(
          'relative rounded-lg my-[1px] transition-all duration-200 ease-out',
          active && [activeBg, 'text-sidebar-foreground'],
          '!hover:bg-sidebar-accent/80 !hover:shadow-sm',
        )}
      >
        <Link to={item.to}>
          <span
            className={cn(
              'flex size-4 shrink-0 items-center justify-center rounded-md transition-all duration-200',
              active && activeIcon,
            )}
          >
            <Icon className="size-4" />
          </span>
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
      {item.badge != null && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
    </SidebarMenuItem>
  )
}

// ─── 子组件：可折叠子菜单 ───────────────────────────────

function CollapsibleMenuItem({
  item,
  defaultOpen,
  mode,
}: {
  item: MenuConfig
  defaultOpen: boolean
  mode: 'user' | 'admin'
}) {
  const [open, setOpen] = useState(defaultOpen)
  const location = useLocation()
  const pathname = location.pathname
  const Icon = item.icon
  const isActivePath = (to?: string): boolean => matchPath(pathname, to)
  const hasActiveInChildren = checkActiveChildren(pathname, item.children)
  const parentActiveBg =
    'bg-gradient-to-r from-sidebar-primary/8 to-transparent'
  const parentActiveIcon = 'text-sidebar-primary'

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.label}
            className={cn(
              'relative rounded-lg my-[1px] transition-all duration-200 ease-out',
              hasActiveInChildren && [
                parentActiveBg,
                'text-sidebar-foreground',
              ],
              '!hover:bg-sidebar-accent/80 !hover:shadow-sm',
            )}
          >
            <span
              className={cn(
                'flex size-4 shrink-0 items-center justify-center rounded-md transition-all duration-200',
                hasActiveInChildren && parentActiveIcon,
              )}
            >
              <Icon className="size-4" />
            </span>
            <span>{item.label}</span>
            <ChevronRight className="ml-auto size-4 shrink-0 text-sidebar-foreground/40 transition-transform duration-200 ease-out group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <SidebarMenuSub>
            {item.children?.map((child) => (
              <SidebarMenuSubItem key={child.key}>
                <SidebarMenuSubButton
                  asChild
                  isActive={isActivePath(child.to)}
                  className={cn(
                    'rounded-md transition-colors duration-150',
                    isActivePath(child.to) && [
                      'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
                    ],
                  )}
                >
                  <Link to={child.to}>
                    <child.icon
                      className={cn(
                        'size-4 transition-all duration-200',
                        isActivePath(child.to) && 'text-sidebar-primary',
                      )}
                    />
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
