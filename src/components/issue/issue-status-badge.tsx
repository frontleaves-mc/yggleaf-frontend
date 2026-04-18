/**
 * IssueStatusBadge - 问题状态徽章
 * 映射 IssueStatus -> 中文标签 + 颜色
 */

import { Badge } from '#/components/ui/badge'
import type { IssueStatus } from '#/api/types'

const statusConfig: Record<IssueStatus, { label: string; className: string }> = {
  registered: { label: '已登记', className: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' },
  pending: { label: '待处理', className: 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 dark:text-yellow-400' },
  processing: { label: '处理中', className: 'bg-primary/10 text-primary hover:bg-primary/20' },
  resolved: { label: '已解决', className: 'bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400' },
  unplanned: { label: '无计划', className: 'bg-muted text-muted-foreground hover:bg-muted/80' },
  closed: { label: '已关闭', className: 'bg-secondary text-secondary-foreground hover:bg-secondary/80' },
}

interface IssueStatusBadgeProps {
  status: IssueStatus
  className?: string
}

export function IssueStatusBadge({ status, className }: IssueStatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <Badge variant="secondary" className={`${config.className} ${className ?? ''}`}>
      {config.label}
    </Badge>
  )
}
