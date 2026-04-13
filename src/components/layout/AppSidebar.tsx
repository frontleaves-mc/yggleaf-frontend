/**
 * AppSidebar - 统一侧边栏
 *
 * 基于 shadcn Sidebar，组装 Header / Content / Footer
 * 通过 props 接收 mode 和 menu 配置
 */

import {
  Sidebar,
  SidebarContent,
  SidebarSeparator,
} from '#/components/ui/sidebar'
import { AppSidebarHeader } from './AppSidebarHeader'
import { AppSidebarFooter } from './AppSidebarFooter'
import { SidebarMenuRenderer } from './SidebarMenuRenderer'
import type { MenuConfig } from './SidebarMenuRenderer'

interface AppSidebarProps {
  /** 布局模式：用户端 or 管理员端 */
  mode: 'user' | 'admin'
  /** 菜单配置 */
  items: MenuConfig[]
}

export function AppSidebar({ mode, items }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="floating">
      {/* Logo 区域 */}
      <AppSidebarHeader mode={mode} />

      <SidebarSeparator />

      {/* 菜单内容区 */}
      <SidebarContent>
        <SidebarMenuRenderer items={items} />
      </SidebarContent>

      {/* 底部用户区域 */}
      <AppSidebarFooter />
    </Sidebar>
  )
}
