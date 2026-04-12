/**
 * TopBar - 管理后台顶部导航栏
 * 跟随主题色，玻璃拟态效果
 */

import { BreadcrumbNav } from './BreadcrumbNav'
import { UserDropdown } from './UserDropdown'
import { cn } from '#/lib/utils'

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 px-4 sm:px-5",
        "bg-[var(--card)]/80 backdrop-blur-xl",
        "border-b border-[var(--border)]/40",
      )}
    >
      {/* 移动端菜单按钮 */}
      <button
        onClick={onMenuClick}
        className={cn(
          "flex items-center justify-center rounded-lg p-2 -ml-1",
          "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
          "hover:bg-[var(--accent)] active:bg-[var(--accent)]/60",
          "transition-colors duration-150 md:hidden",
        )}
        aria-label="打开菜单"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* 面包屑 */}
      <div className="flex-1 min-w-0">
        <BreadcrumbNav />
      </div>

      {/* 右侧用户区域 */}
      <UserDropdown />
    </header>
  )
}
