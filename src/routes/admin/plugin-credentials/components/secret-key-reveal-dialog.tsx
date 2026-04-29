/**
 * 密钥展示 Dialog
 * 创建/重置凭证后展示完整密钥，支持复制到剪贴板
 */

import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
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
      // Fallback: use execCommand
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
          <DialogTitle>密钥已生成</DialogTitle>
          <DialogDescription>
            {credentialName
              ? `凭证「${credentialName}」的密钥已成功生成`
              : '密钥已成功生成'}
          </DialogDescription>
        </DialogHeader>

        {/* 警告提示 */}
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            ⚠️ 此密钥仅展示一次，关闭后将无法再次查看。请立即复制并妥善保管！
          </p>
        </div>

        {/* 密钥展示 */}
        <div className="rounded-lg bg-muted p-3">
          <p className="font-mono text-xs break-all select-all">
            {secretKey}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            关闭
          </Button>
          <Button onClick={handleCopy} className="gap-1.5">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                已复制
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                复制密钥
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
