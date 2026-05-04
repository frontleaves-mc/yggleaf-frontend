/**
 * 管理员端 - 用户管理列表页
 * 支持关键词搜索、角色筛选、分页
 */

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Shield,
  ShieldAlert,
} from 'lucide-react'
import { PageHeader } from '#/components/public/page-header'
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
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Badge } from '#/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { useAdminUsers } from '#/api/endpoints/api-auth/admin-user'
import { useUserInfo } from '#/api/endpoints/api-auth/user'
import type { AdminUserItem, RoleName } from '#/api/types'
import { isSuperAdmin } from '#/lib/permissions'

// ─── 常量 ──────────────────────────────────────────────────

const PAGE_SIZE = 20

const roleLabels: Record<string, { label: string; color: string }> = {
  SUPER_ADMIN: { label: '超管', color: 'bg-destructive/10 text-destructive' },
  ADMIN: { label: '管理员', color: 'bg-primary/10 text-primary' },
  PLAYER: { label: '玩家', color: 'bg-secondary text-secondary-foreground' },
}

const roleOptions: { value: string; label: string }[] = [
  { value: 'all', label: '全部角色' },
  { value: 'SUPER_ADMIN', label: '超管' },
  { value: 'ADMIN', label: '管理员' },
  { value: 'PLAYER', label: '玩家' },
]

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

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Route 定义 ────────────────────────────────────────────

export const Route = createFileRoute('/admin/users/')({
  component: AdminUserListPage,
})

// ─── 页面组件 ──────────────────────────────────────────────

function AdminUserListPage() {
  const navigate = useNavigate()
  const { data: userInfo } = useUserInfo()
  if (!isSuperAdmin(userInfo?.user?.role_name)) {
    navigate({ to: '/admin' })
    return null
  }

  const [keyword, setKeyword] = useState('')
  const [role, setRole] = useState<string>('all')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useAdminUsers({
    page,
    page_size: PAGE_SIZE,
    role: role !== 'all' ? (role as RoleName) : undefined,
    keyword: keyword || undefined,
  })

  const list = data?.list ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const columns: ColumnDef<AdminUserItem, unknown>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => <TableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground font-mono text-xs">
          #{row.original.id.slice(0, 8)}...
        </span>
      ),
      size: 112,
    },
    {
      id: 'username',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="用户名" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-xs font-bold text-primary">
            {row.original.username.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <Link
              to={`/admin/users/${row.original.id}` as any}
              className="font-medium truncate hover:text-primary transition-colors"
            >
              {row.original.username}
            </Link>
            <p className="text-[11px] text-muted-foreground truncate">
              {row.original.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role_name',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="角色" />
      ),
      cell: ({ row }) => {
        const r = roleLabels[row.original.role_name] ?? roleLabels.PLAYER
        return (
          <Badge variant="secondary" className={`text-xs ${r.color}`}>
            {row.original.role_name === 'SUPER_ADMIN' && (
              <ShieldAlert className="mr-1 h-3 w-3" />
            )}
            {row.original.role_name === 'ADMIN' && (
              <Shield className="mr-1 h-3 w-3" />
            )}
            {r.label}
          </Badge>
        )
      },
      size: 96,
    },
    {
      accessorKey: 'has_ban',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="状态" />
      ),
      cell: ({ row }) => (
        <Badge
          variant={row.original.has_ban ? 'destructive' : 'secondary'}
          className="text-xs"
        >
          {row.original.has_ban ? '已封禁' : '正常'}
        </Badge>
      ),
      size: 80,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <TableColumnHeader column={column} title="注册时间" />
      ),
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground whitespace-nowrap">
          {formatTime(row.original.created_at)}
        </span>
      ),
      size: 144,
    },
    {
      id: 'actions',
      header: () => <span className="text-sm font-medium">操作</span>,
      cell: ({ row }) => (
        <Link to={`/admin/users/${row.original.id}` as any}>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <Eye className="mr-1 h-3 w-3" />
            详情
          </Button>
        </Link>
      ),
      size: 80,
    },
  ]

  if (isLoading && !data) return <LoadingPage />

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 页面标题 */}
      <motion.div variants={fadeUpItem}>
        <PageHeader title="用户管理" description="管理系统中的所有用户账号">
          <span className="text-xs text-muted-foreground tabular-nums">
            共 {total} 位用户
          </span>
        </PageHeader>
      </motion.div>

      {/* 筛选栏 */}
      <motion.div
        variants={fadeUpItem}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索用户名或邮箱..."
            className="pl-9 h-9"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value)
              setPage(1)
            }}
          />
        </div>

        <Select
          value={role}
          onValueChange={(v) => {
            setRole(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-28 h-9 text-xs">
            <SelectValue placeholder="角色" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* 数据表格 */}
      <motion.div
        variants={fadeUpItem}
        className="rounded-xl border border-border/70 overflow-hidden"
      >
        <TableProvider columns={columns} data={list}>
          <TSTableHeader>
            {({ headerGroup }) => (
              <TSTableHeaderGroup headerGroup={headerGroup}>
                {({ header }) => <TSTableHead header={header} />}
              </TSTableHeaderGroup>
            )}
          </TSTableHeader>
          <TSTableBody
            emptyContent={
              <p className="text-sm text-muted-foreground">暂无用户数据</p>
            }
          >
            {({ row }) => (
              <TSTableRow row={row}>
                {({ cell }) => <TSTableCell cell={cell} />}
              </TSTableRow>
            )}
          </TSTableBody>
        </TableProvider>
      </motion.div>

      {/* 分页控制 */}
      {totalPages > 1 && (
        <motion.div
          variants={fadeUpItem}
          className="flex items-center justify-between"
        >
          <span className="text-xs text-muted-foreground">
            第 {page}/{totalPages} 页，共 {total} 条
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              下一页
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
