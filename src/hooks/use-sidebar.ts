/**
 * 侧边栏状态 Hook
 * 提供侧边栏折叠/展开控制
 */

import { useStore } from '@tanstack/react-store'
import { sidebarStore, toggleSidebar, setSidebarCollapsed } from '#/stores/sidebar-store'

/** 返回侧边栏状态和控制方法 */
export function useSidebar() {
  const collapsed = useStore(sidebarStore, (s) => s.collapsed)

  return {
    collapsed,
    toggle: toggleSidebar,
    setCollapsed: setSidebarCollapsed,
  }
}
