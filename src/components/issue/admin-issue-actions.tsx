/**
 * AdminIssueActions - 管理员操作面板
 * 备注编辑 + 优先级选择 + 状态管理
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Textarea } from '#/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import {
  useUpdateIssueNoteMutation,
  useUpdateIssuePriorityMutation,
  useUpdateIssueStatusMutation,
} from '#/api/endpoints/api-auth/admin-issue'
import type { IssueEntity, IssuePriority, IssueStatus } from '#/api/types'
import {
  Loader2,
  Save,
  StickyNote,
  Gauge,
  ArrowRight,
  Lock,
  CheckCircle2,
  XCircle,
  Ban,
} from 'lucide-react'
import { toast } from 'sonner'
import { IssueStatusBadge } from './issue-status-badge'

interface AdminIssueActionsProps {
  issue: IssueEntity
}

const priorityOptions: { value: IssuePriority; label: string }[] = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
  { value: 'urgent', label: '紧急' },
]

const STATUS_TRANSITIONS: Record<IssueStatus, IssueStatus[]> = {
  registered: ['pending', 'processing', 'unplanned', 'closed'],
  pending: ['processing', 'resolved', 'closed'],
  processing: ['pending', 'resolved', 'closed'],
  resolved: [],
  unplanned: [],
  closed: [],
}

const STATUS_LABELS: Record<IssueStatus, string> = {
  registered: '已登记',
  pending: '待处理',
  processing: '处理中',
  resolved: '已解决',
  unplanned: '无计划',
  closed: '已关闭',
}

/** 终态对应的图标和描述 */
const TERMINAL_STATE_INFO: Partial<
  Record<IssueStatus, { icon: React.ElementType; description: string }>
> = {
  resolved: {
    icon: CheckCircle2,
    description: '问题已解决，状态锁定',
  },
  unplanned: {
    icon: Ban,
    description: '已标记无计划，状态锁定',
  },
  closed: {
    icon: XCircle,
    description: '问题已关闭，状态锁定',
  },
}

/** 状态转换按钮的配色 */
const TRANSITION_BUTTON_STYLE: Record<IssueStatus, string> = {
  registered:
    'border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950',
  pending:
    'border-yellow-200 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-300 dark:border-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-950',
  processing:
    'border-primary/25 text-primary hover:bg-primary/5 hover:border-primary/40',
  resolved:
    'border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950',
  unplanned: 'border-muted text-muted-foreground hover:bg-muted/50',
  closed: 'border-secondary text-secondary-foreground hover:bg-secondary/50',
}

export function AdminIssueActions({ issue }: AdminIssueActionsProps) {
  const [note, setNote] = useState(issue.admin_note ?? '')
  const noteMutation = useUpdateIssueNoteMutation(issue.id)
  const priorityMutation = useUpdateIssuePriorityMutation(issue.id)
  const statusMutation = useUpdateIssueStatusMutation(issue.id)

  useEffect(() => {
    setNote(issue.admin_note ?? '')
  }, [issue.admin_note])

  const handleSaveNote = async () => {
    try {
      await noteMutation.mutateAsync({ admin_note: note })
      toast.success('备注已保存')
    } catch {
      toast.error('保存备注失败')
    }
  }

  const handlePriorityChange = async (value: string) => {
    try {
      await priorityMutation.mutateAsync({ priority: value as IssuePriority })
      toast.success('优先级已更新')
    } catch {
      toast.error('更新优先级失败')
    }
  }

  const handleStatusChange = async (value: string) => {
    try {
      await statusMutation.mutateAsync({ status: value as IssueStatus })
      toast.success('状态已更新')
    } catch {
      toast.error('更新状态失败')
    }
  }

  const availableTransitions = STATUS_TRANSITIONS[issue.status]
  const isTerminal = availableTransitions.length === 0
  const terminalInfo = TERMINAL_STATE_INFO[issue.status]

  return (
    <div className="space-y-4">
      {/* 管理员备注 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-1.5">
            <StickyNote className="h-3.5 w-3.5" />
            内部备注
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="添加管理员备注（仅管理员可见）"
            rows={3}
            maxLength={2000}
            className="resize-none text-sm"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {note.length}/2000
            </span>
            <Button
              size="sm"
              onClick={handleSaveNote}
              disabled={noteMutation.isPending}
            >
              {noteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              保存
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 优先级 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5" />
            优先级
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={issue.priority} onValueChange={handlePriorityChange}>
            <SelectTrigger
              className="w-full"
              disabled={priorityMutation.isPending}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* 状态管理 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-1.5">
            <ArrowRight className="h-3.5 w-3.5" />
            状态管理
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* 当前状态 */}
          <div className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground shrink-0">
              当前
            </span>
            <IssueStatusBadge status={issue.status} />
          </div>

          {/* 可切换的状态 */}
          {!isTerminal && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  切换至
                </span>
                <span className="h-px flex-1 bg-border/50" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableTransitions.map((target) => (
                  <Tooltip key={target}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={statusMutation.isPending}
                        onClick={() => handleStatusChange(target)}
                        className={`text-xs font-medium transition-all duration-200 ${TRANSITION_BUTTON_STYLE[target]}`}
                      >
                        {STATUS_LABELS[target]}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      {STATUS_LABELS[issue.status]} → {STATUS_LABELS[target]}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}

          {/* 终态提示 */}
          {isTerminal && terminalInfo && (
            <div className="flex items-center gap-2.5 rounded-lg border border-border/40 bg-muted/20 px-3 py-2.5">
              <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              <span className="text-xs text-muted-foreground">
                {terminalInfo.description}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
