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
import { Button } from '#/components/ui/button'

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
    <header className="mc-topbar pt-2">
      <GlobalSearch />
      <div className="mx-auto flex max-w-(--page-max) items-center gap-3 p-3.5 sm:p-4">
        <SidebarTrigger className="shrink-0" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-foreground sm:text-lg">
            {overrideTitle ?? current?.label ?? '概览'}
          </p>
        </div>

        <Button
          type="button"
          variant="stone"
          size="sm"
          onClick={() => {
            document.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: 'k',
                metaKey: true,
                bubbles: true,
              }),
            )
          }}
          className="shrink-0 text-xs text-muted-foreground sm:px-3"
        >
          <SearchIcon data-icon="inline-start" />
          <span className="hidden sm:inline">搜索</span>
          <kbd className="mc-slot hidden items-center gap-0.5 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground/70 sm:inline-flex">
            ⌘K
          </kbd>
        </Button>

        <ThemeToggle />
      </div>
    </header>
  )
}
