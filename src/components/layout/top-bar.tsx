/**
 * TopBar - 顶部导航栏
 *
 * 包含：
 *   - 左侧：侧边栏切换按钮 (SidebarTrigger)
 *   - 中间：页面标题
 *   - 右侧：主题切换 (ThemeToggle - 浅色/深色/跟随系统)
 */

import { SidebarTrigger } from '#/components/ui/sidebar'
import { useMatches } from '@tanstack/react-router'
import { breadcrumbLabels } from '#/config/menu'
import { usePageTitleOverride } from './page-title-context'
import { ThemeToggle } from '#/components/public/theme-toggle'
import { GlobalSearch } from './global-search'
import { SearchIcon } from 'lucide-react'

// ─── 页面标题解析 ───────────────────────────────────────

function useBreadcrumbs() {
  const matches = useMatches()

  return matches
    .filter((match) => match.pathname !== '/' && match.pathname)
    .map((match) => ({
      label:
        breadcrumbLabels[match.pathname] ??
        match.pathname.split('/').pop() ??
        '页面',
      href: match.pathname,
      isCurrent: match.pathname === matches[matches.length - 1]?.pathname,
    }))
}

// ─── 主组件 ──────────────────────────────────────────────

export function TopBar() {
  const crumbs = useBreadcrumbs()
  const current = crumbs[crumbs.length - 1]
  const overrideTitle = usePageTitleOverride()

  return (
    <header className="border-b border-border/40 pt-2">
      <GlobalSearch />
      <div className="mx-auto flex max-w-(--page-max) items-center gap-3 p-3.5 sm:p-4">
        <SidebarTrigger className="shrink-0 rounded-lg" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-foreground sm:text-lg">
            {overrideTitle ?? current?.label ?? '概览'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            document.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'k',
                metaKey: true,
                bubbles: true,
              }),
            )
          }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-muted/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground outline-hidden ring-inset ring-border/40 transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring sm:px-3"
        >
          <SearchIcon className="size-3.5" />
          <span className="hidden sm:inline">搜索</span>
          <kbd className="hidden items-center gap-0.5 rounded border border-border/50 bg-background/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground/70 sm:inline-flex">
            ⌘K
          </kbd>
        </button>

        <ThemeToggle />
      </div>
    </header>
  )
}
