/**
 * IssueDetailContent - 共享的问题详情内容组件
 * 被用户端和管理员端详情页共同复用
 */

import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { IssueStatusBadge } from './issue-status-badge'
import { IssuePriorityBadge } from './issue-priority-badge'
import { IssueAttachmentList } from './issue-attachment-list'
import type { IssueDetailResponse } from '#/api/types'
import { MessageSquare, Paperclip, Clock } from 'lucide-react'

interface IssueDetailContentProps {
  issueDetail: IssueDetailResponse
  canUpload?: boolean
  canDeleteAttachment?: boolean
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function IssueDetailContent({
  issueDetail,
  canUpload = false,
  canDeleteAttachment = false,
}: IssueDetailContentProps) {
  const { issue, issue_type, attachments } = issueDetail

  return (
    <div className="space-y-4">
      {/* 标题与元信息 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <IssueStatusBadge status={issue.status} />
            <IssuePriorityBadge priority={issue.priority} />
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {issue_type.name}
            </span>
          </div>
          <CardTitle className="text-xl leading-snug">{issue.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              提交于 {formatTime(issue.created_at)}
            </span>
            {issue.updated_at !== issue.created_at && (
              <span className="inline-flex items-center gap-1">
                更新于 {formatTime(issue.updated_at)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 问题内容 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            问题描述
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {issue.content}
          </div>
        </CardContent>
      </Card>

      {/* 附件 */}
      {((attachments && attachments.length > 0) || canUpload) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Paperclip className="h-3.5 w-3.5" />
              附件
              {attachments.length > 0 && (
                <span className="text-xs font-normal">({attachments.length})</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IssueAttachmentList
              attachments={attachments}
              issueId={issue.id}
              canUpload={canUpload}
              canDelete={canDeleteAttachment}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export { formatTime }
