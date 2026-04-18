/**
 * IssuePriorityBadge - 问题优先级徽章
 * 映射 IssuePriority -> 中文标签 + 颜色
 */

import { Badge } from '#/components/ui/badge'
import type { IssuePriority } from '#/api/types'

const priorityConfig: Record<IssuePriority, { label: string; className: string }> = {
  low: { label: '低', className: 'bg-muted text-muted-foreground hover:bg-muted/80' },
  medium: { label: '中', className: 'bg-primary/10 text-primary hover:bg-primary/20' },
  high: { label: '高', className: 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 dark:text-yellow-400' },
  urgent: { label: '紧急', className: 'bg-destructive/10 text-destructive hover:bg-destructive/20' },
}

interface IssuePriorityBadgeProps {
  priority: IssuePriority
  className?: string
}

export function IssuePriorityBadge({ priority, className }: IssuePriorityBadgeProps) {
  const config = priorityConfig[priority]
  return (
    <Badge variant="secondary" className={`${config.className} ${className ?? ''}`}>
      {config.label}
    </Badge>
  )
}
