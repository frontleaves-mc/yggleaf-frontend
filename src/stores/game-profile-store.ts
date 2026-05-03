/**
 * 游戏档案选择状态管理 (TanStack Store)
 * 管理用户当前选中的游戏档案，持久化到 localStorage
 */

import { Store } from '@tanstack/store'
import { SELECTED_GAME_PROFILE_KEY } from '#/config/constants'
import type { GameProfile } from '#/api/types'

/** 游戏档案选择状态 */
export interface GameProfileState {
  /** 当前选中的游戏档案 */
  selectedGameProfile: GameProfile | null
}

/** 从 localStorage 恢复初始状态 */
function getInitialState(): GameProfileState {
  if (typeof window === 'undefined') {
    return {
      selectedGameProfile: null,
    }
  }

  try {
    const stored = localStorage.getItem(SELECTED_GAME_PROFILE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as GameProfile
      return { selectedGameProfile: parsed }
    }
  } catch {
    // Invalid JSON or storage unavailable — ignore
  }

  return {
    selectedGameProfile: null,
  }
}

/** 游戏档案选择状态 Store（全局单例） */
export const gameProfileStore = new Store<GameProfileState>(getInitialState())

// ─── Store Actions ──────────────────────────────────────────

/** 设置选中的游戏档案 */
export function setSelectedGameProfile(profile: GameProfile): void {
  localStorage.setItem(SELECTED_GAME_PROFILE_KEY, JSON.stringify(profile))
  gameProfileStore.setState(() => ({
    selectedGameProfile: profile,
  }))
}

/** 清除选中的游戏档案 */
export function clearSelectedGameProfile(): void {
  localStorage.removeItem(SELECTED_GAME_PROFILE_KEY)
  gameProfileStore.setState(() => ({
    selectedGameProfile: null,
  }))
}
