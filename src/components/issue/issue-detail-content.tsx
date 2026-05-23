/**
 * IssueDetailContent - 共享的问题详情内容组件
 * 被用户端和管理员端详情页共同复用
 */

import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { MarkdownRenderer } from '#/components/ui/markdown-renderer'
import { MarkdownEditor } from '#/components/ui/markdown-editor'
import { IssueAttachmentList } from './issue-attachment-list'
import type { IssueDetailResponse } from '#/api/types'
import { MessageSquare, Paperclip, Pencil, Loader2, Save } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { useState, useEffect } from 'react'
import { formatTime } from '#/lib/format'

interface IssueDetailContentProps {
  issueDetail: IssueDetailResponse
  canUpload?: boolean
  canDeleteAttachment?: boolean
  canEditContent?: boolean
  onSaveContent?: (content: string) => Promise<void>
}

export function IssueDetailContent({
  issueDetail,
  canUpload = false,
  canDeleteAttachment = false,
  canEditContent = false,
  onSaveContent,
}: IssueDetailContentProps) {
  const { issue, attachments } = issueDetail

  const [isEditing, setIsEditing] = useState(false)
  const [localContent, setLocalContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (issue.content !== undefined) {
      setLocalContent(issue.content)
    }
  }, [issue.content])

  const handleStartEdit = () => {
    if (!onSaveContent) return
    setLocalContent(issue.content)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setLocalContent(issue.content)
    setIsEditing(false)
  }

  const handleSaveContent = async () => {
    if (!onSaveContent) return
    setIsSaving(true)
    try {
      await onSaveContent(localContent)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* 问题内容 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            问题描述
            {canEditContent && !isEditing && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={handleStartEdit}
                    disabled={isSaving}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>编辑描述</TooltipContent>
              </Tooltip>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-3">
              <MarkdownEditor
                value={localContent}
                onChange={setLocalContent}
                maxLength={10000}
                minRows={8}
                disabled={isSaving}
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                >
                  取消
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveContent}
                  disabled={isSaving || localContent === issue.content}
                >
                  {isSaving ? (
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="mr-1 h-3.5 w-3.5" />
                  )}
                  保存
                </Button>
              </div>
            </div>
          ) : (
            <MarkdownRenderer content={issue.content} className="text-sm" />
          )}
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
