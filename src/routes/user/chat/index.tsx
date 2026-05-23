/**
 * 用户端 - 实时聊天室页面
 * MC 游戏内风格，SSE 实时消息流 + 发送消息
 */

import { createFileRoute } from '@tanstack/react-router'
import { useReducer, useCallback } from 'react'
import { MessageCircle, Gamepad2 } from 'lucide-react'
import { UserPageLayout } from '#/components/public/user-page-layout'
import { GameProfileSelector } from '#/components/public/game-profile-selector'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { LoadingPage } from '#/components/public/loading-page'
import { ChatMessageList } from '#/components/chat/chat-message-list'
import { ChatInput } from '#/components/chat/chat-input'
import { ChatConnectionStatus } from '#/components/chat/chat-connection-status'
import { useChatStream } from '#/hooks/use-chat-stream'
import { useSendChatMessageMutation } from '#/api/endpoints/api-mc/user-message'
import type { ChatLogResponse, SSEChatMessage } from '#/api/types'
import { useGameProfileStore } from '#/hooks/use-game-profile-store'
import { toast } from 'sonner'

// ─── 路由注册 ──────────────────────────────────────────────

export const Route = createFileRoute('/user/chat/')({
  component: UserChatPage,
})

// ─── 消息状态管理 ──────────────────────────────────────────

const MAX_MESSAGES = 500

type MessageAction =
  | { type: 'INIT'; messages: ChatLogResponse[] }
  | { type: 'ADD'; message: ChatLogResponse }
  | { type: 'CLEAR' }

function messageReducer(
  state: ChatLogResponse[],
  action: MessageAction,
): ChatLogResponse[] {
  switch (action.type) {
    case 'INIT':
      return action.messages
    case 'ADD': {
      const next = [...state, action.message]
      return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next
    }
    case 'CLEAR':
      return []
  }
}

// ─── 页面组件 ──────────────────────────────────────────────

function UserChatPage() {
  const { selectedGameProfile } = useGameProfileStore()
  const uuid = selectedGameProfile?.uuid ?? null
  const [messages, dispatch] = useReducer(messageReducer, [])

  const handleInit = useCallback(
    (initMessages: ChatLogResponse[]) => {
      dispatch({ type: 'INIT', messages: initMessages })
    },
    [],
  )

  const handleChat = useCallback(
    (msg: SSEChatMessage) => {
      const chatMessage: ChatLogResponse = {
        id: `sse-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        player_uuid: '',
        player_name: msg.player_name,
        server_name: msg.server_name,
        world_name: '',
        message: msg.message,
        source: msg.source,
      }
      dispatch({ type: 'ADD', message: chatMessage })
    },
    [],
  )

  const { isConnected, reconnectCount } = useChatStream({
    enabled: !!uuid,
    onInit: handleInit,
    onChat: handleChat,
    onError: (err) => {
      toast.error(`聊天连接错误: ${err.message}`)
    },
  })

  const sendMutation = useSendChatMessageMutation()

  const handleSend = (message: string) => {
    if (!uuid) return
    sendMutation.mutate(
      { message, profile_uuid: uuid },
      {
        onError: () => {
          toast.error('消息发送失败')
        },
      },
    )
  }

  return (
    <UserPageLayout
      title="游戏聊天"
      description="实时连接游戏内聊天频道"
      icon={MessageCircle}
      variant="diamond"
      actions={<GameProfileSelector />}
    >
      {!uuid ? (
        <McCard variant="glass" color="default" className="border-dashed py-12 text-center">
          <McIconBox variant="diamond" size="lg" className="mx-auto mb-3 text-muted-foreground [&>svg]:text-muted-foreground">
            <Gamepad2 />
          </McIconBox>
          <p className="text-sm text-muted-foreground">请先选择游戏档案以连接聊天</p>
        </McCard>
      ) : (
        <McCard
          variant="solid"
          color="diamond"
          className="flex flex-col overflow-hidden"
          style={{ height: 'calc(100vh - 220px)', minHeight: '400px' }}
        >
          <ChatConnectionStatus
            isConnected={isConnected}
            reconnectCount={reconnectCount}
          />
          <ChatMessageList messages={messages} />
          <ChatInput
            onSend={handleSend}
            disabled={sendMutation.isPending}
          />
        </McCard>
      )}
    </UserPageLayout>
  )
}
