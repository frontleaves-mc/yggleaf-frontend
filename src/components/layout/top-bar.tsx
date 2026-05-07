/**
 * TopBar - 顶部导航栏
 *
 * 包含：
 *   - 左侧：侧边栏切换按钮 (SidebarTrigger)
 *   - 中间：页面标题
 *   - 右侧：主题切换 (ThemeToggle - 浅色/深色/跟随系统)
 */

import * as React from 'react'
import { SidebarTrigger } from '#/components/ui/sidebar'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { useMatches } from '@tanstack/react-router'
import { Sun, Moon, Monitor } from 'lucide-react'
import { breadcrumbLabels } from '#/config/menu'
import { usePageTitleOverride } from './page-title-context'
import { useThemeMode } from '#/hooks/use-theme'

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

// ─── 主题切换 ───────────────────────────────────────────

function ThemeToggle() {
  const { mode, changeMode } = useThemeMode()

  const icon =
    mode === 'light' ? (
      <Sun className="size-4" />
    ) : mode === 'dark' ? (
      <Moon className="size-4" />
    ) : (
      <Monitor className="size-4" />
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0 rounded-lg">
          {icon}
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem onClick={() => changeMode('light')}>
          <Sun className="size-4" />
          浅色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeMode('dark')}>
          <Moon className="size-4" />
          深色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeMode('auto')}>
          <Monitor className="size-4" />
          跟随系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── 主组件 ──────────────────────────────────────────────

export function TopBar() {
  const crumbs = useBreadcrumbs()
  const current = crumbs[crumbs.length - 1]
  const overrideTitle = usePageTitleOverride()

  return (
    <header className="border-b border-border/40 pt-2">
      <div className="mx-auto flex max-w-(--page-max) items-center gap-3 p-3.5 sm:p-4">
        <SidebarTrigger className="shrink-0 rounded-lg" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-foreground sm:text-lg">
            {overrideTitle ?? current?.label ?? '概览'}
          </p>
        </div>

        <ThemeToggle />
      </div>
    </header>
  )
}
