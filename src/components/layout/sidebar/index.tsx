/**
 * Sidebar - 统一侧边栏
 *
 * 基于 shadcn Sidebar，组装 Header / Content / Footer
 * 通过 props 接收 mode 和 menu 配置
 */

import { SidebarContent, Sidebar as SidebarRoot } from '#/components/ui/sidebar'
import { SidebarFooter } from './footer'
import { SidebarHeader } from './header'
import type { MenuConfig, MenuSectionConfig } from './menu-renderer'
import { SidebarMenuRenderer } from './menu-renderer'
import { ViewSwitcher } from './view-switcher'

interface SidebarProps {
  mode: 'user' | 'admin'
  items?: MenuConfig[]
  sections?: MenuSectionConfig[]
}

export function Sidebar({ mode, items, sections }: SidebarProps) {
  return (
    <SidebarRoot
      collapsible="icon"
      variant="floating"
      style={
        {
          '--sidebar-width-icon': '4.5rem',
          '--sidebar-mode-accent': 'oklch(from var(--sidebar-primary) l c h)',
        } as React.CSSProperties
      }
      className="overflow-hidden"
      data-mode={mode}
    >
      <SidebarHeader mode={mode} />

      <div className="px-4 pt-1 pb-3" aria-hidden="true">
        <div className="h-px bg-sidebar-border" />
      </div>

      <ViewSwitcher mode={mode} />

      <SidebarContent>
        <SidebarMenuRenderer items={items} sections={sections} mode={mode} />
      </SidebarContent>

      <SidebarFooter mode={mode} />
    </SidebarRoot>
  )
}
