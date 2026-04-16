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
  ShieldCheck,
  AlertCircle,
  Mail,
  Phone,
  Lock,
  ExternalLink,
} from 'lucide-react'

export const Route = createFileRoute('/admin/profile/')({
  component: ProfilePage,
})

function ProfilePage() {
  const { data: userInfo, isLoading: userLoading } = useUserInfo()
  const user = userInfo?.user

  /** 角色显示名映射 */
  const roleDisplayNames: Record<string, string> = {
    SUPER_ADMIN: '超级管理员',
    ADMIN: '管理员',
    PLAYER: '玩家',
  }

  if (userLoading) return (
    <PageTransition className="animate-pulse space-y-6">
      <div className="h-8 w-40 rounded bg-muted" />
      <div className="max-w-xl space-y-4 rounded-xl border border-border p-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 w-full rounded bg-muted/50" />
        ))}
      </div>
    </PageTransition>
  )

  return (
    <PageTransition className="space-y-6">
      {/* 账户状态卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary text-white text-lg font-bold shadow-md">
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
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {roleDisplayNames[user?.role_name ?? ''] ?? user?.role?.display_name ?? '--'}
                </Badge>
              }
            />
            <InfoField
              icon={userInfo?.extend?.account_ready === 'ready' ? <ShieldCheck className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-yellow-500" />}
              label="账户状态"
              value={
                userInfo?.extend?.account_ready === 'ready' ? (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">已就绪</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">待完善</Badge>
                )
              }
            />
            <InfoField label="用户 ID" value={String(user?.id ?? '--')} mono />
          </div>
        </CardContent>
      </Card>

      {/* 账户安全提示 */}
      <Card className="max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">账户安全</CardTitle>
          </div>
          <CardDescription>网站登录由 SSO 统一认证平台管理</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-[13px] text-muted-foreground">
            网站登录授权通过 OAuth 2.0 SSO 协议完成，不直接存储或管理用户密码。
            游戏密码用于 Minecraft 启动器认证，可在用户端「安全设置」页面修改。
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
    <div className="flex items-start gap-3 rounded-lg border border-border/60 px-4 py-3">
      {icon && <span className="mt-0.5 text-muted-foreground">{icon}</span>}
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 text-[11px] uppercase tracking-wide text-muted-foreground/70">{label}</p>
        <p className={`break-all text-[14px] font-medium ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
      </div>
    </div>
  )
}
