/**
 * MarkdownRenderer — Markdown 内容渲染组件
 *
 * 基于 react-markdown + remark-gfm + rehype-highlight 构建，
 * 使用 @tailwindcss/typography 的 prose 类进行排版。
 * 支持表格、删除线、任务列表、自动链接等 GFM 语法。
 * 通过 CSS 变量系统自动适配亮色/暗色主题。
 */

import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

import { cn } from '#/lib/utils'

export interface MarkdownRendererProps {
  /** Markdown 源文本 */
  content: string
  /** 额外的 CSS 类名，会合并到外层容器上 */
  className?: string
}

const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const isBlock = Boolean(className)

    if (isBlock) {
      return (
        <code
          className={cn(
            'rounded-none bg-muted/50 border border-border/30 p-4 overflow-x-auto text-sm font-mono',
            className,
          )}
          {...props}
        >
          {children}
        </code>
      )
    }

    return (
      <code
        className={cn(
          'rounded bg-muted/60 px-1.5 py-0.5 text-[0.875em] font-mono text-foreground',
        )}
        {...props}
      >
        {children}
      </code>
    )
  },

  pre({ children, ...props }) {
    return (
      <pre className="mb-4 mt-2" {...props}>
        {children}
      </pre>
    )
  },

  a({ children, ...props }) {
    return (
      <a
        className={cn(
          'text-primary underline underline-offset-2 hover:text-primary/80',
        )}
        {...props}
      >
        {children}
      </a>
    )
  },

  blockquote({ children, ...props }) {
    return (
      <blockquote
        className={cn(
          'border-l-4 border-primary/30 pl-4 italic text-muted-foreground',
        )}
        {...props}
      >
        {children}
      </blockquote>
    )
  },

  h1({ children, ...props }) {
    return (
      <h1 className={cn('text-2xl font-bold text-foreground')} {...props}>
        {children}
      </h1>
    )
  },
  h2({ children, ...props }) {
    return (
      <h2 className={cn('text-xl font-semibold text-foreground')} {...props}>
        {children}
      </h2>
    )
  },
  h3({ children, ...props }) {
    return (
      <h3 className={cn('text-lg font-semibold text-foreground')} {...props}>
        {children}
      </h3>
    )
  },
  h4({ children, ...props }) {
    return (
      <h4 className={cn('text-base font-medium text-foreground')} {...props}>
        {children}
      </h4>
    )
  },
  h5({ children, ...props }) {
    return (
      <h5 className={cn('text-sm font-medium text-foreground')} {...props}>
        {children}
      </h5>
    )
  },
  h6({ children, ...props }) {
    return (
      <h6 className={cn('text-sm font-medium text-foreground')} {...props}>
        {children}
      </h6>
    )
  },

  table({ children, ...props }) {
    return (
      <table className={cn('w-full border-collapse text-sm')} {...props}>
        {children}
      </table>
    )
  },
  th({ children, ...props }) {
    return (
      <th
        className={cn(
          'border border-border px-3 py-2 bg-muted/50 text-left font-medium',
        )}
        {...props}
      >
        {children}
      </th>
    )
  },
  td({ children, ...props }) {
    return (
      <td className={cn('border border-border px-3 py-2')} {...props}>
        {children}
      </td>
    )
  },

  hr({ ...props }) {
    return <hr className={cn('border-border my-4')} {...props} />
  },

  img({ src, alt, ...props }) {
    return (
      <img
        className={cn('rounded-none max-w-full')}
        src={src}
        alt={alt ?? ''}
        {...props}
      />
    )
  },
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  if (!content || content.trim().length === 0) {
    return null
  }

  return (
    <div
      data-slot="markdown-renderer"
      className={cn(
        'prose prose-sm dark:prose-invert max-w-none',
        'prose-headings:text-foreground',
        'prose-p:text-foreground/90',
        'prose-strong:text-foreground',
        'prose-code:before:content-none prose-code:after:content-none',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
