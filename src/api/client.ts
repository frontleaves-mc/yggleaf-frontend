/**
 * HTTP Client - API 请求核心封装
 * 基于 fetch，提供：
 * - 自动注入 Authorization Bearer Token
 * - 统一响应解包与错误处理
 * - 401 自动触发 Token 刷新（通过拦截器）
 * - 请求/响应日志（开发模式）
 */

import type { ApiResponse } from '#/api/types'
import { ApiError } from '#/api/types'
import { authStore } from '#/stores/auth-store'
import { API_BASE_URL, API_TIMEOUT, ACCESS_TOKEN_KEY } from '#/config/constants'
import { getCookie } from '#/lib/cookie'
import { handleUnauthorized } from './interceptors'

// ─── 类型定义 ──────────────────────────────────────────────

export interface RequestConfig {
  method?: string
  path: string
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
  /** 是否跳过认证头（公开接口使用） */
  skipAuth?: boolean
}

// ─── Client 实现 ────────────────────────────────────────────

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  /** 核心请求方法 */
  async request<T>(config: RequestConfig): Promise<T> {
    const url = `${this.baseURL}${config.path}`
    const headers = this.buildHeaders(config.headers, config.skipAuth)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)
    const signal = config.signal ?? controller.signal

    try {
      const response = await fetch(url, {
        method: config.method || 'GET',
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal,
      })

      clearTimeout(timeoutId)
      const data: ApiResponse<T> = await response.json()

      // 处理非 200 HTTP 状态码
      if (!response.ok) {
        // 401 → 清除认证，跳转 SSO 登录
        if (response.status === 401 && !config.skipAuth) {
          handleUnauthorized()
        }
        throw new ApiError(response.status, data)
      }

      // 校验业务状态码
      if (data.code !== 200 && data.code !== undefined) {
        throw new ApiError(response.status, data)
      }

      // 返回业务数据（优先 data 字段，否则返回整个响应）
      return (data.data ?? data) as T
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof ApiError) throw error
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('请求超时')
      }
      throw error
    }
  }

  /** 构建请求头（含 Token 注入，优先从 Cookie 读取） */
  private buildHeaders(
    customHeaders?: Record<string, string>,
    skipAuth = false,
  ): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    }

    if (!skipAuth) {
      const token = authStore.state.accessToken || getCookie(ACCESS_TOKEN_KEY)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  // ─── 便捷方法 ──────────────────────────────────────────

  get<T>(path: string, config?: Omit<RequestConfig, 'method' | 'path' | 'body'>) {
    return this.request<T>({ ...config, method: 'GET', path })
  }

  post<T>(path: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'path'>) {
    return this.request<T>({ ...config, method: 'POST', path, body })
  }

  patch<T>(path: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'path'>) {
    return this.request<T>({ ...config, method: 'PATCH', path, body })
  }

  delete<T>(path: string, config?: Omit<RequestConfig, 'method' | 'path' | 'body'>) {
    return this.request<T>({ ...config, method: 'DELETE', path })
  }
}

/** 全局 API Client 实例 */
export const apiClient = new ApiClient(API_BASE_URL)
