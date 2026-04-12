/**
 * API 统一响应类型
 * 所有 Yggleaf API 接口均遵循此响应格式
 */

/** 标准业务响应（含 data 泛型） */
export interface ApiResponse<T = unknown> {
  /** 业务状态码（200 = 成功） */
  code: number
  /** 人类可读描述信息 */
  message: string
  /** 请求追踪标识（X-Request-UUID） */
  context: string
  /** 补充性错误详情（仅错误时） */
  error_message?: string
  /** 输出标识（Success / PARAMETER_ERROR 等） */
  output?: string
  /** 处理耗时（微秒，调试模式） */
  overhead?: number
  /** 实际业务数据 */
  data?: T
}

/** 分页响应包装 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  /** 总记录数 */
  total?: number
  /** 当前页码 */
  page?: number
  /** 每页大小 */
  page_size?: number
}

/** API 错误类 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public data: ApiResponse,
  ) {
    super(data.message || `API Error ${status}`)
    this.name = 'ApiError'
  }
}
