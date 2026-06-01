/**
 * 管理员经济系统 API 端点函数 + TanStack Query Hooks
 * 对接锋楪核心后端 (mcApiClient)
 *
 * 接口路径：/admin/economy
 */

import { useQuery } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type {
  BalanceDTO,
  TransactionListResponse,
  AdminEconomyBalanceParams,
  AdminEconomyTransactionListParams,
  AdminEconomyAuditLogListParams,
} from '../../types/api-mc/economy'

// ─── Query Keys ────────────────────────────────────────────

export const adminEconomyKey = ['admin', 'mc', 'economy'] as const

export const adminEconomyBalanceKey = [...adminEconomyKey, 'balance'] as const

export const adminEconomyTransactionsKey = [
  ...adminEconomyKey,
  'transactions',
] as const

export const adminEconomyAuditLogsKey = [
  ...adminEconomyKey,
  'audit-logs',
] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 管理员查询玩家经济余额 */
export async function getAdminEconomyBalance(
  params: AdminEconomyBalanceParams,
): Promise<BalanceDTO> {
  const sp = new URLSearchParams()
  sp.set('player_uuid', params.player_uuid)

  return mcApiClient.get<BalanceDTO>(
    `/admin/economy/balance?${sp.toString()}`,
  )
}

/** 管理员查询玩家交易记录（分页） */
export async function getAdminEconomyTransactions(
  params: AdminEconomyTransactionListParams,
): Promise<TransactionListResponse> {
  const page = params.page ?? 1
  const page_size = params.page_size ?? 20

  const sp = new URLSearchParams()
  sp.set('page', String(page))
  sp.set('page_size', String(page_size))
  sp.set('player_uuid', params.player_uuid)

  return mcApiClient.get<TransactionListResponse>(
    `/admin/economy/transactions?${sp.toString()}`,
  )
}

/** 管理员查询经济审计日志（分页 + 多维度筛选） */
export async function getAdminEconomyAuditLogs(
  params?: AdminEconomyAuditLogListParams,
): Promise<TransactionListResponse> {
  const page = params?.page ?? 1
  const page_size = params?.page_size ?? 20

  const sp = new URLSearchParams()
  sp.set('page', String(page))
  sp.set('page_size', String(page_size))

  if (params?.operator_uuid) sp.set('operator_uuid', params.operator_uuid)
  if (params?.player_uuid) sp.set('player_uuid', params.player_uuid)

  const qs = sp.toString()
  return mcApiClient.get<TransactionListResponse>(
    qs ? `/admin/economy/audit-logs?${qs}` : '/admin/economy/audit-logs',
  )
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 管理员经济余额 Query */
export function useAdminEconomyBalance(params: AdminEconomyBalanceParams) {
  return useQuery({
    queryKey: [...adminEconomyBalanceKey, params.player_uuid],
    queryFn: () => getAdminEconomyBalance(params),
    enabled: !!params.player_uuid,
  })
}

/** 管理员交易记录 Query */
export function useAdminEconomyTransactions(
  params: AdminEconomyTransactionListParams,
) {
  return useQuery({
    queryKey: [
      ...adminEconomyTransactionsKey,
      params.page,
      params.page_size,
      params.player_uuid,
    ],
    queryFn: () => getAdminEconomyTransactions(params),
    enabled: !!params.player_uuid,
  })
}

/** 管理员经济审计日志 Query */
export function useAdminEconomyAuditLogs(
  params?: AdminEconomyAuditLogListParams,
) {
  return useQuery({
    queryKey: [
      ...adminEconomyAuditLogsKey,
      params?.page,
      params?.page_size,
      params?.operator_uuid,
      params?.player_uuid,
    ],
    queryFn: () => getAdminEconomyAuditLogs(params),
  })
}
