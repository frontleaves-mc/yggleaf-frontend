/**
 * ErrorPage - 错误状态页面
 * API 请求失败或异常时显示
 */

import { Button } from '#/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorPageProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorPage({
  title = '出错了',
  message = '抱歉，加载过程中遇到了问题，请稍后重试。',
  onRetry,
}: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h2 className="mb-2 text-lg font-semibold text-[var(--foreground)]">{title}</h2>
      <p className="mb-6 max-w-md text-sm text-[var(--muted-foreground)]">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          重试
        </Button>
      )}
    </div>
  )
}
