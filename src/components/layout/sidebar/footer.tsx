/**
 * SidebarFooter - 侧边栏底部区域
 *
 * 用户头像卡片 + 点击展开下拉菜单（个人中心 / 退出登录）
 */

import { useUserInfo } from '#/api/endpoints/user'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import {
  SidebarFooter as SidebarFooterRoot,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from '#/components/ui/sidebar'
import { LogOut, Settings, Shield } from 'lucide-react'
import type { RoleName } from '#/api/types'
import { useNavigate } from '@tanstack/react-router'
import { clearAuth } from '#/stores/auth-store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'

export function SidebarFooter() {
  const navigate = useNavigate()
  const { data: userInfo } = useUserInfo()
  const user = userInfo?.user

  const initials = user?.username
    ?.slice(0, 2)
    .toUpperCase() ?? 'YK'

  const handleLogout = () => {
    clearAuth()
    navigate({ to: '/login' })
  }

  return (
    <>
      <SidebarRail />

      <SidebarFooterRoot className="p-3 pt-0 group-data-[collapsible=icon]:p-2">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="border border-sidebar-border/60 bg-sidebar-accent/30 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="rounded-lg bg-linear-to-br from-primary/15 to-primary/10 text-primary text-xs font-bold border border-primary/15">
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
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top" align="start" className="w-52">
                <DropdownMenuItem onClick={() => navigate({ to: '/user/profile' as any })}>
                  <Settings className="mr-2 size-4" />
                  个人中心
                </DropdownMenuItem>

                {['ADMIN', 'SUPER_ADMIN'].includes(user?.role_name as RoleName) && (
                  <DropdownMenuItem onClick={() => navigate({ to: '/admin' as any })}>
                    <Shield className="mr-2 size-4" />
                    管理员
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 size-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooterRoot>
    </>
  )
}
