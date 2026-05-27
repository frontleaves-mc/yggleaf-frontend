'use client'

/**
 * 聊天会话列表面板
 * 右侧边栏：频道区（公共聊天）+ 私聊区（API 会话列表）
 */

import { Hash, User, MessageCircle } from 'lucide-react'
import { cn } from '#/lib/utils'
import type { ConversationResponse } from '#/api/types'

// ─── 类型定义 ──────────────────────────────────────────────

export interface ChatConversationListProps {
  activeId: string
  onSelect: (id: string) => void
  isConnected: boolean
  /** 私聊会话列表（来自 API） */
  conversations: ConversationResponse[]
  /** 是否正在加载会话 */
  isLoadingConversations?: boolean
}

// ─── 子组件 ────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pt-3 pb-1.5">
      <span className="text-[11px] text-muted-foreground/50 uppercase tracking-wider font-medium select-none">
        {children}
      </span>
    </div>
  )
}

function ConversationEntry({
  id: _id,
  name,
  lastMessage,
  icon,
  active,
  badge,
  onClick,
}: {
  id: string
  name: string
  lastMessage?: string
  icon: React.ReactNode
  active: boolean
  badge?: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors duration-150 cursor-pointer',
        'hover:bg-white/[0.05]',
        active
          ? 'bg-mc-diamond/10 border-r-2 border-mc-diamond'
          : 'border-r-2 border-transparent',
      )}
    >
      <span className={cn(
        'shrink-0 [&>svg]:size-4 transition-colors duration-150',
        active ? 'text-mc-diamond' : 'text-muted-foreground/50',
      )}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className={cn(
            'text-[13px] truncate transition-colors duration-150',
            active ? 'text-foreground font-medium' : 'text-foreground/70',
          )}>
            {name}
          </span>
          {badge}
        </div>
        {lastMessage && (
          <p className="text-[11px] text-muted-foreground/40 truncate mt-0.5 leading-tight">
            {lastMessage}
          </p>
        )}
      </div>
    </button>
  )
}

function UnreadBadge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="shrink-0 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-mc-diamond text-[10px] font-bold text-white px-1">
      {count > 99 ? '99+' : count}
    </span>
  )
}

function ConnectionDot({ isConnected }: { isConnected: boolean }) {
  return (
    <span
      className={cn(
        'size-2 rounded-full shrink-0',
        isConnected
          ? 'bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]'
          : 'bg-muted-foreground/40',
      )}
    />
  )
}

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2">
      <div className="size-4 rounded-full bg-muted/40 animate-pulse" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-20 rounded bg-muted/40 animate-pulse" />
        <div className="h-2.5 w-32 rounded bg-muted/30 animate-pulse" />
      </div>
    </div>
  )
}

// ─── 主组件 ────────────────────────────────────────────────

export function ChatConversationList({
  activeId,
  onSelect,
  isConnected,
  conversations,
  isLoadingConversations,
}: ChatConversationListProps) {
  return (
    <div className="hidden md:flex w-[220px] shrink-0 flex-col border-l border-border/30 bg-muted/[0.06]">
      {/* ── 频道区 ── */}
      <SectionLabel>频道</SectionLabel>

      <ConversationEntry
        id="public"
        name="公共聊天"
        icon={<Hash />}
        active={activeId === 'public'}
        badge={<ConnectionDot isConnected={isConnected} />}
        onClick={() => onSelect('public')}
      />

      {/* ── 私聊区 ── */}
      <SectionLabel>私聊</SectionLabel>

      <div className="flex-1 overflow-y-auto min-h-0">
        {isLoadingConversations ? (
          <>
            <ConversationSkeleton />
            <ConversationSkeleton />
            <ConversationSkeleton />
          </>
        ) : conversations.length === 0 ? (
          <div className="px-3 py-4 text-center">
            <MessageCircle className="size-4 text-muted-foreground/20 mx-auto mb-1" />
            <p className="text-[11px] text-muted-foreground/40">
              暂无私聊会话
            </p>
          </div>
        ) : (
          conversations.map((conv) => {
            const convId = `dm:${conv.user_id}`
            return (
              <ConversationEntry
                key={convId}
                id={convId}
                name={conv.user_name}
                lastMessage={conv.last_message}
                icon={<User />}
                active={activeId === convId}
                badge={<UnreadBadge count={conv.unread_count} />}
                onClick={() => onSelect(convId)}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
