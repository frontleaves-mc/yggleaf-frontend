/**
 * 密钥展示 Dialog
 * 创建/重置凭证后展示完整密钥，支持复制到剪贴板
 */

import { Copy, Check, KeyRound, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { cn } from '#/lib/utils'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { toast } from 'sonner'

// ─── Props ──────────────────────────────────────────────

interface SecretKeyRevealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  secretKey: string
  credentialName?: string
}

// ─── 组件 ────────────────────────────────────────────────

export function SecretKeyRevealDialog({
  open,
  onOpenChange,
  secretKey,
  credentialName,
}: SecretKeyRevealDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(secretKey)
      setCopied(true)
      toast.success('已复制到剪贴板')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = secretKey
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        setCopied(true)
        toast.success('已复制到剪贴板')
        setTimeout(() => setCopied(false), 2000)
      } catch {
        toast.error('复制失败，请手动复制')
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15">
              <KeyRound className="size-4.5 text-primary" />
            </div>
            <div>
              <DialogTitle>密钥已生成</DialogTitle>
            </div>
          </div>
          <DialogDescription className="pt-1">
            {credentialName
              ? `凭证「${credentialName}」的密钥已成功生成`
              : '密钥已成功生成'}
          </DialogDescription>
        </DialogHeader>

        {/* 警告提示 */}
        <div className="rounded-lg border border-amber-500/25 bg-gradient-to-r from-amber-500/8 to-amber-500/3 p-3.5 space-y-1.5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-500 shrink-0" />
            <span className="text-[13px] font-medium text-amber-600 dark:text-amber-400">安全提示</span>
          </div>
          <p className="text-[13px] text-amber-600/80 dark:text-amber-400/80 leading-relaxed pl-6">
            此密钥仅展示一次，关闭后将无法再次查看。请立即复制并妥善保管！
          </p>
        </div>

        {/* 密钥展示 - 核心区域 */}
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-muted/40 p-4">
          {/* 背景装饰点阵 */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] [background-size:12px_12px]" />
          <div className="relative">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="size-1.5 rounded-full bg-primary/60 animate-pulse" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Secret Key</span>
            </div>
            <p className="font-mono text-sm leading-relaxed break-all select-all text-foreground bg-background rounded-lg px-3.5 py-3 border border-border/50 shadow-sm">
              {secretKey}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            关闭
          </Button>
          <Button
            onClick={handleCopy}
            className={cn(
              'gap-1.5 transition-all duration-200',
              copied
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                : ''
            )}
          >
            {copied ? (
              <>
                <Check data-icon="inline-start" className="size-4" />
                已复制
              </>
            ) : (
              <>
                <Copy data-icon="inline-start" className="size-4" />
                复制密钥
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
