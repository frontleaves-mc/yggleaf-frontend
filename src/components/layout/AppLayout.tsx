/**
 * AppLayout - 统一布局容器
 *
 * 基于 shadcn SidebarProvider 构建完整的页面框架。
 * 用户端和管理员端共用此布局，通过 `mode` prop 区分菜单和功能。
 *
 * 结构:
 *   SidebarProvider
 *   ├── AppSidebar (shadcn Sidebar)
 *   └── SidebarInset (主内容区)
 *       ├── AppTopBar (顶部栏)
 *       └── main (内容)
 */

import { useEffect } from 'react'
import {
  SidebarProvider,
  SidebarInset,
} from '#/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { AppTopBar } from './AppTopBar'
import type { MenuConfig } from './SidebarMenuRenderer'
import { PageTransition } from '#/components/ui/page-transition'

// ─── 类型定义 ────────────────────────────────────────────

export interface AppLayoutProps {
  children: React.ReactNode
  /** 布局模式：决定显示哪套菜单 */
  mode: 'user' | 'admin'
  /** 菜单配置项 */
  items: MenuConfig[]
}

// ─── 从 localStorage 恢复侧边栏状态 ─────────────────────

function getInitialOpen(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const stored = localStorage.getItem('yggleaf_sidebar_collapsed')
    if (stored === 'true') return false
    if (stored === 'false') return true
  } catch {
    // ignore
  }
  return true
}

// ─── 主组件 ──────────────────────────────────────────────

export function AppLayout({ children, mode, items }: AppLayoutProps) {
  // 同步旧版 localStorage key 到新版 cookie（兼容性）
  useEffect(() => {
    try {
      const oldState = localStorage.getItem('yggleaf_sidebar_collapsed')
      if (oldState === 'true') {
        document.cookie = `sidebar_state=collapsed; path=/; max-age=604800`
      }
    } catch {
      // ignore
    }
  }, [])

  return (
    <SidebarProvider defaultOpen={getInitialOpen()}>
      <AppSidebar mode={mode} items={items} />

      <SidebarInset>
        <div className="relative flex min-h-[100svh] flex-col">
          <AppTopBar mode={mode} />

          <main className="flex-1 px-3.5 py-3.5 pb-7 sm:px-5 sm:pb-8 lg:px-6 lg:py-4 lg:pb-10">
            <PageTransition className="relative mx-auto max-w-[var(--page-max)]">{children}</PageTransition>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
