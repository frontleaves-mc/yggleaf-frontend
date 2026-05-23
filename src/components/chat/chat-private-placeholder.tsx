'use client'

/**
 * 私聊功能占位组件
 * 当选中私聊会话时，在聊天区域展示的空状态
 */

import { MessageSquare } from 'lucide-react'
import { McIconBox } from '#/components/shared/mc-icon-box'

export function ChatPrivatePlaceholder() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12 px-4">
      <McIconBox
        variant="diamond"
        size="lg"
        className="text-muted-foreground/40 [&>svg]:text-muted-foreground/40"
      >
        <MessageSquare />
      </McIconBox>
      <div className="text-center space-y-1.5">
        <p className="text-sm font-medium text-muted-foreground/70">
          私聊功能即将上线
        </p>
        <p className="text-xs text-muted-foreground/40 max-w-[240px]">
          您将可以与其他玩家进行一对一的私密对话
        </p>
      </div>
    </div>
  )
}
