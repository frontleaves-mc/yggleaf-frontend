/**
 * 经济系统相关类型定义
 * 对接锋楪核心后端 (mcApiClient)
 */

// ─── 枚举类型 ──────────────────────────────────────────────

/** 交易类型 */
export enum TransactionType {
  /** 转账 */
  Transfer = 1,
  /** 管理员操作 */
  Admin = 2,
}

// ─── 响应类型 ──────────────────────────────────────────────

export interface BalanceDTO {
  balance: number
  balance_display: string
  currency: string
  player_uuid: string
}

export interface TransactionDTO {
  amount: number
  amount_display: string
  comment: string
  counterparty: string
  created_at: string
  id: number
  operator: string
  player_name: string
  player_uuid: string
  type: TransactionType
  type_name: string
}

export interface TransactionListResponse {
  list: TransactionDTO[]
  page: number
  page_size: number
  total: number
}

// ─── 查询参数 ──────────────────────────────────────────────

export interface AdminEconomyBalanceParams {
  player_uuid: string
}

export interface AdminEconomyTransactionListParams {
  page?: number
  page_size?: number
  player_uuid: string
}

export interface AdminEconomyAuditLogListParams {
  page?: number
  page_size?: number
  operator_uuid?: string
  player_uuid?: string
}

export interface UserEconomyTransactionListParams {
  page?: number
  page_size?: number
}
