/**
 * 游戏档案选择状态 Hook
 * 提供选中档案的读取和设置操作
 */

import { useCallback } from 'react'
import { useStore } from '@tanstack/react-store'
import {
  gameProfileStore,
  setSelectedGameProfile as setProfile,
  clearSelectedGameProfile as clearProfile,
} from '#/stores/game-profile-store'
import type { GameProfile } from '#/api/types'

/** 返回选中的游戏档案和操作方法 */
export function useGameProfileStore() {
  const selectedGameProfile = useStore(
    gameProfileStore,
    (s) => s.selectedGameProfile,
  )

  const setSelectedGameProfile = useCallback((profile: GameProfile) => {
    setProfile(profile)
  }, [])

  const clearSelectedGameProfile = useCallback(() => {
    clearProfile()
  }, [])

  return {
    selectedGameProfile,
    setSelectedGameProfile,
    clearSelectedGameProfile,
  }
}
