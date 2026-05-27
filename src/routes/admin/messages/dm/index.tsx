/**
 * 管理员端 - 私信记录查看页
 * MC 风格：diamond 配色
 * 带筛选的分页表格：sender_name / receiver_name
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'
import { MessageSquare, Search } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
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
import { useAdminDMList } from '#/api/endpoints/api-mc/admin-message'
import type { DirectMessageResponse } from '#/api/types'
import { McCard } from '#/components/shared/mc-card'
import { McBadge } from '#/components/shared/mc-badge'
import { McIconBox } from '#/components/shared/mc-icon-box'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { formatTime } from '#/lib/format'

// ─── 路由注册 ──────────────────────────────────────────────

export const Route = createFileRoute('/admin/messages/dm/')({
  component: AdminDMRecordsPage,
})

function AdminDMRecordsPage() {
  // 分页参数
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)

  // 筛选参数
  const [filterSenderName, setFilterSenderName] = useState('')
  const [filterReceiverName, setFilterReceiverName] = useState('')

  // 提交用的筛选值（点击搜索后生效）
  const [appliedFilters, setAppliedFilters] = useState<{
    sender_name?: string
    receiver_name?: string
  }>({})

  const { data, isLoading } = useAdminDMList({
    page,
    page_size: pageSize,
    ...appliedFilters,
  })

  const handleSearch = () => {
    setPage(1)
    setAppliedFilters({
      sender_name: filterSenderName.trim() || undefined,
      receiver_name: filterReceiverName.trim() || undefined,
    })
  }

  const handleReset = () => {
    setFilterSenderName('')
    setFilterReceiverName('')
    setPage(1)
    setAppliedFilters({})
  }

  if (isLoading) return <LoadingPage />

  const records = data?.list ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / pageSize)

  // 列定义

  const columns: ColumnDef<DirectMessageResponse, unknown>[] = [
    {
      accessorKey: 'sender_name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="发送者" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <McIconBox variant="diamond" size="sm">
            <MessageSquare />
          </McIconBox>
          <span className="font-medium text-sm">
            {row.getValue('sender_name')}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'receiver_name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="接收者" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.getValue('receiver_name')}
        </span>
      ),
    },
    {
      accessorKey: 'message',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="消息内容" />
      ),
      cell: ({ row }) => {
        const message = row.getValue('message') as string
        if (!message) return <span className="text-muted-foreground">-</span>
        if (message.length <= 50) {
          return <span className="text-sm">{message}</span>
        }
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm truncate max-w-[280px] block cursor-default">
                  {message}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="text-sm">{message}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: 'source',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="来源" />
      ),
      cell: ({ row }) => {
        const source = row.original.source
        return (
          <McBadge variant={source === 1 ? 'grass' : 'diamond'}>
            {source === 1 ? 'Game' : 'Web'}
          </McBadge>
        )
      },
    },
    {
      accessorKey: 'is_read',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="已读" />
      ),
      cell: ({ row }) => {
        const isRead = row.getValue('is_read') as boolean
        return (
          <McBadge variant={isRead ? 'grass' : 'nether'}>
            {isRead ? '已读' : '未读'}
          </McBadge>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="发送时间" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground tabular-nums">
          {formatTime(row.getValue('created_at') as string)}
        </span>
      ),
    },
  ]

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUpItem}>
        <PageHeader description="查看所有用户私信记录，支持按发送者、接收者筛选" />
      </motion.div>

      {/* 筛选栏 */}
      <motion.div variants={fadeUpItem}>
        <McCard variant="glass" className="flex flex-wrap items-center gap-3 p-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="发送者名称"
              value={filterSenderName}
              onChange={(e) => setFilterSenderName(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="接收者名称"
              value={filterReceiverName}
              onChange={(e) => setFilterReceiverName(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Button variant="gradient" size="sm" className="h-9" onClick={handleSearch}>
            搜索
          </Button>
          <Button variant="outline" size="sm" className="h-9" onClick={handleReset}>
            重置
          </Button>
        </McCard>
      </motion.div>

      {/* 表格 */}
      <motion.div variants={fadeUpItem}>
        <McCard variant="solid" color="diamond" className="overflow-hidden">
          <TableProvider columns={columns} data={records}>
            <TSTableHeader>
              {({ headerGroup }) => (
                <TSTableHeaderGroup headerGroup={headerGroup}>
                  {({ header }) => <TSTableHead header={header} />}
                </TSTableHeaderGroup>
              )}
            </TSTableHeader>
            <TSTableBody
              emptyContent={
                <div className="flex flex-col items-center gap-3 py-8">
                  <McIconBox variant="diamond" size="lg" className="mx-auto">
                    <MessageSquare />
                  </McIconBox>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      暂无私信记录
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      调整筛选条件后重试
                    </p>
                  </div>
                </div>
              }
            >
              {({ row }) => (
                <TSTableRow row={row}>
                  {({ cell }) => <TSTableCell cell={cell} />}
                </TSTableRow>
              )}
            </TSTableBody>
          </TableProvider>
        </McCard>
      </motion.div>

      {/* 分页 */}
      {totalPages > 1 && (
        <motion.div
          variants={fadeUpItem}
          className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3"
        >
          <p className="text-[13px] text-muted-foreground">
            共 {data?.total ?? 0} 条记录，第 {page}/{totalPages} 页
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              下一页
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
