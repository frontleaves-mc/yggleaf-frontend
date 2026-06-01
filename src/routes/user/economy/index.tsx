/**
 * 玩家端经济页面 - 我的经济
 *
 * 展示：
 *   - 当前余额卡片
 *   - 交易记录表格（带分页）
 */

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { TrendingUp, Wallet } from 'lucide-react'
import { motion } from 'motion/react'
import {
  useUserEconomyBalance,
  useUserEconomyTransactions,
} from '#/api/endpoints/api-mc/player-economy'
import type { TransactionDTO } from '#/api/types'
import { LoadingPage } from '#/components/public/loading-page'
import { McCard } from '#/components/shared/mc-card'
import { McIconBox } from '#/components/shared/mc-icon-box'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { Button } from '#/components/ui/button'
import type { ColumnDef } from '#/components/ui/tanstack-table'
import {
  TableProvider,
  TSTableBody,
  TSTableCell,
  TSTableHead,
  TSTableHeader,
  TSTableHeaderGroup,
  TSTableRow,
} from '#/components/ui/tanstack-table'
import { formatTime } from '#/lib/format'
import { mcStaggerGrid, mcStaggerGridItem } from '#/lib/motion-presets'

export const Route = createFileRoute('/user/economy/')({
  component: EconomyPage,
})

// ─── 表格列定义 ──────────────────────────────────────────────

const txColumns: ColumnDef<TransactionDTO>[] = [
  {
    accessorKey: 'created_at',
    header: '时间',
    cell: ({ row }) => formatTime(row.original.created_at),
  },
  {
    accessorKey: 'type_name',
    header: '类型',
    cell: ({ row }) => row.original.type_name,
  },
  {
    accessorKey: 'amount_display',
    header: '金额',
    cell: ({ row }) => (
      <span className="font-mono">{row.original.amount_display}</span>
    ),
  },
  {
    accessorKey: 'comment',
    header: '备注',
    cell: ({ row }) => row.original.comment,
  },
]

// ─── 页面组件 ────────────────────────────────────────────────

function EconomyPage() {
  const { data: balanceData, isLoading: balanceLoading } = useUserEconomyBalance()
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20
  const { data: txData } = useUserEconomyTransactions({
    page,
    page_size: PAGE_SIZE,
  })

  // 加载中
  if (balanceLoading && !balanceData) {
    return <LoadingPage />
  }

  // 无数据
  if (!balanceData) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <McIconBox variant="diamond" size="lg">
          <Wallet />
        </McIconBox>
        <p className="text-sm text-muted-foreground/70">暂无经济数据</p>
      </div>
    )
  }

  const totalPages = txData ? Math.ceil(txData.total / PAGE_SIZE) : 1

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={mcStaggerGrid}
      initial="hidden"
      animate="visible"
    >
      {/* 页面标题 */}
      <McSectionHeader icon={Wallet} title="我的经济" variant="diamond" />

      {/* 余额卡片 */}
      <motion.div variants={mcStaggerGridItem}>
        <McCard variant="solid" color="gold" className="p-6">
          <div className="flex items-center gap-4">
            <McIconBox variant="diamond" size="lg">
              <Wallet />
            </McIconBox>
            <div>
              <p className="text-sm text-muted-foreground">当前余额</p>
              <p className="text-3xl font-bold">{balanceData.balance_display}</p>
              <p className="text-sm text-muted-foreground">{balanceData.currency}</p>
            </div>
          </div>
        </McCard>
      </motion.div>

      {/* 交易记录 */}
      <motion.div variants={mcStaggerGridItem} className="flex flex-col gap-4">
        <McSectionHeader
          title="交易记录"
          icon={TrendingUp}
          variant="diamond"
          size="sm"
        />
        <McCard variant="glass" className="overflow-hidden">
          <TableProvider columns={txColumns} data={txData?.list ?? []}>
            <TSTableHeader>
              {({ headerGroup }) => (
                <TSTableHeaderGroup headerGroup={headerGroup}>
                  {({ header }) => <TSTableHead header={header} />}
                </TSTableHeaderGroup>
              )}
            </TSTableHeader>
            <TSTableBody
              emptyContent={
                <p className="text-sm text-muted-foreground">暂无交易记录</p>
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
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">
              第 {page} / {totalPages} 页
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
              >
                下一页
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
