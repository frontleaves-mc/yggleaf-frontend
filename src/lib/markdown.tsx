/**
 * 极简 Markdown → React 渲染器
 *
 * 仅支持登录页品牌介绍所需的基础 Markdown 语法：
 *   h1, h2, h3, p, strong, em, ul/li, blockquote, hr, a
 *
 * 用法：
 *   import brandMd from '#/content/login-brand.md?raw'
 *   <SimpleMarkdown>{brandMd}</SimpleMarkdown>
 */

import React from 'react'

// ─── 行内解析 ────────────────────────────────────────────

function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  const inlineRe = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(\[(.+?)\]\((.+?)\))/g
  let lastIndex = 0
  let key = 0
  let match = inlineRe.exec(text)

  while (match !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (match[1]) {
      nodes.push(
        <strong key={`b${key++}`} className="font-semibold">
          {match[2]}
        </strong>,
      )
    } else if (match[3]) {
      nodes.push(
        <em key={`i${key++}`} className="italic">
          {match[4]}
        </em>,
      )
    } else if (match[5]) {
      nodes.push(
        <a
          key={`a${key++}`}
          href={match[7]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors hover:text-white/80"
        >
          {match[6]}
        </a>,
      )
    }

    lastIndex = match.index + match[0].length
    match = inlineRe.exec(text)
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes.length > 0 ? nodes : [text]
}

// ─── 块级解析 ────────────────────────────────────────────

interface ParsedBlock {
  type: 'h1' | 'h2' | 'h3' | 'p' | 'ul' | 'blockquote' | 'hr'
  content: string | string[]
}

function parseBlocks(md: string): ParsedBlock[] {
  const lines = md.split('\n')
  const blocks: ParsedBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      i++
      continue
    }

    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'hr', content: '' })
      i++
      continue
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3
      blocks.push({
        type: `h${level}`,
        content: headingMatch[2],
      })
      i++
      continue
    }

    if (line.startsWith('> ')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].replace(/^>\s/, ''))
        i++
      }
      blocks.push({ type: 'blockquote', content: quoteLines.join('\n') })
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ''))
        i++
      }
      blocks.push({ type: 'ul', content: items })
      continue
    }

    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('>') &&
      !lines[i].startsWith('- ') &&
      !lines[i].startsWith('* ') &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'p', content: paraLines.join('\n') })
    }
  }

  return blocks
}

// ─── React 组件 ──────────────────────────────────────────

const BLOCK_RENDERERS: Record<
  ParsedBlock['type'],
  (content: string | string[], blockKey: string) => React.ReactNode
> = {
  h1: (content, key) => (
    <h1 key={key} className="text-2xl font-bold tracking-tight">
      {parseInline(content as string)}
    </h1>
  ),
  h2: (content, key) => (
    <h2 key={key} className="text-xl font-bold tracking-tight">
      {parseInline(content as string)}
    </h2>
  ),
  h3: (content, key) => (
    <h3 key={key} className="text-lg font-bold tracking-tight">
      {parseInline(content as string)}
    </h3>
  ),
  hr: (_content, key) => (
    <hr key={key} className="my-4 border-0 h-px bg-white/10" />
  ),
  p: (content, key) => (
    <p key={key} className="text-sm leading-relaxed">
      {parseInline(content as string)}
    </p>
  ),
  ul: (content, key) => (
    <ul key={key} className="space-y-1.5 text-sm">
      {(content as string[]).map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/40" />
          <span className="leading-relaxed">{parseInline(item)}</span>
        </li>
      ))}
    </ul>
  ),
  blockquote: (content, key) => (
    <blockquote
      key={key}
      className="border-l-2 border-white/20 pl-3 text-sm italic"
    >
      {parseInline(content as string)}
    </blockquote>
  ),
}

export function SimpleMarkdown({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  const blocks = parseBlocks(children)

  return (
    <div className={className}>
      {blocks.map((block, i) =>
        BLOCK_RENDERERS[block.type](block.content, `block-${i}`),
      )}
    </div>
  )
}
