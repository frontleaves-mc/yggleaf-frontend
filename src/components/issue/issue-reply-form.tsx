/**
 * IssueReplyForm - 回复表单组件
 */

import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { Textarea } from '#/components/ui/textarea'
import { useReplyIssueMutation } from '#/api/endpoints/issue'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'

interface IssueReplyFormProps {
  issueId: string
  disabled?: boolean
}

export function IssueReplyForm({ issueId, disabled = false }: IssueReplyFormProps) {
  const [content, setContent] = useState('')
  const replyMutation = useReplyIssueMutation(issueId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) return

    try {
      await replyMutation.mutateAsync({ content: trimmed })
      setContent('')
      toast.success('回复成功')
    } catch {
      toast.error('回复失败，请稍后重试')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={disabled ? '问题已关闭，无法回复' : '输入回复内容...'}
        disabled={disabled || replyMutation.isPending}
        rows={3}
        maxLength={5000}
        className="resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {content.length}/5000
        </span>
        <Button
          type="submit"
          size="sm"
          disabled={disabled || replyMutation.isPending || !content.trim()}
        >
          {replyMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          回复
        </Button>
      </div>
    </form>
  )
}
