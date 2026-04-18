/**
 * IssueReplyList - 回复时间线组件
 * 管理员回复带"管理"徽章，按时间排序
 */

import { Badge } from '#/components/ui/badge'
import { formatTime } from './issue-detail-content'
import type { IssueReplyItem } from '#/api/types'
import { User, Shield } from 'lucide-react'

interface IssueReplyListProps {
  replies: IssueReplyItem[]
}

export function IssueReplyList({ replies }: IssueReplyListProps) {
  if (replies.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        暂无回复
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <div
          key={reply.issue_reply.id}
          className={`rounded-lg border p-4 ${
            reply.issue_reply.is_admin_reply
              ? 'border-primary/20 bg-primary/5'
              : 'border-border bg-card'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {reply.issue_reply.is_admin_reply ? (
              <Shield className="h-4 w-4 text-primary" />
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">{reply.username}</span>
            {reply.issue_reply.is_admin_reply && (
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-primary/10 text-primary">
                管理
              </Badge>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {formatTime(reply.issue_reply.created_at)}
            </span>
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words pl-6">
            {reply.issue_reply.content}
          </div>
        </div>
      ))}
    </div>
  )
}
