/**
 * IssueStatusBadge - 问题状态徽章 (MC 风格)
 * 映射 IssueStatus -> 中文标签 + MC 配色
 */

import { McBadge } from '#/components/shared'
import type { IssueStatus } from '#/api/types'

const statusConfig: Record<
  IssueStatus,
  {
    label: string
    variant: 'grass' | 'diamond' | 'nether' | 'gold' | 'default'
  }
> = {
  registered: { label: '已登记', variant: 'diamond' },
  pending: { label: '待处理', variant: 'gold' },
  processing: { label: '处理中', variant: 'diamond' },
  resolved: { label: '已解决', variant: 'grass' },
  unplanned: { label: '无计划', variant: 'default' },
  closed: { label: '已关闭', variant: 'nether' },
}

interface IssueStatusBadgeProps {
  status: IssueStatus
  className?: string
}

export function IssueStatusBadge({ status, className }: IssueStatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <McBadge variant={config.variant} className={className}>
      {config.label}
    </McBadge>
  )
}
