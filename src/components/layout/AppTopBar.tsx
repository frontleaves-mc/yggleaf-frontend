/**
 * AppTopBar - 顶部导航栏
 *
 * 包含：
 *   - 左侧：移动端菜单触发器 (SidebarTrigger)
 *   - 中间：面包屑导航 (BreadcrumbNav)
 *   - 右侧：主题切换 + 用户下拉菜单
 */

import { useSidebar, SidebarTrigger } from '#/components/ui/sidebar'
import { Separator } from '#/components/ui/separator'
import { Link, useMatches } from '@tanstack/react-router'
import { Home, ChevronRight, Sparkles } from 'lucide-react'
import { breadcrumbLabels } from '#/config/menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { authStore } from '#/stores/auth-store'
import { useNavigate } from '@tanstack/react-router'
import { clearAuth } from '#/stores/auth-store'
import { LogOut, Settings, UserCircle } from 'lucide-react'
import { cn } from '#/lib/utils'

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

// ─── 用户下拉菜单 ───────────────────────────────────────

function UserDropdown() {
  const navigate = useNavigate()
  const user = authStore.state.user

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'YK'

  const handleLogout = () => {
    clearAuth()
    navigate({ to: '/login' })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/70 px-2.5 py-2 text-sm transition-colors hover:bg-accent outline-hidden">
          <Avatar className="size-7">
            <AvatarFallback className="rounded-md bg-[var(--diamond)]/10 text-[var(--diamond-deep)] text-[10px] font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline max-w-[120px] truncate font-medium">
            {user?.username ?? '用户'}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <div className="px-2 py-1.5 border-b border-border mb-1">
          <p className="text-sm font-medium truncate">{user?.username ?? '用户'}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email ?? '未登录'}</p>
        </div>

        <DropdownMenuItem onClick={() => navigate({ to: '/app/profile' as any })}>
          <UserCircle className="mr-2 size-4" />
          个人中心
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: '/admin/profile' as any })}>
          <Settings className="mr-2 size-4" />
          账号设置
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 size-4" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── 主组件 ──────────────────────────────────────────────

export function AppTopBar({ mode }: { mode: 'user' | 'admin' }) {
  const { isMobile, state } = useSidebar()
  const crumbs = useBreadcrumbs()
  const current = crumbs[crumbs.length - 1]
  const modeLabel = mode === 'admin' ? '管理后台' : '用户中心'

  return (
    <header className="sticky top-0 z-30 px-4 pt-3 sm:px-6 lg:px-8 lg:pt-4">
      <div className="mx-auto flex max-w-(--page-max) items-center gap-3 rounded-[18px] border border-border/65 bg-background/82 px-3 py-2.5 shadow-[0_14px_30px_-24px_oklch(0.18_0.03_195_/_0.2)] backdrop-blur-xl sm:px-4">
        {(isMobile || state === 'collapsed') && (
          <SidebarTrigger className="shrink-0 rounded-lg border border-border/60 bg-background/90" />
        )}

        {!isMobile && state === 'collapsed' && (
          <Separator orientation="vertical" className="h-8" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]',
                mode === 'admin'
                  ? 'border-[var(--diamond)]/20 bg-[var(--diamond)]/8 text-[var(--diamond-deep)]'
                  : 'border-[var(--gold)]/25 bg-[var(--gold)]/10 text-[var(--diamond-deep)]',
              )}
            >
              <Sparkles className="size-3" />
              {modeLabel}
            </span>
          </div>
          <div className="mt-1.5 flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground sm:text-lg">
                {current?.label ?? '概览'}
              </p>
              <BreadcrumbNav crumbs={crumbs} />
            </div>
          </div>
        </div>

        <UserDropdown />
      </div>
    </header>
  )
}
