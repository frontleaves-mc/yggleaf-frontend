/**
 * ViewSwitcher - 视图切换卡片
 *
 * 位于侧边栏 Logo 下方、菜单上方。
 * 管理员角色在用户端显示「切换管理员视图」，
 * 管理员端显示「切换用户视图」。
 * 非管理员用户不显示此卡片。
 */

import { useNavigate } from '@tanstack/react-router'
import { Shield, User } from 'lucide-react'
import { useUserInfo } from '#/api/endpoints/api-auth/user'
import { useSidebar } from '#/components/ui/sidebar'
import { isAdmin } from '#/lib/permissions'
import { cn } from '#/lib/utils'

interface ViewSwitcherProps {
  mode: 'user' | 'admin'
}

export function ViewSwitcher({ mode }: ViewSwitcherProps) {
  const navigate = useNavigate()
  const { data: userInfo } = useUserInfo()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const show = mode === 'user' ? isAdmin(userInfo?.user?.role_name) : true

  if (!show) return null

  const label = mode === 'admin' ? '用户视图' : '管理员视图'
  const Icon = mode === 'admin' ? User : Shield
  const target = mode === 'admin' ? '/user/dashboard' : '/admin'

  return (
    <div className="px-3 pt-0 pb-1 group-data-[collapsible=icon]:px-2">
      <button
        type="button"
        onClick={() => navigate({ to: target as any })}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left',
          'text-xs font-semibold tracking-wide transition-all duration-200 ease-out',
          'mc-glass border-0 shadow-sm',
          'text-sidebar-foreground/75',
          'hover:shadow-[0_4px_16px_-4px_oklch(from_var(--mc-diamond)_l_c_h/0.14)] hover:border-oklch(from_var(--mc-diamond)_l_c_h/_0.20) hover:text-sidebar-foreground',
          'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2',
        )}
      >
        <span
          className={cn(
            'flex size-6 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
            'bg-mc-grass-soft text-mc-grass',
          )}
        >
          <Icon className="size-3.5" />
        </span>
        {!isCollapsed && <span className="truncate">{label}</span>}
      </button>
    </div>
  )
}
