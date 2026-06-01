/**
 * 玩家经济系统 API 端点函数 + TanStack Query Hooks
 * 对接锋楪核心后端 (mcApiClient)
 *
 * 接口路径：
 *   /user/economy/balance (GET)
 *   /user/economy/transactions (GET)
 */

import { useQuery } from '@tanstack/react-query'
import { mcApiClient } from '../../client'
import type { BalanceDTO, TransactionListResponse, UserEconomyTransactionListParams } from '../../types/api-mc/economy'

// ─── Query Keys ────────────────────────────────────────────

export const userEconomyBalanceKey = ['user', 'mc', 'economy', 'balance'] as const
export const userEconomyTransactionsKey = ['user', 'mc', 'economy', 'transactions'] as const

// ─── 端点函数 ──────────────────────────────────────────────

/** 获取当前登录玩家的经济余额（后端从 Token 自动识别玩家） */
export async function getUserEconomyBalance(): Promise<BalanceDTO> {
  return mcApiClient.get<BalanceDTO>('/user/economy/balance')
}

/** 获取当前登录玩家的交易记录 */
export async function getUserEconomyTransactions(
  params?: UserEconomyTransactionListParams,
): Promise<TransactionListResponse> {
  const sp = new URLSearchParams()
  sp.set('page', String(params?.page ?? 1))
  sp.set('page_size', String(params?.page_size ?? 20))
  return mcApiClient.get<TransactionListResponse>(`/user/economy/transactions?${sp.toString()}`)
}

// ─── TanStack Query Hooks ──────────────────────────────────

/** 玩家经济余额 Query（自动查询当前登录玩家） */
export function useUserEconomyBalance() {
  return useQuery({
    queryKey: userEconomyBalanceKey,
    queryFn: getUserEconomyBalance,
  })
}

/** 玩家交易记录 Query */
export function useUserEconomyTransactions(params?: UserEconomyTransactionListParams) {
  return useQuery({
    queryKey: [...userEconomyTransactionsKey, params?.page, params?.page_size],
    queryFn: () => getUserEconomyTransactions(params),
  })
}
