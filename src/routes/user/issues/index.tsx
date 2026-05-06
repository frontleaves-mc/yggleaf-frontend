/**
 * 用户端 - 问题反馈列表页
 * 展示当前用户的问题列表，支持状态和类型筛选，使用 TanStack Table + 排序
 */

import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { MessageSquareWarning, Eye, Plus, Send, Loader2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Separator } from '#/components/ui/separator'
import { MarkdownEditor } from '#/components/ui/markdown-editor'
import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
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
import { LoadingPage } from '#/components/public/loading-page'
import { IssueStatusBadge } from '#/components/issue/issue-status-badge'
import { IssuePriorityBadge } from '#/components/issue/issue-priority-badge'
import {
  useMyIssues,
  useCreateIssueMutation,
} from '#/api/endpoints/api-auth/issue'
import { useIssueTypes } from '#/api/endpoints/api-auth/issue-type'
import { formatTime } from '#/components/issue/issue-detail-content'
import type { IssueStatus, IssueListItem } from '#/api/types'
import { motion } from 'motion/react'
import { cn } from '#/lib/utils'

// ─── 动画常量 ──────────────────────────────────────────────

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

export const Route = createFileRoute('/user/issues/')({
  component: UserIssuesPage,
})

const statusTabs: { value: string; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'registered', label: '已登记' },
  { value: 'pending', label: '待处理' },
  { value: 'processing', label: '处理中' },
  { value: 'resolved', label: '已解决' },
  { value: 'closed', label: '已关闭' },
]

