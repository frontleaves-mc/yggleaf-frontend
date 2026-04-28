/**
 * IssueDetailContent - 共享的问题详情内容组件
 * 被用户端和管理员端详情页共同复用
 */

import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { IssueAttachmentList } from './issue-attachment-list'
import type { IssueDetailResponse } from '#/api/types'
import { MessageSquare, Paperclip } from 'lucide-react'

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
  const { issue, attachments } = issueDetail

  return (
    <div className="space-y-4">
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
                <span className="text-xs font-normal">
                  ({attachments.length})
                </span>
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
