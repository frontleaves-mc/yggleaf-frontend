/**
 * TopBar - 顶部导航栏
 *
 * 包含：
 *   - 左侧：侧边栏切换按钮 (SidebarTrigger)
 *   - 中间：页面标题 + 面包屑导航 (BreadcrumbNav)
 */

import { SidebarTrigger } from '#/components/ui/sidebar'
import { Link, useMatches } from '@tanstack/react-router'
import { Home, ChevronRight } from 'lucide-react'
import { breadcrumbLabels } from '#/config/menu'

function useBreadcrumbs() {
  const matches = useMatches()

  return matches
    .filter((match) => match.pathname !== '/' && match.pathname)
    .map((match) => ({
      label: breadcrumbLabels[match.pathname] ?? match.pathname.split('/').pop() ?? '页面',
      href: match.pathname,
      isCurrent: match.pathname === matches[matches.length - 1]?.pathname,
    }))
}

function BreadcrumbNav({ crumbs }: { crumbs: ReturnType<typeof useBreadcrumbs> }) {
  if (crumbs.length === 0) return null

  const rootHref = crumbs[0]?.href ?? '/'

  return (
    <nav className="flex items-center gap-1.5 text-sm" aria-label="面包屑导航">
      <Link
        to={rootHref as any}
        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Home className="size-4" />
      </Link>

      {crumbs.map((crumb, idx) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight className="size-3.5 text-muted-foreground/50" />
          {idx === crumbs.length - 1 ? (
            <span className="font-medium text-foreground max-w-[200px] truncate">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.href as any}
              className="max-w-[180px] truncate rounded-md px-1.5 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}

// ─── 主组件 ──────────────────────────────────────────────

export function TopBar() {
  const crumbs = useBreadcrumbs()
  const current = crumbs[crumbs.length - 1]

  return (
    <header className="border-b border-border/40 bg-background/60 backdrop-blur-md pt-2">
      <div className="mx-auto flex max-w-(--page-max) items-center gap-3 p-3 sm:p-3.5">
        <SidebarTrigger className="shrink-0 rounded-lg" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-foreground sm:text-lg">
            {current?.label ?? '概览'}
          </p>
          <BreadcrumbNav crumbs={crumbs} />
        </div>
      </div>
    </header>
  )
}
