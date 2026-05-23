'use client'

/**
 * 聊天会话列表面板
 * 右侧边栏：频道区（公共聊天）+ 私聊区（联系人列表）
 */

import { Hash, MessageCircle, User } from 'lucide-react'
import { cn } from '#/lib/utils'

// ─── 类型定义 ──────────────────────────────────────────────

interface ConversationItem {
  id: string
  name: string
  lastMessage?: string
  unread?: number
}

export interface ChatConversationListProps {
  activeId: string
  onSelect: (id: string) => void
  isConnected: boolean
}

// ─── 占位数据（后端私聊 API 就绪后移除）──────────────────────

const PRIVATE_CHATS: ConversationItem[] = [
  { id: 'private-steve', name: 'Steve', lastMessage: '一起去挖矿吧！', unread: 2 },
  { id: 'private-alex', name: 'Alex', lastMessage: '好的', unread: 0 },
  { id: 'private-notch', name: 'Notch', lastMessage: '明天见', unread: 1 },
]

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
  item,
  icon,
  active,
  badge,
  onClick,
}: {
  item: ConversationItem
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
            {item.name}
          </span>
          {badge}
        </div>
        {item.lastMessage && (
          <p className="text-[11px] text-muted-foreground/40 truncate mt-0.5 leading-tight">
            {item.lastMessage}
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

// ─── 主组件 ────────────────────────────────────────────────

export function ChatConversationList({
  activeId,
  onSelect,
  isConnected,
}: ChatConversationListProps) {
  return (
    <div className="hidden md:flex w-[220px] shrink-0 flex-col border-l border-border/30 bg-muted/[0.06]">
      {/* ── 频道区 ── */}
      <SectionLabel>频道</SectionLabel>

      <ConversationEntry
        item={{ id: 'public', name: '公共聊天' }}
        icon={<Hash />}
        active={activeId === 'public'}
        badge={<ConnectionDot isConnected={isConnected} />}
        onClick={() => onSelect('public')}
      />

      {/* ── 私聊区 ── */}
      <SectionLabel>私聊</SectionLabel>

      <div className="flex-1 overflow-y-auto min-h-0">
        {PRIVATE_CHATS.length === 0 ? (
          <div className="px-3 py-4 text-center">
            <p className="text-[11px] text-muted-foreground/40">
              暂无私聊会话
            </p>
          </div>
        ) : (
          PRIVATE_CHATS.map((chat) => (
            <ConversationEntry
              key={chat.id}
              item={chat}
              icon={<User />}
              active={activeId === chat.id}
              badge={<UnreadBadge count={chat.unread ?? 0} />}
              onClick={() => onSelect(chat.id)}
            />
          ))
        )}
      </div>

      {/* ── 底部提示 ── */}
      <div className="px-3 py-2 border-t border-border/15">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/35">
          <MessageCircle className="size-3" />
          <span>私聊功能即将上线</span>
        </div>
      </div>
    </div>
  )
}
