'use client'

/**
 * 单条聊天消息组件 — 气泡模式（支持连续消息分组）
 *
 * 分组：连续同一人消息合并，只有首条显示名称行
 * 圆角：四角精确控制，衔接方向收窄，非衔接方向保持大圆角
 * 来源：每条消息独立显示来源图标，不受分组影响
 */

import type { ChatLogResponse } from '#/api/types'
import { PlayerName } from './player-name'
import { Monitor, Gamepad2 } from 'lucide-react'
import { cn } from '#/lib/utils'

const SOURCE_WEB = 2

type GroupPosition = 'single' | 'first' | 'middle' | 'last'

interface ChatMessageItemProps {
  message: ChatLogResponse
  currentPlayerName?: string | null
  isFirstInGroup: boolean
  isLastInGroup: boolean
  isSingleInGroup: boolean
}

function SourceIcon({
  source,
  className,
}: {
  source: number
  className?: string
}) {
  if (source === SOURCE_WEB) {
    return <Monitor className={cn('size-3', className)} />
  }
  return <Gamepad2 className={cn('size-3', className)} />
}

/**
 * 四角精确圆角
 *
 * 自己（右侧对齐）："自己侧"是右侧 → 衔接发生在右侧的上下角
 *   single:  左全大圆角 + 右上大 + 右下收缩（尾巴）
 *   first:   左全大圆角 + 右上大 + 右下收缩（下面还有，衔接）
 *   middle:  左全大圆角 + 右上收缩 + 右下收缩（上下衔接）
 *   last:    左全大圆角 + 右上收缩 + 右下大（尾巴恢复）
 *
 * 他人（左侧对齐）：镜像 → 衔接发生在左侧的上下角
 *   single:  右全大圆角 + 左上大 + 左下收缩
 *   first:   右全大圆角 + 左上大 + 左下收缩
 *   middle:  右全大圆角 + 左上收缩 + 左下收缩
 *   last:    右全大圆角 + 左上收缩 + 左下大
 */
const R = '1rem'
const S = '0.3rem'

function getBubbleRadius(isSelf: boolean, pos: GroupPosition) {
  if (isSelf) {
    const tl = R,
      bl = R // 左侧始终大圆角（对面侧）
    const tr = pos === 'middle' || pos === 'last' ? S : R
    const br = pos === 'single' || pos === 'first' || pos === 'middle' ? S : R
    return `rounded-tl-[${tl}] rounded-tr-[${tr}] rounded-br-[${br}] rounded-bl-[${bl}]`
  }
  const tr = R,
    br = R // 右侧始终大圆角（对面侧）
  const tl = pos === 'middle' || pos === 'last' ? S : R
  const bl = pos === 'single' || pos === 'first' || pos === 'middle' ? S : R
  return `rounded-tl-[${tl}] rounded-tr-[${tr}] rounded-br-[${br}] rounded-bl-[${bl}]`
}

export function ChatMessageItem({
  message,
  currentPlayerName,
  isFirstInGroup,
  isLastInGroup,
  isSingleInGroup,
}: ChatMessageItemProps) {
  const isSelf = message.player_name === currentPlayerName
  const position: GroupPosition = isSingleInGroup
    ? 'single'
    : isFirstInGroup
      ? 'first'
      : isLastInGroup
        ? 'last'
        : 'middle'

  const radiusClass = getBubbleRadius(isSelf, position)
  const gapClass = isFirstInGroup ? 'mt-2' : 'mt-[2px]'
  const innerTop = isFirstInGroup ? 'pt-2' : 'pt-1'

  if (isSelf) {
    return (
      <div className={cn('flex justify-end px-4', gapClass)}>
        <div
          className={cn(
            'max-w-[70%] px-3.5 pb-1.5',
            innerTop,
            radiusClass,
            'bg-mc-diamond/15 text-foreground/90',
            'text-sm leading-relaxed break-words',
          )}
        >
          <p>{message.message}</p>
          <div className="flex justify-end mt-0.5">
            <SourceIcon
              source={message.source}
              className="text-muted-foreground/25"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-start px-4', gapClass)}>
      {isFirstInGroup && (
        <div className="flex items-center gap-1.5 mb-0.5">
          <SourceIcon
            source={message.source}
            className={
              message.source === SOURCE_WEB
                ? 'text-blue-400/50'
                : 'text-muted-foreground/35'
            }
          />
          <span className="text-xs leading-none">
            <PlayerName name={message.player_name} />
          </span>
          {message.server_name && (
            <span className="text-[10px] text-muted-foreground/30">
              {message.server_name}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'max-w-[70%] px-3.5 pb-2',
          isFirstInGroup ? 'pt-2' : 'pt-1.5',
          radiusClass,
          'bg-muted/40 text-foreground/85',
          'text-sm leading-relaxed break-words',
        )}
      >
        {message.message}
      </div>
    </div>
  )
}
