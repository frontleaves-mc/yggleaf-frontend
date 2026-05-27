/**
 * 管理 Matrix 统计 API 端点函数 + TanStack Query Hooks
 * 对接锋楪核心后端 (mcApiClient)
 *
 * 接口路径：/admin/matrix/statistics/{uuid}
 */

import { useQuery } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type { MatrixStatisticResponse } from '#/api/types'

// ─── Query Keys ────────────────────────────────────────────

export const adminMatrixStatisticsKey = [
  'admin',
  'mc',
  'matrix',
  'statistics',
] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 管理员查询玩家 Matrix 统计 */
export async function getAdminMatrixStatistics(
  uuid: string,
): Promise<MatrixStatisticResponse> {
  return mcApiClient.get<MatrixStatisticResponse>(
    `/admin/matrix/statistics/${uuid}`,
  )
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 管理 Matrix 统计 Query */
export function useAdminMatrixStatistics(uuid: string) {
  return useQuery({
    queryKey: [...adminMatrixStatisticsKey, uuid],
    queryFn: () => getAdminMatrixStatistics(uuid),
    enabled: !!uuid,
  })
}
