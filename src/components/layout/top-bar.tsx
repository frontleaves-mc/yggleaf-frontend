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

// ─── 页面标题解析 ───────────────────────────────────────

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

// ─── 主题切换 ───────────────────────────────────────────

type ThemeMode = 'light' | 'dark' | 'auto'

function useThemeMode() {
  const [mode, setMode] = React.useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'auto'
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored
    return 'auto'
  })

  const applyTheme = React.useCallback((newMode: ThemeMode) => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved = newMode === 'auto' ? (prefersDark ? 'dark' : 'light') : newMode
    const root = document.documentElement

    root.classList.remove('light', 'dark')
    root.classList.add(resolved)

    if (newMode === 'auto') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', newMode)
    }

    root.style.colorScheme = resolved
    localStorage.setItem('theme', newMode)
  }, [])

  const changeMode = React.useCallback((newMode: ThemeMode) => {
    setMode(newMode)
    applyTheme(newMode)
  }, [applyTheme])

  return { mode, changeMode }
}

function ThemeToggle() {
  const { mode, changeMode } = useThemeMode()

  const icon = mode === 'light'
    ? <Sun className="size-4" />
    : mode === 'dark'
      ? <Moon className="size-4" />
      : <Monitor className="size-4" />

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

  return (
    <header className="border-b border-border/40 bg-background/60 backdrop-blur-md pt-2">
      <div className="mx-auto flex max-w-(--page-max) items-center gap-3 p-3 sm:p-3.5">
        <SidebarTrigger className="shrink-0 rounded-lg" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-foreground sm:text-lg">
            {current?.label ?? '概览'}
          </p>
        </div>

        <ThemeToggle />
      </div>
    </header>
  )
}
