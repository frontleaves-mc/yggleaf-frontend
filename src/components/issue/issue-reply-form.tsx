import { useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from '#/components/ui/input-group'
import { useReplyIssueMutation } from '#/api/endpoints/api-auth/issue'
import { MarkdownRenderer } from '#/components/ui/markdown-renderer'
import { Loader2, Send, Bold, Italic, Code, Eye, Pencil, Quote, List, ListOrdered, Heading1, Heading2, Heading3, Link as LinkIcon } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '#/lib/utils'

interface IssueReplyFormProps {
  issueId: string
  disabled?: boolean
}

const MAX_LENGTH = 5000

function insertAtCursor(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  onInsert: (v: string) => void,
  currentValue: string,
  linePrefix = false,
) {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = currentValue.substring(start, end)
  let next: string

  if (linePrefix) {
    const lines = currentValue.split('\n')
    const sLine = currentValue.substring(0, start).split('\n').length - 1
    const eLine = currentValue.substring(0, end).split('\n').length - 1
    for (let i = sLine; i <= eLine && i < lines.length; i++) {
      if (!lines[i].startsWith(before.trim())) lines[i] = before + lines[i]
    }
    next = lines.join('\n')
  } else {
    next =
      currentValue.substring(0, start) +
      before +
      selected +
      after +
      currentValue.substring(end)
  }

  onInsert(next)

  requestAnimationFrame(() => {
    const pos = linePrefix ? start + before.length : start + before.length + selected.length
    textarea.selectionStart = pos
    textarea.selectionEnd = pos
    textarea.focus()
  })
}

export function IssueReplyForm({
  issueId,
  disabled = false,
}: IssueReplyFormProps) {
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState(false)
  const replyMutation = useReplyIssueMutation(issueId)

  const isDisabled = disabled || replyMutation.isPending
  const charCount = content.length
  const charRatio = charCount / MAX_LENGTH
  const isNearLimit = charRatio > 0.9
  const isAtLimit = charRatio >= 1

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) return

    try {
      await replyMutation.mutateAsync({ content: trimmed })
      setContent('')
      setPreview(false)
      toast.success('回复成功')
    } catch {
      toast.error('回复失败，请稍后重试')
    }
  }

  const handleInsert = (before: string, after: string, linePrefix = false) => {
    const ta = document.querySelector<HTMLTextAreaElement>(
      '[data-slot="reply-textarea"]',
    )
    if (ta) insertAtCursor(ta, before, after, setContent, content, linePrefix)
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
        {preview ? (
          <div className="min-h-20 px-4 py-3 w-full text-left">
            {content.trim() ? (
              <MarkdownRenderer content={content} className="text-sm" />
            ) : (
              <span className="text-sm text-muted-foreground/50">
                暂无内容预览
              </span>
            )}
          </div>
        ) : (
          <InputGroupTextarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={disabled ? '问题已关闭，无法回复' : '输入回复内容...（支持 Markdown）'}
            disabled={isDisabled}
            maxLength={MAX_LENGTH}
            data-slot="reply-textarea"
            className="min-h-20 px-4 text-sm leading-relaxed placeholder:text-muted-foreground/50"
          />
        )}

        <InputGroupAddon
          align="block-end"
          className="border-t border-border/40 bg-muted/20 px-3 py-1.5"
        >
          {!preview ? (
            <div className="flex items-center gap-0.5 mr-auto overflow-x-auto">
              <InputGroupButton
                type="button"
                variant="ghost"
                size="xs"
                title="标题 1"
                onClick={() => handleInsert('# ', '', true)}
                className="h-6 w-6 p-0"
              >
                <Heading1 className="size-3" />
              </InputGroupButton>
              <InputGroupButton
                type="button"
                variant="ghost"
                size="xs"
                title="标题 2"
                onClick={() => handleInsert('## ', '', true)}
                className="h-6 w-6 p-0"
              >
                <Heading2 className="size-3" />
              </InputGroupButton>
              <InputGroupButton
                type="button"
                variant="ghost"
                size="xs"
                title="标题 3"
                onClick={() => handleInsert('### ', '', true)}
                className="h-6 w-6 p-0"
              >
                <Heading3 className="size-3" />
              </InputGroupButton>

              <span className="mx-0.5 h-3 w-px bg-border/60" />

              <InputGroupButton
                type="button"
                variant="ghost"
                size="xs"
                title="粗体"
                onClick={() => handleInsert('**', '**')}
                className="h-6 w-6 p-0"
              >
                <Bold className="size-3" />
              </InputGroupButton>
              <InputGroupButton
                type="button"
                variant="ghost"
                size="xs"
                title="斜体"
                onClick={() => handleInsert('*', '*')}
                className="h-6 w-6 p-0"
              >
                <Italic className="size-3" />
              </InputGroupButton>
              <InputGroupButton
                type="button"
                variant="ghost"
                size="xs"
                title="行内代码"
                onClick={() => handleInsert('`', '`')}
                className="h-6 w-6 p-0"
              >
                <Code className="size-3" />
              </InputGroupButton>
              <InputGroupButton
                type="button"
                variant="ghost"
                size="xs"
                title="代码块"
                onClick={() => handleInsert('```\n', '\n```')}
                className="h-6 w-6 p-0 text-[9px] font-mono font-bold"
              >
                {'{ }'}
              </InputGroupButton>

              <span className="mx-0.5 h-3 w-px bg-border/60" />

              <InputGroupButton
                type="button"
                variant="ghost"
                size="xs"
                title="引用"
                onClick={() => handleInsert('> ', '', true)}
                className="h-6 w-6 p-0"
              >
                <Quote className="size-3" />
              </InputGroupButton>
              <InputGroupButton
                type="button"
                variant="ghost"
                size="xs"
                title="无序列表"
                onClick={() => handleInsert('- ', '', true)}
                className="h-6 w-6 p-0"
              >
                <List className="size-3" />
              </InputGroupButton>
              <InputGroupButton
                type="button"
                variant="ghost"
                size="xs"
                title="有序列表"
                onClick={() => handleInsert('1. ', '', true)}
                className="h-6 w-6 p-0"
              >
                <ListOrdered className="size-3" />
              </InputGroupButton>
              <InputGroupButton
                type="button"
                variant="ghost"
                size="xs"
                title="链接"
                onClick={() => handleInsert('[', '](url)')}
                className="h-6 w-6 p-0"
              >
                <LinkIcon className="size-3" />
              </InputGroupButton>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-colors',
              preview
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
            )}
          >
            {preview ? <Pencil className="size-3" /> : <Eye className="size-3" />}
            {preview ? '编辑' : '预览'}
          </button>

          <InputGroupText
            className={cn(
              'ml-2 tabular-nums text-xs tracking-wide transition-colors duration-200',
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
