/**
 * 游戏档案选择器组件
 *
 * 页面级组件，用于选择当前操作的 GameProfile
 * 采用 Combobox 模式（Popover + Command），支持搜索 + 选中标记
 * 选择状态通过 GameProfile Store 持久化到 localStorage
 */

import { Link } from '@tanstack/react-router'
import { Check, ChevronsUpDown, Gamepad2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useGameProfiles } from '#/api/endpoints/api-auth/game-profile'
import { Button } from '#/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '#/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { Skeleton } from '#/components/ui/skeleton'
import { useGameProfileStore } from '#/hooks/use-game-profile-store'
import { cn } from '#/lib/utils'

// ─── 组件 ──────────────────────────────────────────────────

/** 游戏档案选择器（页面级，可复用） */
export function GameProfileSelector() {
  const { data: profiles, isLoading } = useGameProfiles()
  const { selectedGameProfile, setSelectedGameProfile } = useGameProfileStore()
  const [open, setOpen] = useState(false)

  // 自动选中逻辑 + stale UUID 处理
  useEffect(() => {
    if (!profiles || profiles.length === 0) return

    // 验证当前选中的 profile 是否在列表中
    if (selectedGameProfile) {
      const exists = profiles.some((p) => p.uuid === selectedGameProfile.uuid)
      if (!exists) {
        // Stale UUID — 自动选中第一个
        setSelectedGameProfile(profiles[0])
      }
    } else {
      // 无选中 — 自动选中第一个
      setSelectedGameProfile(profiles[0])
    }
  }, [profiles, selectedGameProfile, setSelectedGameProfile])

  // 加载中
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-none border bg-card p-3 mc-pixel-shadow-sm">
        <Gamepad2 className="h-4 w-4 text-muted-foreground" />
        <Skeleton className="h-5 w-[180px]" />
      </div>
    )
  }

  // 无档案
  if (!profiles || profiles.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-none border bg-card p-3 text-sm text-muted-foreground mc-pixel-shadow-sm">
        <Gamepad2 className="h-4 w-4" />
        <span>暂无游戏档案，请先</span>
        <Link
          to="/user/profiles"
          className="text-primary underline underline-offset-4 hover:text-primary/80"
        >
          创建档案
        </Link>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-9 w-[220px] justify-between gap-2 mc-pixel-shadow-sm cursor-pointer"
        >
          <span className="truncate">
            {selectedGameProfile ? selectedGameProfile.name : '选择游戏档案...'}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0" align="end">
        <Command>
          <CommandInput placeholder="搜索游戏档案..." />
          <CommandList>
            <CommandEmpty>未找到匹配的档案</CommandEmpty>
            <CommandGroup>
              {profiles.map((profile) => (
                <CommandItem
                  key={profile.uuid}
                  value={profile.name}
                  onSelect={() => {
                    setSelectedGameProfile(profile)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedGameProfile?.uuid === profile.uuid
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {profile.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
