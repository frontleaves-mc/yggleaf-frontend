/**
 * SSE 实时聊天流连接 Hook
 *
 * 基于 fetch + ReadableStream 手动解析 SSE，因为标准 EventSource 不支持自定义 Header。
 * 支持 init（批量初始化）和 chat（实时消息）两种事件类型。
 * 内置指数退避自动重连 + 雪花 ID 精度保护。
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { authStore } from '#/stores/auth-store'
import { MC_API_BASE_URL, ACCESS_TOKEN_KEY } from '#/config/constants'
import { getCookie } from '#/lib/cookie'
import type { ChatLogResponse, SSEChatMessage } from '#/api/types/api-mc/message'

// ─── 类型定义 ──────────────────────────────────────────────

export interface UseChatStreamOptions {
  /** 是否启用连接（默认 true） */
  enabled?: boolean
  /** init 事件回调：连接建立时推送最近 50 条消息 */
  onInit: (messages: ChatLogResponse[]) => void
  /** chat 事件回调：实时聊天消息推送 */
  onChat: (message: SSEChatMessage) => void
  /** 错误回调 */
  onError?: (error: Error) => void
}

export interface UseChatStreamReturn {
  /** 是否已连接 */
  isConnected: boolean
  /** 重连次数 */
  reconnectCount: number
  /** 手动连接 */
  connect: () => void
  /** 手动断开 */
  disconnect: () => void
}

// ─── 雪花 ID 精度保护 ──────────────────────────────────────

// 与 client.ts 中保持一致的雪花 ID 正则
const UNSAFE_NUMBER_RE = /(?<=[:,[])\s*(\d{15,})\s*(?=[,\]}\s])/g

function safeParseSSE(data: string): unknown {
  const patched = data.replace(UNSAFE_NUMBER_RE, '"$1"')
  return JSON.parse(patched)
}

// ─── SSE 解析器 ────────────────────────────────────────────

interface SSEEvent {
  event: string
  data: string
}

/**
 * 从 SSE 文本流中解析出完整的事件。
 * SSE 格式：以 \n\n 分隔的事件块，每个块内 event: xxx / data: xxx 各占一行。
 */
function parseSSEChunk(buffer: string): { events: SSEEvent[]; remaining: string } {
  const events: SSEEvent[] = []
  const parts = buffer.split('\n\n')

  // 最后一段可能不完整，保留作为下一轮 buffer
  const remaining = parts.pop() ?? ''

  for (const part of parts) {
    if (!part.trim()) continue

    let event = 'message'
    let data = ''

    for (const line of part.split('\n')) {
      if (line.startsWith('event:')) {
        event = line.slice(6).trim()
      } else if (line.startsWith('data:')) {
        data = line.slice(5).trim()
      }
    }

    if (data) {
      events.push({ event, data })
    }
  }

  return { events, remaining }
}

// ─── Token 读取 ──────────────────────────────────────────────

function getAccessToken(): string | null {
  return authStore.state.accessToken || getCookie(ACCESS_TOKEN_KEY) || null
}

// ─── Hook 实现 ──────────────────────────────────────────────

export function useChatStream(options: UseChatStreamOptions): UseChatStreamReturn {
  const { enabled = true, onInit, onChat, onError } = options

  const [isConnected, setIsConnected] = useState(false)
  const [reconnectCount, setReconnectCount] = useState(0)

  const abortRef = useRef<AbortController | null>(null)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectCountRef = useRef(0)
  const enabledRef = useRef(enabled)
  const onInitRef = useRef(onInit)
  const onChatRef = useRef(onChat)
  const onErrorRef = useRef(onError)

  // 保持回调 ref 最新
  useEffect(() => {
    onInitRef.current = onInit
    onChatRef.current = onChat
    onErrorRef.current = onError
  })

  enabledRef.current = enabled

  const cleanup = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
    setIsConnected(false)
  }, [])

  const doConnect = useCallback(() => {
    // 清理旧连接
    cleanup()

    const token = getAccessToken()
    if (!token) {
      onErrorRef.current?.(new Error('未获取到 Access Token'))
      return
    }

    if (!enabledRef.current) return

    const controller = new AbortController()
    abortRef.current = controller

    const url = `${MC_API_BASE_URL}/user/messages/chat/stream`

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'text/event-stream',
      },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`SSE 连接失败: ${response.status}`)
        }
        if (!response.body) {
          throw new Error('浏览器不支持 ReadableStream')
        }

        setIsConnected(true)
        setReconnectCount(0)
        reconnectCountRef.current = 0

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        const processChunk = (): Promise<void> => {
          return reader.read().then(({ done, value }) => {
            if (done) {
              setIsConnected(false)
              scheduleReconnect()
              return
            }

            buffer += decoder.decode(value, { stream: true })
            const { events, remaining } = parseSSEChunk(buffer)
            buffer = remaining

            for (const evt of events) {
              try {
                if (evt.event === 'init') {
                  const messages = safeParseSSE(evt.data) as ChatLogResponse[]
                  onInitRef.current(messages)
                } else if (evt.event === 'chat') {
                  const message = safeParseSSE(evt.data) as SSEChatMessage
                  onChatRef.current(message)
                }
              } catch {
                // JSON 解析失败，忽略该事件
              }
            }

            return processChunk()
          })
        }

        return processChunk()
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setIsConnected(false)
        onErrorRef.current?.(err instanceof Error ? err : new Error(String(err)))
        scheduleReconnect()
      })
  }, [cleanup])

  const scheduleReconnect = useCallback(() => {
    if (!enabledRef.current) return

    reconnectCountRef.current += 1
    setReconnectCount(reconnectCountRef.current)

    const delay = Math.min(1000 * 2 ** (reconnectCountRef.current - 1), 30000)

    reconnectTimerRef.current = setTimeout(() => {
      if (enabledRef.current) {
        doConnect()
      }
    }, delay)
  }, [doConnect])

  const disconnect = useCallback(() => {
    enabledRef.current = false
    cleanup()
  }, [cleanup])

  const connect = useCallback(() => {
    enabledRef.current = true
    setReconnectCount(0)
    reconnectCountRef.current = 0
    doConnect()
  }, [doConnect])

  // 自动连接/断开
  useEffect(() => {
    if (enabled) {
      doConnect()
    } else {
      cleanup()
    }
    return () => {
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  return { isConnected, reconnectCount, connect, disconnect }
}
