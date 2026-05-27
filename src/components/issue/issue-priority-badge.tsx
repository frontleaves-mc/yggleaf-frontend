/**
 * IssuePriorityBadge - 问题优先级徽章 (MC 风格)
 * 映射 IssuePriority -> 中文标签 + MC 配色
 */

import { McBadge } from '#/components/shared'
import type { IssuePriority } from '#/api/types'

const priorityConfig: Record<
  IssuePriority,
  {
    label: string
    variant: 'grass' | 'diamond' | 'nether' | 'gold' | 'default'
  }
> = {
  low: { label: '低', variant: 'default' },
  medium: { label: '中', variant: 'diamond' },
  high: { label: '高', variant: 'gold' },
  urgent: { label: '紧急', variant: 'nether' },
}

interface IssuePriorityBadgeProps {
  priority: IssuePriority
  className?: string
}

export function IssuePriorityBadge({
  priority,
  className,
}: IssuePriorityBadgeProps) {
  const config = priorityConfig[priority]
  return (
    <McBadge variant={config.variant} className={className}>
      {config.label}
    </McBadge>
  )
}
