/**
 * 用户端 - 个人中心页 (MC 风格)
 *
 * 查看个人信息、账户状态、修改游戏密码。
 * 网站登录由 SSO 统一认证平台管理。
 */

import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import {
  useUserInfo,
  useUpdateGamePasswordMutation,
} from '#/api/endpoints/api-auth/user'
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
import { cn } from '#/lib/utils'
import { staggerContainer, fadeUpItem } from '#/lib/motion-presets'
import { McCard } from '#/components/shared/mc-card'
import { McSectionHeader } from '#/components/shared/mc-section-header'
import { McBadge } from '#/components/shared/mc-badge'
import { McIconBox } from '#/components/shared/mc-icon-box'

// ─── 表单数据类型 ──────────────────────────────────────────

interface ChangePasswordForm {
  new_password: string
  confirm_password: string
}

// ─── 路由定义 ──────────────────────────────────────────────

export const Route = createFileRoute('/user/profile/')({
  component: ProfilePage,
})

// ─── 子组件：信息项卡片（MC 风格） ───────

function InfoItem({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon?: React.ComponentType<{ className?: string }>
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <McCard variant="glass" className="p-3.5">
      <div className="flex items-start gap-3">
        <McIconBox variant="diamond" size="sm">
          {Icon ? (
            <Icon />
          ) : (
            <div className="size-2 rounded-full bg-mc-diamond/50" />
          )}
        </McIconBox>
        <div className="min-w-0 flex flex-col gap-0.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
            {label}
          </span>
          <span
            className={cn(
              'truncate text-sm font-semibold text-foreground',
              mono && 'font-mono text-xs',
            )}
          >
            {value}
          </span>
        </div>
      </div>
    </McCard>
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
      {
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      },
      {
        onSuccess: () => {
          toast.success('游戏密码已更新')
          pwdForm.reset()
        },
        onError: () => toast.error('密码更新失败，请稍后重试'),
      },
    )
  }

  if (userLoading)
    return (
      <div className="animate-pulse space-y-8">
        <div className="space-y-2">
          <div className="h-7 w-32 rounded bg-muted" />
          <div className="h-4 w-48 rounded bg-muted/60" />
        </div>
        <div className="max-w-xl rounded-xl border border-border/60 bg-card/90 p-6">
          <div className="flex items-center gap-4">
            <div className="size-14 shrink-0 rounded-2xl bg-muted" />
            <div className="space-y-2">
              <div className="h-5 w-28 rounded bg-muted" />
              <div className="h-3.5 w-20 rounded bg-muted/60" />
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[68px] rounded-xl border border-border/60 bg-card/80 p-3.5"
            />
          ))}
        </div>
      </div>
    )

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* 页面标题 */}
      <motion.div variants={fadeUpItem}>
        <McSectionHeader
          title="个人中心"
          subtitle="Account"
          description="查看你的账户信息和状态"
          icon={UserIcon}
          variant="diamond"
        />
      </motion.div>

      {/* 用户信息卡片 */}
      <motion.div variants={fadeUpItem}>
        <McCard variant="solid" color="diamond" className="px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mc-diamond to-mc-diamond/80 text-white text-xl font-bold shadow-md sm:size-16 sm:text-2xl">
              {user?.username?.charAt(0)?.toUpperCase() ?? '?'}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {user?.username ?? '加载中...'}
                </span>
                <McBadge variant="diamond">
                  {roleDisplayNames[user?.role_name ?? ''] ??
                    user?.role?.display_name ??
                    '--'}
                </McBadge>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                {accountReady === 'ready' ? (
                  <>
                    <ShieldCheck className="size-4 text-mc-grass" />
                    <span className="text-mc-grass">账户已就绪</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="size-4 text-mc-gold" />
                    <span className="text-mc-gold">待完善游戏密码</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </McCard>
      </motion.div>

      {/* 信息网格 */}
      <motion.div variants={fadeUpItem}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem icon={UserIcon} label="用户名" value={user?.username ?? '--'} />
          <InfoItem icon={Mail} label="邮箱" value={user?.email ?? '--'} />
          <InfoItem icon={Phone} label="手机号" value={user?.phone || '--'} />
          <InfoItem
            icon={Shield}
            label="角色"
            value={
              <McBadge variant="diamond">
                {roleDisplayNames[user?.role_name ?? ''] ??
                  user?.role?.display_name ??
                  '--'}
              </McBadge>
            }
          />
          <InfoItem
            icon={accountReady === 'ready' ? ShieldCheck : AlertCircle}
            label="账户状态"
            value={
              accountReady === 'ready' ? (
                <McBadge variant="grass">已就绪</McBadge>
              ) : (
                <McBadge variant="gold">待完善</McBadge>
              )
            }
          />
          <InfoItem label="用户 ID" value={String(user?.id ?? '--')} mono />
        </div>
      </motion.div>

      {/* 修改密码卡片 */}
      <motion.div variants={fadeUpItem}>
        <McCard variant="solid" color="nether" className="max-w-xl px-6 pt-6 pb-5 sm:px-8 sm:pt-7 sm:pb-6">
          <div className="mb-5 flex items-center gap-3.5">
            <McIconBox variant="nether" size="md">
              <Lock />
            </McIconBox>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                修改游戏密码
              </h2>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                更新你在 Minecraft 启动器中使用的认证密码
              </p>
            </div>
          </div>

          <Form {...pwdForm}>
            <form
              onSubmit={pwdForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                      <FormLabel className="text-[13px]">新密码</FormLabel>
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
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors"
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
                      value === pwdForm.watch('new_password') ||
                      '两次输入的密码不一致',
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[13px]">确认密码</FormLabel>
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
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors"
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
                <Button
                  type="submit"
                  size="sm"
                  disabled={pwdMutation.isPending}
                >
                  {pwdMutation.isPending ? '更新中...' : '更新密码'}
                </Button>
              </div>
            </form>
          </Form>
        </McCard>
      </motion.div>

      {/* SSO 登录信息卡片 */}
      <motion.div variants={fadeUpItem}>
        <McCard variant="glass" color="gold" className="max-w-xl px-5 py-4.5 sm:px-6 sm:py-5">
          <div className="flex items-start gap-4">
            <McIconBox variant="gold" size="md">
              <Shield />
            </McIconBox>

            <div className="min-w-0 flex-1 space-y-2.5">
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                  网站登录
                </h3>
                <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                  通过 OAuth 2.0 SSO 协议完成统一认证
                </p>
              </div>

              <p className="text-[13px] leading-relaxed text-muted-foreground/80">
                网站登录不直接存储或管理用户密码，所有认证均由 SSO
                统一平台处理。
              </p>

              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-[13px]"
                onClick={() =>
                  window.open('https://auth.frontleaves.com', '_blank')
                }
              >
                <ExternalLink className="size-3.5" />
                前往 SSO 平台管理
              </Button>
            </div>
          </div>
        </McCard>
      </motion.div>
    </motion.div>
  )
}
