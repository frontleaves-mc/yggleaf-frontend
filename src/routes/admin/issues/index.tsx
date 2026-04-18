/**
 * 管理员端 - 全量问题列表页
 * 支持按状态、优先级、类型、关键词筛选，使用 TanStack Table + 排序
 */

import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import { Eye, Search } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import type { ColumnDef } from '#/components/ui/tanstack-table'
import {
  TableProvider,
  TableColumnHeader,
  TSTableHeader,
  TSTableHeaderGroup,
  TSTableHead,
  TSTableBody,
  TSTableRow,
  TSTableCell,
} from '#/components/ui/tanstack-table'
import { PageHeader } from '#/components/public/page-header'
import { LoadingPage } from '#/components/public/loading-page'
import { IssueStatusBadge } from '#/components/issue/issue-status-badge'
import { IssuePriorityBadge } from '#/components/issue/issue-priority-badge'
import { useAdminIssues } from '#/api/endpoints/admin-issue'
import { useIssueTypes } from '#/api/endpoints/issue-type'
import type { IssueListItem, IssueStatus, IssuePriority } from '#/api/types'
import { formatTime } from '#/components/issue/issue-detail-content'

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const fadeUpItem = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export const Route = createFileRoute('/admin/issues/')({
  component: AdminIssuesPage,
})

function AdminIssuesPage() {
  const [status, setStatus] = useState<string>('all')
  const [priority, setPriority] = useState<string>('all')
  const [typeId, setTypeId] = useState<string>('all')
  const [keyword, setKeyword] = useState('')

  const { data: issueTypes } = useIssueTypes()
  const { data, isLoading } = useAdminIssues({
    status: status !== 'all' ? (status as IssueStatus) : undefined,
    priority: priority !== 'all' ? (priority as IssuePriority) : undefined,
    issue_type_id: typeId !== 'all' ? typeId : undefined,
    keyword: keyword || undefined,
    page: 1,
    page_size: 50,
  })

  const issues = data?.items ?? []

  const columns: ColumnDef<IssueListItem, unknown>[] = [
    {
      accessorKey: 'issue.id',
      header: ({ column }) => <TableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => {
        const item = row.original as IssueListItem
        return (
          <span className="tabular-nums text-muted-foreground font-mono text-xs">
            #{item.issue.id}
          </span>
        )
      },
      size: 64,
    },
    {
      id: 'title',
      header: ({ column }) => <TableColumnHeader column={column} title="标题" />,
      cell: ({ row }) => {
        const item = row.original as IssueListItem
        return (
          <div className="min-w-0">
            <span className="font-medium text-sm block truncate">{item.issue.title}</span>
            <span className="text-xs text-muted-foreground">用户 #{item.issue.user_id}</span>
          </div>
        )
      },
    },
    {
      id: 'type',
      header: ({ column }) => <TableColumnHeader column={column} title="类型" />,
      cell: ({ row }) => {
        const item = row.original as IssueListItem
        return (
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{item.issue_type_name}</span>
        )
      },
      size: 96,
    },
    {
      accessorKey: 'issue.priority',
      header: ({ column }) => <TableColumnHeader column={column} title="优先级" />,
      cell: ({ row }) => {
        const item = row.original as IssueListItem
        return <IssuePriorityBadge priority={item.issue.priority} />
      },
      size: 80,
    },
    {
      accessorKey: 'issue.status',
      header: ({ column }) => <TableColumnHeader column={column} title="状态" />,
      cell: ({ row }) => {
        const item = row.original as IssueListItem
        return <IssueStatusBadge status={item.issue.status} />
      },
      size: 80,
    },
    {
      id: 'replies',
      header: () => <span className="text-sm font-medium">回复</span>,
      cell: ({ row }) => {
        const item = row.original as IssueListItem
        return (
          <span className="text-xs text-muted-foreground tabular-nums">{item.reply_count}</span>
        )
      },
      size: 56,
    },
    {
      accessorKey: 'issue.updated_at',
      header: ({ column }) => <TableColumnHeader column={column} title="更新时间" />,
      cell: ({ row }) => {
        const item = row.original as IssueListItem
        return (
          <span className="text-[13px] text-muted-foreground whitespace-nowrap">
            {formatTime(item.issue.updated_at)}
          </span>
        )
      },
      size: 144,
    },
    {
      id: 'actions',
      header: () => <span className="text-sm font-medium">操作</span>,
      cell: ({ row }) => {
        const item = row.original as IssueListItem
        return (
          <Link to={`/admin/issues/${item.issue.id}` as any}>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <Eye className="mr-1 h-3 w-3" />
              详情
            </Button>
          </Link>
        )
      },
      size: 80,
    },
  ]

  if (isLoading) return <LoadingPage />

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUpItem}>
        <PageHeader title="问题管理" description="查看和处理所有用户提交的问题反馈" />
      </motion.div>

      {/* 筛选栏 */}
      <motion.div variants={fadeUpItem} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索问题标题..."
            className="pl-9 h-9"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-28 h-9 text-xs">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="registered">已登记</SelectItem>
            <SelectItem value="pending">待处理</SelectItem>
            <SelectItem value="processing">处理中</SelectItem>
            <SelectItem value="resolved">已解决</SelectItem>
            <SelectItem value="unplanned">无计划</SelectItem>
            <SelectItem value="closed">已关闭</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-28 h-9 text-xs">
            <SelectValue placeholder="优先级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部优先级</SelectItem>
            <SelectItem value="low">低</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="high">高</SelectItem>
            <SelectItem value="urgent">紧急</SelectItem>
          </SelectContent>
        </Select>

        {issueTypes && issueTypes.length > 0 && (
          <Select value={typeId} onValueChange={setTypeId}>
            <SelectTrigger className="w-28 h-9 text-xs">
              <SelectValue placeholder="类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              {issueTypes.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </motion.div>

      <motion.div variants={fadeUpItem} className="rounded-xl border border-border/70 overflow-hidden">
        <TableProvider columns={columns} data={issues}>
          <TSTableHeader>
            {({ headerGroup }) => (
              <TSTableHeaderGroup headerGroup={headerGroup}>
                {({ header }) => <TSTableHead header={header} />}
              </TSTableHeaderGroup>
            )}
          </TSTableHeader>
          <TSTableBody>
            {({ row }) => (
              <TSTableRow row={row}>
                {({ cell }) => <TSTableCell cell={cell} />}
              </TSTableRow>
            )}
          </TSTableBody>
        </TableProvider>

        {issues.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground">暂无问题数据</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
