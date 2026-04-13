/**
 * Sidebar - 统一侧边栏
 *
 * 基于 shadcn Sidebar，组装 Header / Content / Footer
 * 通过 props 接收 mode 和 menu 配置
 */

import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarSeparator,
} from '#/components/ui/sidebar'
import { SidebarHeader } from './header'
import { SidebarFooter } from './footer'
import { SidebarMenuRenderer } from './menu-renderer'
import type { MenuConfig } from './menu-renderer'

interface SidebarProps {
  /** 布局模式：用户端 or 管理员端 */
  mode: 'user' | 'admin'
  /** 菜单配置 */
  items: MenuConfig[]
}

export function Sidebar({ mode, items }: SidebarProps) {
  return (
    <SidebarRoot collapsible="icon" variant="floating" style={{ '--sidebar-width-icon': '4rem' } as React.CSSProperties}>
      {/* Logo 区域 */}
      <SidebarHeader mode={mode} />

      <div className="flex flex-col items-center px-4 pb-1">
        <SidebarSeparator className='p-0.5 rounded-full' />
      </div>

      {/* 菜单内容区 */}
      <SidebarContent>
        <SidebarMenuRenderer items={items} />
      </SidebarContent>

      {/* 底部用户区域 */}
      <SidebarFooter />
    </SidebarRoot>
  )
}
