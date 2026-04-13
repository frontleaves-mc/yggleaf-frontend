/**
 * 用户管理列表页
 * 展示系统中的用户信息
 */

import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '#/components/admin/shared/PageHeader'
import { DataTable, type Column } from '#/components/admin/shared/DataTable'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import {
  Eye,
  Shield,
  ShieldAlert,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { User } from '#/api/types'
import { PageTransition } from '#/components/ui/page-transition'

// 临时数据（API 对接后替换为真实查询）
const mockUsers: User[] = []

/** 角色名称映射 */
const roleLabels: Record<string, { label: string; color: string }> = {
  SUPER_ADMIN: { label: '超管', color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  ADMIN: { label: '管理员', color: 'bg-[var(--diamond)]/10 text-[var(--diamond-deep)]' },
  PLAYER: { label: '玩家', color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400' },
}

export const Route = createFileRoute('/admin/users/')({
  component: UserListPage,
})

function UserListPage() {
  const columns: Column<User>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (row) => (
        <span className="tabular-nums text-[var(--muted-foreground)]">#{row.id}</span>
      ),
      className: 'w-16',
    },
    {
      key: 'username',
      header: '用户名',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--diamond)]/20 to-[var(--diamond-deep)]/10 text-xs font-bold text-[var(--diamond-deep)]">
            {row.username.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{row.username}</p>
            <p className="text-[11px] text-[var(--muted-foreground)] truncate">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role_name',
      header: '角色',
      render: (row) => {
        const role = roleLabels[row.role_name] ?? roleLabels.PLAYER
        return (
          <Badge variant="secondary" className={`text-xs ${role.color}`}>
            {row.role_name === 'SUPER_ADMIN' && <ShieldAlert className="mr-1 h-3 w-3" />}
            {row.role_name === 'ADMIN' && <Shield className="mr-1 h-3 w-3" />}
            {role.label}
          </Badge>
        )
      },
      className: 'w-24',
    },
    {
      key: 'has_ban',
      header: '状态',
      render: (row) => (
        <Badge variant={row.has_ban ? 'destructive' : 'secondary'} className="text-xs">
          {row.has_ban ? '已封禁' : '正常'}
        </Badge>
      ),
      className: 'w-20',
    },
    {
      key: 'actions',
      header: '操作',
      render: (row) => (
        <Link to={`/admin/users/${row.id}` as any}>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <Eye className="mr-1 h-3 w-3" />
            详情
          </Button>
        </Link>
      ),
      className: 'w-20',
    },
  ]

  return (
    <PageTransition className="space-y-6">
      <PageHeader title="用户管理" description="管理系统中的所有用户账号">
        <Badge variant="secondary" className="text-xs">接口开发中</Badge>
      </PageHeader>

      <DataTable
        columns={columns}
        data={mockUsers}
        rowKey={(row) => row.id}
        emptyMessage="用户列表接口开发中，完成对接后将显示全部用户数据"
      />
    </PageTransition>
  )
}
