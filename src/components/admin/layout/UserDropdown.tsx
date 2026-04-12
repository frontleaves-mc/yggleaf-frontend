/**
 * UserDropdown - 用户头像 + 下拉菜单
 * 显示用户信息，提供：个人中心 / 设置 / 登出 入口
 *
 * 深度优化:
 *   - 头像使用 clip-path 切角方块风格 (与 Logo 统一)
 *   - 下拉面板更紧凑精致
 *   - 登出按钮明确的红色警示
 */

import { useAuth } from '#/hooks/use-auth'
import { useLogoutMutation } from '#/api/endpoints/auth'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { LogOut, Settings, UserCircle } from 'lucide-react'
import { cn } from '#/lib/utils'

export function UserDropdown() {
  const { user, isAuthenticated } = useAuth()
  const logoutMutation = useLogoutMutation()

  const handleLogout = async () => {
    await logoutMutation.mutateAsync()
    window.location.href = '/login'
  }

  // 未登录时显示登录按钮
  if (!isAuthenticated || !user) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-[13px] font-medium"
        onClick={() => (window.location.href = '/login')}
      >
        登录
      </Button>
    )
  }

  // 从用户名提取首字母
  const initials = user.username
    ? user.username.slice(0, 2).toUpperCase()
    : user.email?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-lg p-1.5 pr-3 transition-all duration-150",
            "hover:bg-[var(--accent)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1",
          )}
        >
          {/* 头像：切角方块风格 */}
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center bg-gradient-to-br from-[var(--lagoon)] to-[var(--lagoon-deep)] text-white text-[11px] font-bold shadow-sm"
            style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
          >
            {initials}
          </div>

          {/* 用户名 */}
          <span className="hidden text-[13px] font-medium text-[var(--foreground)] sm:inline-block max-w-[100px] truncate">
            {user.username}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl">
        {/* 用户信息 */}
        <DropdownMenuLabel className="border-0 px-2.5 py-2">
          <p className="truncate text-[13px] font-semibold text-[var(--foreground)]">
            {user.username}
          </p>
          <p className="truncate text-[11px] text-[var(--muted-foreground)] mt-0.5">
            {user.email}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-0.5" />

        {/* 个人中心 */}
        <DropdownMenuItem
          onClick={() => (window.location.href = '/admin/profile')}
          className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] gap-2.5"
        >
          <UserCircle className="h-4 w-4 text-[var(--muted-foreground)]" />
          个人中心
        </DropdownMenuItem>

        {/* 账号设置 */}
        <DropdownMenuItem
          onClick={() => (window.location.href = '/admin/profile')}
          className="cursor-pointer rounded-lg px-2.5 py-2 text-[13px] gap-2.5"
        >
          <Settings className="h-4 w-4 text-[var(--muted-foreground)]" />
          账号设置
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-0.5" />

        {/* 退出登录 */}
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className={cn(
            "cursor-pointer rounded-lg px-2.5 py-2 text-[13px] font-medium gap-2.5",
            "text-red-500/90 hover:text-red-600 hover:bg-red-500/5",
            "focus:text-red-600 focus:bg-red-500/5",
          )}
        >
          <LogOut className="h-4 w-4" />
          {logoutMutation.isPending ? '登出中...' : '退出登录'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