function UserIssuesPage() {
  const [status, setStatus] = useState<string>('all')
  const [typeId, setTypeId] = useState<string>('all')
  const { data: issueTypes } = useIssueTypes()
  const createMutation = useCreateIssueMutation()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formTypeId, setFormTypeId] = useState('')
  const [formPriority, setFormPriority] = useState('')

  const handleCreate = async () => {
    if (!formTitle.trim() || !formContent.trim() || !formTypeId) return
    try {
      await createMutation.mutateAsync({
        issue_type_id: formTypeId,
        title: formTitle,
        content: formContent,
        priority: (formPriority as any) || undefined,
      })
      setDialogOpen(false)
      setFormTitle('')
      setFormContent('')
      setFormTypeId('')
      setFormPriority('')
    } catch {
      // error handled by mutation
    }
  }

  const { data, isLoading } = useMyIssues({
    status: status !== 'all' ? (status as IssueStatus) : undefined,
    issue_type_id: typeId !== 'all' ? typeId : undefined,
    page: 1,
    page_size: 50,
  })

  // 构建 id → name 查找表
  const typeNameMap = useMemo(() => {
    if (!issueTypes) return new Map<string, string>()
    return new Map(issueTypes.map((t) => [String(t.id), t.name]))
  }, [issueTypes])

  const issues = data?.items ?? []

  const columns: ColumnDef<IssueListItem, unknown>[] = [
    {
      id: 'title',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="标题" />
      ),
      cell: ({ row }) => {
        const item = row.original
        return (
          <Link
            to="/user/issues/$issueId"
            params={{ issueId: String(item.issue.id) }}
            className="font-medium text-sm hover:text-primary transition-colors"
          >
            {item.issue.title}
          </Link>
        )
      },
    },
    {
      id: 'type',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="类型" />
      ),
      cell: ({ row }) => {
        const item = row.original
        return (
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
            {typeNameMap.get(String(item.issue.issue_type_id)) ?? '未知类型'}
          </span>
        )
      },
      size: 96,
    },
    {
      accessorKey: 'issue.priority',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="优先级" />
      ),
      cell: ({ row }) => {
        const item = row.original
        return <IssuePriorityBadge priority={item.issue.priority} />
      },
      size: 80,
    },
    {
      accessorKey: 'issue.status',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="状态" />
      ),
      cell: ({ row }) => {
        const item = row.original
        return <IssueStatusBadge status={item.issue.status} />
      },
      size: 80,
    },
    {
      id: 'replies',
      header: () => <span className="text-sm font-medium">回复</span>,
      cell: ({ row }) => {
        const item = row.original
        return (
          <span className="text-xs text-muted-foreground tabular-nums">
            {item.reply_count}
          </span>
        )
      },
      size: 56,
    },
    {
      accessorKey: 'issue.updated_at',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="更新时间" />
      ),
      cell: ({ row }) => {
        const item = row.original
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
        const item = row.original
        return (
          <Link
            to="/user/issues/$issueId"
            params={{ issueId: String(item.issue.id) }}
          >
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <Eye className="mr-1 h-3 w-3" />
              查看
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
      {/* 页面标题 */}
      <motion.div variants={fadeUpItem}>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-foreground sm:text-[24px]">
              问题反馈
            </h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
              提交和追踪你的问题反馈
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="size-3.5" />
                添加反馈
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[780px] gap-0 p-0 overflow-hidden">
              <DialogHeader className="px-6 pt-5 pb-3">
                <DialogTitle className="text-base font-bold tracking-tight">
                  提交问题反馈
                </DialogTitle>
                <DialogDescription className="text-[13px] mt-0.5 text-muted-foreground/80">
                  描述你遇到的问题，我们会尽快处理
                </DialogDescription>
              </DialogHeader>

              <div className="px-6 pb-2">
                <div className="overflow-hidden">
                  {/* ── Meta Bar: 标题 + 分类 + 优先级 ── */}
                  <div className="flex items-center gap-0 px-3 py-2">
                    <Input
                      placeholder="简要概括问题"
                      className={cn(
                        'h-7 flex-1 min-w-0 border-0 shadow-none bg-transparent text-sm',
                        'focus-visible:ring-0 placeholder:text-muted-foreground/40',
                      )}
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                    <Separator
                      orientation="vertical"
                      className="mx-2 h-4 shrink-0"
                    />
                    <Select value={formTypeId} onValueChange={setFormTypeId}>
                      <SelectTrigger
                        className={cn(
                          'h-7 w-[110px] border-0 shadow-none bg-transparent text-sm',
                          'focus-visible:ring-0',
                        )}
                      >
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {issueTypes?.map((type) => (
                          <SelectItem key={type.id} value={String(type.id)}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Separator
                      orientation="vertical"
                      className="mx-2 h-4 shrink-0"
                    />
                    <Select
                      value={formPriority}
                      onValueChange={setFormPriority}
                    >
                      <SelectTrigger
                        className={cn(
                          'h-7 w-[100px] border-0 shadow-none bg-transparent text-sm',
                          'focus-visible:ring-0',
                        )}
                      >
                        <SelectValue placeholder="优先级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">低</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="high">高</SelectItem>
                        <SelectItem value="urgent">紧急</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ── Markdown 编辑区 ── */}
                  <MarkdownEditor
                    value={formContent}
                    onChange={setFormContent}
                    placeholder="请详细说明问题的现象、复现步骤、期望行为等信息，越详细有助于更快定位问题"
                    minRows={8}
                    maxLength={10000}
                    className="border-0 shadow-none rounded-none bg-transparent"
                  />
                </div>
              </div>

              <DialogFooter className="px-6 pb-5 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogOpen(false)}
                >
                  取消
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={
                    !formTitle.trim() ||
                    !formContent.trim() ||
                    !formTypeId ||
                    createMutation.isPending
                  }
                  className="gap-1.5"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      提交中...
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" />
                      提交反馈
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* 筛选栏 */}
      <motion.div variants={fadeUpItem}>
        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={status} onValueChange={setStatus}>
            <TabsList className="h-8">
              {statusTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-xs px-3 h-6"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {issueTypes && issueTypes.length > 0 && (
            <Select value={typeId} onValueChange={setTypeId}>
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue placeholder="问题类型" />
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
        </div>
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <div className="rounded-xl border border-border/70 overflow-hidden">
          <TableProvider columns={columns} data={issues}>
            <TSTableHeader>
              {({ headerGroup }) => (
                <TSTableHeaderGroup headerGroup={headerGroup}>
                  {({ header }) => <TSTableHead header={header} />}
                </TSTableHeaderGroup>
              )}
            </TSTableHeader>
            <TSTableBody
              emptyContent={
                <>
                  <MessageSquareWarning className="mx-auto size-10 text-muted-foreground/30" />
                  <p className="text-sm font-medium text-foreground">
                    暂无问题反馈
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {status !== 'all'
                      ? '当前筛选条件下没有匹配的问题'
                      : '点击右上角按钮提交你的第一个问题'}
                  </p>
                </>
              }
            >
              {({ row }) => (
                <TSTableRow row={row}>
                  {({ cell }) => <TSTableCell cell={cell} />}
                </TSTableRow>
              )}
            </TSTableBody>
          </TableProvider>
        </div>
      </motion.div>
    </motion.div>
  )
}
