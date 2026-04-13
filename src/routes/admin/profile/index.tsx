/**
 * 个人设置页
 * 查看个人信息、账户状态
 * 修改密码等操作通过 SSO 提供商管理，本平台不直接修改
 */

import { createFileRoute } from '@tanstack/react-router'
import { useUserInfo } from '#/api/endpoints/user'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { PageTransition } from '#/components/ui/page-transition'
import {
  User as UserIcon,
  Shield,
  Mail,
  Phone,
  Lock,
  ExternalLink,
} from 'lucide-react'

export const Route = createFileRoute('/admin/profile/')({
  component: ProfilePage,
})

function ProfilePage() {
  const { data: user, isLoading: userLoading } = useUserInfo()

  /** 角色显示名映射 */
  const roleDisplayNames: Record<string, string> = {
    SUPER_ADMIN: '超级管理员',
    ADMIN: '管理员',
    PLAYER: '玩家',
  }

  if (userLoading) return (
    <PageTransition className="animate-pulse space-y-6">
      <div className="h-8 w-40 rounded bg-[var(--muted)]" />
      <div className="max-w-xl space-y-4 rounded-xl border border-[var(--border)] p-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 w-full rounded bg-[var(--muted)]/50" />
        ))}
      </div>
    </PageTransition>
  )

  return (
    <PageTransition className="space-y-6">
      {/* 个人信息卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--diamond)] to-[var(--diamond-deep)] text-white text-lg font-bold shadow-md">
              {user?.username?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <div>
              <CardTitle className="text-lg">{user?.username ?? '加载中...'}</CardTitle>
              <CardDescription>个人信息概览</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoField icon={<UserIcon className="h-4 w-4" />} label="用户名" value={user?.username ?? '--'} />
            <InfoField icon={<Mail className="h-4 w-4" />} label="邮箱" value={user?.email ?? '--'} />
            <InfoField icon={<Phone className="h-4 w-4" />} label="手机号" value={user?.phone || '--'} />
            <InfoField
              icon={<Shield className="h-4 w-4" />}
              label="角色"
              value={
                <Badge variant="secondary" className="bg-[var(--diamond)]/10 text-[var(--diamond-deep)]">
                  {roleDisplayNames[user?.role_name ?? ''] ?? user?.role?.display_name ?? '--'}
                </Badge>
              }
            />
            <InfoField label="用户 ID" value={String(user?.id ?? '--')} mono />
            <InfoField label="更新时间" value={user ? new Date(user.updated_at).toLocaleString('zh-CN') : '--'} />
          </div>
        </CardContent>
      </Card>

      {/* 账户安全提示 */}
      <Card className="max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[var(--diamond)]" />
            <CardTitle className="text-lg">账户安全</CardTitle>
          </div>
          <CardDescription>密码和安全设置由 SSO 统一认证平台管理</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-[13px] text-[var(--muted-foreground)]">
            修改密码、绑定邮箱/手机等安全操作，请前往 SSO 认证平台完成。
            本平台通过 OAuth 2.0 安全协议接入，不直接存储或管理用户密码。
          </p>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              window.open('/sso/oauth/login', '_blank')
            }}
          >
            <ExternalLink className="h-4 w-4" />
            前往 SSO 平台管理
          </Button>
        </CardContent>
      </Card>
    </PageTransition>
  )
}

/** 信息字段组件 */
function InfoField({
  icon,
  label,
  value,
  mono,
}: {
  icon?: React.ReactNode
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[var(--border)]/60 px-4 py-3">
      {icon && <span className="mt-0.5 text-[var(--muted-foreground)]">{icon}</span>}
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 text-[11px] uppercase tracking-wide text-[var(--muted-foreground)]/70">{label}</p>
        <p className={`break-all text-[14px] font-medium ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
      </div>
    </div>
  )
}
