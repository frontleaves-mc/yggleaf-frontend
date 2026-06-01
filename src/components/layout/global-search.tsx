/**
 * GlobalSearch - 全局搜索 Command Palette
 *
 * 基于 cmdk + shadcn Command 组件构建的命令面板。
 * 支持快捷键触发、按模式过滤页面、点击跳转。
 */

import * as React from 'react'
import { useRouter } from '@tanstack/react-router'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '#/components/ui/command'
import {
  adminMenuSections,
  userMenuSections
  
} from '#/config/menu'
import type {MenuItem} from '#/config/menu';

// ─── 类型定义 ────────────────────────────────────────────

interface SearchItem {
  label: string
  to: string
  icon: React.ComponentType<{ className?: string }>
  group: string
}

type AppMode = 'user' | 'admin'

// ─── 工具函数：递归扁平化菜单项 ──────────────────────────

function flattenItems(items: MenuItem[], groupLabel: string): SearchItem[] {
  const result: SearchItem[] = []

  for (const item of items) {
    if (item.to) {
      result.push({
        label: item.label,
        to: item.to,
        icon: item.icon,
        group: groupLabel,
      })
    }
    if (item.children?.length) {
      result.push(...flattenItems(item.children, groupLabel))
    }
  }

  return result
}

/** 从 MenuSection 配置中提取所有可搜索的页面 */
function buildSearchIndex(mode: AppMode): SearchItem[] {
  const sections = mode === 'admin' ? adminMenuSections : userMenuSections

  return sections.flatMap((section) =>
    flattenItems(section.items, section.label ?? ''),
  )
}

// ─── 获取当前应用模式 ─────────────────────────────────────

function getAppMode(): AppMode {
  if (typeof document === 'undefined') return 'user'
  const el = document.querySelector('[data-mode]')
  const mode = el?.getAttribute('data-mode')
  return mode === 'admin' || mode === 'user' ? mode : 'user'
}

// ─── 主组件 ──────────────────────────────────────────────

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const [mode, setMode] = React.useState<AppMode>('user')

  // 挂载后读取实际模式
  React.useEffect(() => {
    setMode(getAppMode())
  }, [])

  // 快捷键: Cmd+K / Ctrl+K
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const searchItems = React.useMemo(() => buildSearchIndex(mode), [mode])

  // 按 group 分组
  const grouped = React.useMemo(() => {
    const map = new Map<string, SearchItem[]>()
    for (const item of searchItems) {
      const list = map.get(item.group) ?? []
      list.push(item)
      map.set(item.group, list)
    }
    return map
  }, [searchItems])

  function handleSelect(to: string) {
    setOpen(false)
    router.navigate({ to })
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="搜索页面..." />
      <CommandList>
        <CommandEmpty>未找到匹配的页面</CommandEmpty>

        {Array.from(grouped.entries()).map(([group, items], idx) => (
          <React.Fragment key={group}>
            {idx > 0 && <CommandSeparator />}
            <CommandGroup heading={group || undefined}>
              {items.map((item) => (
                <CommandItem
                  key={item.to}
                  value={`${item.label} ${item.to}`}
                  onSelect={() => handleSelect(item.to)}
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
