/**
 * AppSidebarFooter - 侧边栏底部区域
 *
 * 显示用户信息 + 折叠/展开切换按钮
 */

import { useSidebar } from '#/components/ui/sidebar'
import { authStore } from '#/stores/auth-store'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarRail } from '#/components/ui/sidebar'
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { clearAuth } from '#/stores/auth-store'

export function AppSidebarFooter() {
  const { state, toggleSidebar } = useSidebar()
  const navigate = useNavigate()
  const user = authStore.state.user

  const handleLogout = () => {
    clearAuth()
    navigate({ to: '/login' })
  }

  /** 从用户名生成头像 fallback */
  const initials = user?.username
    ?.slice(0, 2)
    .toUpperCase() ?? 'YK'

  return (
    <>
      <SidebarRail />

      <SidebarFooter className="p-3 pt-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="rounded-2xl border border-sidebar-border/60 bg-sidebar-accent/30 px-2.5 py-2.5 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              onClick={() => navigate({ to: '/admin/profile' as any })}
            >
              <Avatar className="size-8">
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-[var(--diamond)]/15 to-[var(--diamond-deep)]/10 text-[var(--diamond-deep)] text-xs font-bold border border-[var(--diamond)]/15">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col min-w-0">
                <span className="truncate text-sm font-medium">{user?.username ?? '用户'}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email ?? '未登录'}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <div className="mt-2 flex items-center gap-2 px-1">
            <button
              onClick={toggleSidebar}
              className="flex h-8 flex-1 items-center justify-center gap-1 rounded-xl border border-sidebar-border/60 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              title={state === 'collapsed' ? '展开侧边栏' : '收起侧边栏'}
            >
              {state === 'collapsed' ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
              <span className="text-xs font-medium">{state === 'collapsed' ? '展开' : '收起'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex size-8 items-center justify-center rounded-xl border border-sidebar-border/60 text-sidebar-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
              title="退出登录"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
