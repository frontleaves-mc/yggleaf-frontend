/**
 * AppTopBar - 顶部导航栏
 *
 * 包含：
 *   - 左侧：移动端菜单触发器 (SidebarTrigger)
 *   - 中间：面包屑导航 (BreadcrumbNav)
 *   - 右侧：主题切换 + 用户下拉菜单
 */

import { useSidebar } from '#/components/ui/sidebar'
import { SidebarTrigger } from '#/components/ui/sidebar'
import { Separator } from '#/components/ui/separator'
import { useMatches } from '@tanstack/react-router'
import { Home, ChevronRight } from 'lucide-react'
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

// ─── 面包屑子组件 ─────────────────────────────────────

function BreadcrumbNav() {
  const matches = useMatches()

  // 过滤掉根路由和无路径的路由
  const crumbs = matches
    .filter((match) => match.pathname !== '/' && match.pathname)
    .map((match) => ({
      label: breadcrumbLabels[match.pathname] ?? match.pathname.split('/').pop() ?? '页面',
      href: match.pathname,
      isCurrent: match.pathname === matches[matches.length - 1]?.pathname,
    }))
    .filter((crumb) => !crumb.isCurrent || true)

  if (crumbs.length === 0) return null

  return (
    <nav className="flex items-center gap-1.5 text-sm" aria-label="面包屑导航">
      {/* 首页图标 */}
      <a
        href={crumbs[0]?.href ?? '/'}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="size-4" />
      </a>

      {crumbs.map((crumb, idx) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight className="size-3.5 text-muted-foreground/50" />
          {idx === crumbs.length - 1 ? (
            <span className="font-medium text-foreground max-w-[200px] truncate">
              {crumb.label}
            </span>
          ) : (
            <a
              href={crumb.href}
              className="text-muted-foreground hover:text-foreground transition-colors max-w-[180px] truncate"
            >
              {crumb.label}
            </a>
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
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-accent transition-colors outline-hidden">
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
  // mode 可用于未来区分用户端/管理端顶部栏行为
  void mode
  const { isMobile, state } = useSidebar()

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-xl px-4 transition-all duration-200">
      {/* 左侧：移动端菜单按钮 */}
      {(isMobile || state === 'collapsed') && (
        <SidebarTrigger className="-ml-1" />
      )}

      {/* 分隔线（桌面端折叠时显示） */}
      {!isMobile && state === 'collapsed' && (
        <Separator orientation="vertical" className="mx-1 h-5" />
      )}

      {/* 中间：面包屑导航 */}
      <div className="flex-1 min-w-0">
        <BreadcrumbNav />
      </div>

      {/* 右侧：用户信息 */}
      <UserDropdown />
    </header>
  )
}
