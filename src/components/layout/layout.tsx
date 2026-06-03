/**
 * Layout - 统一布局容器（MC 风格融合）
 *
 * 基于 shadcn SidebarProvider 构建完整的页面框架。
 * 用户端和管理员端共用此布局，通过 `mode` prop 区分菜单和功能。
 *
 * MC 风格增强:
 *   - 环境光渐变背景（user: grass/diamond 蓝绿调，admin: nether/gold 红金调）
 *   - GridPattern 网格纹理 + dot-grid 点阵叠加
 *   - 通过 data-mode 驱动 CSS 变量实现主题色切换
 *
 * 结构:
 *   SidebarProvider (data-mode + MC 渐变层)
 *   ├── Sidebar (shadcn Sidebar)
 *   └── SidebarInset (主内容区)
 *       ├── TopBar (顶部栏)
 *       └── main (内容 + GridPattern + dot-grid)
 */

import { useEffect } from 'react'
import { SidebarProvider, SidebarInset } from '#/components/ui/sidebar'
import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'
import { PageTitleProvider } from './page-title-context'
import type { MenuConfig, MenuSectionConfig } from './sidebar/menu-renderer'
import { PageTransition } from '#/components/ui/page-transition'
import { GridPattern } from '#/components/ui/grid-pattern'

// ─── 类型定义 ────────────────────────────────────────────

export interface LayoutProps {
  children: React.ReactNode
  mode: 'user' | 'admin'
  items?: MenuConfig[]
  sections?: MenuSectionConfig[]
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

const mcGradientMap = {
  user: 'bg-[radial-gradient(ellipse_45%_35%_at_0%_0%,var(--mc-grass-soft),transparent),radial-gradient(ellipse_38%_30%_at_100%_100%,var(--mc-diamond-soft),transparent)]',
  admin:
    'bg-[radial-gradient(ellipse_45%_35%_at_100%_0%,var(--mc-nether-soft),transparent),radial-gradient(ellipse_38%_30%_at_0%_100%,var(--mc-gold-soft),transparent)]',
} as const

// ─── 主组件 ──────────────────────────────────────────────

export function Layout({ children, mode, items, sections }: LayoutProps) {
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
    <SidebarProvider
      defaultOpen={getInitialOpen()}
      className="relative bg-background"
      data-mode={mode}
    >
      <div
        className={`pointer-events-none fixed inset-0 opacity-80 transition-opacity duration-700 ${mcGradientMap[mode]}`}
        aria-hidden="true"
      />

      <Sidebar mode={mode} items={items} sections={sections} />

      <SidebarInset className="relative">
        <PageTitleProvider>
          <div className="relative flex min-h-svh flex-col">
            <TopBar />

            <main className="relative flex-1 overflow-hidden px-3.5 py-3.5 pb-7 sm:px-5 sm:pb-8 lg:px-6 lg:py-4 lg:pb-10">
              <GridPattern
                width={32}
                height={32}
                className="fill-none stroke-[var(--grid-line-color)] [mask-image:radial-gradient(ellipse_at_center,white,transparent_72%)]"
              />

              <div
                className="mc-inventory-grid pointer-events-none absolute inset-0 opacity-[0.12]"
                aria-hidden="true"
              />

              <PageTransition className="relative mx-auto max-w-(--page-max)">
                {children}
              </PageTransition>
            </main>
          </div>
        </PageTitleProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
