/**
 * 管理端 - 经济管理系统
 * 支持余额查询、交易流水、审计日志
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Wallet,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronsUpDown,
} from 'lucide-react'
import {
  useAdminEconomyBalance,
  useAdminEconomyTransactions,
  useAdminEconomyAuditLogs,
} from '#/api/endpoints/api-mc/admin-economy'
import { useAdminGameProfiles } from '#/api/endpoints/api-auth/admin-game-profile'
import type { BalanceDTO, TransactionDTO } from '#/api/types'
import { LoadingPage } from '#/components/public/loading-page'
import { McCard } from '#/components/shared/mc-card'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '#/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '#/components/ui/tabs'
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
import type { ColumnDef } from '#/components/ui/tanstack-table'
import { formatTime } from '#/lib/format'
import { fadeUpItem, staggerContainer } from '#/lib/motion-presets'
import { cn } from '#/lib/utils'

// ─── 常量 ──────────────────────────────────────────────────

const PAGE_SIZE = 20

// ─── 子组件 ────────────────────────────────────────────────

/** 玩家选择 Combobox（从档案列表中选择） */
function PlayerCombobox({
  value,
  onChange,
  profiles,
}: {
  value: string
  onChange: (v: string) => void
  profiles: Array<{ uuid: string; name: string }>
}) {
  const [open, setOpen] = useState(false)
  const selected = profiles.find((p) => p.uuid === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-9 w-[260px] justify-between gap-2 shadow-sm cursor-pointer"
        >
          <span className="truncate">
            {selected
              ? `${selected.name} (${selected.uuid.slice(0, 8)}...)`
              : '选择玩家...'}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0">
        <Command>
          <CommandInput placeholder="搜索玩家..." />
          <CommandList>
            <CommandEmpty>未找到匹配的玩家</CommandEmpty>
            <CommandGroup>
              {profiles.map((profile) => (
                <CommandItem
                  key={profile.uuid}
                  value={`${profile.name} ${profile.uuid}`}
                  onSelect={() => {
                    onChange(profile.uuid)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === profile.uuid ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {profile.name} ({profile.uuid.slice(0, 8)}...)
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// ─── 路由定义 ──────────────────────────────────────────────

export const Route = createFileRoute('/admin/economy/')({
  component: AdminEconomyPage,
})

// ─── 页面组件 ──────────────────────────────────────────────

function AdminEconomyPage() {
  // ── 玩家选择（共享） ──
  const [selectedPlayerUuid, setSelectedPlayerUuid] = useState('')

  // ── 交易流水状态 ──
  const [txPage, setTxPage] = useState(1)
  const [transactionType, setTransactionType] = useState('all')

  // ── 审计日志状态 ──
  const [auditPage, setAuditPage] = useState(1)
  const [auditOperatorUuid, setAuditOperatorUuid] = useState('')
  const [auditPlayerUuid, setAuditPlayerUuid] = useState('')

  // ── 数据查询 ──
  const { data: profilesData } = useAdminGameProfiles({ page_size: 100 })
  const profiles = profilesData?.list ?? []

  const { data: balanceData, isLoading: balanceLoading } =
    useAdminEconomyBalance({
      player_uuid: selectedPlayerUuid,
    })

  const { data: txData, isLoading: txLoading } =
    useAdminEconomyTransactions({
      page: txPage,
      page_size: PAGE_SIZE,
      player_uuid: selectedPlayerUuid,
    })

  const { data: auditData, isLoading: auditLoading } =
    useAdminEconomyAuditLogs({
      page: auditPage,
      page_size: PAGE_SIZE,
      operator_uuid: auditOperatorUuid || undefined,
      player_uuid: auditPlayerUuid || undefined,
    })

  const selectedProfile = profiles.find((p) => p.uuid === selectedPlayerUuid)

  // ── 表格列定义 — 交易流水 ──
  const txColumns: ColumnDef<TransactionDTO, unknown>[] = [
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="时间" />
      ),
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground whitespace-nowrap">
          {formatTime(row.original.created_at)}
        </span>
      ),
      size: 160,
    },
    {
      accessorKey: 'type_name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="类型" />
      ),
      cell: ({ row }) => (
        <span className="text-[13px]">{row.original.type_name}</span>
      ),
      size: 120,
    },
    {
      accessorKey: 'player_name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="玩家" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.player_name}</span>
      ),
    },
    {
      accessorKey: 'amount_display',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="金额" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums font-medium">
          {row.original.amount_display}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: 'operator',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="操作员" />
      ),
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground">
          {row.original.operator || '-'}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: 'counterparty',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="交易方" />
      ),
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground">
          {row.original.counterparty || '-'}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: 'comment',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="备注" />
      ),
      cell: ({ row }) => (
        <span className="max-w-[240px] truncate block text-[13px] text-muted-foreground">
          {row.original.comment || '-'}
        </span>
      ),
    },
  ]

  // ── 表格列定义 — 审计日志 ──
  const auditColumns: ColumnDef<TransactionDTO, unknown>[] = [
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="时间" />
      ),
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground whitespace-nowrap">
          {formatTime(row.original.created_at)}
        </span>
      ),
      size: 160,
    },
    {
      accessorKey: 'operator',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="操作员" />
      ),
      cell: ({ row }) => (
        <span className="text-[13px]">{row.original.operator || '-'}</span>
      ),
      size: 120,
    },
    {
      accessorKey: 'player_name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="玩家" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.player_name}</span>
      ),
    },
    {
      accessorKey: 'type_name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="类型" />
      ),
      cell: ({ row }) => (
        <span className="text-[13px]">{row.original.type_name}</span>
      ),
      size: 120,
    },
    {
      accessorKey: 'amount_display',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="金额" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums font-medium">
          {row.original.amount_display}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: 'comment',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="备注" />
      ),
      cell: ({ row }) => (
        <span className="max-w-[300px] truncate block text-[13px] text-muted-foreground">
          {row.original.comment || '-'}
        </span>
      ),
    },
  ]

  // ── 分页计算 ──
  const txTotal = txData?.total ?? 0
  const txTotalPages = Math.ceil(txTotal / PAGE_SIZE)

  const auditTotal = auditData?.total ?? 0
  const auditTotalPages = Math.ceil(auditTotal / PAGE_SIZE)

  // ── 加载状态 ──
  const isLoading =
    (balanceLoading && !balanceData) ||
    (txLoading && !txData) ||
    (auditLoading && !auditData)

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
        <McSectionHeader
          icon={Wallet}
          title="经济管理"
          description="查询玩家余额、查看交易流水与审计日志"
        />
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUpItem}>
        <Tabs defaultValue="balance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="balance">余额查询</TabsTrigger>
            <TabsTrigger value="transactions">交易流水</TabsTrigger>
            <TabsTrigger value="audit">审计日志</TabsTrigger>
          </TabsList>

          {/* ── Tab 1: 余额查询 ── */}
          <TabsContent value="balance" className="space-y-4">
            <div className="flex items-center gap-3">
              <PlayerCombobox
                value={selectedPlayerUuid}
                onChange={(uuid) => {
                  setSelectedPlayerUuid(uuid)
                }}
                profiles={profiles}
              />
            </div>

            {balanceData && selectedPlayerUuid && (
              <McCard variant="solid" color="gold" className="overflow-hidden">
                <div className="flex flex-col gap-4 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">玩家</span>
                    <span className="font-medium">
                      {selectedProfile?.name || balanceData.player_uuid}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">UUID</span>
                    <span className="text-[13px] text-muted-foreground font-mono">
                      {balanceData.player_uuid}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">余额</span>
                    <span className="text-2xl font-bold tabular-nums">
                      {balanceData.balance_display} {balanceData.currency}
                    </span>
                  </div>
                </div>
              </McCard>
            )}

            {selectedPlayerUuid && !balanceData && !balanceLoading && (
              <p className="text-sm text-muted-foreground">暂无余额数据</p>
            )}
          </TabsContent>

          {/* ── Tab 2: 交易流水 ── */}
          <TabsContent value="transactions" className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <PlayerCombobox
                value={selectedPlayerUuid}
                onChange={(uuid) => {
                  setSelectedPlayerUuid(uuid)
                  setTxPage(1)
                }}
                profiles={profiles}
              />

              <Select
                value={transactionType}
                onValueChange={(v) => {
                  setTransactionType(v)
                  setTxPage(1)
                }}
              >
                <SelectTrigger className="h-9 w-[160px]">
                  <SelectValue placeholder="交易类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="1">转账</SelectItem>
                  <SelectItem value="2">管理员操作</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <McCard variant="solid" color="nether" className="overflow-hidden">
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
                    <p className="text-sm text-muted-foreground">
                      暂无交易记录
                    </p>
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

            {txTotalPages > 1 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  第 {txPage}/{txTotalPages} 页，共 {txTotal} 条
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs"
                    disabled={txPage <= 1}
                    onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    上一页
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs"
                    disabled={txPage >= txTotalPages}
                    onClick={() => setTxPage((p) => p + 1)}
                  >
                    下一页
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── Tab 3: 审计日志 ── */}
          <TabsContent value="audit" className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Input
                placeholder="操作员UUID"
                className="h-9 max-w-[200px]"
                value={auditOperatorUuid}
                onChange={(e) => {
                  setAuditOperatorUuid(e.target.value)
                  setAuditPage(1)
                }}
              />
              <PlayerCombobox
                value={auditPlayerUuid}
                onChange={(uuid) => {
                  setAuditPlayerUuid(uuid)
                  setAuditPage(1)
                }}
                profiles={profiles}
              />
            </div>

            <McCard variant="solid" color="nether" className="overflow-hidden">
              <TableProvider
                columns={auditColumns}
                data={auditData?.list ?? []}
              >
                <TSTableHeader>
                  {({ headerGroup }) => (
                    <TSTableHeaderGroup headerGroup={headerGroup}>
                      {({ header }) => <TSTableHead header={header} />}
                    </TSTableHeaderGroup>
                  )}
                </TSTableHeader>
                <TSTableBody
                  emptyContent={
                    <p className="text-sm text-muted-foreground">
                      暂无审计记录
                    </p>
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

            {auditTotalPages > 1 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  第 {auditPage}/{auditTotalPages} 页，共 {auditTotal} 条
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs"
                    disabled={auditPage <= 1}
                    onClick={() => setAuditPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    上一页
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs"
                    disabled={auditPage >= auditTotalPages}
                    onClick={() => setAuditPage((p) => p + 1)}
                  >
                    下一页
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
