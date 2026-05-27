/**
 * 用户端 - 实时聊天室页面
 * MC 游戏内风格，SSE 实时消息流 + 发送消息
 * 支持公共频道 + 私聊双模式（侧边栏切换）
 */

import { createFileRoute } from '@tanstack/react-router'
import { useReducer, useCallback, useState, useRef } from 'react'
import { MessageCircle, Gamepad2 } from 'lucide-react'
import { UserPageLayout } from '#/components/public/user-page-layout'
import { GameProfileSelector } from '#/components/public/game-profile-selector'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { ChatContainer } from '#/components/chat/chat-container'
import { ChatMessageList } from '#/components/chat/chat-message-list'
import { ChatInput } from '#/components/chat/chat-input'
import { ChatConnectionStatus } from '#/components/chat/chat-connection-status'
import { ChatConversationList } from '#/components/chat/chat-conversation-list'
import { ChatDMView } from '#/components/chat/chat-dm-view'
import { useChatStream } from '#/hooks/use-chat-stream'
import {
  useSendChatMessageMutation,
  useUserConversations,
  useSendDMMutation,
  useMarkAsReadMutation,
  DM_CONVERSATIONS_QUERY_KEY,
  DM_MESSAGES_QUERY_KEY,
  DM_UNREAD_QUERY_KEY,
} from '#/api/endpoints/api-mc/user-message'
import type { ChatLogResponse, SSEChatMessage, SSEDirectMessage } from '#/api/types'
import { useGameProfileStore } from '#/hooks/use-game-profile-store'
import { useQueryClient } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()
  const { selectedGameProfile } = useGameProfileStore()
  const uuid = selectedGameProfile?.uuid ?? null
  const playerName = selectedGameProfile?.name ?? null
  const userId = String(selectedGameProfile?.user_id ?? '')
  const [messages, dispatch] = useReducer(messageReducer, [])

  /** 当前选中的会话 ID，默认为公共频道 */
  const [activeConversationId, setActiveConversationId] = useState('public')
  const activeConversationIdRef = useRef(activeConversationId)
  activeConversationIdRef.current = activeConversationId

  // ─── DM Hooks ──────────────────────────────────────────

  const { data: conversationsData, isLoading: isConversationsLoading } =
    useUserConversations()
  const sendDMMutation = useSendDMMutation()
  const markAsReadMutation = useMarkAsReadMutation()

  const conversations = conversationsData?.list ?? []

  // ─── SSE 回调 ──────────────────────────────────────────

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

  const handleDm = useCallback(
    (dm: SSEDirectMessage) => {
      const dmConvId = `dm:${dm.sender_id}`
      if (activeConversationIdRef.current === dmConvId) {
        // 当前正在与发送者对话 → 刷新消息列表 + 自动标记已读
        queryClient.invalidateQueries({ queryKey: DM_MESSAGES_QUERY_KEY })
        markAsReadMutation.mutate({ sender_id: dm.sender_id })
      } else {
        // 不在当前对话 → 刷新会话列表和未读数
        queryClient.invalidateQueries({ queryKey: DM_CONVERSATIONS_QUERY_KEY })
        queryClient.invalidateQueries({ queryKey: DM_UNREAD_QUERY_KEY })
        toast.info(`${dm.sender_name}: ${dm.message.slice(0, 50)}`)
      }
    },
    [queryClient, markAsReadMutation],
  )

  const { isConnected, reconnectCount } = useChatStream({
    enabled: !!uuid,
    onInit: handleInit,
    onChat: handleChat,
    onDm: handleDm,
    onError: (err) => {
      toast.error(`聊天连接错误: ${err.message}`)
    },
  })

  // ─── 公共聊天发送 ──────────────────────────────────────

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

  // ─── 私聊发送 ──────────────────────────────────────────

  const handleSendDM = (message: string) => {
    if (!activeConversationId.startsWith('dm:')) return
    const targetUserId = activeConversationId.slice(3)
    sendDMMutation.mutate(
      { message, receiver_id: targetUserId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: DM_MESSAGES_QUERY_KEY })
        },
        onError: () => {
          toast.error('私信发送失败')
        },
      },
    )
  }

  // ─── 会话切换时标记已读 ──────────────────────────────────

  const handleConversationSelect = (id: string) => {
    setActiveConversationId(id)
    if (id.startsWith('dm:')) {
      const senderId = id.slice(3)
      markAsReadMutation.mutate({ sender_id: senderId })
    }
  }

  // ─── 获取当前 DM 会话对象信息 ──────────────────────────────

  const currentDMConversation = activeConversationId.startsWith('dm:')
    ? conversations.find((c) => `dm:${c.user_id}` === activeConversationId)
    : null

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
        <ChatContainer
          className="flex flex-row overflow-hidden"
          style={{ height: 'calc(100vh - 220px)', minHeight: '400px' }}
        >
          {/* ── 左侧：聊天区域 ── */}
          <div className="flex-1 flex flex-col min-w-0">
            <ChatConnectionStatus
              isConnected={isConnected}
              reconnectCount={reconnectCount}
            />

            {activeConversationId === 'public' ? (
              <>
                <ChatMessageList messages={messages} currentPlayerName={playerName} />
                <ChatInput
                  onSend={handleSend}
                  disabled={sendMutation.isPending}
                />
              </>
            ) : currentDMConversation ? (
              <ChatDMView
                targetUserId={currentDMConversation.user_id}
                targetUserName={currentDMConversation.user_name}
                currentUserId={userId}
                currentPlayerName={playerName ?? ''}
                onSend={handleSendDM}
                sendPending={sendDMMutation.isPending}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                选择一个会话开始聊天
              </div>
            )}
          </div>

          {/* ── 右侧：会话列表 ── */}
          <ChatConversationList
            activeId={activeConversationId}
            onSelect={handleConversationSelect}
            isConnected={isConnected}
            conversations={conversations}
            isLoadingConversations={isConversationsLoading}
          />
        </ChatContainer>
      )}
    </UserPageLayout>
  )
}
