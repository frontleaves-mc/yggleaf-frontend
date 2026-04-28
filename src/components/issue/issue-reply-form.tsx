/**
 * IssueReplyForm - 回复表单组件
 * 使用 InputGroup 复合组件体系，精致玻璃态设计
 */

import { useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from '#/components/ui/input-group'
import { useReplyIssueMutation } from '#/api/endpoints/api-auth/issue'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '#/lib/utils'

interface IssueReplyFormProps {
  issueId: string
  disabled?: boolean
}

const MAX_LENGTH = 5000

export function IssueReplyForm({
  issueId,
  disabled = false,
}: IssueReplyFormProps) {
  const [content, setContent] = useState('')
  const replyMutation = useReplyIssueMutation(issueId)

  const isDisabled = disabled || replyMutation.isPending
  const charCount = content.length
  const charRatio = charCount / MAX_LENGTH
  const isNearLimit = charRatio > 0.9
  const isAtLimit = charRatio >= 1

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
    <form onSubmit={handleSubmit}>
      <InputGroup
        className={cn(
          'w-full overflow-hidden rounded-xl border-border/60 bg-card shadow-sm',
          'transition-all duration-200 ease-out',
          'has-[[data-slot=input-group-control]:focus-visible]:shadow-md has-[[data-slot=input-group-control]:focus-visible]:border-primary/30',
          'has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-primary/10',
          isDisabled && 'opacity-50 pointer-events-none',
        )}
        data-disabled={isDisabled || undefined}
      >
        <InputGroupTextarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={disabled ? '问题已关闭，无法回复' : '输入回复内容...'}
          disabled={isDisabled}
          maxLength={MAX_LENGTH}
          className="min-h-20 px-4 text-sm leading-relaxed placeholder:text-muted-foreground/50"
        />
        <InputGroupAddon
          align="block-end"
          className="border-t border-border/40 bg-muted/20 px-4 py-2.5"
        >
          <InputGroupText
            className={cn(
              'ml-auto tabular-nums text-xs tracking-wide transition-colors duration-200',
              isAtLimit && 'font-semibold text-destructive',
              isNearLimit && !isAtLimit && 'text-amber-600 dark:text-amber-400',
              !isNearLimit && 'text-muted-foreground',
            )}
          >
            {charCount.toLocaleString()}/{MAX_LENGTH.toLocaleString()}
          </InputGroupText>
          <InputGroupButton
            type="submit"
            size="sm"
            variant="default"
            className="ml-3 gap-1.5 rounded-lg px-3 text-xs font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.97]"
            disabled={isDisabled || !content.trim()}
          >
            {replyMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            回复
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
