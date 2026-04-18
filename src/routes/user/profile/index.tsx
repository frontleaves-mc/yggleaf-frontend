/**
 * 用户端 - 个人中心页
 *
 * 查看个人信息、账户状态、修改游戏密码。
 * 网站登录由 SSO 统一认证平台管理。
 */

import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useUserInfo, useUpdateGamePasswordMutation } from '#/api/endpoints/user'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { motion } from 'motion/react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/form'
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
import { toast } from 'sonner'
import { useState } from 'react'

// ─── 表单数据类型 ──────────────────────────────────────────

interface ChangePasswordForm {
  new_password: string
  confirm_password: string
}

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

// ─── 路由定义 ──────────────────────────────────────────────

export const Route = createFileRoute('/user/profile/')({
  component: ProfilePage,
})

// ─── 子组件：信息字段 ─────────────────────────────────────

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

// ─── 页面组件 ──────────────────────────────────────────────

function ProfilePage() {
  const { data: userInfo, isLoading: userLoading } = useUserInfo()
  const user = userInfo?.user
  const pwdMutation = useUpdateGamePasswordMutation()
  const [showNewPwd, setShowNewPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)

  const accountReady = userInfo?.extend?.account_ready ?? 'game_password'

  /** 角色显示名映射 */
  const roleDisplayNames: Record<string, string> = {
    SUPER_ADMIN: '超级管理员',
    ADMIN: '管理员',
    PLAYER: '玩家',
  }

  // 密码修改表单
  const pwdForm = useForm<ChangePasswordForm>({
    defaultValues: { new_password: '', confirm_password: '' },
    mode: 'onBlur',
  })

  function onPasswordSubmit(data: ChangePasswordForm) {
    pwdMutation.mutate(
      { new_password: data.new_password, confirm_password: data.confirm_password },
      {
        onSuccess: () => {
          toast.success('游戏密码已更新')
          pwdForm.reset()
        },
        onError: () => toast.error('密码更新失败，请稍后重试'),
      },
    )
  }

  if (userLoading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-40 rounded bg-muted" />
      <div className="max-w-xl space-y-4 rounded-xl border border-border p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 w-full rounded bg-muted/50" />
        ))}
      </div>
    </div>
  )

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 页面标题 */}
      <motion.div variants={fadeUpItem}>
      <div>
        <h1 className="font-display text-[1.5rem] font-bold tracking-tight text-foreground">
          个人中心
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          查看你的账户信息和状态
        </p>
      </div>
      </motion.div>

      {/* 个人信息卡片 */}
      <motion.div variants={fadeUpItem}>
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
              icon={accountReady === 'ready' ? <ShieldCheck className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-yellow-500" />}
              label="账户状态"
              value={
                accountReady === 'ready' ? (
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
      </motion.div>

      {/* 修改游戏密码卡片 */}
      <motion.div variants={fadeUpItem}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="size-4.5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">修改游戏密码</CardTitle>
              <CardDescription>
                更新你在 Minecraft 启动器中使用的认证密码
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...pwdForm}>
            <form onSubmit={pwdForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={pwdForm.control}
                  name="new_password"
                  rules={{
                    required: '请输入密码',
                    minLength: { value: 6, message: '密码至少需要 6 个字符' },
                    maxLength: { value: 128, message: '密码最多 128 个字符' },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>新密码</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPwd ? 'text' : 'password'}
                            placeholder="输入新密码"
                            autoComplete="new-password"
                            className="pr-9 h-9"
                            disabled={pwdMutation.isPending}
                            {...field}
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowNewPwd(!showNewPwd)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-xs"
                          >
                            {showNewPwd ? '隐藏' : '显示'}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={pwdForm.control}
                  name="confirm_password"
                  rules={{
                    required: '请确认密码',
                    validate: (value) =>
                      value === pwdForm.watch('new_password') || '两次输入的密码不一致',
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>确认密码</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPwd ? 'text' : 'password'}
                            placeholder="再次输入"
                            autoComplete="new-password"
                            className="pr-9 h-9"
                            disabled={pwdMutation.isPending}
                            {...field}
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-xs"
                          >
                            {showConfirmPwd ? '隐藏' : '显示'}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" size="sm" disabled={pwdMutation.isPending}>
                  {pwdMutation.isPending ? '更新中...' : '更新密码'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      </motion.div>

      {/* SSO 认证提示 */}
      <motion.div variants={fadeUpItem}>
      <Card className="max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">网站登录</CardTitle>
          </div>
          <CardDescription>网站登录授权通过 OAuth 2.0 SSO 协议完成</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-[13px] text-muted-foreground">
            网站登录不直接存储或管理用户密码，所有认证均由 SSO 统一平台处理。
          </p>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.open('/sso/oauth/login', '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            前往 SSO 平台管理
          </Button>
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  )
}
