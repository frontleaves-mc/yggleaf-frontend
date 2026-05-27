/**
 * 玩家 Matrix 统计 API 端点函数 + TanStack Query Hooks
 * 对接锋楪核心后端 (mcApiClient)
 *
 * 接口路径：/matrix/statistics/me (GET)
 */

import { useQuery } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type { MatrixStatisticResponse } from '#/api/types'

// ─── Query Keys ────────────────────────────────────────────

export const playerMatrixStatisticsKey = [
  'player',
  'mc',
  'matrix',
  'statistics',
] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 获取当前登录玩家的 Matrix 统计数据（后端从 Token 自动识别玩家） */
export async function getPlayerMatrixStatistics(): Promise<MatrixStatisticResponse> {
  return mcApiClient.get<MatrixStatisticResponse>('/matrix/statistics/me')
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 玩家 Matrix 统计 Query（自动查询当前登录玩家） */
export function usePlayerMatrixStatistics() {
  return useQuery({
    queryKey: playerMatrixStatisticsKey,
    queryFn: getPlayerMatrixStatistics,
  })
}
