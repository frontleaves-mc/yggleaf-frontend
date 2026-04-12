/**
 * 侧边栏折叠状态管理 (TanStack Store)
 * 管理侧边栏展开/折叠状态，持久化到 localStorage
 */

import { Store } from '@tanstack/store'
import { SIDEBAR_COLLAPSED_KEY } from '#/config/constants'

/** 侧边栏状态 */
export interface SidebarState {
  /** 是否折叠 */
  collapsed: boolean
}

/** 从 localStorage 恢复初始状态 */
function getInitialState(): SidebarState {
  if (typeof window === 'undefined') {
    return { collapsed: false }
  }

  const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
  return { collapsed: stored === 'true' }
}

/** 侧边栏状态 Store（全局单例） */
export const sidebarStore = new Store<SidebarState>(getInitialState())

// ─── Store Actions ──────────────────────────────────────────

/** 切换侧边栏折叠状态 */
export function toggleSidebar(): void {
  const next = !sidebarStore.state.collapsed
  localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next))
  sidebarStore.setState((prev) => ({ ...prev, collapsed: next }))
}

/** 设置侧边栏折叠状态 */
export function setSidebarCollapsed(collapsed: boolean): void {
  localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed))
  sidebarStore.setState((prev) => ({ ...prev, collapsed }))
}
