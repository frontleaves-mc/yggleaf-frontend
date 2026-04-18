/**
 * AdminIssueActions - 管理员操作面板
 * 备注编辑 + 优先级选择 + 状态选择
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
  useUpdateIssueNoteMutation,
  useUpdateIssuePriorityMutation,
  useUpdateIssueStatusMutation,
} from '#/api/endpoints/admin-issue'
import type { IssueEntity, IssuePriority, IssueStatus } from '#/api/types'
import { Loader2, Save, StickyNote, Gauge, ToggleRight } from 'lucide-react'
import { toast } from 'sonner'

interface AdminIssueActionsProps {
  issue: IssueEntity
}

const priorityOptions: { value: IssuePriority; label: string }[] = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
  { value: 'urgent', label: '紧急' },
]

const statusOptions: { value: IssueStatus; label: string }[] = [
  { value: 'registered', label: '已登记' },
  { value: 'pending', label: '待处理' },
  { value: 'processing', label: '处理中' },
  { value: 'resolved', label: '已解决' },
  { value: 'unplanned', label: '无计划' },
  { value: 'closed', label: '已关闭' },
]

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

  const handleStatusChange = async (value: string) => {    try {
      await statusMutation.mutateAsync({ status: value as IssueStatus })
      toast.success('状态已更新')
    } catch {
      toast.error('更新状态失败')
    }
  }

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
            <span className="text-xs text-muted-foreground">{note.length}/2000</span>
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
            <SelectTrigger className="w-full" disabled={priorityMutation.isPending}>
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

      {/* 状态 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-1.5">
            <ToggleRight className="h-3.5 w-3.5" />
            状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={issue.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full" disabled={statusMutation.isPending}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  )
}
