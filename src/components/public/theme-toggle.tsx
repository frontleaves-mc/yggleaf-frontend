/**
 * ThemeToggle — 主题切换组件（共享）
 * 提供 light / dark / auto 三种模式切换，使用 DropdownMenu 展示选项
 */

import { Monitor, Moon, Sun } from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { useThemeMode } from '#/hooks/use-theme'

export function ThemeToggle() {
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
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-lg cursor-pointer"
        >
          {icon}
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          onClick={() => changeMode('light')}
          className="cursor-pointer"
        >
          <Sun className="size-4" />
          浅色
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeMode('dark')}
          className="cursor-pointer"
        >
          <Moon className="size-4" />
          深色
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeMode('auto')}
          className="cursor-pointer"
        >
          <Monitor className="size-4" />
          跟随系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
