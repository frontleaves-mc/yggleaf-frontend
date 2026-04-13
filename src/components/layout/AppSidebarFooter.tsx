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
      {/* 边缘拖拽触发条 */}
      <SidebarRail />

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          {/* 用户信息区 */}
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              onClick={() => navigate({ to: '/admin/profile' as any })}
            >
              <Avatar className="size-8">
                <AvatarFallback className="rounded-lg bg-[var(--diamond)]/10 text-[var(--diamond-deep)] text-xs font-semibold">
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

          {/* 操作行：折叠切换 + 登出 */}
          <div className="flex items-center gap-1 mt-1 px-2">
            {/* 折叠/展开按钮 */}
            <button
              onClick={toggleSidebar}
              className="flex size-7 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              title={state === 'collapsed' ? '展开侧边栏' : '收起侧边栏'}
            >
              {state === 'collapsed' ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </button>

            {/* 登出按钮 */}
            <button
              onClick={handleLogout}
              className="flex size-7 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
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
