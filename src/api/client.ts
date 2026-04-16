/**
 * HTTP Client - API 请求核心封装
 * 基于 Axios，提供：
 * - 自动注入 Authorization Bearer Token
 * - 统一响应解包与错误处理
 * - 401 自动清除认证并重定向到 SSO 登录页（响应拦截器）
 * - 请求超时控制
 */

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '#/api/types'
import { ApiError } from '#/api/types'
import { authStore, clearAuth } from '#/stores/auth-store'
import { API_BASE_URL, API_TIMEOUT, ACCESS_TOKEN_KEY } from '#/config/constants'
import { getCookie } from '#/lib/cookie'

// ─── 类型定义 ──────────────────────────────────────────────

/** 扩展 Axios 请求配置，支持 skipAuth 标志 */
interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean
}

/** 公开请求配置（仅暴露 skipAuth） */
export interface RequestConfig {
  /** 是否跳过认证头（公开接口使用） */
  skipAuth?: boolean
}

// ─── 并发 401 去重锁 ───────────────────────────────────────

let isRedirecting = false

// ─── 内部 Axios 实例 ────────────────────────────────────────

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── 请求拦截器：自动注入 Token ─────────────────────────────

instance.interceptors.request.use(
  (config: CustomAxiosConfig) => {
    if (!config.skipAuth) {
      const token = authStore.state.accessToken || getCookie(ACCESS_TOKEN_KEY)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
)

// ─── 响应拦截器：统一解包 + 401 处理 ───────────────────────

instance.interceptors.response.use(
  // 成功响应：校验业务状态码
  (response) => {
    const data: ApiResponse = response.data

    if (data.code !== 200 && data.code !== undefined) {
      throw new ApiError(response.status, data)
    }

    return response
  },

  // 错误响应：HTTP 错误 + 401 特殊处理
  (error) => {
    // 网络错误 / 超时 / 被取消
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        throw new Error('请求超时')
      }
      throw error
    }

    const { status } = error.response

    // 401 → 清除认证 + 跳转登录页（带去重锁 + SSR 兼容）
    // 返回永远 pending 的 Promise，阻止错误传播到 TanStack Query catch 链
    if (status === 401 && !error.config?.skipAuth && !isRedirecting) {
      isRedirecting = true
      clearAuth()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return new Promise(() => {})
    }

    throw new ApiError(status, error.response.data)
  },
)

// ─── 响应解包工具 ──────────────────────────────────────────

/** 从 AxiosResponse 中提取并解包业务数据 */
function unwrapData<T>(response: { data: ApiResponse<T> }): T {
  const body = response.data
  return (body.data ?? body) as T
}

// ─── 公共 API（保持与原 Fetch 版本一致的调用签名） ─────────

class ApiClient {
  async get<T>(path: string, config?: RequestConfig): Promise<T> {
    const response = await instance.get<ApiResponse<T>>(path, {
      skipAuth: config?.skipAuth,
    } as CustomAxiosConfig)
    return unwrapData<T>(response)
  }

  async post<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const response = await instance.post<ApiResponse<T>>(path, body, {
      skipAuth: config?.skipAuth,
    } as CustomAxiosConfig)
    return unwrapData<T>(response)
  }

  async patch<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const response = await instance.patch<ApiResponse<T>>(path, body, {
      skipAuth: config?.skipAuth,
    } as CustomAxiosConfig)
    return unwrapData<T>(response)
  }

  async delete<T>(path: string, config?: RequestConfig): Promise<T> {
    const response = await instance.delete<ApiResponse<T>>(path, {
      skipAuth: config?.skipAuth,
    } as CustomAxiosConfig)
    return unwrapData<T>(response)
  }
}

/** 全局 API Client 实例 */
export const apiClient = new ApiClient()
