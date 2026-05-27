/**
 * 管理员端 - 聊天记录查看页
 * MC 风格：nether 配色
 * 带筛选的分页表格：player_uuid / server_name / source
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'
import { MessageCircle, Search } from 'lucide-react'
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
import { useAdminChatList } from '#/api/endpoints/api-mc/admin-message'
import type { ChatLogResponse, MessageSourceValue } from '#/api/types'
import { McCard } from '#/components/shared/mc-card'
import { McBadge } from '#/components/shared/mc-badge'
import { McIconBox } from '#/components/shared/mc-icon-box'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '#/components/ui/tooltip'

// ─── 路由注册 ──────────────────────────────────────────────

export const Route = createFileRoute('/admin/messages/chat/')({
  component: AdminChatRecordsPage,
})

function AdminChatRecordsPage() {
  // 分页参数
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)

  // 筛选参数
  const [filterPlayerUuid, setFilterPlayerUuid] = useState('')
  const [filterServerName, setFilterServerName] = useState('')
  const [filterSource, setFilterSource] = useState<string>('all')

  // 提交用的筛选值（点击搜索后生效）
  const [appliedFilters, setAppliedFilters] = useState<{
    player_uuid?: string
    server_name?: string
    source?: MessageSourceValue
  }>({})

  const { data, isLoading } = useAdminChatList({
    page,
    page_size: pageSize,
    ...appliedFilters,
  })

  const handleSearch = () => {
    setPage(1)
    setAppliedFilters({
      player_uuid: filterPlayerUuid.trim() || undefined,
      server_name: filterServerName.trim() || undefined,
      source:
        filterSource !== 'all'
          ? (Number(filterSource) as MessageSourceValue)
          : undefined,
    })
  }

  const handleReset = () => {
    setFilterPlayerUuid('')
    setFilterServerName('')
    setFilterSource('all')
    setPage(1)
    setAppliedFilters({})
  }

  if (isLoading) return <LoadingPage />

  const records = data?.list ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / pageSize)

  // 列定义

  const columns: ColumnDef<ChatLogResponse, unknown>[] = [
    {
      accessorKey: 'player_name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="玩家" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <McIconBox variant="nether" size="sm">
            <MessageCircle />
          </McIconBox>
          <span className="font-medium text-sm">
            {row.getValue('player_name')}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'server_name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="服务器" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.getValue('server_name') || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'world_name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="世界" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.getValue('world_name') || '-'}
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
  ]

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUpItem}>
        <PageHeader description="查看所有聊天消息记录，支持按玩家、服务器、来源筛选" />
      </motion.div>

      {/* 筛选栏 */}
      <motion.div variants={fadeUpItem}>
        <McCard
          variant="glass"
          className="flex flex-wrap items-center gap-3 p-4"
        >
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="玩家 UUID"
              value={filterPlayerUuid}
              onChange={(e) => setFilterPlayerUuid(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Input
            placeholder="服务器名称"
            value={filterServerName}
            onChange={(e) => setFilterServerName(e.target.value)}
            className="h-9 w-36"
          />
          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-28 h-9 text-xs">
              <SelectValue placeholder="来源" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部来源</SelectItem>
              <SelectItem value="1">Game</SelectItem>
              <SelectItem value="2">Web</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="gradient"
            size="sm"
            className="h-9"
            onClick={handleSearch}
          >
            搜索
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={handleReset}
          >
            重置
          </Button>
        </McCard>
      </motion.div>

      {/* 表格 */}
      <motion.div variants={fadeUpItem}>
        <McCard variant="solid" color="nether" className="overflow-hidden">
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
                  <McIconBox variant="nether" size="lg" className="mx-auto">
                    <MessageCircle />
                  </McIconBox>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      暂无聊天记录
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
