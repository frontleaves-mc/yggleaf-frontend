/**
 * 用户端 - 指令记录查看页
 * MC 风格：nether 配色
 * 分页表格查看自己的指令历史（自动关联所有游戏角色）
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Terminal } from 'lucide-react'
import { Button } from '#/components/ui/button'
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
import { UserPageLayout } from '#/components/public/user-page-layout'
import { LoadingPage } from '#/components/public/loading-page'
import { useUserCommandList } from '#/api/endpoints/api-mc/user-message'
import type { CommandLogResponse } from '#/api/types'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '#/components/ui/tooltip'

// ─── 路由注册 ──────────────────────────────────────────────

export const Route = createFileRoute('/user/commands/')({
  component: UserCommandsPage,
})

function UserCommandsPage() {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)

  const { data, isLoading } = useUserCommandList({
    page,
    page_size: pageSize,
  })

  if (isLoading) return <LoadingPage />

  const records = data?.list ?? []
  const totalPages = Math.ceil((data?.total ?? 0) / pageSize)

  // 列定义

  const columns: ColumnDef<CommandLogResponse, unknown>[] = [
    {
      accessorKey: 'command',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="指令" />
      ),
      cell: ({ row }) => {
        const command = row.getValue('command')
        if (!command) return <span className="text-muted-foreground">-</span>
        if (command.length <= 40) {
          return (
            <span className="font-mono text-xs bg-muted/60 px-2 py-0.5 rounded">
              {command}
            </span>
          )
        }
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-mono text-xs bg-muted/60 px-2 py-0.5 rounded truncate max-w-[280px] block cursor-default">
                  {command}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="font-mono text-xs">{command}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
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
  ]

  return (
    <UserPageLayout
      title="命令记录"
      description="查看你关联角色的指令使用历史"
      icon={Terminal}
      variant="nether"
    >
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
                  <Terminal />
                </McIconBox>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    暂无指令记录
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    绑定游戏角色后将显示指令历史
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

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
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
        </div>
      )}
    </UserPageLayout>
  )
}
