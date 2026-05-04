'use client'

import * as React from 'react'
import {
  Bold,
  Braces,
  Code,
  Eye,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pencil,
  Quote,
} from 'lucide-react'

import { cn } from '#/lib/utils'
import { MarkdownRenderer } from '#/components/ui/markdown-renderer'
import { Separator } from '#/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  className?: string
  minRows?: number
  compact?: boolean
}

function MarkdownEditor({
  value,
  onChange,
  placeholder = '请输入 Markdown 内容...',
  disabled = false,
  maxLength,
  className,
  minRows = 5,
  compact = false,
}: MarkdownEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const insertMarkdown = React.useCallback(
    (before: string, after: string = '', linePrefix: boolean = false) => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)

      let newValue: string

      if (linePrefix) {
        const lines = value.split('\n')
        const startLineIndex = value.substring(0, start).split('\n').length - 1
        const endLineIndex = value.substring(0, end).split('\n').length - 1

        for (
          let i = startLineIndex;
          i <= endLineIndex && i < lines.length;
          i++
        ) {
          if (!lines[i].startsWith(before.trim())) {
            lines[i] = before + lines[i]
          }
        }
        newValue = lines.join('\n')
      } else {
        newValue =
          value.substring(0, start) +
          before +
          selectedText +
          after +
          value.substring(end)
      }

      onChange(newValue)

      requestAnimationFrame(() => {
        if (!textareaRef.current) return
        if (linePrefix) {
          const cursorPos = start + before.length
          textareaRef.current.selectionStart = cursorPos
          textareaRef.current.selectionEnd = cursorPos
        } else {
          const newPos = start + before.length + selectedText.length
          textareaRef.current.selectionStart = newPos
          textareaRef.current.selectionEnd = newPos
        }
        textareaRef.current.focus()
      })
    },
    [value, onChange],
  )

  const charCount = value.length
  const counterColorClass = React.useMemo(() => {
    if (!maxLength) return 'text-muted-foreground'
    const ratio = charCount / maxLength
    if (ratio >= 1) return 'text-destructive'
    if (ratio >= 0.9) return 'text-amber-600 dark:text-amber-400'
    return 'text-muted-foreground'
  }, [charCount, maxLength])

  return (
    <div
      data-slot="markdown-editor"
      className={cn(
        'group/markdown-editor rounded-xl border border-border/60 bg-card shadow-sm transition-all duration-200 ease-out',
        'has-[[data-slot=markdown-textarea]:focus-visible]:border-primary/30',
        'has-[[data-slot=markdown-textarea]:focus-visible]:shadow-md',
        'has-[[data-slot=markdown-textarea]:focus-visible]:ring-[3px]',
        'has-[[data-slot=markdown-textarea]:focus-visible]:ring-primary/10',
        disabled && 'opacity-50 pointer-events-none',
        className,
      )}
    >
      <div className="flex items-center gap-1 border-b border-border/40 bg-muted/20 px-3 py-1.5 overflow-x-auto">
        {!compact && (
          <>
            <ToggleGroup type="single" variant="outline" size="sm">
              <ToggleGroupItem
                value="h1"
                title="标题 1"
                onMouseDown={(e) => {
                  e.preventDefault()
                  insertMarkdown('# ', '', true)
                }}
              >
                <span className="text-[10px] font-bold">H1</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="h2"
                title="标题 2"
                onMouseDown={(e) => {
                  e.preventDefault()
                  insertMarkdown('## ', '', true)
                }}
              >
                <span className="text-[10px] font-bold">H2</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="h3"
                title="标题 3"
                onMouseDown={(e) => {
                  e.preventDefault()
                  insertMarkdown('### ', '', true)
                }}
              >
                <span className="text-[10px] font-bold">H3</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="h4"
                title="标题 4"
                onMouseDown={(e) => {
                  e.preventDefault()
                  insertMarkdown('#### ', '', true)
                }}
              >
                <span className="text-[10px] font-bold">H4</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="h5"
                title="标题 5"
                onMouseDown={(e) => {
                  e.preventDefault()
                  insertMarkdown('##### ', '', true)
                }}
              >
                <span className="text-[10px] font-bold">H5</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="h6"
                title="标题 6"
                onMouseDown={(e) => {
                  e.preventDefault()
                  insertMarkdown('###### ', '', true)
                }}
              >
                <span className="text-[10px] font-bold">H6</span>
              </ToggleGroupItem>
            </ToggleGroup>

            <Separator orientation="vertical" className="mx-1 h-5" />
          </>
        )}

        <ToggleGroup type="single" variant="outline" size="sm">
          <ToggleGroupItem
            value="bold"
            title="粗体"
            onMouseDown={(e) => {
              e.preventDefault()
              insertMarkdown('**', '**')
            }}
          >
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="italic"
            title="斜体"
            onMouseDown={(e) => {
              e.preventDefault()
              insertMarkdown('*', '*')
            }}
          >
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="code"
            title="行内代码"
            onMouseDown={(e) => {
              e.preventDefault()
              insertMarkdown('`', '`')
            }}
          >
            <Code />
          </ToggleGroupItem>

          {!compact && (
            <ToggleGroupItem
              value="code-block"
              title="代码块"
              onMouseDown={(e) => {
                e.preventDefault()
                insertMarkdown('```\n', '\n```')
              }}
            >
              <Braces />
            </ToggleGroupItem>
          )}

          <ToggleGroupItem
            value="link"
            title="链接"
            onMouseDown={(e) => {
              e.preventDefault()
              const ta = textareaRef.current
              const selectedText = ta
                ? value.substring(ta.selectionStart, ta.selectionEnd)
                : ''
              insertMarkdown('[', `](${selectedText ? 'url' : 'url'})`)
            }}
          >
            <LinkIcon />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="quote"
            title="引用"
            onMouseDown={(e) => {
              e.preventDefault()
              insertMarkdown('> ', '', true)
            }}
          >
            <Quote />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="ul"
            title="无序列表"
            onMouseDown={(e) => {
              e.preventDefault()
              insertMarkdown('- ', '', true)
            }}
          >
            <List />
          </ToggleGroupItem>

          {!compact && (
            <ToggleGroupItem
              value="ol"
              title="有序列表"
              onMouseDown={(e) => {
                e.preventDefault()
                insertMarkdown('1. ', '', true)
              }}
            >
              <ListOrdered />
            </ToggleGroupItem>
          )}
        </ToggleGroup>
      </div>

      <Tabs defaultValue="write" className="w-full">
        <div className="flex items-center justify-end px-3 pt-1.5">
          <TabsList variant="line" className="h-8">
            <TabsTrigger value="write" data-icon="inline-start">
              <Pencil />
              编写
            </TabsTrigger>
            <TabsTrigger value="preview" data-icon="inline-start">
              <Eye />
              预览
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="write" className="mt-0">
          <textarea
            ref={textareaRef}
            data-slot="markdown-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={minRows}
            maxLength={maxLength}
            className={cn(
              'px-4 py-3 text-sm leading-relaxed resize-none',
              'bg-transparent border-0 focus-visible:ring-0 focus-visible:outline-none w-full min-h-[120px]',
            )}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0 px-4 py-3 min-h-[120px]">
          {value.trim().length > 0 ? (
            <MarkdownRenderer content={value} />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[80px] text-sm text-muted-foreground">
              暂无内容预览
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-end border-t border-border/40 bg-muted/20 px-4 py-2">
        <span className={cn('text-xs tabular-nums', counterColorClass)}>
          {maxLength ? `${charCount}/${maxLength}` : `${charCount}`}
        </span>
      </div>
    </div>
  )
}

export { MarkdownEditor }
export type { MarkdownEditorProps }
