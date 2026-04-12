/**
 * AdminLayout - 管理后台主布局容器
 * 深色侧边栏（常驻） + 跟随主题的内容区
 *
 * 响应式:
 *   - 桌面 (≥md): 侧边栏 fixed + 内容区 margin-left
 *   - 移动 (<md): 侧边栏 Sheet 抽屉 + 内容区全宽
 */

import { useState, useCallback } from 'react'
import { Outlet } from '@tanstack/react-router'
import { cn } from '#/lib/utils'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { ContentArea } from './ContentArea'

/** 侧边栏展开/折叠宽度 */
const SIDEBAR_EXPANDED = '260px'
const SIDEBAR_COLLAPSED = '68px'

interface AdminLayoutProps {
  children?: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('yggleaf_sidebar_collapsed') === 'true'
  })

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('yggleaf_sidebar_collapsed', String(next))
      return next
    })
  }, [])

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED

  return (
    <div
      className="admin-layout flex h-screen overflow-hidden bg-[var(--background)]"
      style={{ '--admin-sidebar-w': sidebarWidth } as React.CSSProperties}
    >
      {/* ─── Desktop Sidebar (≥md) ─── */}
      <aside
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
        }}
        className={cn(
          "hidden md:flex md:flex-col md:fixed md:inset-y-0 md:z-30",
          "transition-[width,min-width] duration-280 ease-[cubic-bezier(0.25,0.8,0.25,1)]",
        )}
      >
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
          onMobileClose={() => {}}
        />
      </aside>

      {/* ─── Mobile Sidebar Overlay ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          style={{ animation: 'fadeIn 180ms ease-out' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Mobile Sidebar (Sheet) ─── */}
      {sidebarOpen && (
        <aside
          className="fixed inset-y-0 left-0 z-50 w-[280px] shadow-2xl md:hidden"
          style={{ animation: 'slideInLeft 280ms cubic-bezier(0.25,0.8,0.25,1)' }}
        >
          <Sidebar
            collapsed={false}
            onToggleCollapse={() => {}}
            onMobileClose={() => setSidebarOpen(false)}
            isMobile
          />
        </aside>
      )}

      {/* ─── Main Area ─── */}
      <div className="admin-main flex flex-1 flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <ContentArea>{children ?? <Outlet />}</ContentArea>
      </div>
    </div>
  )
}
