/**
 * 管理员 Matrix 警告 API 端点函数 + TanStack Query Hooks
 * 对接锋楪核心后端 (mcApiClient)
 *
 * 接口路径：/admin/matrix/warnings
 */

import { useQuery } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type {
  MatrixWarningListResponse,
  MatrixWarningDetailResponse,
  AdminMatrixWarningListParams,
} from '../../types/api-mc/matrix'

// ─── Query Keys ────────────────────────────────────────────

export const adminMatrixWarningsKey = [
  'admin',
  'mc',
  'matrix',
  'warnings',
] as const

export const adminMatrixWarningDetailKey = (id: string) =>
  [...adminMatrixWarningsKey, id] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 管理员查询 Matrix 警告列表（分页 + 多维度筛选） */
export async function getAdminMatrixWarnings(
  params?: AdminMatrixWarningListParams,
): Promise<MatrixWarningListResponse> {
  // 分页参数默认值
  const page = params?.page ?? 1
  const page_size = params?.page_size ?? 20

  const sp = new URLSearchParams()
  sp.set('page', String(page))
  sp.set('page_size', String(page_size))

  // 字符串类型参数：空字符串不筛选
  if (params?.player_uuid) sp.set('player_uuid', params.player_uuid)
  if (params?.warning_type) sp.set('warning_type', params.warning_type)
  if (params?.server_name) sp.set('server_name', params.server_name)
  if (params?.start_time) sp.set('start_time', params.start_time)
  if (params?.end_time) sp.set('end_time', params.end_time)

  // 数值类型参数：0 是有效值，用 != null 检查
  if (params?.risk_score_min != null) sp.set('risk_score_min', String(params.risk_score_min))
  if (params?.risk_score_max != null) sp.set('risk_score_max', String(params.risk_score_max))

  const qs = sp.toString()
  return mcApiClient.get<MatrixWarningListResponse>(
    qs ? `/admin/matrix/warnings?${qs}` : '/admin/matrix/warnings',
  )
}

/** 管理员查询 Matrix 警告详情 */
export async function getAdminMatrixWarningDetail(
  id: string,
): Promise<MatrixWarningDetailResponse> {
  return mcApiClient.get<MatrixWarningDetailResponse>(
    `/admin/matrix/warnings/${id}`,
  )
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 管理员 Matrix 警告列表 Query */
export function useAdminMatrixWarnings(params?: AdminMatrixWarningListParams) {
  return useQuery({
    queryKey: [
      ...adminMatrixWarningsKey,
      params?.page,
      params?.page_size,
      params?.player_uuid,
      params?.warning_type,
      params?.risk_score_min,
      params?.risk_score_max,
      params?.server_name,
      params?.start_time,
      params?.end_time,
    ],
    queryFn: () => getAdminMatrixWarnings(params),
  })
}

/** 管理员 Matrix 警告详情 Query */
export function useAdminMatrixWarningDetail(id: string) {
  return useQuery({
    queryKey: adminMatrixWarningDetailKey(id),
    queryFn: () => getAdminMatrixWarningDetail(id),
    enabled: !!id,
  })
}
