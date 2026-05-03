/**
 * 游戏档案选择器组件
 * 页面级组件，用于选择当前操作的 GameProfile
 * 选择状态通过 GameProfile Store 持久化到 localStorage
 */

import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Gamepad2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Skeleton } from '#/components/ui/skeleton'
import { useGameProfiles } from '#/api/endpoints/api-auth/game-profile'
import { useGameProfileStore } from '#/hooks/use-game-profile-store'

/** 游戏档案选择器（页面级，可复用） */
export function GameProfileSelector() {
  const { data: profiles, isLoading } = useGameProfiles()
  const { selectedGameProfile, setSelectedGameProfile } = useGameProfileStore()

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
      <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
        <Gamepad2 className="h-4 w-4 text-muted-foreground" />
        <Skeleton className="h-5 w-40" />
      </div>
    )
  }

  // 无档案
  if (!profiles || profiles.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-card p-3 text-sm text-muted-foreground">
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
    <div className="flex items-center gap-2">
      <Gamepad2 className="h-4 w-4 text-muted-foreground" />
      <Select
        value={selectedGameProfile?.uuid ?? ''}
        onValueChange={(uuid) => {
          const profile = profiles?.find((p) => p.uuid === uuid)
          if (profile) setSelectedGameProfile(profile)
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="请选择游戏档案" />
        </SelectTrigger>
        <SelectContent>
          {profiles.map((profile) => (
            <SelectItem key={profile.uuid} value={profile.uuid}>
              {profile.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
